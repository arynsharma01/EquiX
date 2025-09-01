import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler, 
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler 
);

interface LineChartProps {
  labels: string[]
  values: number[]
  postive : boolean
}

export default function LineChart({ labels, values , postive }: LineChartProps) {

  
  const updatedLables = labels.map((label)=>{
    
    return label.toString().split(' ')[0].split(',')[0]
  })
  
  
  const data = {
    labels : updatedLables,
    datasets: [
      {
        label: "Stock Price",
        data: values,
        borderColor:postive? "rgb(0, 200, 0)" :"rgb(255, 0, 0)"  ,
        backgroundColor: postive? "rgb(0, 200, 0,0.1)" :"rgb(255, 0, 0,0.1)" ,
        tension: 0.3,
        fill: 'origin',
        pointRadius : 5,
        pointHoverRadius : 10,
        pointStyle :'circle'
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Line Chart",
      },
    },
    scales: {
      y: {
      },
    },
  };

  return (
    <div className="w-full h-[300px] md:h-[400px]">
      <Line data={data} options={options} />
    </div>
  );
}