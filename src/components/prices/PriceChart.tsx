"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

type PriceChartProps = {
  prices: number[][];
  livePrice?: number;
};

export default function PriceChart({ prices, livePrice }: PriceChartProps) {
  const formattedPrices = prices.map(([timeStamp, price]) => ({
    timeStamp,
    price,
  }));

  const chartPrices =
    livePrice && formattedPrices.length > 0
      ? [
          ...formattedPrices.slice(0, -1),
          {
            timeStamp: Date.now(),
            price: livePrice,
          },
        ]
      : formattedPrices;

  if (chartPrices.length === 0) {
    return <div className="h-64 w-full" />;
  }

  const isUp =
    chartPrices[chartPrices.length - 1].price >= chartPrices[0].price;

  const data = {
    labels: chartPrices.map((item) =>
      new Date(item.timeStamp).toLocaleDateString()
    ),
    datasets: [
      {
        data: chartPrices.map((item) => item.price),
        borderColor: isUp ? "#22c55e" : "#ef4444",
        tension: 0.4,
        pointRadius: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
}
