import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";
 
let prisma : PrismaClient |  any ;
export default function singlePrismaClient():PrismaClient{
    if(prisma == null){
        prisma = new  PrismaClient().$extends(withAccelerate())
    }
    
    return prisma 
}