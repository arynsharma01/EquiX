import { useAtom } from "jotai";
import { useEffect, useState } from "react"
import io from "socket.io-client"
import { buyAAPL, buyAMZN, buyMSFT, buyNFLX, buyNVDA, buyTSLA, sellAAPL, sellAMZN, sellMSFT, sellNFLX, sellNVDA, sellTSLA } from "../store/popularStocks";
import { toast } from "sonner"
import AvailableMarkets from "./AvailableMarkets";
import Price from "./Price";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Spinner } from "./ui/shadcn-io/spinner";



export default function StockBuy() {
    const [buyAAPLstock, setBuyAAPL] = useAtom(buyAAPL);
    const [sellAAPLstock, setSellAAPL] = useAtom(sellAAPL);


    const [buyAMZNstock, setBuyAMZN] = useAtom(buyAMZN);

    const [sellAMZNstock, setSellAMZN] = useAtom(sellAMZN);


    const [buyNVDAstock, setBuyNVDA] = useAtom(buyNVDA);
    const [sellNVDAstock, setSellNVDA] = useAtom(sellNVDA);


    const [buyTSLAstock, setBuyTSLA] = useAtom(buyTSLA);
    const [sellTSLAstock, setSellTSLA] = useAtom(sellTSLA);


    const [buyMSFTstock, setBuyMSFT] = useAtom(buyMSFT);
    const [sellMSFTstock, setSellMSFT] = useAtom(sellMSFT);


    const [buyNFLXstock, setBuyNFLX] = useAtom(buyNFLX);
    const [sellNFLXstock, setSellNFLX] = useAtom(sellNFLX);

    // const [buy, setBuy] = useState<StockBuyer[]>();
    // const [sell, setSell] = useState<StockBuyer[]>();
    
    

    const [change, setChange] = useState<boolean>(false)
    const [loader, setLoader] = useState<boolean>(true)
    const [stockName, setStockName] = useState<string>()
    const [stockSymbol, setStockSymbol] = useState<string>("")
    const [placeOrderType, setPlaceOrderType] = useState<"market" | "limit">("market")
    const [side, setSide] = useState<"sell" | "buy">("buy")
    const [price, setPrice] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(0)
    const [filled, setFilled] = useState<boolean>(false)
    const navigate = useNavigate()
    const [buttonLoader , setButtonLoader] = useState<boolean>(false)


    const stockRecord: Record<string, any> = {
        "AAPL": [buyAAPLstock, sellAAPLstock],
        "AMZN": [buyAMZNstock, sellAMZNstock],
        "NVDA": [buyNVDAstock, sellNVDAstock],
        "MSFT": [buyMSFTstock, sellMSFTstock],
        "TSLA": [buyTSLAstock, sellTSLAstock],
        "NFLX": [buyNFLXstock, sellNFLXstock],

    };
    useEffect(() => {
        if (placeOrderType === "limit") {
            quantity > 0 && price > 0 ? setFilled(true) : setFilled(false)

        }
        else if (placeOrderType === "market") {
            quantity > 0 ? setFilled(true) : setFilled(false)
        }



    }, [price, quantity, placeOrderType])



    useEffect(() => {




        const socket = io("https://equix-k46e.onrender.com");

        socket.on("connect", () => {


            console.log("Connected:", socket.id);
            socket.on("stockUpdate", (data: any) => {
                setBuyAAPL(data.buyAAPL);
                setSellAAPL(data.sellAAPL);

                setBuyAMZN(data.buyAMZN);
                setSellAMZN(data.sellAMZN);

                setBuyNVDA(data.buyNVDA);
                setSellNVDA(data.sellNVDA);

                setBuyTSLA(data.buyTSLA);
                setSellTSLA(data.sellTSLA);

                setBuyMSFT(data.buyMSFT);
                setSellMSFT(data.sellMSFT);

                setBuyNFLX(data.buyNFLX);
                setSellNFLX(data.sellNFLX);



            })
        });
        async function fnc() {
            await axios.get('https://equix-k46e.onrender.com/test23')



        }
        fnc()
        setLoader(false);






        // return () => socket.disconnect();
    }, [])

    async function placeOrder() {
        try{

        

        let payload = {
            price: price,
            quantity: quantity,
            symbol: stockSymbol,
            orderType: side
        }
        let url ;
        placeOrderType === "limit" ? url = "https://equix-k46e.onrender.com/api/stocks/buy/new/stock" : url = "https://equix-k46e.onrender.com/api/stocks/buy/new/stock/market"
        
        
        
        const res = await axios.post(url, payload, {headers : {token : localStorage.getItem("token")}})
        
        setButtonLoader(false)
        toast(res.data.message,
            {description : res.data.filled || ""
                ,
                action: {
                    label : "ok",
                    onClick: () => console.log("Ok"),
                }
            }
            
        )
    }
    catch(e){
        navigate('/signin')
    }



    }

    return (
        change ? (
                <div className="flex flex-col px-2   justify-center items-center w-full min-h-screen">
            
            
            <div className=" flex gap-2 lg:flex-row flex-col max-w-6xl w-full justify-between items-center  mx-auto py-4 px-2 ">
                <div className=" flex flex-col gap-2  rounded-2xl bg-white shadow-sm shadow-black p-4 max-w-3xl w-full  ">

                    <div className="flex  justify-between items-center text-center gap-2  ">
                        <div className="text-2xl font-semibold">
                            OrderBook
                        </div>
                        <div className="font-semibold text-gray-600 text-md ">
                            USD $
                        </div>
                    </div>
                    <div className="flex justify-between items-center  p-4  ">

                        <div className="text-gray-600">Price</div>
                        <div className="text-gray-600">Quantity</div>
                        <div className="text-gray-600">Total</div>

                    </div>

                    <div className="flex flex-col gap-2 ">

                        <div className="items-left justify-center text-green-600 ">
                            Buy Stocks
                        </div>

                        <div className="overflow-y-auto max-h-32 lg:max-h-64 ">
                            {stockRecord[stockSymbol][0]?.slice().reverse().map((stock: any) => { return <Price price={stock.price} quantity={stock.quantity} orderType="buy" /> })}
                        </div>

                        <div className="items-left justify-center text-red-600 ">
                            Sell Stocks
                        </div>

                        <div className="overflow-y-auto max-h-32 lg:max-h-64 ">
                            {stockRecord[stockSymbol][1]?.slice().map((stock: any) => { return <Price price={stock.price} quantity={stock.quantity} orderType="sell" /> })}
                        </div>
                    </div>

                </div>
                <div className="flex flex-col items-center rounded-xl border bg-white shadow-md shadow-gray-500 max-w-3xl w-full mx-auto">


                    <div className="p-4 text-2xl w-full rounded-xl font-semibold bg-gray-100 border-b border-gray-300 ">
                        $ Place Order
                    </div>
                    <div className=" flex flex-col gap-2 p-4 w-full">
                        <div className="text-md font-medium text-left">
                            Trading Asset
                        </div>
                        <div className="px-2 py-4 text-gray-800 font-semibold bg-gray-100 border border-gray-200 rounded-xl">
                            {stockSymbol} - {stockName}
                        </div>

                        <div className="font-semibold">
                            Order Type
                        </div>
                        <div className="flex gap-2 w-full">
                            <button className={`${placeOrderType === "market" ? "bg-[#2563EB] text-white " : "bg-gray-200 hover:bg-gray-300 text-black"} transition-all duration-300 p-3 w-full hover:cursor-pointer rounded-xl`}
                                onClick={() => {
                                    setPlaceOrderType("market")
                                    setPrice(0)
                                }}
                            >Market </button>
                            <button className={`${placeOrderType === "limit" ? "bg-[#2563EB] text-white " : "bg-gray-200 hover:bg-gray-300  text-black"} transition-all duration-300 p-3 w-full hover:cursor-pointer rounded-xl`}
                                onClick={() => {
                                    setPlaceOrderType("limit")
                                }}
                            >Limit </button>
                        </div>

                        <div className="font-semibold">
                            Side
                        </div>
                        <div className="flex gap-2 w-full">
                            <button className={`${side === "buy" ? "bg-[#16A34A] text-white " : "bg-gray-200 hover:bg-gray-300 text-black"} transition-all duration-300 p-3 w-full hover:cursor-pointer rounded-xl`}
                                onClick={() => {
                                    setSide("buy")
                                }}
                            >Buy </button>
                            <button className={`${side === "sell" ? "bg-[#DC2626]  text-white " : "bg-gray-200 hover:bg-gray-300  text-black"} transition-all duration-300 p-3 w-full hover:cursor-pointer rounded-xl`}
                                onClick={() => {
                                    setSide("sell")
                                }}
                            >Sell </button>
                        </div>
                        {placeOrderType === "limit" ? (<div className="flex flex-col gap-2">
                            <div className="text-lg font-medium">
                                Limit Price ($)
                            </div>
                            <div className="">
                                <input
                                    onChange={(e: any) => {
                                    const val = e.target.value
                                    setPrice(val === "" ? 0 : parseFloat(val))
                                    

                                }}
                                    placeholder="Enter Limit Price "  className="p-3 rounded-xl text-gray-600 border border-gray-400 w-full focus:border-white focus:ring-2 focus:ring-blue-400" type="number" min={0}  ></input>
                            </div>
                        </div>) : ""}

                        <div className="text-lg font-medium">
                            Quantity
                        </div>
                        <div className="">
                            <input
                                onChange={(e: any) => {
                                    const val = e.target.value
                                    setQuantity(val === "" ? 0 : parseFloat(val))
                                    

                                }}
                                placeholder="Enter Quantity "  className="p-3 rounded-xl text-gray-600 border border-gray-400 w-full focus:border-white focus:ring-2 focus:ring-blue-400" type="number" min={0}  ></input>
                        </div>
                        {placeOrderType === "market" && filled ? <div className="flex justify-between text-md items-center text-gray-600">
                            <div>
                                * Market order will be completed as much as possible 
                            </div>
                            {/* <button className="p-2 bg-blue-500 cursor-pointer transition-all duration-300 hover:shadow-blue-500 shadow-md text-white rounded-xl"
                            onClick={()=>{}}
                            >Fetch Price </button> */}
                        </div> : ""}



                        {filled && price != 0 ? <div className="flex flex-col gap-2 bg-gray-100 p-2 w-full rounded-xl">
                            <div className="font-semibold ">
                                Order Summary
                            </div>
                            <div className="flex  text-gray-600 justify-between w-full">
                                <div>Asset :</div>
                                <div>{stockSymbol}  {stockName}</div>
                            </div>
                            <div className="flex  text-gray-600 justify-between w-full">
                                <div>Type :</div>
                                <div>{placeOrderType} {side} </div>
                            </div>
                            <div className="flex  text-gray-600 justify-between w-full">
                                <div>Quantity :  </div>
                                <div>{quantity}</div>
                            </div>
                            <div className="flex  text-gray-600 justify-between w-full">
                                <div>Price :  </div>
                                <div>${price}</div>
                            </div>
                            <div className="flex  text-gray-600 justify-between w-full">
                                <div>Total :</div>
                                <div>$ {(price * quantity).toFixed(2)}</div>
                            </div>

                        </div> : ""}
                        {buttonLoader?<div className=" flex items-center justify-center w-full">
                            <Spinner/>
                        </div> :
                            <button
                            onClick={() => {
                                setButtonLoader(true)
                                placeOrder()
                            }}
                            className={`rounded-xl w-full ${filled ? "bg-[#16A34A]  text-white" : " bg-gray-400 text-white"} p-3 my-2  cursor-pointer `}>Place {side} Order </button>
                        }

                        

                    </div>



                </div>
            </div>

            
        </div>
            
        ) : (loader ? (<div>ok</div>) : <div className="flex flex-col   bg-gray-200 w-full min-h-screen ">
            <div className=" flex mx-auto max-w-7xl items-center w-full px-2 py-12 ">
                <div className="flex flex-col gap-2 ">
                    <div className="text-4xl font-bold">
                        Market Overview
                    </div>
                    <div className="text-gray-700 font-thin text-lg">
                        Select a stock to view detailed order book and place trades
                    </div>
                </div>
                <div >

                </div>
            </div>
            <div className="flex justify-center w-full px-4">
                <div className="flex flex-col py-2 border border-gray-300 rounded-2xl bg-gray-100 shadow-md w-full divide-gray-400 divide-y  max-w-7xl">

                    <div className=" px-3 py-4 text-2xl font-bold text-gray-900">
                        Available Markets
                    </div>

                    <AvailableMarkets symbol="AMZN" stockName="Amazon Inc"  setChange={setChange} setStockName={setStockName} setStockSymbol={setStockSymbol} />
                    <AvailableMarkets symbol="AAPL" stockName="Apple "     setChange={setChange} setStockName={setStockName} setStockSymbol={setStockSymbol} />
                    <AvailableMarkets symbol="NVDA" stockName="Nvidia"     setChange={setChange} setStockName={setStockName} setStockSymbol={setStockSymbol} />
                    <AvailableMarkets symbol="NFLX" stockName="Netflix Inc"   setChange={setChange} setStockName={setStockName} setStockSymbol={setStockSymbol} />
                    <AvailableMarkets symbol="TSLA" stockName="Tesla "   setChange={setChange} setStockName={setStockName} setStockSymbol={setStockSymbol} />
                    <AvailableMarkets symbol="MSFT" stockName="Microsoft   "   setChange={setChange} setStockName={setStockName} setStockSymbol={setStockSymbol} />



                </div>
            </div>

        </div>)

    )


}