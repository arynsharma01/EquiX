import Cookies from "cookies";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
import  Jwt, { JwtPayload }  from "jsonwebtoken";
import userExists from "./userExists";
config()
async function tokenCheck(req: Request,res : Response ,next :NextFunction) {
    const cookie = new Cookies(req,res);
    const token = cookie.get("auth-token")
    if(!token){
        return res.redirect('/user/signin');

    }
    const validToken= Jwt.verify(token ,process.env.JWT_PASSWORD as string )  as JwtPayload
    
    if(!validToken){
        cookie.set("auth-token")
        return res.redirect('/user/signin');
    }
    
    console.log(validToken);
    req.body.email = validToken.email ;
    const validUser = await userExists(validToken.email )
    if(!validUser){
        cookie.set("auth-token")
        return res.redirect('/user/signin');
    }
    
    return next()
    
}
export default tokenCheck