import bodyParser from "body-parser"
import express, { Request, Response } from "express"
import stocksRouter from "./stocks"
import userRouter from "./user"
import Cookies from "cookies"
import cors from "cors"
import getOrderBook, { matchFound } from "./stocks/popular/orderbooks"
import tokenCheck from "./utils/tokenCheck"
import { Server, Socket } from "socket.io"
import http from "http"
import cookieParser from "cookie-parser"

const app = express()
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true, 
}))
app.use(cookieParser());
app.use(bodyParser.json())
app.use('/api/stocks', stocksRouter)
app.use('/api/user' , userRouter)

const server = http.createServer(app)

export const io  = new Server(server,{
  cors: {
    origin: process.env.FRONTEND_URL, 
    methods: ["GET", "POST"]
  }
})


io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);
  getOrderBook()

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});




app.post('/testing' ,tokenCheck, async (req:Request , res : Response)=>{
    const {price  , quantity , symbol , email } = req.body
    
    
    if(!email){
        return res.status(401).json({
            message : "no email found pls login "
        })

    }
    matchFound({userEmail:email , price : price as number, quantity : quantity as number , symbol : symbol as string , orderType:"buy"})
    return res.json({
        message :"ok"
    })
})
app.get('/api/already/signed',tokenCheck, (req : Request , res : Response)=>{
  
  const {email } = req.body;
  return res.status(200).json({
    message :"ok",
    email : email
  })
})
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

app.post('/api/auth/logout', (req : Request , res : Response)=>{
  res.clearCookie("auth_token")
  return res.json({
    message : "signed out "
  })
})