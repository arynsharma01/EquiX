import { useEffect, useState } from "react";
import Overview from "./OverviewCard";
import StockCard from "./StockCard";
import axios from "axios";
import type StockType from "../assets/types/stockType";
import { useAtom } from "jotai";
import { popularStocksInfo } from "../store/popularStocks";
import { Spinner } from "./ui/shadcn-io/spinner";
import { useNavigate } from "react-router-dom";




type searchResult = {
    symbol: string
    name: string

}

export default function Market() {



    const [popularStocks, setPopularStocks] = useAtom(popularStocksInfo)

    const [marketOverview, setMarketOverview] = useState<StockType[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [searchResult, setSearchResult] = useState<searchResult[]>([])
    const [searched, setSearched] = useState<boolean>(false)

    const navigate = useNavigate()



    async function getSearchResult(search: string) {
        const res = await axios.get(`https://equix-k46e.onrender.com/api/stocks/search?symbol=${search}`, {
            withCredentials: true
        })
        const data = res.data.searchResult;
        

        setSearchResult(data)
        setSearched(true);


    }

    useEffect(() => {
        async function getData() {
            try {

                await axios.all([
                    axios.get('https://equix-k46e.onrender.com/api/stocks/popular/market/status'),
                    axios.get('https://equix-k46e.onrender.com/api/stocks/popular/get-info')
                ]).then(axios.spread((res1, res2) => {
                    setMarketOverview(res1.data.allResult),
                        setPopularStocks(res2.data.allData)



                }))

                setLoader(false)

            }
            catch (e) {
                console.log(e);

            }
        }
        getData()
    }, [])
    return loader ? (
        <div className="flex items-center justify-center w-full min-h-screen">
            <Spinner variant="ring" className="size-16" />
        </div>
    ) : (<div className=" flex items-center justify-center max-w-7xl mx-auto w-full">
        <div className="flex flex-col gap-10 ">

            <div className="flex flex-col pt-6 gap-2 ">
                <div className=" font-bold text-3xl">
                    Stock Market Dashboard

                </div>
                <div className="text-lg font-light">
                    Track your favorite stocks and monitor market performance
                </div>
            </div>

            <div className=" flex flex-col p-6 bg-white border border-gray-300 rounded-2xl gap-4  ">
                <div className="text-xl font-bold">Market Overview</div>
                <div className="flex lg:flex-row flex-col   gap-2 ">
                    {marketOverview.map((card,key) => {
                        return <Overview symbol={card.symbol} value={card.value} gainValue={card.gainValue} gainPercent={(card.gainPercent)} up={!(card.gainValue < 0)} key={key} />
                    })}



                </div>
            </div>


            <div className="flex flex-col gap-2 bg-white border border-gray-100 p-5 rounded-2xl ">
                <div className="pt-2 flex flex-col">
                    <input
                        className="w-full border-2 rounded-xl p-4 focus:border-white border-gray-300 focus:ring-3 focus:ring-blue-700 "
                        onChange={(e) => { getSearchResult(e.target.value) }} type="text" placeholder="Search Stock by Symbol  (1 day price) " />
                    {searched && searchResult ? (<div className="flex flex-col bg-white w-full z-0   "> {searchResult?.map((value ,key) => { 
                        return <div className=" flex justify-between w-full items-center px-2 py-4 text-lg font-semibold cursor-pointer border-b  border-gray-300 rounded-2xl bg-gray-100 hover:bg-gray-200 "
                        onClick={()=>{
                            navigate('/stock/searched',{
                                state : {symbol : value.symbol}
                            })
                        }}
                        key={key}>
                            
                            {value.name}
                            {value.symbol}

                        </div>
                        })} </div>) : ""}
                </div>
                <div className="text-lg font-semibold">
                    Popular Stocks
                </div>
                <div className="grid lg:grid-cols-3 gap-4 w-full ">

                    {popularStocks.map((stock ,key) => {
                        const child = stock.child[0];

                        if (!child) return null;

                        return (
                            <StockCard
                                key={key}
                                symbol={stock.symbol}
                                longName={child.longName}
                                closingValues={child.closingValues}
                                gainValue={child.gainValue}
                                gainPercent={child.gainPercent}
                                volume={child.volume} child={[]} />
                        );
                    })}


                </div>
            </div>

        </div>
    </div>)
}



