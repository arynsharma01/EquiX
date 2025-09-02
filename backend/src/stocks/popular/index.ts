import bodyParser from "body-parser";
import { config } from "dotenv";
import express, { Request, Response } from "express"
import axios from "axios";
import { Redis } from '@upstash/redis'



const popularRouter = express()
config()
popularRouter.use(bodyParser.json())

type ResultChildType = {

    duration: string,
    closingValues: number[],
    dateTime: Date[],
    volume: number,
    longName : string,
    gainPercent : number,
    gainValue : number 


}

type result = {

    symbol: string,
    child: ResultChildType[]

}


popularRouter.get('/get-info', async (req: Request, res: Response) => {


    let allData: result[] = []

    const redis = new Redis({
   url: process.env.UPSTASH_REDIS_REST_URL,
   token: process.env.UPSTASH_REDIS_REST_TOKEN,
})

    const popularStocks = [
        
        { symbol: "AAPL", range: "1mo", interval: "1d" },

        { symbol: "MSFT", range: "1mo", interval: "1d" },

        { symbol: "NVDA", range: "1mo", interval: "1d" },

        { symbol: "AMZN", range: "1mo", interval: "1d" },

        { symbol: "TSLA", range: "1mo", interval: "1d" },

        { symbol: "NFLX", range: "1mo", interval: "1d" },

    ]
    const cached = await redis.get("usersCache");
    if (cached) {
        ;
         return res.status(200).json({
            message: "Work well ",
            allData: cached

        })
    }
    try {

        for (let i = 0; i < popularStocks.length; i++) {
            const { symbol, interval, range } = popularStocks[i]
            const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`)
            const timestamps = response.data.chart.result[0].timestamp
            const values = response.data.chart.result[0].indicators.quote[0].low;
            
            
            const dateTime = timestamps.map((value: number) => new Date(value * 1000).toLocaleString())
            const closingValues = values.map((value: number) => parseFloat(value.toFixed(2)))
            const lastVolume = response.data.chart.result[0].indicators.quote[0].volume.slice(-1)[0];
            const close = response.data.chart.result[0].indicators.quote[0].low.at(-1)
            const open = response.data.chart.result[0].indicators.quote[0].low[0]

            const gainPercent = ((close-open)/open) *100 
            const gainValue = close-open
            
            
            const childEntry = {
                symbol,
                duration: interval,
                dateTime,
                closingValues,
                volume: lastVolume,
                longName : response.data.chart.result[0].meta.longName,
                gainValue : (parseFloat)(gainValue.toFixed(2)),
                gainPercent :(parseFloat)(gainPercent.toFixed(2))
            }


            const existing = allData.find(stock => stock.symbol === symbol);


            if (existing) {
                existing.child.push(childEntry);
            } else {
                allData.push({
                    symbol,
                    child: [childEntry]
                });
            }
        }
        await redis.setex("usersCache",1200, JSON.stringify(allData));




       
        
        return res.status(200).json({
            message: "Work well ",
            allData: allData

        })
    } catch (error) {
        console.log(error);


        return res.status(429).json({
            message: "to many requests ",
            allData: allData
        })


    }

})

popularRouter.get('/search/result', async (req: Request, res: Response) => {
    try {


        let allData: result[] = []

        let symbol = req.query.symbol
        
        
        if (!symbol) {
            return res.status(200).json({
                message: "Not found "
            })

        }
        symbol = symbol.toString().toUpperCase()
        const response = await axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1d&interval=30m`)
        const timestamps = response.data.chart.result[0].timestamp
        const values = response.data.chart.result[0].indicators.quote[0].low;

        const dateTime = timestamps.map((value: number) => new Date(value * 1000).toLocaleTimeString())
        const closingValues = values.map((value: number) => parseFloat(value.toFixed(4)))
        const lastVolume = response.data.chart.result[0].indicators.quote[0].volume.slice(-1)[0];

        const close = response.data.chart.result[0].indicators.quote[0].low.at(-1)
        const open = response.data.chart.result[0].indicators.quote[0].low[0]

        const gainPercent = ((close-open)/open) *100 
        const gainValue = close-open

        

        
        let childEntry = [
            {
                dateTime: dateTime,
                closingValues: closingValues,
                duration: "1d",
                volume: lastVolume,
                longName : response.data.chart.result[0].meta.longName,
                gainValue : (parseFloat)(gainValue.toFixed(2)),
                gainPercent :(parseFloat)(gainPercent.toFixed(2))
            }
        ]

        allData.push({ symbol: symbol, child: childEntry })
        return res.json({
            message: "ok",
            allData: allData
        })
    }
    catch (e) {
        return res.status(400).json({
            message: "not found/ internal error "
        })
    }
})


popularRouter.get('/market/status', async (req: Request, res: Response) => {
    type allData = {
        symbol: string,
        value: number,
        gainPercent : number,
        gainValue : number 
    }
    let allResult: allData[] = []
    try {
        console.log("inside market status ");
        

        await axios
            .all([
                axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/^DJI?range=1wk&interval=1d`),
                axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/^IXIC?range=1wk&interval=1d`),
                axios.get(`https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?range=1wk&interval=1d`),
                
            ])
            .then(
                axios.spread((dowRes, nasdaqRes, spRes) => {
                    const dowClose = dowRes.data.chart.result[0].indicators.quote[0].low.at(-1)
                    const dowOpen = dowRes.data.chart.result[0].indicators.quote[0].low[0]
                    const nasdaqClose = nasdaqRes.data.chart.result[0].indicators.quote[0].low.at(-1)
                    const nasdaqOpen = nasdaqRes.data.chart.result[0].indicators.quote[0].low[0]
                    const spClose = spRes.data.chart.result[0].indicators.quote[0].low.at(-1)
                    const spOpen = spRes.data.chart.result[0].indicators.quote[0].low[0]
                    
                    
                    
                    

                    const dowPercent = (dowClose-dowOpen)/dowOpen * 100 ;
                    const nasdaqPercent = (nasdaqClose-nasdaqOpen)/nasdaqOpen * 100 ;
                    const spPercent = (spClose-spOpen)/spOpen * 100 ;

                    
                    allResult.push(
                        { symbol: "DOW JONES", value: dowClose , gainPercent: (parseFloat)(dowPercent.toFixed(2)), gainValue : (parseFloat)((dowClose-dowOpen).toFixed(2)) },
                        { symbol: "NASDAQ", value: nasdaqClose  ,gainPercent : (parseFloat)(nasdaqPercent.toFixed(2)), gainValue : (parseFloat)((nasdaqClose-nasdaqOpen).toFixed(2))},
                        { symbol: "S&P 500", value: spClose , gainPercent : (parseFloat)(spPercent.toFixed(2)) , gainValue : (parseFloat)((spClose-spOpen).toFixed(2)) }
                    );
                })
            );

        
        return res.status(200).json({
            message: "ok",

            allResult: allResult
        })

    }
    catch (e: any) {
        console.log(e);

        return res.status(400).json({
            message: "some internal error"
        })
    }
})


export default popularRouter; 