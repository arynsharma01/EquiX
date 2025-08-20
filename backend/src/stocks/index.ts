import express from "express"
import popularRouter from "./popular";
import stockSearch from "./search";
import { buyStocksRouter } from "./buy";
const stocksRouter = express()

stocksRouter.use('/popular',popularRouter)
stocksRouter.use('/search',stockSearch)
stocksRouter.use('/buy',buyStocksRouter)

export default stocksRouter ;