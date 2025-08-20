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
exports.default = userExists;
const prismaClient_1 = __importDefault(require("./prismaClient"));
function userExists(email, mobile) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const prisma = (0, prismaClient_1.default)();
            console.log(email);
            const existingUser = yield prisma.user.findFirst({
                where: {
                    OR: [
                        { email: email },
                        { mobile: mobile }
                    ]
                }
            });
            if (existingUser) {
                return true;
            }
            return false;
        }
        catch (e) {
            console.log(e);
            return true;
        }
    });
}
