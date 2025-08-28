
import singlePrismaClient from "../../utils/prismaClient"
import { io } from "../.."

type bidsAsks = {
    email: string
    price: number,
    quantity: number,
    name?: string

}

interface Order {
    userEmail: string,
    price: number,
    quantity: number,
    orderType: "buy" | "sell",
    symbol: string

}
interface TICKER {
    symbol: string,
    price: number,
    quantity: number

}
interface User {
    email: string,
    TICKERS: TICKER[]
}
let sellAAPL: bidsAsks[] = [{ email: "admin@gmail.com", price: 802.63, quantity: 3 }, { email: "admin@gmail.com", price: 800.98, quantity: 5 }, { email: "admin@gmail.com", price: 789.43, quantity: 3 }]
let buyAAPL: bidsAsks[] = [{ email: "admin@gmail.com", price: 783.32, quantity: 2 }, { email: "M1", price: 80, quantity: 5 }, { email: "", price: 82, quantity: 3 }]

let sellMSFT: bidsAsks[] = []
let buyMSFT: bidsAsks[] = []

let sellNVDA: bidsAsks[] = []
let buyNVDA: bidsAsks[] = []

let sellAMZN: bidsAsks[] = [{ email: "admin@gmail.com", quantity: 4, price: 223 }]
let buyAMZN: bidsAsks[] = [{ email: "admin@gmail.com", quantity: 2, price: 221 }]

let sellTSLA: bidsAsks[] = []
let buyTSLA: bidsAsks[] = []

let sellNFLX: bidsAsks[] = []
let buyNFLX: bidsAsks[] = []

const prisma = singlePrismaClient()

const buyArrays: Record<string, bidsAsks[]> = {
    "AAPL": buyAAPL,
    "MSFT": buyMSFT,
    "AMZN": buyAMZN,
    "NVDA": buyNVDA,
    "TSLA": buyTSLA,
    "NFLX": buyNFLX
};

const sellArrays: Record<string, bidsAsks[]> = {
    "AAPL": sellAAPL,
    "MSFT": sellMSFT,
    "AMZN": sellAMZN,
    "NVDA": sellNVDA,
    "TSLA": sellTSLA,
    "NFLX": sellNFLX
};





export default function getOrderBook() {
    return io.emit("stockUpdate", {
        "buyAMZN": buyAMZN,
        "sellAMZN": sellAMZN,
        "buyAAPL": buyAAPL,
        "sellAAPL": sellAAPL,
        "buyMSFT": buyMSFT,
        "sellMSFT": sellMSFT,
        "buyNVDA": buyNVDA,
        "sellNVDA": sellNVDA,
        "buyTSLA": buyTSLA,
        "sellTSLA": sellTSLA,
        "buyNFLX": buyNFLX,
        "sellNFLX": sellNFLX,
    })



}
export async function makeBid({ userEmail, price, quantity, orderType, symbol }: Order) {
    let item = {
        email: userEmail,
        price: price,
        quantity: quantity
    }
    if (orderType == "sell") {
        const sellArray = sellArrays[symbol]
        console.log("inside the sell");

        if (!sellArray) {
            return "no symbol  matched "
        }
        try {
            const user = await prisma.user.findFirst({
                where: {
                    email: userEmail
                },
                include: {
                    stocks: true
                }
            })
            const stock = user?.stocks.find((stock) => stock.symbol === symbol)
            const stockId = stock?.id
            await prisma.$transaction([
                prisma.stocks.update({
                    where: {
                        id: stockId
                    },
                    data: {
                        quantity: {
                            decrement: quantity
                        }
                    }
                }),
                prisma.trades.create({
                    data: {
                        userId: userEmail,
                        price: price,
                        quantity: quantity,
                        orderType: orderType,
                        date: new Date(Date.now()),
                        completed: false,
                        symbol: symbol

                    }
                })
            ])

        }
        catch (e) {
            console.log("some internal error at make bid  ", e);

        }

        sellArrays[symbol].push(item)
        sellArrays[symbol].sort((a, b) => a.price - b.price)
        console.log(sellArrays[symbol], "selll");




    }
    else {
        console.log("inside the buy of makeBid ");


        const buyArray = buyArrays[symbol]
        if (!buyArray) {
            return "no symbol  matched "
        }

        try {
            await prisma.$transaction([

                prisma.user.update({
                    where: {
                        email: userEmail
                    },
                    data: {
                        balance: { decrement: parseFloat((price * quantity).toFixed(2)) }
                    }

                }),

                prisma.trades.create({
                    data: {
                        userId: userEmail,
                        price: price,
                        quantity: quantity,
                        orderType: orderType,
                        date: new Date(Date.now()),
                        completed: false,
                        symbol: symbol

                    }
                })
            ])




        }
        catch (e) {
            console.log("some internal error at make bid  ", e);

        }

        buyArrays[symbol].push(item)
        buyArrays[symbol].sort((a, b) => b.price - a.price)
        console.log(buyArrays[symbol], "  buy ");

    }



}
//userEmail khareedne aayA hai stock owener k pass stocks hai 
async function flipStocks(arr: bidsAsks[], index: number, stockOwnerEmail: string, { userEmail, price, quantity, orderType, symbol }: Order): Promise<any> {


    const owner = await prisma.user.findFirst({
        where: { email: stockOwnerEmail },
        include: { stocks: true }
    })
    if (!owner) {
        return Promise.resolve("Owner not found ")
    }
    const ownerHasEnoughStocks = owner.stocks.find((stock) => { return stock.symbol === symbol })

    if (!ownerHasEnoughStocks) return Promise.resolve("Owner not found ")
    if (ownerHasEnoughStocks.quantity < quantity) {
        return Promise.resolve("Stocks sold already  ")
    }



    const stockId = ownerHasEnoughStocks.id
    let ownerOrderType: "buy" | "sell" = "buy";
    if (orderType === "buy") {
        ownerOrderType = "sell"
    }



    if (quantity === arr[index].quantity) {
        // console.log("match is found");



        await prisma.$transaction(async (tx) => {
            const userHasStockSymbol = await tx.stocks.findFirst({
                where: { userId: userEmail, symbol: symbol }
            })

            if (userHasStockSymbol) {
                let averagePrice = parseFloat(
                    (
                        (userHasStockSymbol.averagePrice * userHasStockSymbol.quantity + price * quantity) /
                        (userHasStockSymbol.quantity + quantity)
                    ).toFixed(2)
                );
                await tx.stocks.update({
                    where: { id: userHasStockSymbol.id },
                    data: {
                        averagePrice: averagePrice,
                        quantity: { increment: quantity },

                    }
                })

            }
            else {
                await tx.stocks.create({
                    data: {
                        symbol: symbol,
                        averagePrice: price,
                        quantity: quantity,
                        userId: userEmail,
                        name: arr[index].name

                    }
                })
            }
            console.log(stockId , " stock idddd");
            

            await tx.stocks.update({
                where: {
                    id: stockId
                },
                data : {
                    quantity : {decrement : quantity}
                }
            }),
            
            await tx.user.update({
                where: { email: userEmail },
                data: { balance: { decrement: parseFloat((price * quantity).toFixed(4)) } }
            }),
                await tx.user.update({
                    where: { email: stockOwnerEmail },
                    data: {
                        balance: { increment: parseFloat((price * quantity).toFixed(4)) }
                    }
                })
            await tx.trades.create({
                data: {
                    userId: userEmail,
                    orderType: orderType,
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity,
                    completed: true
                }
            })
            await tx.trades.create({
                data: {
                    userId: stockOwnerEmail,
                    orderType: ownerOrderType,
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity,
                    completed: true
                }
            })

        }
        )
        arr.splice(index, 1) // removing it from the array 



    } else {




        await prisma.$transaction(async (tx) => {
            const userHasStockSymbol = await tx.stocks.findFirst({
                where: {
                    userId: userEmail,
                    symbol: symbol

                }
            })
            if (userHasStockSymbol) {
                let averagePrice = parseFloat(
                    (
                        (userHasStockSymbol.averagePrice * userHasStockSymbol.quantity + price * quantity) /
                        (userHasStockSymbol.quantity + quantity)
                    ).toFixed(2)
                );


                await tx.stocks.update({
                    where: {
                        id: userHasStockSymbol.id
                    },
                    data: {
                        quantity: { increment: quantity },
                        averagePrice: averagePrice
                    }
                })


            }
            else {
                await tx.stocks.create({
                    data: {
                        symbol: symbol,
                        averagePrice: (parseFloat)(price.toFixed(4)),
                        userId: userEmail,
                        quantity: quantity,
                        name: arr[index].name || null

                    }
                })
            }
            await tx.stocks.update({
                where: {
                    id: ownerHasEnoughStocks.id
                },
                data: {
                    quantity: { decrement: quantity },

                }
            })
            await tx.user.update({
                where: { email: userEmail },
                data: { balance: { decrement: parseFloat((price * quantity).toFixed(4)) } }
            }),
                await tx.user.update({
                    where: { email: stockOwnerEmail },
                    data: {
                        balance: { increment: parseFloat((price * quantity).toFixed(4)) }
                    }
                })
            await tx.trades.create({
                data: {
                    userId: userEmail,
                    orderType: orderType,
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity,
                    completed: true
                }
            })
            await tx.trades.create({
                data: {
                    userId: stockOwnerEmail,
                    orderType: ownerOrderType,
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity,
                    completed: true
                }
            })
        })



        arr[index].quantity = arr[index].quantity - quantity




    }
    getOrderBook()
}
export async function matchFound({ userEmail, price, quantity, orderType, symbol }: Order) {
    let remainingQuantity = quantity
    if (orderType === "sell") {

        const buyArray = buyArrays[symbol]
        if (!buyArray) {
            return "no symbol  matched "
        }
        let index = binarySearch(price, buyArray, false, userEmail)
        if (buyArray[index].price >= price) {
            let i = index;
            while (i < buyArray.length && remainingQuantity != 0) {
                if (remainingQuantity <= buyArray[i].quantity) {
                    remainingQuantity = 0;
                    try {
                        const response = await flipStocks(buyArray, i, userEmail, { userEmail: buyArray[i].email, price, quantity, orderType, symbol })
                        return response
                    }
                    catch (e) {
                        console.log(e);
                        return e;

                    }



                }

                else {
                    const response = await flipStocks(buyArray, i, userEmail, { userEmail: buyArray[i].email, price, quantity: buyArray[i].quantity, orderType, symbol })
                    remainingQuantity = remainingQuantity - buyArray[i].quantity
                    i++;

                }

            }
            if (remainingQuantity != 0) {
                makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "sell", symbol: symbol })

            }


        }
        else {
            makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "sell", symbol: symbol })

        }

        return Promise.resolve("ok")

    }
    else {

        const sellArray = sellArrays[symbol]
        if (!sellArray) {
            return "no symbol  matched "
        }
        let index = binarySearch(price, sellArray, true, userEmail)
        if (sellArray[index].price <= price) {
            let i = index;
            while (i < sellArray.length && remainingQuantity != 0) {
                if (remainingQuantity <= sellArray[i].quantity) {
                    remainingQuantity = 0;
                    try {
                        const response = await flipStocks(sellArray, i, sellArray[i].email, { userEmail:userEmail , price, quantity, orderType, symbol })
                        return response
                    }
                    catch (e) {
                        console.log(e);
                        return e;

                    }



                }

                else {
                    const response = await flipStocks(sellArray, i, sellArray[i].email, { userEmail:userEmail , price, quantity: sellArray[i].quantity, orderType, symbol })
                    remainingQuantity = remainingQuantity - sellArray[i].quantity
                    i++;

                }

            }
            if (remainingQuantity != 0) {
                makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "buy", symbol: symbol })

            }


        }
        else {
            makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "buy", symbol: symbol })

        }

    }

    return Promise.resolve("okk")

}
function binarySearch(price: number, arr: bidsAsks[], asc: boolean, userEmail: string): number {


    let low = 0;
    let high = arr.length;

    let mid = Math.floor(low + (high - low) / 2);
    while (low < high) {
        mid = Math.floor(low + (high - low) / 2)
        if (arr[mid].price === price && arr[mid].email != userEmail) {

            if (asc) high = mid;
            else low = mid + 1;

        }
        else if (arr[mid].price > price) {
            if (asc) high = mid;
            else low = mid + 1;
        }
        else {
            if (asc) low = mid + 1;
            else high = mid;
        }
    }
    if (low >= arr.length) return arr.length;
  return low;
}
export function getMarketPrice(symbol: string, quantity: number, orderType: "buy" | "sell", email: string) {
    const buy = buyArrays[symbol]
    const sell = sellArrays[symbol]

    if (buy == null || sell == null) {
        return { message: "symbol not found " }
    }
    let remainingQuantity = quantity
    let price = 0;

    if (orderType === "buy") {

        for (let i = 0; i < sell.length && remainingQuantity > 0; i++) {
            if (remainingQuantity >= sell[i].quantity && sell[i].email != email) {
                remainingQuantity -= sell[i].quantity
                price += sell[i].price
            }
            else if (remainingQuantity < sell[i].quantity && sell[i].email != email) {
                price = remainingQuantity * sell[i].price
                remainingQuantity = 0;
            }
            if (remainingQuantity === 0) break;

        }

    }
    else {

        for (let i = 0; i < buy.length && remainingQuantity > 0; i++) {
            if (remainingQuantity >= buy[i].quantity && buy[i].email != email) {
                remainingQuantity -= buy[i].quantity
                price += sell[i].price * sell[i].quantity

            }
            else if (remainingQuantity < buy[i].quantity && buy[i].email != email) {
                price = remainingQuantity * buy[i].price
                remainingQuantity = 0;
            }
            if (remainingQuantity === 0) break;
        }


    }
    let averagePrice = 0;
    if (remainingQuantity != quantity) {
        averagePrice = (parseFloat)((price / (quantity - remainingQuantity)).toFixed(2))
    }

    return {
        message: "Price fetched ",
        remainingQuantity: remainingQuantity,
        price: price,
        averagePrice: averagePrice
    }



}