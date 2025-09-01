export type stocks = {
    symbol: string,
    quantity: number,
    averagePrice: number,

}
export default function StockHolding({ symbol, quantity, averagePrice }: stocks) {
    return <div className="flex flex-col p-2 gap-2  ">
        <div className=" text-xl font-semibold">
            {symbol}
        </div>

        <div className="flex justify-between items-center w-full ">
            <div className="flex flex-col gap-1">
                <div className="text-gray-500 ">
                    Quantity
                </div>
                <div className="text-lg font-semibold">
                    {quantity}
                </div>

            </div>
            <div className="flex flex-col gap-1">
                <div className="text-gray-500 ">
                    Average Price
                </div>
                <div className="text-lg font-semibold">
                    $ {averagePrice}
                </div>

            </div>
            <div className="flex flex-col gap-1">
                <div className="text-gray-500 ">
                    Total price
                </div>
                <div className="text-lg font-semibold">
                    $ {(averagePrice * quantity).toLocaleString()}
                </div>

            </div>

        </div>

    </div>
}