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

  const isUp = prices[prices.length - 1][1] >= prices[0][1];

  const data = {
    labels: prices.map(p => new Date(p[0]).toLocaleDateString()),
    datasets: [
      {
        data: prices.map(p => p[1]),
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