
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import  Jwt, { JwtPayload }  from "jsonwebtoken";
import userExists from "./userExists";
config()

async function tokenCheck(req: Request,res : Response ,next :NextFunction) {
    

    
    const token = req.headers.token as string
    console.log("token ", token);
    
    
    
    
    if(!token){
        return res.status(403).json({
            message : "unauthorized signup "
        });

    }
    const validToken= Jwt.verify(token ,process.env.JWT_PASSWORD as string )  as JwtPayload
    
    if(!validToken){
        
        return res.status(403).json({
            message : "unauthorized signup "
        });
    }
    
    

    if (!req.body) req.body = {}; 


    req.body.email = validToken.email ;
    const validUser = await userExists(validToken.email )
    if(!validUser){
        res.clearCookie("auth_token")
        return res.status(403).json({
            message : "unauthorized signup "
        });
    }
    
    return next()
    
}
export default tokenCheck