import express, { Request, Response } from "express";
import tokenCheck from "../../utils/tokenCheck";

import singlePrismaClient from "../../utils/prismaClient";
import { getMarketPrice, matchFound } from "../popular/orderbooks";
import { string } from "zod";

export const buyStocksRouter = express()

buyStocksRouter.post('/new/stock', tokenCheck, async (req: Request, res: Response) => {
    const { price, quantity, symbol, email, orderType } = req.body
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
    const prisma = singlePrismaClient()
    const user = await prisma.user.findFirst({
        where: {
            email: email
        },
        include :{
            stocks : true
        }
    })
    if (!user) {
        return res.status(401).redirect('/signup')
    }
    if (orderType === "buy" && price * quantity > user.balance) {
        console.log(price *quantity );
        console.log(user.balance );
        
    
        return res.status(200).json({
            message: "insufficient balance "
        })

    }
    else if(orderType === "sell") {
        const currStock = user.stocks.find((stock)=>{return stock.symbol === symbol})
        if(!currStock){
            return res.status(200).json({
            message: "Stock not found  "
        })
        
        }
        else if(currStock.quantity < quantity){
            return res.status(200).json({
            message: "insufficient stock quantity "
        })
        }
    }


    matchFound({ userEmail: email, price: price as number, quantity: quantity as number, symbol: symbol as string, orderType  })


    return res.status(200).json({
        message: "Transaction successfull"

    })
})

buyStocksRouter.post('/get/market/price',tokenCheck, async (req : Request , res: Response )=>{
    
    const {quantity,symbol, orderType, email } = req.body
    if(!quantity || !symbol || !orderType ){
        return res.json({
            message : "quantity not found"
        })
    }
    const result = getMarketPrice(symbol , quantity ,orderType , email )
    return res.json({
        message  : result.message,
        quantity : result.remainingQuantity,
        price : result.price,
        averagePrice : result.averagePrice
    })

})