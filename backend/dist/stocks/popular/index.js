"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = require("dotenv");
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const redis_1 = require("@upstash/redis");
const popularRouter = (0, express_1.default)();
(0, dotenv_1.config)();
popularRouter.use(body_parser_1.default.json());
popularRouter.get('/get-info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allData = [];
    const redis = new redis_1.Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    const popularStocks = [
        { symbol: "AAPL", range: "1mo", interval: "1d" },
        { symbol: "MSFT", range: "1mo", interval: "1d" },
        { symbol: "NVDA", range: "1mo", interval: "1d" },
        { symbol: "AMZN", range: "1mo", interval: "1d" },
        { symbol: "TSLA", range: "1mo", interval: "1d" },
        { symbol: "NFLX", range: "1mo", interval: "1d" },
    ];
    const cached = yield redis.get("usersCache");
    if (cached) {
        ;
        return res.status(200).json({
            message: "Work well ",
            allData: cached
        });
    }
    try {
        for (let i = 0; i < popularStocks.length; i++) {
            const { symbol, interval, range } = popularStocks[i];
            const response = yield axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`);
            const timestamps = response.data.chart.result[0].timestamp;
            const values = response.data.chart.result[0].indicators.quote[0].low;
            const dateTime = timestamps.map((value) => new Date(value * 1000).toLocaleString());
            const closingValues = values.map((value) => parseFloat(value.toFixed(2)));
            const lastVolume = response.data.chart.result[0].indicators.quote[0].volume.slice(-1)[0];
            const close = response.data.chart.result[0].indicators.quote[0].low.at(-1);
            const open = response.data.chart.result[0].indicators.quote[0].low[0];
            const gainPercent = ((close - open) / open) * 100;
            const gainValue = close - open;
            const childEntry = {
                symbol,
                duration: interval,
                dateTime,
                closingValues,
                volume: lastVolume,
                longName: response.data.chart.result[0].meta.longName,
                gainValue: (parseFloat)(gainValue.toFixed(2)),
                gainPercent: (parseFloat)(gainPercent.toFixed(2))
            };
            const existing = allData.find(stock => stock.symbol === symbol);
            if (existing) {
                existing.child.push(childEntry);
            }
            else {
                allData.push({
                    symbol,
                    child: [childEntry]
                });
            }
        }
        yield redis.setex("usersCache", 1200, JSON.stringify(allData));
        return res.status(200).json({
            message: "Work well ",
            allData: allData
        });
    }
    catch (error) {
        console.log(error);
        return res.status(429).json({
            message: "to many requests ",
            allData: allData
        });
    }
}));
popularRouter.get('/search/result', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allData = [];
        let symbol = req.query.symbol;
        if (!symbol) {
            return res.status(200).json({
                message: "Not found "
            });
        }
        symbol = symbol.toString().toUpperCase();
        const response = yield axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=1mo&interval=1d`);
        const timestamps = response.data.chart.result[0].timestamp;
        const values = response.data.chart.result[0].indicators.quote[0].low;
        const dateTime = timestamps.map((value) => new Date(value * 1000).toISOString());
        const closingValues = values.map((value) => parseFloat(value.toFixed(4)));
        const lastVolume = response.data.chart.result[0].indicators.quote[0].volume.slice(-1)[0];
        const close = response.data.chart.result[0].indicators.quote[0].low.at(-1);
        const open = response.data.chart.result[0].indicators.quote[0].low[0];
        const gainPercent = ((close - open) / open) * 100;
        const gainValue = close - open;
        let childEntry = [
            {
                dateTime: dateTime,
                closingValues: closingValues,
                duration: "1d",
                volume: lastVolume,
                longName: response.data.chart.result[0].meta.longName,
                gainValue: (parseFloat)(gainValue.toFixed(2)),
                gainPercent: (parseFloat)(gainPercent.toFixed(2))
            }
        ];
        allData.push({ symbol: symbol, child: childEntry });
        return res.json({
            message: "ok",
            allDatadata: allData
        });
    }
    catch (e) {
        return res.status(400).json({
            message: "not found/ internal error "
        });
    }
}));
popularRouter.get('/market/status', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let allResult = [];
    try {
        console.log("inside market status ");
        yield axios_1.default
            .all([
            axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/^DJI?range=1wk&interval=1d`),
            axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/^IXIC?range=1wk&interval=1d`),
            axios_1.default.get(`https://query1.finance.yahoo.com/v8/finance/chart/^GSPC?range=1wk&interval=1d`),
        ])
            .then(axios_1.default.spread((dowRes, nasdaqRes, spRes) => {
            const dowClose = dowRes.data.chart.result[0].indicators.quote[0].low.at(-1);
            const dowOpen = dowRes.data.chart.result[0].indicators.quote[0].low[0];
            const nasdaqClose = nasdaqRes.data.chart.result[0].indicators.quote[0].low.at(-1);
            const nasdaqOpen = nasdaqRes.data.chart.result[0].indicators.quote[0].low[0];
            const spClose = spRes.data.chart.result[0].indicators.quote[0].low.at(-1);
            const spOpen = spRes.data.chart.result[0].indicators.quote[0].low[0];
            const dowPercent = (dowClose - dowOpen) / dowOpen * 100;
            const nasdaqPercent = (nasdaqClose - nasdaqOpen) / nasdaqOpen * 100;
            const spPercent = (spClose - spOpen) / spOpen * 100;
            allResult.push({ symbol: "DOW JONES", value: dowClose, gainPercent: (parseFloat)(dowPercent.toFixed(2)), gainValue: (parseFloat)((dowClose - dowOpen).toFixed(2)) }, { symbol: "NASDAQ", value: nasdaqClose, gainPercent: (parseFloat)(nasdaqPercent.toFixed(2)), gainValue: (parseFloat)((nasdaqClose - nasdaqOpen).toFixed(2)) }, { symbol: "S&P 500", value: spClose, gainPercent: (parseFloat)(spPercent.toFixed(2)), gainValue: (parseFloat)((spClose - spOpen).toFixed(2)) });
        }));
        return res.status(200).json({
            message: "ok",
            allResult: allResult
        });
    }
    catch (e) {
        console.log(e);
        return res.status(400).json({
            message: "some internal error"
        });
    }
}));
exports.default = popularRouter;
