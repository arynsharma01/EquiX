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
exports.io = void 0;
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const stocks_1 = __importDefault(require("./stocks"));
const user_1 = __importDefault(require("./user"));
const cookies_1 = __importDefault(require("cookies"));
const cors_1 = __importDefault(require("cors"));
const orderbooks_1 = __importStar(require("./stocks/popular/orderbooks"));
const tokenCheck_1 = __importDefault(require("./utils/tokenCheck"));
const socket_io_1 = require("socket.io");
const http_1 = __importDefault(require("http"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(body_parser_1.default.json());
app.use('/api/stocks', stocks_1.default);
app.use('/api/user', user_1.default);
const server = http_1.default.createServer(app);
exports.io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});
exports.io.on("connection", (socket) => {
    console.log("🔌 Client connected:", socket.id);
    socket.on("disconnect", () => {
        console.log("❌ Client disconnected:", socket.id);
    });
});
app.get('/api/get', (req, res) => {
    return res.status(200).json({
        message: "works "
    });
});
app.get('/remove/token', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const cookie = new cookies_1.default(req, res);
    cookie.set("auth-token");
    return res.redirect('user/signin');
}));
app.post('/testing', tokenCheck_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { price, quantity, symbol, email } = req.body;
    if (!email) {
        return res.status(401).json({
            message: "no email found pls login "
        });
    }
    (0, orderbooks_1.matchFound)({ userEmail: email, price: price, quantity: quantity, symbol: symbol, orderType: "buy" });
    return res.json({
        message: "ok"
    });
}));
app.get('/test23', (req, res) => {
    (0, orderbooks_1.default)();
    return res.status(200).json({
        message: "ok"
    });
});
server.listen(3000, () => {
    console.log("listening at 3000");
});
