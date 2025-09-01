import axios from "axios"
import { useEffect, useState } from "react"
import type { stocks } from "./StockHoldings"
import StockHolding from "./StockHoldings"
import { useNavigate } from "react-router-dom"
import { Spinner } from "./ui/shadcn-io/spinner"

export default function Portfolio() {
    const [stocks , setStocks ] = useState<stocks[]>([])
    const [balance , setBalance ] = useState<number>(0)
    const [loader , setLoader]  = useState<boolean>(true)
    const navigate = useNavigate()
    useEffect(()=>{
        try{
            async function getStocks(){
                const res = await axios.get('http://localhost:3000/api/stocks/buy/get/stocks',{
                withCredentials : true

            })

            setStocks(res.data.stocks)
            setBalance(res.data.balance)
            setLoader(false)
            }
            getStocks()
        }
        catch(e){
            navigate('/signin')
        }
    })
    return (loader?<div className="flex justify-center items-center w-full min-h-screen ">
        <Spinner variant="ring" className="size-12"/>
    </div> : 
        <div className="flex flex-col max-w-7xl w-full mx-auto gap-4 p-2 pt-4 ">
        <div className="flex gap-2 w-full">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.2" stroke="currentColor" className="size-12 text-green-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
            <div className="text-4xl  font-bold">
                Portfolio
            </div>

        </div>
        <div className="flex lg:flex-row flex-col gap-2 items-center justify-between w-full">
            <div className="flex flex-col p-4 gap-2 bg-white rounded-xl w-full ">

                <div className="text-gray-600">
                    Total Value 
                </div>
                <div className="text-2xl font-bold">
                    $ 29833
                </div>

            </div>
            <div className="flex flex-col p-4 gap-2 bg-white rounded-xl w-full ">

                <div className="text-gray-600">
                    Balance  
                </div>
                <div className="text-2xl font-bold text-green-500">
                    $ {balance.toLocaleString()}
                </div>

            </div>
        </div>

        <div className="flex flex-col rounded-xl border border-gray-400 p-4 divide-y divide-gray-400 w-full bg-white">
            <div className="p-2 text-xl font-semiboldw-full">
                Holdings 
            </div>
            
            {stocks.map((stk , key) =>{
                return <StockHolding key={key} averagePrice={stk.averagePrice } quantity={stk.quantity} symbol={stk.symbol} />
            })}
           

        </div>
    </div>
    )
    
}