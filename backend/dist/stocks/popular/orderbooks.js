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
exports.default = getOrderBook;
exports.makeBid = makeBid;
exports.matchFound = matchFound;
const prismaClient_1 = __importDefault(require("../../utils/prismaClient"));
const __1 = require("../..");
let sellAAPL = [{ email: "", price: 82, quantity: 3 }, { email: "M1", price: 80, quantity: 5 }, { email: "", price: 78, quantity: 1 }];
let buyAAPL = [{ email: "", price: 78, quantity: 1 }, { email: "M1", price: 80, quantity: 5 }, { email: "", price: 82, quantity: 3 }];
let sellMSFT = [];
let buyMSFT = [];
let sellNVDA = [];
let buyNVDA = [];
let sellAMZN = [{ email: "admin@gmail.com", quantity: 4, price: 223 }];
let buyAMZN = [{ email: "admin@gmail.com", quantity: 2, price: 221 }];
let sellTSLA = [];
let buyTSLA = [];
let sellNFLX = [];
let buyNFLX = [];
const prisma = (0, prismaClient_1.default)();
const buyArrays = {
    "AAPL": buyAAPL,
    "MSFT": buyMSFT,
    "AMZN": buyAMZN,
    "NVDA": buyNVDA,
    "TSLA": buyTSLA,
    "NFLX": buyNFLX
};
const sellArrays = {
    "AAPL": sellAAPL,
    "MSFT": sellMSFT,
    "AMZN": sellAMZN,
    "NVDA": sellNVDA,
    "TSLA": sellTSLA,
    "NFLX": sellNFLX
};
function getOrderBook() {
    return __1.io.emit("stockUpdate", {
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
    });
}
function makeBid({ userEmail, price, quantity, orderType, symbol }) {
    let item = {
        email: userEmail,
        price: price,
        quantity: quantity
    };
    if (orderType == "sell") {
        const sellArray = sellArrays[symbol];
        console.log("inside the sell");
        if (!sellArray) {
            return "no symbol  matched ";
        }
        sellArrays[symbol].push(item);
        sellArrays[symbol].sort((a, b) => a.price < b.price ? 1 : -1);
    }
    else {
        console.log("inside the buy of makeBid ");
        const buyArray = buyArrays[symbol];
        if (!buyArray) {
            return "no symbol  matched ";
        }
        buyArrays[symbol].push(item);
        buyArrays[symbol].sort((a, b) => a.price < b.price ? -1 : 1);
        console.log(buyArrays[symbol]);
    }
}
//userEmail khareedne aayA hai stock owener k pass stocks hai 
function flipStocks(arr_1, index_1, stockOwnerEmail_1, _a) {
    return __awaiter(this, arguments, void 0, function* (arr, index, stockOwnerEmail, { userEmail, price, quantity, orderType, symbol }) {
        const owner = yield prisma.user.findFirst({
            where: { email: stockOwnerEmail },
            include: { stocks: true }
        });
        if (!owner) {
            return Promise.resolve("Owner not found ");
        }
        const ownerHasEnoughStocks = owner.stocks.find((stock) => { return stock.symbol === symbol; });
        if (!ownerHasEnoughStocks)
            return Promise.resolve("Owner not found ");
        if (ownerHasEnoughStocks.quantity < quantity) {
            return Promise.resolve("Stocks sold already  ");
        }
        const stockId = ownerHasEnoughStocks.id;
        let ownerOrderType = "buy";
        if (orderType === "buy") {
            ownerOrderType = "sell";
        }
        if (quantity === arr[index].quantity) {
            yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const userHasStockSymbol = yield tx.stocks.findFirst({
                    where: { userId: userEmail, symbol: symbol }
                });
                if (userHasStockSymbol) {
                    let averagePrice = parseFloat(((userHasStockSymbol.averagePrice * userHasStockSymbol.quantity + price * quantity) / userHasStockSymbol.quantity + quantity).toFixed(4));
                    yield tx.stocks.update({
                        where: { id: userHasStockSymbol.id },
                        data: {
                            averagePrice: averagePrice,
                            quantity: { increment: quantity },
                        }
                    });
                }
                else {
                    yield tx.stocks.create({
                        data: {
                            symbol: symbol,
                            averagePrice: price,
                            quantity: quantity,
                            userId: userEmail,
                            name: arr[index].name
                        }
                    });
                }
                yield tx.stocks.delete({
                    where: {
                        id: stockId
                    },
                }),
                    yield tx.user.update({
                        where: { email: userEmail },
                        data: { balance: { decrement: parseFloat((price * quantity).toFixed(4)) } }
                    }),
                    yield tx.user.update({
                        where: { email: stockOwnerEmail },
                        data: {
                            balance: { increment: parseFloat((price * quantity).toFixed(4)) }
                        }
                    });
                yield tx.trades.create({
                    data: {
                        userId: userEmail,
                        orderType: orderType,
                        date: new Date(Date.now()),
                        symbol: symbol,
                        price: price,
                        quantity: quantity
                    }
                });
                yield tx.trades.create({
                    data: {
                        userId: stockOwnerEmail,
                        orderType: ownerOrderType,
                        date: new Date(Date.now()),
                        symbol: symbol,
                        price: price,
                        quantity: quantity
                    }
                });
            }));
            arr = arr.splice(index, index + 1); // removing it from the array 
        }
        else {
            yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                const userHasStockSymbol = yield tx.stocks.findFirst({
                    where: {
                        userId: userEmail,
                        symbol: symbol
                    }
                });
                if (userHasStockSymbol) {
                    let averagePrice = parseFloat(((userHasStockSymbol.averagePrice * userHasStockSymbol.quantity + price * quantity) / userHasStockSymbol.quantity + quantity).toFixed(4));
                    yield tx.stocks.update({
                        where: {
                            id: userHasStockSymbol.id
                        },
                        data: {
                            quantity: { increment: quantity },
                            averagePrice: averagePrice
                        }
                    });
                }
                else {
                    yield tx.stocks.create({
                        data: {
                            symbol: symbol,
                            averagePrice: (parseFloat)(price.toFixed(4)),
                            userId: userEmail,
                            quantity: quantity,
                            name: arr[index].name || null
                        }
                    });
                }
                yield tx.stocks.update({
                    where: {
                        id: ownerHasEnoughStocks.id
                    },
                    data: {
                        quantity: { decrement: quantity },
                    }
                });
                yield tx.user.update({
                    where: { email: userEmail },
                    data: { balance: { decrement: parseFloat((price * quantity).toFixed(4)) } }
                }),
                    yield tx.user.update({
                        where: { email: stockOwnerEmail },
                        data: {
                            balance: { increment: parseFloat((price * quantity).toFixed(4)) }
                        }
                    });
                yield tx.trades.create({
                    data: {
                        userId: userEmail,
                        orderType: orderType,
                        date: new Date(Date.now()),
                        symbol: symbol,
                        price: price,
                        quantity: quantity
                    }
                });
                yield tx.trades.create({
                    data: {
                        userId: stockOwnerEmail,
                        orderType: ownerOrderType,
                        date: new Date(Date.now()),
                        symbol: symbol,
                        price: price,
                        quantity: quantity
                    }
                });
            }));
            arr[index].quantity = arr[index].quantity - quantity;
        }
    });
}
function matchFound(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userEmail, price, quantity, orderType, symbol }) {
        let remainingQuantity = quantity;
        if (orderType === "sell") {
            const buyArray = buyArrays[symbol];
            if (!buyArray) {
                return "no symbol  matched ";
            }
            let index = binarySearch(price, buyArray, true);
            if (index !== -1) {
                if (remainingQuantity <= buyArray[index].quantity) {
                    remainingQuantity = 0;
                    const response = yield flipStocks(buyArray, index, userEmail, { userEmail: buyArray[index].email, price, quantity, orderType, symbol });
                    return response;
                }
                else {
                    const response = yield flipStocks(buyArray, index, userEmail, { userEmail: buyArray[index].email, price, quantity: buyArray[index].quantity, orderType, symbol });
                    remainingQuantity = remainingQuantity - buyArray[index].quantity;
                    makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "sell", symbol: symbol });
                    return response;
                }
            }
            else {
                makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "sell", symbol: symbol });
            }
            getOrderBook();
            return Promise.resolve("ok");
        }
        else {
            const sellArray = sellArrays[symbol];
            if (!sellArray) {
                return "no symbol  matched ";
            }
            let index = binarySearch(price, sellArray, false);
            if (index !== -1) {
                if (remainingQuantity <= sellArray[index].quantity) {
                    remainingQuantity = 0;
                    const response = yield flipStocks(sellArray, index, sellArray[index].email, { userEmail, price, quantity, orderType, symbol });
                    return response;
                }
                else if (remainingQuantity > sellArray[index].quantity) {
                    const response = yield flipStocks(sellArray, index, sellArray[index].email, { userEmail, price, quantity, orderType, symbol });
                    remainingQuantity = remainingQuantity - sellArray[index].quantity;
                    makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "buy", symbol: symbol });
                    return response;
                }
            }
            else {
                makeBid({ userEmail, price, quantity: remainingQuantity, orderType: "buy", symbol: symbol });
            }
        }
        return Promise.resolve("okk");
    });
}
function binarySearch(price, arr, asc) {
    let low = 0;
    let high = arr.length;
    while (low < high) {
        let mid = Math.floor(low + (high - low) / 2);
        if (arr[mid].price === price) {
            return mid;
        }
        else if (arr[mid].price > price) {
            if (asc)
                high = mid;
            else
                low = mid + 1;
        }
        else {
            if (asc)
                low = mid + 1;
            else
                high = mid;
        }
    }
    return -1;
}
