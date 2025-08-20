import { email } from "zod"
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
let sellAAPL: bidsAsks[] = [{ email: "", price: 82, quantity: 3 }, { email: "M1", price: 80, quantity: 5 }, { email: "", price: 78, quantity: 1 }]
let buyAAPL: bidsAsks[] = [{ email: "", price: 78, quantity: 1 }, { email: "M1", price: 80, quantity: 5 }, { email: "", price: 82, quantity: 3 }]

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
        "buyAMZN" : buyAMZN,
        "sellAMZN" : sellAMZN,
        "buyAAPL" : buyAAPL,
        "sellAAPL" : sellAAPL,
        "buyMSFT" : buyMSFT,
        "sellMSFT" : sellMSFT,
        "buyNVDA" : buyNVDA,
        "sellNVDA" : sellNVDA,
        "buyTSLA" : buyTSLA,
        "sellTSLA" : sellTSLA,
        "buyNFLX" : buyNFLX,
        "sellNFLX" : sellNFLX,
    })


    
}
export function makeBid({ userEmail, price, quantity, orderType, symbol }: Order) {
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

        sellArrays[symbol].push(item)
        sellArrays[symbol].sort((a, b) => a.price < b.price ? 1 : -1)



    }
    else {
        console.log("inside the buy of makeBid ");

        const buyArray = buyArrays[symbol]
        if (!buyArray) {
            return "no symbol  matched "
        }
        buyArrays[symbol].push(item)
        buyArrays[symbol].sort((a, b) => a.price < b.price ? -1 : 1)
        console.log(buyArrays[symbol]);

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


        await prisma.$transaction(async (tx) => {
            const userHasStockSymbol = await tx.stocks.findFirst({
                where: { userId: userEmail, symbol: symbol }
            })

            if (userHasStockSymbol) {
                let averagePrice = parseFloat(((userHasStockSymbol.averagePrice * userHasStockSymbol.quantity + price * quantity) / userHasStockSymbol.quantity + quantity).toFixed(4))
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


            await tx.stocks.delete({
                where: {
                    id: stockId
                },
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
                    quantity: quantity
                }
            })
            await tx.trades.create({
                data: {
                    userId: stockOwnerEmail,
                    orderType: ownerOrderType,
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity
                }
            })

        }
        )
        arr = arr.splice(index, index + 1) // removing it from the array 


    } else {




        await prisma.$transaction(async (tx) => {
            const userHasStockSymbol = await tx.stocks.findFirst({
                where: {
                    userId: userEmail,
                    symbol: symbol

                }
            })
            if (userHasStockSymbol) {
                let averagePrice = parseFloat(((userHasStockSymbol.averagePrice * userHasStockSymbol.quantity + price * quantity) / userHasStockSymbol.quantity + quantity).toFixed(4))
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
                    quantity: quantity
                }
            })
            await tx.trades.create({
                data: {
                    userId: stockOwnerEmail,
                    orderType: ownerOrderType,
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity
                }
            })
        })



        arr[index].quantity = arr[index].quantity - quantity

    }
}
export async function matchFound({ userEmail, price, quantity, orderType, symbol }: Order) {
    let remainingQuantity = quantity
    if (orderType === "sell") {

        const buyArray = buyArrays[symbol]
        if (!buyArray) {
            return "no symbol  matched "
        }
        let index = binarySearch(price, buyArray, true)
        if (index !== -1) {
            if (remainingQuantity <= buyArray[index].quantity) {
                remainingQuantity = 0;
                const response = await flipStocks(buyArray, index, userEmail, { userEmail: buyArray[index].email, price, quantity, orderType, symbol })
                return response;
            }
            else {
                const response = await flipStocks(buyArray, index, userEmail, { userEmail: buyArray[index].email, price, quantity: buyArray[index].quantity, orderType, symbol })
                remainingQuantity = remainingQuantity - buyArray[index].quantity
                makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "sell", symbol: symbol })
                return response;
            }
        }
        else {
            makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "sell", symbol: symbol })

        }
        getOrderBook()
        return Promise.resolve("ok")




    }
    else {

        const sellArray = sellArrays[symbol]
        if (!sellArray) {
            return "no symbol  matched "
        }
        let index = binarySearch(price, sellArray, false)
        if (index !== -1) {
            if (remainingQuantity <= sellArray[index].quantity) {
                remainingQuantity = 0;
                const response = await flipStocks(sellArray, index, sellArray[index].email, { userEmail, price, quantity, orderType, symbol })
                return response

            }
            else if (remainingQuantity > sellArray[index].quantity) {
                const response = await flipStocks(sellArray, index, sellArray[index].email, { userEmail, price, quantity, orderType, symbol })
                remainingQuantity = remainingQuantity - sellArray[index].quantity
                makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "buy", symbol: symbol })
                return response
            }

        }
        else {
            makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "buy", symbol: symbol })
        }

    }
    return Promise.resolve("okk")




}
function binarySearch(price: number, arr: bidsAsks[], asc: boolean): number {


    let low = 0;
    let high = arr.length;


    while (low < high) {
        let mid = Math.floor(low + (high - low) / 2);

        if (arr[mid].price === price) {
            return mid;
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
    return -1;
}