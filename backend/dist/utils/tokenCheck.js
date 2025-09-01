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
const dotenv_1 = require("dotenv");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userExists_1 = __importDefault(require("./userExists"));
(0, dotenv_1.config)();
function tokenCheck(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = req.cookies.auth_token;
        console.log(token);
        if (!token) {
            return res.status(403).json({
                message: "unauthorized signup "
            });
        }
        const validToken = jsonwebtoken_1.default.verify(token, process.env.JWT_PASSWORD);
        if (!validToken) {
            res.clearCookie("auth_token");
            return res.status(403).json({
                message: "unauthorized signup "
            });
        }
        console.log(validToken);
        if (!req.body)
            req.body = {};
        req.body.email = validToken.email;
        const validUser = yield (0, userExists_1.default)(validToken.email);
        if (!validUser) {
            res.clearCookie("auth_token");
            return res.status(403).json({
                message: "unauthorized signup "
            });
        }
        return next();
    });
}
exports.default = tokenCheck;
