"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const popular_1 = __importDefault(require("./popular"));
const search_1 = __importDefault(require("./search"));
const buy_1 = require("./buy");
const stocksRouter = (0, express_1.default)();
stocksRouter.use('/popular', popular_1.default);
stocksRouter.use('/search', search_1.default);
stocksRouter.use('/buy', buy_1.buyStocksRouter);
exports.default = stocksRouter;
