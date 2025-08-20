"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = singlePrismaClient;
const client_1 = require("@prisma/client");
const extension_accelerate_1 = require("@prisma/extension-accelerate");
let prisma;
function singlePrismaClient() {
    if (prisma == null) {
        prisma = new client_1.PrismaClient().$extends((0, extension_accelerate_1.withAccelerate)());
    }
    return prisma;
}
