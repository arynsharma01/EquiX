import bodyParser from "body-parser"
import express, { Request, Response } from "express"

const stockSearch = express()
stockSearch.use(bodyParser.json())

stockSearch.get('/', async (req : Request , res : Response)=>{
    const popularStocks = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc. (Class A)" },
  { symbol: "GOOG", name: "Alphabet Inc. (Class C)" },
  { symbol: "AMZN", name: "Amazon.com, Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms, Inc." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "BRK-B", name: "Berkshire Hathaway Inc. (Class B)" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "PG", name: "Procter & Gamble Co." },
  { symbol: "UNH", name: "UnitedHealth Group Inc." },
  { symbol: "MA", name: "Mastercard Incorporated" },
  { symbol: "XOM", name: "Exxon Mobil Corporation" },
  { symbol: "HD", name: "Home Depot, Inc." },
  { symbol: "BAC", name: "Bank of America Corporation" },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "KO", name: "The Coca-Cola Company" },
  { symbol: "PEP", name: "PepsiCo, Inc." },
  { symbol: "CVX", name: "Chevron Corporation" },
  { symbol: "ABBV", name: "AbbVie Inc." },
  { symbol: "AVGO", name: "Broadcom Inc." },
  { symbol: "MRK", name: "Merck & Co., Inc." },
  { symbol: "NFLX", name: "Netflix, Inc." },
  { symbol: "NKE", name: "NIKE, Inc." },
  { symbol: "TMO", name: "Thermo Fisher Scientific Inc." },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "ORCL", name: "Oracle Corporation" },
  { symbol: "DIS", name: "The Walt Disney Company" },
  { symbol: "LLY", name: "Eli Lilly and Company" },
  { symbol: "TSM", name: "Taiwan Semiconductor Manufacturing Company Ltd." },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "CRM", name: "Salesforce, Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices, Inc." },
  { symbol: "COST", name: "Costco Wholesale Corporation" },
  { symbol: "QCOM", name: "Qualcomm Incorporated" },
  { symbol: "ABNB", name: "Airbnb, Inc." },
  { symbol: "BABA", name: "Alibaba Group Holding Ltd." },
  { symbol: "UBER", name: "Uber Technologies, Inc." },
  { symbol: "SHOP", name: "Shopify Inc." },
  { symbol: "SBUX", name: "Starbucks Corporation" },
  { symbol: "PYPL", name: "PayPal Holdings, Inc." },
  { symbol: "SAP", name: "SAP SE" },
  { symbol: "NVO", name: "Novo Nordisk A/S" },
  { symbol: "RIVN", name: "Rivian Automotive, Inc." },
  { symbol: "ZM", name: "Zoom Video Communications, Inc." }
];

    let symbol = req.query.symbol
    
    if(!symbol ){
        return res.status(200).json({
            message : "not found "
        })
    }
    symbol = symbol.toString().trim()
    
   
   
    

    const searchResult = popularStocks.filter((stock)=>stock.name.includes(symbol) || stock.symbol.includes(symbol))
    console.log(searchResult);
    return res.status(200).json({
            message : "found ",
            searchResult : searchResult
        })
    
})

export default stockSearch

