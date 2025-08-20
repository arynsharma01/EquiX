import { useAtom } from "jotai";
import { popularStocksInfo } from "../store/popularStocks";
import { useEffect } from "react";

export default function ChartRender(){

    const [popularStocks, setPopularStocks] = useAtom(popularStocksInfo)

    console.log(popularStocks + "heeree ");
    useEffect(()=>{
        console.log("in the use effect ");
        window.alert("in the useEffect ")
        
    },[])

    
    const currentStock   = popularStocks.filter((stock)=> {
        return stock.symbol === "AMZN"
    })
    console.log(currentStock)
    
    const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }
        ]
      };
    
    return <div className="bg-red-800">
        Ok 
    </div>
}