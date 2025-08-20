interface Props{
    orderType : "sell" | "buy",
    price : number,
    quantity : number
}
export default function Price({orderType , price,quantity } : Props) {
    return <div className={`${orderType === "sell"?"bg-red-200":"bg-green-200" } rounded-xl max-w-2xl`}>
        <div className="flex justify-between px-2 items-center     border-b  border-gray-200">
        <div className= {`${orderType === "sell"?"text-red-500":"text-green-500" } font-semibold`}>
        $ {price.toFixed(2)}
        </div>
        <div className="font-semibold">
            {quantity}
        </div>
        <div className="font-semibold">
            {(price * quantity).toFixed(2)}
        </div>
    </div>
    </div>
}