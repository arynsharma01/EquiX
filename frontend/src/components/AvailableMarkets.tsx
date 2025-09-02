

interface Props {
    symbol: string,
    stockName: string,

    
    
    
    setChange: (value: boolean) => void;
    setStockName : (value : string)=> void
    setStockSymbol : (value : string)=> void

}

export default function AvailableMarkets({ symbol, stockName,  setChange , setStockName , setStockSymbol }: Props) {
    
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