import { useEffect, useState } from "react";
import Overview from "./OverviewCard";
import StockCard from "./StockCard";
import axios from "axios";
import type StockType from "../assets/types/stockType";
import { useAtom } from "jotai";
import { popularStocksInfo } from "../store/popularStocks";




 type searchResult = {
    symbol : string
    name : string 

}

export default function Market() {
 


const [popularStocks, setPopularStocks] = useAtom(popularStocksInfo)

    const [marketOverview, setMarketOverview] = useState<StockType[]>([])
    const [loader, setLoader] = useState<boolean>(true)
    const [searchResult ,setSearchResult] = useState<searchResult[]>()
    let searched = false ;

    async function getSearchResult(search :string) {
        const res = await axios.get(`http://localhost:3000/api/stocks/search?symbol=${search}`,{
            withCredentials : true 
        })
        const data = res.data.searchResult ;
        console.log(data);
        
        setSearchResult(data)
        searched = true ;
       
        

    }

    useEffect(() => {
        async function getData() {
            try {

                await axios.all([
                    axios.get('http://localhost:3000/api/stocks/popular/market/status'),
                    axios.get('http://localhost:3000/api/stocks/popular/get-info')
                ]).then(axios.spread((res1, res2) => {
                    setMarketOverview(res1.data.allResult),
                    setPopularStocks(  res2.data.allData)
                    
                    

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
        <div>
            Hello
        </div>
    ) : (<div className=" flex  justify-evenly w-full">
        <div className="flex flex-col gap-10 ">

            <div className="flex flex-col pt-6 gap-2 ">
                <div className=" font-bold text-3xl">
                    Stock Market Dashboard

                </div>
                <div className="text-lg font-light">
                    Track your favorite stocks and monitor market performance
                </div>
            </div>

            <div className=" flex flex-col p-6 bg-white border border-gray-300 rounded-2xl gap-4 msx-2 ">
                <div className="text-xl font-bold">Market Overview</div>
                <div className="flex lg:flex-row flex-col   gap-2 ">
                    {marketOverview.map(card => {
                        return <Overview symbol={card.symbol} value={card.value} gainValue={card.gainValue} gainPercent={(card.gainPercent)} up={!(card.gainValue < 0)} />
                    })}



                </div>
            </div>


            <div className="flex flex-col gap-2 bg-white border border-gray-100 p-5 rounded-2xl ">
                <div className="pt-2 flex flex-col">
                    <input className="w-full border-2 rounded-xl p-4 focus:border-white border-gray-300 focus:ring-3 focus:ring-blue-700 "
                    onChange={(e)=>{
                        getSearchResult(e.target.value)
                    }}
                    
                    type="text" placeholder="Search Stock by Symbol or Company name " />
                    {searched && searchResult?(<div className="flex flex-col bg-white w-full z-0 ">
                    
                        {searchResult?.map((value)=>{
                            return value.name + value.symbol 
                        })}

                    </div>) :""}

                </div>
                <div className="text-lg font-semibold">
                    Popular Stocks
                </div>
                <div className="grid lg:grid-cols-3 gap-4 ">

                    {popularStocks.map((stock) => {
                        const child = stock.child[0]; 

                        if (!child) return null; 

                        return (
                            <StockCard
                                
                                symbol={stock.symbol}
                                longName={child.longName}
                                closingValues={child.closingValues}
                                gainValue={child.gainValue}
                                gainPercent={child.gainPercent}
                                volume={child.volume} child={[]}                            />
                        );
                    })}


                </div>
            </div>

        </div>
    </div>)
}



