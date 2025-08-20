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
exports.buyStocksRouter = void 0;
const express_1 = __importDefault(require("express"));
const tokenCheck_1 = __importDefault(require("../../utils/tokenCheck"));
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const orderbooks_1 = require("../popular/orderbooks");
exports.buyStocksRouter = (0, express_1.default)();
exports.buyStocksRouter.post('/new/stock', tokenCheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, quantity, symbol, email, orderType } = req.body;
    if (!price || !quantity || !email || !symbol || !orderType) {
        return res.status(401).json({
            message: "invalid data  "
        });
    }
    if (!email) {
        return res.status(401).json({
            message: "no email found pls login "
        });
    }
    const prisma = (0, prismaClient_1.default)();
    const user = yield prisma.user.findFirst({
        where: {
            email: email
        },
        include: {
            stocks: true
        }
    });
    if (!user) {
        return res.status(401).redirect('/signup');
    }
    if (orderType === "buy" && price * quantity < user.balance) {
        return res.status(200).json({
            message: "insufficient balance "
        });
    }
    else {
        const currStock = user.stocks.find((stock) => { return stock.symbol === symbol; });
        if (!currStock) {
            return res.status(200).json({
                message: "Stock not found  "
            });
        }
        else if (currStock.quantity < quantity) {
            return res.status(200).json({
                message: "insufficient stock quantity "
            });
        }
    }
    (0, orderbooks_1.matchFound)({ userEmail: email, price: price, quantity: quantity, symbol: symbol, orderType });
    return res.status(200).json({
        message: "Transaction successfull"
    });
}));
