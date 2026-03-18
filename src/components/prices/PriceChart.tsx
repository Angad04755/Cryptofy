"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip
} from "chart.js";
import { Line } from "react-chartjs-2";
import { priceChart } from "@/src/types/PricesType";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);



export default function PriceChart({prices}: priceChart) {

  const formatedPrices = prices.map(([timeStamp, price]) => {
    return (
      {
        timeStamp,
        price,
      }
    )
  })



  

  const isUp = formatedPrices[formatedPrices.length - 1].price >= formatedPrices[0].price;

  const data = {

    labels: formatedPrices.map((price) => new Date(price.timeStamp).toLocaleDateString()),
    datasets: [
      {
        data: formatedPrices.map((price) => price.price),
        borderColor: isUp ? "#22c55e" : "#ef4444",
        tension: 0.4,
        pointRadius: 0
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false
    },
    plugins: {
      legend: { display: false }
    },
    scales: {
      x: { display: false },
      y: { display: false }
    }
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
}