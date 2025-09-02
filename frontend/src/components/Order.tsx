import axios from "axios"
import type { Transactions } from "../assets/types/stockType"

import { toast } from "sonner"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Spinner } from "./ui/shadcn-io/spinner"

export default function Order({ id, symbol, date, orderType, price, quantity, completed, cancelled, filled }: Transactions) {
    const converted = new Date(date).toLocaleDateString()
    const navigate = useNavigate()
    const [cancelButtonLoader,setCancelButtonLoader] = useState<boolean>(false)
    async function cancelTransaction(id : string) {
        try{

        
        const res = await axios.post('https://equix-k46e.onrender.com/api/stocks/buy/cancel/trade',{
            tradeID : id 
        },{
            withCredentials : true
        })
        setCancelButtonLoader(false)

        toast(res.data.message)
    }
    catch(e){
        navigate('/signin')
    }
        
        
    }
    return <div className="flex flex-col p-4 w-full hover:bg-gray-200 transition-all duration-300 border-b border-gray-200 rounded-md ">
        <div className="flex justify-between items-center w-full">
            <div className=" flex  gap-4 items-center justify-between ">
                {completed ?
                    <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-green-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>


                        <div className="p-1 text-sm font-light  rounded-xl bg-green-200">
                            EXECUTED
                        </div>

                    </div>
                    :
                    cancelled ? <div className="flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-red-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>

                        <div className="p-1 text-sm font-light  rounded-xl bg-red-200">
                            CANCELLED
                        </div>
                    </div>
                    :
                    <div className="flex items-center gap-2 ">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-8 text-amber-400">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>


                        <div className="p-1 text-sm font-light  rounded-xl bg-amber-200 ">
                            PENDING
                        </div>
                    </div>
                }

                <div className="text-sm font-light text-gray-600">
                    {converted}
                </div>
            </div>
            {!cancelButtonLoader?(!cancelled && !completed ? <button
                className="py-2 px-4 text-red-400 bg-red-100 hover:bg-red-200 cursor-pointer transition-all rounded-xl duration-300 border border-red-300 "
                onClick={()=>{
                    setCancelButtonLoader(true)
                    cancelTransaction(id)
                }}
            
            > ❌ Cancel</button>:"") : <Spinner/>}
        </div>

        <div className="flex lg:flex-row flex-col max-w-7xl w-full mx-auto items-start gap-3 lg:gap-0 lg:items-center justify-between py-2 ">
            <div className="flex flex-col gap-2 ">

                <div className="text-gray-400 font-thin">
                    Asset
                </div>
                <div className="font-semibold ">
                    {symbol}
                </div>

            </div>
            <div className="flex flex-col gap-2 ">

                <div className="text-gray-400 font-thin">
                    Type
                </div>
                <div className="font-semibold ">
                    {orderType}
                </div>

            </div>
            <div className="flex flex-col gap-2 ">

                <div className="text-gray-400 font-thin">
                    Quantity
                </div>
                <div className="font-semibold ">
                    {quantity}
                </div>

            </div>
            <div className="flex flex-col gap-2 ">

                <div className="text-gray-400 font-thin">
                    Filled
                </div>
                <div className="font-semibold ">
                    {filled}
                </div>

            </div>
            <div className="flex flex-col gap-2 ">

                <div className="text-gray-400 font-thin">
                    Price
                </div>
                <div className="font-semibold ">
                    $ {price}
                </div>

            </div>
            <div className="flex flex-col gap-2 ">

                <div className="text-gray-400 font-thin">
                    Total
                </div>
                <div className="font-semibold ">
                    $ {(filled * price).toFixed(2)}
                </div>

            </div>
        </div>
    </div>
}