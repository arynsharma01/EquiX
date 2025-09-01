import { useNavigate } from "react-router-dom";
import type { result, ResultChildType } from "../assets/types/stockType";
type StockCardProps = result & ResultChildType
export default function StockCard({ symbol, longName, closingValues, gainValue, gainPercent }: StockCardProps) {
    const navigate = useNavigate()
    return <div className="flex flex-col border bg-white border-gray-200 hover:border-blue-300 rounded-2xl p-4 w-full hover:cursor-pointer transition-all duration-300"

        onClick={() => {
            navigate('/stock/info', {
                state: {
                    symbol: symbol
                }
            })
        }}

    >
        <div className="flex justify-between items-center lg:min-w-lg w-full">
            <div className="flex flex-col gap-2">
                <div className="text-xl font-bold">
                    {symbol}
                </div>
                <div className="text-lg font-medium">
                    {longName}
                </div>
            </div>
            <div>
                {gainValue > 0 ? (
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className=" text-green-500 size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18 9 11.25l4.306 4.306a11.95 11.95 0 0 1 5.814-5.518l2.74-1.22m0 0-5.94-2.281m5.94 2.28-2.28 5.941" />
                        </svg>
                    </div>
                ) : <>

                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="text-red-500 size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6 9 12.75l4.286-4.286a11.948 11.948 0 0 1 4.306 6.43l.776 2.898m0 0 3.182-5.511m-3.182 5.51-5.511-3.181" />
                    </svg>

                </>}

            </div>
        </div>
        <div className="flex justify-between ">
            <div className="text-2xl font-bold">
                $ {closingValues.at(-1)}
            </div>
            <div className={`flex flex-col ${gainValue < 0 ? "text-red-500" : "text-green-400"} `}>
                <div>
                    $ {gainValue}
                </div>
                <div>
                    ({gainPercent}%)
                </div>
            </div>
        </div>
    </div>
}