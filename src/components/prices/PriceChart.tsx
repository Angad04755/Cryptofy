"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
);

interface Props {
  prices: number[][]; // [[timestamp, price]]
}

const PriceChart = ({ prices }: Props) => {
  const labels = prices.map((price) =>
    new Date(price[0]).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })
  );

  const data = {
    labels,
    datasets: [
      {
        data: prices.map((price) => price[1]),
        borderColor: "#22c55e", // green
        borderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: "rgba(34, 197, 94, 0.08)",
        pointRadius: 0,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: "#22c55e",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "#111827",
        titleColor: "#ffffff",
        bodyColor: "#e5e7eb",
        padding: 10,
        displayColors: false,
        callbacks: {
          title: (items: any) => {
            const index = items[0].dataIndex;
            const date = new Date(prices[index][0]);
            return date.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
          },
          label: (item: any) =>
            `$${item.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        ticks: { display: false },
        grid: { display: false },
      },
      y: {
        ticks: { display: false },
        grid: { display: false },
      },
    },
  };

  return (
    <div className="h-64 w-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default PriceChart;
