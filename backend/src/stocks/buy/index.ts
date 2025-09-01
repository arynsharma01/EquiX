import express, { Request, Response } from "express";
import tokenCheck from "../../utils/tokenCheck";

import singlePrismaClient from "../../utils/prismaClient";
import getOrderBook, { cancelTrade, getMarketPrice, marketOrder, matchFound } from "../popular/orderbooks";


export const buyStocksRouter = express()
const prisma = singlePrismaClient()
buyStocksRouter.post('/new/stock', tokenCheck, async (req: Request, res: Response) => {
    const { price, quantity, symbol, email, orderType } = req.body
    console.log("inside the request ", req.body);

    if (!price || !quantity || !email || !symbol || !orderType) {
        return res.status(401).json({
            message: "invalid data  "
        })
    }

    if (!email) {
        return res.status(401).json({
            message: "no email found pls login "
        })

    }

    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            stocks: true
        }
    })
    if (!user) {
        return res.status(401).redirect('/signup')
    }
    if (orderType === "buy" && price * quantity > user.balance) {
        console.log(price * quantity);
        console.log(user.balance);


        return res.status(200).json({
            message: "insufficient balance "
        })

    }
    else if (orderType === "sell") {
        const currStock = user.stocks.find((stock) => { return stock.symbol === symbol })
        if (!currStock) {
            return res.status(200).json({
                message: "Stock not found  "
            })

        }
        else if (currStock.quantity < quantity) {
            return res.status(200).json({
                message: "insufficient stock quantity "
            })
        }
    }
    console.log("reached match found ");



    matchFound({ userEmail: email, price: price as number, quantity: quantity as number, symbol: symbol as string, orderType })

    getOrderBook()
    return res.status(200).json({
        message: "Transaction successfull"

    })
})

buyStocksRouter.post('/get/market/price', tokenCheck, async (req: Request, res: Response) => {

    const { quantity, symbol, orderType, email } = req.body
    if (!quantity || !symbol || !orderType) {
        return res.json({
            message: "quantity not found"
        })
    }
    const result = getMarketPrice(symbol, quantity, orderType, email)
    return res.json({
        message: result.message,
        quantity: result.remainingQuantity,
        price: result.price,
        averagePrice: result.averagePrice
    })

})

// buyStocksRouter.post('/new/stock', tokenCheck, async (req: Request, res: Response) => {
//     const {  quantity, symbol, email, orderType } = req.body
//     if ( !quantity || !email || !symbol || !orderType) {
//         return res.status(401).json({
//             message: "invalid data  "
//         })
//     }

//     if (!email) {
//         return res.status(401).json({
//             message: "no email found pls login "
//         })

//     }
//     const prisma = singlePrismaClient()
//     const user = await prisma.user.findFirst({
//         where: {
//             email: email
//         },
//         include :{
//             stocks : true
//         }
//     })
//     if (!user) {
//         return res.status(401).redirect('/signup')
//     }
//     const marketResult = getMarketPrice(symbol,quantity,orderType,email)
//     let balanceNeeded = marketResult.averagePrice *
//     if (orderType === "buy" && price * quantity > user.balance) {
//         console.log(price *quantity );
//         console.log(user.balance );


//         return res.status(200).json({
//             message: "insufficient balance "
//         })

//     }
//     else if(orderType === "sell") {
//         const currStock = user.stocks.find((stock)=>{return stock.symbol === symbol})
//         if(!currStock){
//             return res.status(200).json({
//             message: "Stock not found  "
//         })

//         }
//         else if(currStock.quantity < quantity){
//             return res.status(200).json({
//             message: "insufficient stock quantity "
//         })
//         }
//     }


//     matchFound({ userEmail: email, price: price as number, quantity: quantity as number, symbol: symbol as string, orderType  })


//     return res.status(200).json({
//         message: "Transaction successfull"

//     })
// })

buyStocksRouter.post('/new/stock/market', tokenCheck, async (req: Request, res: Response) => {
    const { quantity, email, symbol, orderType } = req.body
    if (!email || !quantity || !symbol || !orderType) {
        return res.json({
            message: "missing details "
        })
    }
    const prisma = singlePrismaClient()
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        include: { stocks: true }
    })
    const currentStock = user?.stocks.find((stk) => { return stk.symbol === symbol })


    if (!currentStock || currentStock.quantity < quantity && orderType === "sell") {
        return res.json({
            message: "insufficient stock quantity "
        })
    }

    const result = await marketOrder(email, quantity, orderType, symbol)
    console.log(result);

    return res.json({
        message: result.message,
        filled: result.filled,

    })

})

buyStocksRouter.post('/cancel/trade', tokenCheck, async (req: Request, res: Response) => {
    const { email, tradeID } = req.body;
    if (!tradeID) {
        return res.json({
            message: "trade ID not found "
        })
    }
    const user = await prisma.user.findFirst({
        where: {
            email: email
        }, include: { trades: true, stocks: true }
    })
    const currentTrade = user?.trades.find((trades) => {
        return trades.id === tradeID
    })
    if (!currentTrade || currentTrade.cancelled) {
        return res.json({
            message: "trade already cancelled  "
        })
    }
    if (currentTrade.completed) {
        return res.json({
            message: "trade already completed  "
        })
    }
    let remainingQuantity = currentTrade.quantity - currentTrade.filled
    if (currentTrade.orderType === "sell") {

        const currentStock = user?.stocks.find((stk) => { return stk.symbol === currentTrade.symbol })
        if (!currentStock) {
            await prisma.stocks.create({
                data: {
                    userId: email,
                    quantity: remainingQuantity,
                    averagePrice: currentTrade.price,
                    symbol: currentTrade.symbol
                }
            })
        }
        else {
            await prisma.$transaction([
                prisma.stocks.update({
                    where: {
                        id: currentStock.id
                    },
                    data: {
                        quantity: { increment: remainingQuantity }
                    }
                }),
                prisma.trades.update({
                    where: {
                        id: tradeID
                    },
                    data: {
                        cancelled: true
                    }
                })
            ])
        }

        cancelTrade("sell", tradeID, currentTrade.symbol)
    }
    else {
        const total = parseFloat((remainingQuantity * currentTrade.price).toFixed(2))
        await prisma.$transaction([
            prisma.trades.update({
                where: {
                    id: tradeID
                },
                data: {
                    cancelled: true
                }
            }),
                prisma.user.update({
                where: {
                    email: email
                },
                data: {
                    balance: { increment: total }
                }
            })

        ])


        cancelTrade("buy", tradeID, currentTrade.symbol)
    }
    return res.json({
        message: "order cancelled successfully "
    })
})

buyStocksRouter.get('/get/stocks', tokenCheck, async (req: Request, res: Response) => {
    const { email } = req.body;
    const user = await prisma.user.findFirst({
        where: { email: email },
        include: { stocks: true, trades: true }
    })
    return res.json({
        message: "ok",
        stocks: user?.stocks,
        balance: user?.balance,
        trades: user?.trades
    })

})
