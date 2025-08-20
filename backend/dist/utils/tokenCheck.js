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
const cookies_1 = __importDefault(require("cookies"));
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userExists_1 = __importDefault(require("./userExists"));
(0, dotenv_1.config)();
function tokenCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const cookie = new cookies_1.default(req, res);
        const token = cookie.get("auth-token");
        if (!token) {
            return res.redirect('/user/signin');
        }
        const validToken = jsonwebtoken_1.default.verify(token, process.env.JWT_PASSWORD);
        if (!validToken) {
            cookie.set("auth-token");
            return res.redirect('/user/signin');
        }
        console.log(validToken);
        req.body.email = validToken.email;
        const validUser = yield (0, userExists_1.default)(validToken.email);
        if (!validUser) {
            cookie.set("auth-token");
            return res.redirect('/user/signin');
        }
        return next();
    });
}
exports.default = tokenCheck;
