import type StockType from "../assets/types/stockType"

export default function Overview({ symbol, value, up, gainValue , gainPercent }: StockType) {
    return (
        <div className="flex flex-col  bg-gray-200 p-4 rounded-xl  items-center justify-center md:w-lg ">

            <div className="text-xl ">
                {symbol}
            </div>
            <div className="flex flex-col gap-2 p-2 items-center justify-between">
                <div className="text-2xl font-bold">
                    $ {(parseFloat)(value).toFixed(2)} 
                </div>
                <div className={` ${up ? "text-green-500" : "text-red-500"} flex gap-1 `}>
                    {up ? <> <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                    </svg></> :
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                            </svg>

                        </>
                    }


                    {gainValue}  ({gainPercent}%)

                </div>
            </div>


        </div>
    )
}