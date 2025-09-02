import bodyParser from "body-parser";
import express, { Request, Response } from "express";
import z from "zod";
import userExists from "../utils/userExists";
import singlePrismaClient from "../utils/prismaClient";
import cors from "cors"
import Jwt from "jsonwebtoken";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
config()
const userRouter = express()

userRouter.use(bodyParser.json())
userRouter.use(cookieParser())
userRouter.use(cors({
    origin: ["https://equi-x-ijts.vercel.app"],
    credentials: true,
}));
 


const signupValidation = z.object({
    name: z.string(),
    email: z.email(),
    mobile: z.string().regex(/^\+\d{10,15}$/, "Invalid mobile number format. Must start with '+' and have 10–15 digits."),
    password: z.string().min(8),
    age: z.number().min(18).optional()


})

const signinValidation = z.object({
    email: z.email(),
    password: z.string().min(8),
})


const prisma = singlePrismaClient()

userRouter.post('/signup', async (req: Request, res: Response) => {
    try {



        const { name, email, mobile, password, age } = req.body
        const validUserSchema = signupValidation.safeParse({
            name,
            email,
            mobile,
            password,
            age

        })
        if (!validUserSchema.success) {
            return res.status(401).json({

                message: validUserSchema.error.issues[0].message,

            })
        }


        if (await userExists(email, mobile)) {
            return res.status(401).json({
                message: "user already exists  "
            })

        }

        await prisma.user.create({
            data: {
                name,
                email,
                mobile,
                password

            }
        })

        const token = Jwt.sign({ email: email }, process.env.JWT_PASSWORD as string, { expiresIn: "2d" })

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 2,
            path: "/"
        });


        return res.status(201).json({
            message: "user created Successfully "
        })





    }
    catch (e) {
        console.log(e);

        return res.status(500).json({
            message: "some internal error",
            error: e
        })
    }
})
export default userRouter


userRouter.post('/signin', async (req, res) => {

    try {

        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(401).json({
                message: "incomplete details "
            })
        }
        const validUserSchema = signinValidation.safeParse({
            email: email,
            password: password
        })
        if (!validUserSchema.success) {
            return res.status(401).json({
                message: validUserSchema.error.issues[0].message,
            })
        }
        const existingUser = await prisma.user.findFirst({
            where: {
                AND: [
                    { email: email },
                    { password: password }
                ]
            }
        })
        if (!existingUser) {
            return res.status(401).json({
                message: "email not found/wrong password ",
            })
        }

        const token = Jwt.sign({ email: email }, process.env.JWT_PASSWORD as string, { expiresIn: "2d" })

        res.cookie("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            maxAge: 1000 * 60 * 60 * 24 * 2,
            path: "/"
        });


        return res.status(200).json({
            message: "signed in Successfully "
        })
    }
    catch (e) {
        return res.status(500).json({
            message: "Some internal error  "
        })
    }



})