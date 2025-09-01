
import singlePrismaClient from "../../utils/prismaClient"
import { io } from "../.."

type bidsAsks = {
    email: string
    price: number,
    quantity: number,
    name?: string,
    tradeID: string

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
let sellAAPL: bidsAsks[] = []
let buyAAPL: bidsAsks[] = []
// { email: "admin@gmail.com", price: 802.63, quantity: 3 }, { email: "admin@gmail.com", price: 800.98, quantity: 5 }, { email: "admin@gmail.com", price: 789.43, quantity: 3 }
// { email: "admin@gmail.com", price: 783.32, quantity: 2 }, { email: "M1", price: 80, quantity: 5 }, { email: "", price: 82, quantity: 3 }
let sellMSFT: bidsAsks[] = []
let buyMSFT: bidsAsks[] = []

let sellNVDA: bidsAsks[] = []
let buyNVDA: bidsAsks[] = []

let sellAMZN: bidsAsks[] = []
let buyAMZN: bidsAsks[] = []
//{ email: "admin@gmail.com", quantity: 4, price: 223 }
// { email: "admin@gmail.com", quantity: 2, price: 221 }

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
        quantity: quantity,
        tradeID: ""
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
            const [updatedStock, createdTrade] = await prisma.$transaction([
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
            item.tradeID = createdTrade.id



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
            const [updatedStock, createdTrade] = await prisma.$transaction([

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
            item.tradeID = createdTrade.id




        }
        catch (e) {
            console.log("some internal error at make bid  ", e);

        }

        buyArrays[symbol].push(item)
        buyArrays[symbol].sort((a, b) => b.price - a.price)
        console.log(buyArrays[symbol], "  buy ");

    }

    getOrderBook()

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
            console.log(stockId, " stock idddd");


            await tx.stocks.update({
                where: {
                    id: stockId
                },
                data: {
                    quantity: { decrement: quantity }
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
                    orderType: orderType + " limit",
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity,
                    completed: true,
                    filled: quantity
                }
            })
            const updated = await tx.trades.update({
                where: {
                    id: arr[index].tradeID
                },
                data: {

                    // quantity: {decrement : quantity},
                    filled: { increment: quantity },
                    completed: true
                }
            })

            if (updated.filled == updated.quantity) {
                await tx.trades.update({
                    where: { id: arr[index].tradeID },
                    data: { completed: true }
                })
            }

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
                    orderType: orderType + " limit",
                    date: new Date(Date.now()),
                    symbol: symbol,
                    price: price,
                    quantity: quantity,
                    completed: true,
                    filled: quantity
                }
            })
            const updated = await tx.trades.update({
                where: {
                    id: arr[index].tradeID
                },
                data: {

                    // quantity: {decrement : quantity},
                    filled: { increment: quantity }

                }
            })

            if (updated.filled >= updated.quantity) {
                await tx.trades.update({
                    where: { id: arr[index].tradeID },
                    data: { completed: true }
                })
            }
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
        if (index != buyArray.length && buyArray[index].price >= price) {
            let i = index;
            while (i < buyArray.length && remainingQuantity != 0) {
                if (buyArray[i].email === userEmail) {
                    i++;
                    continue
                }
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

                    const tradableQuantity = Math.min(remainingQuantity, buyArray[i].quantity);

                    const response = await flipStocks(
                        buyArray,
                        i,
                        userEmail,
                        { userEmail: buyArray[i].email, price, quantity: tradableQuantity, orderType, symbol }
                    );

                    remainingQuantity -= tradableQuantity;
                    i++


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
        if (index != sellArray.length && sellArray[index].price <= price) {
            let i = index;
            while (i < sellArray.length && remainingQuantity != 0) {
                let newPrice = Math.min(price, sellArray[i].price);

                if (sellArray[i].email === userEmail) {
                    i++;
                    continue
                }
                if (remainingQuantity <= sellArray[i].quantity) {
                    remainingQuantity = 0;
                    try {
                        const response = await flipStocks(sellArray, i, sellArray[i].email, { userEmail: userEmail, price: newPrice, quantity, orderType, symbol })
                        return response
                    }
                    catch (e) {
                        console.log(e);
                        return e;

                    }



                }

                else {
                    const tradableQuantity = Math.min(remainingQuantity, sellArray[i].quantity);

                    const response = await flipStocks(
                        sellArray,
                        i,
                        sellArray[i].email,
                        { userEmail: userEmail, price: newPrice, quantity: tradableQuantity, orderType, symbol }
                    );

                    remainingQuantity -= tradableQuantity;


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
    let low = 0, high = arr.length;
    while (low < high) {
        let mid = Math.floor((low + high) / 2);
        if (asc) {
            // ascending => sells
            if (arr[mid].price <= price) high = mid;
            else low = mid + 1;
        } else {
            // descending => buys
            if (arr[mid].price >= price) high = mid;
            else low = mid + 1;
        }
    }
    return low;
}


export function getMarketPrice(
    symbol: string,
    quantity: number,
    orderType: "buy" | "sell",
    email: string
) {
    const buy = buyArrays[symbol];
    const sell = sellArrays[symbol];

    if (!buy || !sell) {
        return { message: "symbol not found " };
    }

    let remainingQuantity = quantity;
    let price = 0;

    if (orderType === "buy") {
        for (let i = 0; i < sell.length && remainingQuantity > 0; i++) {
            if (sell[i].email === email) continue;

            const qty = Math.min(remainingQuantity, sell[i].quantity);
            remainingQuantity -= qty;
            price += qty * sell[i].price;
        }
    } else {
        for (let i = 0; i < buy.length && remainingQuantity > 0; i++) {
            if (buy[i].email === email) continue;

            const qty = Math.min(remainingQuantity, buy[i].quantity);
            remainingQuantity -= qty;
            price += qty * buy[i].price;
        }
    }

    let averagePrice = 0;
    if (remainingQuantity !== quantity) {
        averagePrice = parseFloat(
            (price / (quantity - remainingQuantity)).toFixed(2)
        );
    }

    return {
        message: "Price fetched",
        remainingQuantity,
        price,
        averagePrice,
    };
}


export async function marketOrder(userEmail: string, quantity: number, orderType: "sell" | "buy", symbol: string) {
    let arr: bidsAsks[];
    let userHasCurrently = -1;
    let userHasBalance = -1;
    let currentStockId = ""
    let remainingQuantity = quantity;
    let result = {
        message: "",
        filled: 0,

    }
    let totalPrice = 0;
    try {
        if (orderType === "sell") {
            arr = buyArrays[symbol];
            await prisma.$transaction(async (tx) => {
                for (let i = 0; i < arr.length && remainingQuantity > 0; i++) {
                    if (arr[i].email === userEmail) continue;

                    let tradeQty = 0;


                    if (userHasCurrently === -1) {
                        const user = await tx.user.findFirst({
                            where: {
                                email: userEmail
                            },
                            include: {
                                stocks: true
                            }
                        })
                        const currStock = user?.stocks.find((stock) => { return stock.symbol === symbol })
                        if (!currStock || currStock.quantity <= 0) {
                            result.message = "Stock not found / insufficient quantity   ",
                                result.filled = quantity - remainingQuantity
                            throw Error("stock quantity not filled ");
                        }

                        userHasCurrently = currStock.quantity
                        currentStockId = currStock.id

                    }
                    tradeQty = Math.min(remainingQuantity, arr[i].quantity, userHasCurrently);
                    const total = parseFloat(((tradeQty * arr[i].price)).toFixed(2));
                    const stockUpdate = await tx.stocks.update({
                        where: {
                            id: currentStockId
                        },
                        data: {
                            quantity: { decrement: tradeQty }
                        }
                    })
                    const userBalanceUpdate = await tx.user.update({
                        where: {
                            email: userEmail
                        },
                        data: {
                            balance: { increment: total }
                        }
                    })
                    const buyerStock = await tx.user.findFirst({
                        where: {
                            email: arr[i].email
                        },

                        include: { stocks: true }
                    })
                    const userHasStockSymbol = buyerStock?.stocks.find((stock) => { return stock.symbol === symbol })
                    if (!userHasStockSymbol) {
                        await tx.stocks.create({
                            data: {
                                userId: arr[i].email,
                                averagePrice: arr[i].price,
                                quantity: tradeQty,
                                symbol: symbol

                            }
                        })


                    }
                    else {
                        let averagePrice = parseFloat(
                            (
                                (userHasStockSymbol.averagePrice * userHasStockSymbol.quantity +
                                    arr[i].price * tradeQty) /
                                (userHasStockSymbol.quantity + tradeQty)
                            ).toFixed(2)
                        )


                        await tx.stocks.update({
                            where: {
                                id: userHasStockSymbol.id
                            },
                            data: {
                                averagePrice: averagePrice,
                                quantity: { increment: tradeQty }
                            }
                        })
                    }

                    const trades = await tx.trades.update({
                        where: {
                            id: arr[i].tradeID
                        },
                        data: {
                            filled: { increment: tradeQty }
                        }
                    })
                    if (trades.filled === trades.quantity) {
                        await tx.trades.update({
                            where: {
                                id: trades.id
                            },
                            data: {
                                filled: trades.quantity,
                                completed: true
                            }
                        })
                    }


                    userHasCurrently = stockUpdate.quantity
                    totalPrice += arr[i].price * tradeQty

                    remainingQuantity -= tradeQty;
                    arr[i].quantity -= tradeQty;

                    if (arr[i].quantity === 0) {
                        arr.splice(i, 1);
                        i--;
                    }
                }
            })


            const filledQty = quantity - remainingQuantity;
            const totalAveragePrice = filledQty > 0 ? parseFloat((totalPrice / filledQty).toFixed(2)) : 0;

            totalAveragePrice > 0 ? await prisma.trades.create({
                data: {
                    userId: userEmail,
                    price: totalAveragePrice,
                    date: new Date(Date.now()),
                    quantity: quantity,
                    filled: quantity - remainingQuantity,
                    completed: remainingQuantity === 0,
                    symbol: symbol,
                    orderType: orderType + " market"


                }
            }) : ""
            result.message = "order completed "
            result.filled = quantity - remainingQuantity
            return result


        } else {

            arr = sellArrays[symbol];


            await prisma.$transaction(async (tx) => {
                const buyerStock = await tx.user.findFirst({
                    where: {
                        email: userEmail
                    },

                    include: { stocks: true }
                })
                const userHasStockSymbol = buyerStock?.stocks.find((stock) => { return stock.symbol === symbol })

                for (let i = 0; i < arr.length && remainingQuantity > 0; i++) {
                    if (arr[i].email === userEmail) continue;

                    if (userHasBalance === -1) {
                        const user = await tx.user.findFirst({
                            where: {
                                email: userEmail
                            },

                        })
                        userHasBalance = user?.balance || 0

                        if (userHasBalance < arr[i].price) {
                            result.message = "insufficient blance  ",
                                result.filled = quantity - remainingQuantity
                            throw Error("stock quantity not filled ");
                        }


                    }
                    let maxStocksUserCanbuyAtI = Math.floor(userHasBalance / arr[i].price)


                    let tradeQty = Math.min(remainingQuantity, arr[i].quantity, maxStocksUserCanbuyAtI);


                    const total = parseFloat(((tradeQty * arr[i].price)).toFixed(2));
                    const seller = await tx.user.findFirst({
                        where: {
                            email: arr[i].email
                        },
                        include: {
                            stocks: true
                        }
                    })
                    const stockId = seller?.stocks.find((stock) => { return stock.symbol === symbol })
                    currentStockId = stockId?.id as string

                    await tx.user.update({
                        where: { email: userEmail },
                        data: { balance: { decrement: total } }
                    })
                    userHasBalance -= total;


                    const sellerBalanceUpdate = await tx.user.update({
                        where: {
                            email: arr[i].email
                        },
                        data: {
                            balance: { increment: total } // seller balance inc 
                        }
                    })


                    if (!userHasStockSymbol) {
                        await tx.stocks.create({
                            data: {
                                userId: userEmail,
                                averagePrice: arr[i].price,
                                quantity: tradeQty,
                                symbol: symbol

                            }
                        })


                    }
                    else {
                        let averagePrice = parseFloat(
                            (
                                (userHasStockSymbol.averagePrice * userHasStockSymbol.quantity +
                                    arr[i].price * tradeQty) /
                                (userHasStockSymbol.quantity + tradeQty)
                            ).toFixed(2)
                        )


                        await tx.stocks.update({
                            where: {
                                id: userHasStockSymbol.id
                            },
                            data: {
                                averagePrice: averagePrice,
                                quantity: { increment: tradeQty }
                            }
                        })
                    }

                    const trades = await tx.trades.update({
                        where: {
                            id: arr[i].tradeID
                        },
                        data: {
                            filled: { increment: tradeQty }
                        }
                    })
                    if (trades.filled === trades.quantity) {
                        await tx.trades.update({
                            where: {
                                id: trades.id
                            },
                            data: {
                                filled: trades.quantity,
                                completed: true
                            }
                        })
                    }



                    totalPrice += arr[i].price * tradeQty

                    remainingQuantity -= tradeQty;
                    arr[i].quantity -= tradeQty;

                    if (arr[i].quantity === 0) {
                        arr.splice(i, 1);
                        i--;
                    }
                }
            })


            const filledQty = quantity - remainingQuantity;
            const totalAveragePrice = filledQty > 0 ? parseFloat((totalPrice / filledQty).toFixed(2)) : 0;

            filledQty > 0 ? await prisma.trades.create({
                data: {
                    userId: userEmail,
                    price: totalAveragePrice,
                    date: new Date(Date.now()),
                    quantity: quantity,
                    filled: quantity - remainingQuantity,
                    completed: remainingQuantity === 0,
                    symbol: symbol,
                    orderType: orderType + " market"


                }
            }) : ""
            result.message = "order completed "
            result.filled = quantity - remainingQuantity
            return result





        }
    }
    catch (e: any) {
        console.log(e + " inside market error ");

        return result
    }


}

export function cancelTrade(orderType: "sell" | "buy", tradeID: string, symbol: string) {
    let arr;
    if (orderType === "sell") {
        arr = sellArrays[symbol]
    }
    else {
        arr = buyArrays[symbol]
    }
    let index = arr.findIndex((stk) => {
        stk.tradeID === tradeID
    })
    arr.splice(index, 1)
    getOrderBook()
}