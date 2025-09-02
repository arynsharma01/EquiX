import { useLocation, useNavigate } from "react-router-dom"
import LineChart from "./LineChart"
import { useEffect, useState } from "react"
import axios from "axios"

import type { result } from "@/assets/types/stockType"
import { Spinner } from "./ui/shadcn-io/spinner"

export default function StockSearchedCard() {
    
    const location = useLocation()
    const { symbol } = location.state
    const [currentStock , setCurrentStock] = useState<result[]>([])
    const [laoder , setLoader] = useState<boolean>(true)

    useEffect(()=>{
        try{
            async function getStock() {
            const res = await axios.get(`https://equix-k46e.onrender.com/api/stocks/popular/search/result?symbol=${symbol}`)
            console.log(res.data);
            
            setCurrentStock(res.data.allData)
            setLoader(false)
        }
        setTimeout(()=>{
            getStock()
        },1000)
        }
        catch(e){
            console.log("some error ");
            
        }
    },[symbol])
    
    
    const closingValue = currentStock[0]?.child[0].closingValues.at(-1) as number
    const openingValue = currentStock[0]?.child[0].closingValues.at(0) as number
    const gainValue = currentStock[0]?.child[0].gainValue as number
    const navigate = useNavigate()





    return (laoder?(<div className="flex  items-center justify-center w-full min-h-screen">
        <Spinner variant="ring"/>
    </div>): (<div className="flex flex-col lg:items-center w-full min-h-screen p-4 gap-2 mt-2 ">
        
        <div className="flex flex-col gap-2 p-4 rounded-2xl border sm:w-full lg:w-[70vw] border-gray-200 bg-white  ">

            <div className="flex justify-between w-full">
            <div className="p-2 text-xl gap-2 rounded-2xl shadow-md shadow-blue-200 hover:shadow-md hover:shadow-blue-400 hover:text-blue-700 hover:cursor-pointer transition-all duration-300 text-blue-800"
            onClick={()=>{
                navigate('/dashboard' ,{
                    replace : true
                })
            }}
            >
                ← Back to Dashboard
            </div>
            
        </div>



            <div className="flex gap-4 flex-col justify-between  ">
                <div className="flex justify-between">


                    <div className="flex flex-col gap-4 ">
                        <div className="text-3xl font-bold">
                            {currentStock[0].symbol}
                        </div>
                        <div className="text-xl text-gray-400">
                            {currentStock[0].child[0].longName}
                        </div>
                    </div>

                    <div className="items-center justify-center ">
                        {gainValue > 0 ?
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className=" text-green-500 size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                            </svg> :
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-red-500 size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                            </svg>
                        }
                    </div>
                </div>


                <div className="flex lg:flex-row flex-col justify-between gap-2 ">

                    <div className="flex flex-col sm:w-full  lg:w-xl p-4 rounded-lg items-start bg-gray-100 ">

                        <div className="text-lg text-gray-700 ">
                            Closing Value
                        </div>
                        <div className="text-3xl font-bold">
                            $ {currentStock[0].child[0].closingValues.at(-1)}
                        </div>
                        <div className={`text-lg ${gainValue > 0 ? "text-green-500" : "text-red-500"} `}>
                            {gainValue > 0 ? ('$' + currentStock[0].child[0].gainValue) : ('$' + currentStock[0].child[0].gainValue)}
                            ({currentStock[0].child[0].gainPercent}%)
                        </div>

                    </div>
                    <div className="flex flex-col sm:w-full  lg:w-xl p-4 rounded-lg items-start bg-gray-100 ">

                        <div className="text-lg text-gray-700 ">
                            Todays Range 
                        </div>
                        <div className="text-2xl font-semibold">
                            {`$${openingValue} - $${closingValue}`}
                        </div>


                    </div>
                    <div className="flex flex-col sm:w-full  lg:w-xl p-4 rounded-lg items-start bg-gray-100 ">

                        <div className="text-lg text-gray-700 ">
                            Volume
                        </div>
                        <div className="text-2xl font-semibold">
                            {(currentStock[0].child[0].volume / 1000000).toFixed(2)} M
                        </div>


                    </div>



                </div>


                <div className="flex flex-col gap-2 ">
                    <div className="text-2xl font-bold">
                        Price Chart(1 Day  )
                    </div>

                    <div className="bg-white w-full">
                        <LineChart labels={currentStock[0].child[0]?.dateTime as any} values={currentStock[0].child[0].closingValues} postive={gainValue > 0} />
                    </div>
                </div>

            </div>
        </div>

    </div>))
    
}