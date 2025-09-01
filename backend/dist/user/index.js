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
const express_1 = __importDefault(require("express"));
const zod_1 = __importDefault(require("zod"));
const userExists_1 = __importDefault(require("../utils/userExists"));
const prismaClient_1 = __importDefault(require("../utils/prismaClient"));
const cookies_1 = __importDefault(require("cookies"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = require("dotenv");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
(0, dotenv_1.config)();
const userRouter = (0, express_1.default)();
userRouter.use(body_parser_1.default.json());
userRouter.use((0, cookie_parser_1.default)());
const signupValidation = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.email(),
    mobile: zod_1.default.string().regex(/^\+\d{10,15}$/, "Invalid mobile number format. Must start with '+' and have 10–15 digits."),
    password: zod_1.default.string().min(8),
    age: zod_1.default.number().min(18).optional()
});
const signinValidation = zod_1.default.object({
    email: zod_1.default.email(),
    password: zod_1.default.string().min(8),
});
const prisma = (0, prismaClient_1.default)();
userRouter.post('/signup', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = new cookies_1.default(req, res);
        const { name, email, mobile, password, age } = req.body;
        const validUserSchema = signupValidation.safeParse({
            name,
            email,
            mobile,
            password,
            age
        });
        if (!validUserSchema.success) {
            return res.status(401).json({
                message: validUserSchema.error.issues[0].message,
            });
        }
        if (yield (0, userExists_1.default)(email, mobile)) {
            return res.status(401).json({
                message: "user already exists  "
            });
        }
        yield prisma.user.create({
            data: {
                name,
                email,
                mobile,
                password
            }
        });
        const token = jsonwebtoken_1.default.sign({ email: email }, process.env.JWT_PASSWORD, { expiresIn: "2d" });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: false, // localhost HTTP
            sameSite: "lax"
        });
        return res.status(201).json({
            message: "user created Successfully "
        });
    }
    catch (e) {
        console.log(e);
        return res.status(500).json({
            message: "some internal error",
            error: e
        });
    }
}));
exports.default = userRouter;
userRouter.post('/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "incomplete details "
            });
        }
        const validUserSchema = signinValidation.safeParse({
            email: email,
            password: password
        });
        if (!validUserSchema.success) {
            return res.status(401).json({
                message: validUserSchema.error.issues[0].message,
            });
        }
        const existingUser = yield prisma.user.findFirst({
            where: {
                AND: [
                    { email: email },
                    { password: password }
                ]
            }
        });
        if (!existingUser) {
            return res.status(401).json({
                message: "email not found/wrong password ",
            });
        }
        const token = jsonwebtoken_1.default.sign({ email: email }, process.env.JWT_PASSWORD, { expiresIn: "2d" });
        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: false, // localhost HTTP
            sameSite: "lax"
        });
        return res.status(200).json({
            message: "signed in Successfully "
        });
    }
    catch (e) {
        return res.status(500).json({
            message: "Some internal error  "
        });
    }
}));
