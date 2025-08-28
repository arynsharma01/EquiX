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

const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use('/api/stocks', stocksRouter)
app.use('/api/user' , userRouter)

const server = http.createServer(app)

export const io  = new Server(server,{
  cors: {
    origin: "*", 
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


app.get('/api/get',(req : Request , res : Response)=>{
    return res.status(200).json({
        message : "works "

    })
})
app.get('/remove/token',async (req :Request , res : Response)=>{
    const cookie = new  Cookies(req, res )
    cookie.set("auth-token")
    return res.redirect('user/signin',)
})
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
app.get('/test23', (req : Request , res : Response)=>{
  
  return res.status(200).json({
    message :"ok"
  })
})
server.listen(3000,()=>{
    console.log("listening at 3000");
    
})