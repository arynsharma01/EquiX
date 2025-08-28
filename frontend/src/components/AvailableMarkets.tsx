import type React from "react"
import { useEffect } from "react";

interface Props {
    symbol: string,
    stockName: string,

    buy: any,
    sell: any
    setBuy: (value: any) => void;
    setSell: (value: any) => void;
    setChange: (value: boolean) => void;
    setStockName : (value : string)=> void
    setStockSymbol : (value : string)=> void

}

export default function AvailableMarkets({ symbol, stockName, setSell, setBuy, buy, sell, setChange , setStockName , setStockSymbol }: Props) {
    useEffect(() => {
        console.log(buy, "inside available ");

    })
    return <div className="flex justify-between items-center hover:cursor-pointer hover:bg-gray-300 transition-all duration-200 rounded-2xl  p-4 w-full "
        onClick={() => {
            // setBuy()
            // setSell(sell) // changes need to be made here 
            setChange(true)
            setStockName(stockName)
            setStockSymbol(symbol)
        }}
    >
        <div className="flex flex-col items-center">
            <div className="text-2xl font-semibold text-gray-800">
                {symbol}
            </div>
            <div className="text-gray-600">
                {stockName}
            </div>
        </div>
        <div className=" text-xl items-center text-center">
            {`>`}
        </div>
    </div>
}