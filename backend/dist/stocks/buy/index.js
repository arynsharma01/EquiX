"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const orderbooks_1 = __importStar(require("../popular/orderbooks"));
exports.buyStocksRouter = (0, express_1.default)();
const prisma = (0, prismaClient_1.default)();
exports.buyStocksRouter.post('/new/stock', tokenCheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, quantity, symbol, email, orderType } = req.body;
    console.log("inside the request ", req.body);
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
    if (orderType === "buy" && price * quantity > user.balance) {
        console.log(price * quantity);
        console.log(user.balance);
        return res.status(200).json({
            message: "insufficient balance "
        });
    }
    else if (orderType === "sell") {
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
    console.log("reached match found ");
    (0, orderbooks_1.matchFound)({ userEmail: email, price: price, quantity: quantity, symbol: symbol, orderType });
    (0, orderbooks_1.default)();
    return res.status(200).json({
        message: "Transaction successfull"
    });
}));
exports.buyStocksRouter.post('/get/market/price', tokenCheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity, symbol, orderType, email } = req.body;
    if (!quantity || !symbol || !orderType) {
        return res.json({
            message: "quantity not found"
        });
    }
    const result = (0, orderbooks_1.getMarketPrice)(symbol, quantity, orderType, email);
    return res.json({
        message: result.message,
        quantity: result.remainingQuantity,
        price: result.price,
        averagePrice: result.averagePrice
    });
}));
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
exports.buyStocksRouter.post('/new/stock/market', tokenCheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { quantity, email, symbol, orderType } = req.body;
    if (!email || !quantity || !symbol || !orderType) {
        return res.json({
            message: "missing details "
        });
    }
    const prisma = (0, prismaClient_1.default)();
    const user = yield prisma.user.findFirst({
        where: {
            email: email
        },
        include: { stocks: true }
    });
    const currentStock = user === null || user === void 0 ? void 0 : user.stocks.find((stk) => { return stk.symbol === symbol; });
    if (!currentStock || currentStock.quantity < quantity && orderType === "sell") {
        return res.json({
            message: "insufficient stock quantity "
        });
    }
    const result = yield (0, orderbooks_1.marketOrder)(email, quantity, orderType, symbol);
    console.log(result);
    return res.json({
        message: result.message,
        filled: result.filled,
    });
}));
exports.buyStocksRouter.post('/cancel/trade', tokenCheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, tradeID } = req.body;
    if (!tradeID) {
        return res.json({
            message: "trade ID not found "
        });
    }
    const user = yield prisma.user.findFirst({
        where: {
            email: email
        }, include: { trades: true, stocks: true }
    });
    const currentTrade = user === null || user === void 0 ? void 0 : user.trades.find((trades) => {
        return trades.id === tradeID;
    });
    if (!currentTrade || currentTrade.cancelled) {
        return res.json({
            message: "trade already cancelled  "
        });
    }
    if (currentTrade.completed) {
        return res.json({
            message: "trade already completed  "
        });
    }
    let remainingQuantity = currentTrade.quantity - currentTrade.filled;
    if (currentTrade.orderType === "sell") {
        const currentStock = user === null || user === void 0 ? void 0 : user.stocks.find((stk) => { return stk.symbol === currentTrade.symbol; });
        if (!currentStock) {
            yield prisma.stocks.create({
                data: {
                    userId: email,
                    quantity: remainingQuantity,
                    averagePrice: currentTrade.price,
                    symbol: currentTrade.symbol
                }
            });
        }
        else {
            yield prisma.$transaction([
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
            ]);
        }
        (0, orderbooks_1.cancelTrade)("sell", tradeID, currentTrade.symbol);
    }
    else {
        const total = parseFloat((remainingQuantity * currentTrade.price).toFixed(2));
        yield prisma.$transaction([
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
        ]);
        (0, orderbooks_1.cancelTrade)("buy", tradeID, currentTrade.symbol);
    }
    return res.json({
        message: "order cancelled successfully "
    });
}));
exports.buyStocksRouter.get('/get/stocks', tokenCheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield prisma.user.findFirst({
        where: { email: email },
        include: { stocks: true, trades: true }
    });
    return res.json({
        message: "ok",
        stocks: user === null || user === void 0 ? void 0 : user.stocks,
        balance: user === null || user === void 0 ? void 0 : user.balance,
        trades: user === null || user === void 0 ? void 0 : user.trades
    });
}));
