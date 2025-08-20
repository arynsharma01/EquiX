import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react"
import io from "socket.io-client"
import { buyAAPL, buyAMZN, buyMSFT, buyNFLX, buyNVDA, buyTSLA, sellAAPL, sellAMZN, sellMSFT, sellNFLX, sellNVDA, sellTSLA } from "../store/popularStocks";
import Price from "./Price";

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
    useEffect(() => {

        const socket = io("http://localhost:3000");

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
        
        console.log("in use effect ");
        

    }, [])

    return <div className="flex lg:flex-row flex-col  justify-evenly items-center bg-gray-300 w-full min-h-screen">
        <div className=" flex flex-col gap-2  rounded-2xl bg-white shadow-sm shadow-black p-4 lg:w-2xl w-sm  ">
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

            <div className="overflow-y-auto max-h-32 lg:max-h-64 ">
                {buyAMZNstock?.map((stock)=>{return <Price price={stock.price} quantity={stock.quantity} orderType="buy" />})}
            </div>

            <div className="overflow-y-auto max-h-32 lg:max-h-64 ">
                {sellAMZNstock?.slice().reverse().map((stock)=>{return <Price price={stock.price} quantity={stock.quantity} orderType="sell" />})}
            </div>
            
        </div>
    </div>


}