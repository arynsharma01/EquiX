import axios from "axios"
import { useEffect, useState } from "react"
import type { Transactions } from "../assets/types/stockType"
import { useNavigate } from "react-router-dom"
import Order from "./Order"
import { Spinner } from "./ui/shadcn-io/spinner"

export default function Transactions() {
    const [viewTransaction, setViewTransaction] = useState<"All" | "Executed" | "Pending" | "Cancelled">("All")

    const [loader, setLoader] = useState<boolean>(true)
    const [transactions, setTransactions] = useState<Transactions[]>([])
    const [pendingTransactions, setPendingTransactions] = useState<Transactions[]>([])
    const [cancelledTransactions, setCancelledTransactions] = useState<Transactions[]>([])
    const [executedTransactions, setExecutedTransactions] = useState<Transactions[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        async function getTransactions() {
            try {
                const res = await axios.get('https://equix-k46e.onrender.com/api/stocks/buy/get/stocks', {headers : {token : localStorage.getItem("token")}})
                ;
                setTransactions(res.data.trades)
                setExecutedTransactions(res.data.trades.filter((trade :Transactions)=>{return trade.completed === true }))
                setPendingTransactions(res.data.trades.filter((trade :Transactions)=>{return !trade.completed && !trade.cancelled }))
                setCancelledTransactions(res.data.trades.filter((trade :Transactions)=>{return trade.cancelled }))
                setLoader(false)


            }
            catch(e){
                navigate('/signin')
            }
            
            
                 
        }
        getTransactions()
    }, [])

    return (loader ? <div className="flex justify-center items-center w-full min-h-screen">
        <Spinner className="size-12 " variant="ring"/>
    </div> :

        <div className="flex flex-col items-center gap-4 justify-center  w-full min-h-screen px-2 ">


            <div className="max-w-7xl gap-4 w-full flex flex-col mx-auto py-4">

                <div className=" flex flex-col gap-2 items-start w-full my-4   ">

                    <div className="text-3xl  font-bold">
                        Transactions
                    </div>
                    <div className="text-gray-600">
                        View your trading history and manage pending orders
                    </div>


                </div>
                <div className="flex rounded-xl border border-gray-300 p-2  w-full gap-4 bg-white  ">
                    <div className={`p-2 px-4 ${viewTransaction === "All" ? "bg-[#2563EB] text-white " : "text-gray-700 hover:bg-gray-200 "}   font-thin lg:text-lg text-md  transition-all duration-300 hover:cursor-pointer text-center rounded-xl `}
                        onClick={() => {
                            setViewTransaction("All")
                        }}
                    >
                        All ({transactions.length})
                    </div>
                    <div className={`p-2 ${viewTransaction === "Executed" ? "bg-[#2563EB] text-white " : "text-gray-700 hover:bg-gray-200 "}   font-thin lg:text-lg text-md transition-all duration-300 hover:cursor-pointer text-center rounded-xl `}
                        onClick={() => {
                            setViewTransaction("Executed")
                        }}
                    >
                        Executed ({executedTransactions.length})
                    </div>
                    <div className={`p-2 ${viewTransaction === "Pending" ? "bg-[#2563EB] text-white " : "text-gray-700 hover:bg-gray-200 "}   font-thin lg:text-lg text-md transition-all duration-300 hover:cursor-pointer text-center rounded-xl `}
                        onClick={() => {
                            setViewTransaction("Pending")
                        }}
                    >
                        Pending ({pendingTransactions.length})
                    </div>
                    <div className={`p-2 ${viewTransaction === "Cancelled" ? "bg-[#2563EB] text-white " : "text-gray-700 hover:bg-gray-200 "}  font-thin lg:text-lg text-md  transition-all duration-300 hover:cursor-pointer text-center rounded-xl  `}
                        onClick={() => {
                            setViewTransaction("Cancelled")
                        }}
                    >
                        Cancelled ({cancelledTransactions.length})
                    </div>
                </div>

                <div className="flex flex-col divide-y divide-gray-300 bg-white  w-full rounded-2xl border-gray-300 border   ">

                    <div className="w-full p-3  text-xl font-semibold">
                        Order History
                    </div>

                    {viewTransaction === "All"?<div>

                        {transactions.map((transaction ,key)=>{
                        return <Order key={key} id={transaction.id} orderType={transaction.orderType} cancelled={transaction.cancelled} completed={transaction.completed} quantity={transaction.quantity}
                        price={transaction.price} symbol={transaction.symbol} date={transaction.date} filled={transaction.filled}
                        />
                    })}
                    </div> : ""}
                    {viewTransaction === "Executed"?<div>

                        {executedTransactions.map((transaction, key)=>{
                        return <Order key = {key} id={transaction.id} orderType={transaction.orderType} cancelled={transaction.cancelled} completed={transaction.completed} quantity={transaction.quantity}
                        price={transaction.price} symbol={transaction.symbol} date={transaction.date} filled={transaction.filled}
                        />
                    })}
                    </div> : ""}
                    {viewTransaction === "Pending"?<div>

                        {pendingTransactions.map((transaction, key)=>{
                        return <Order key = {key}  id={transaction.id} orderType={transaction.orderType} cancelled={transaction.cancelled} completed={transaction.completed} quantity={transaction.quantity}
                        price={transaction.price} symbol={transaction.symbol} date={transaction.date} filled={transaction.filled}
                        />
                    })}
                    </div> : ""}
                    {viewTransaction === "Cancelled"?<div>

                        {cancelledTransactions.map((transaction, key)=>{
                        return <Order  key = {key} id={transaction.id} orderType={transaction.orderType} cancelled={transaction.cancelled} completed={transaction.completed} quantity={transaction.quantity}
                        price={transaction.price} symbol={transaction.symbol} date={transaction.date} filled={transaction.filled}
                        />
                    })}
                    </div> : ""}

                </div>


            </div>



        </div>
    )

}