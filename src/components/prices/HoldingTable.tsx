"use client";

import { useEffect, useState } from "react";
import { getPrices } from "@/src/apis/PricesApi";
import { Price } from "@/src/types/PricesType";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SyncLoader } from "react-spinners"
import SelectableButton from "../ui/SelectableButton";
import { useQuery } from "@tanstack/react-query";
const currency_options = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "GBP", value: "gbp" },
  { label: "JPY", value: "jpy" },
  { label: "INR", value: "inr" },
  { label: "BTC", value: "btc" },
]

const currency_symbols = new Map<string, string>([
  ["usd", "$"],
  ["eur", "€"],
  ["gbp", "£"],
  ["jpy", "¥"],
  ["inr", "₹"],
  ["btc", "₿"],
])
const HoldingTable = () => {
  const router = useRouter();
  const limit = 20;

  const [Page, setPage] = useState(1);
  const [currency, setCurrency] = useState("usd");
  const symbol = currency_symbols.get(currency);
  const skip = (Page - 1) * limit;
  // Fetch prices

  const { data = [], isLoading } = useQuery<Price[]>({
    queryKey: ["Prices", currency],
    queryFn: () => getPrices(currency),
  })

  // useEffect(() => {
  //   const getPricesList = async () => {
  //     setLoading(true);
  //     try {
  //       const data = await getPrices(currency);
  //       setPrices(data);
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   getPricesList();
  // }, [currency]);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [Page]);

  const totalPages = Math.ceil(data.length / limit);
  const start = (Page - 1) * limit;
  const end = start + limit;
  const allprices = data.slice(start, end);
  const isLastPage = Page === totalPages;

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || i === Page || i === Page - 1 || i === Page + 1) {
      pages.push(i);
    } else {
      pages.push(null);
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white">
        <SyncLoader size={15} color="white" />
      </div>
    );
  }
  const handlePrev = () => {
    setPage((val) => val - 1);
  }
  const handleNext = () => {
    setPage((val) => val + 1);
  }

  return (
    <section>
      {/* Stylish animated background */}
      <article className="min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white">
        <div className="flex justify-center items-center p-2 sticky top-16.5 backdrop-blur-lg">
          <SelectableButton options={currency_options} selected={currency} onChange={(val: any) => setCurrency(val)} />
        </div>

        {/* 🔒 Sticky Header */}
        <div className="sticky top-30 z-10 bg-gray-900/70 backdrop-blur-md text-gray-300 text-xs md:text-lg">
          <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 md:px-10 py-3">
            <span className="text-left">Coin</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h %</span>
            <span className="hidden md:block text-right">Market Cap</span>
            <span className="hidden lg:block text-right">Volume</span>
          </div>
        </div>

        {/* 📱 Table with fade + slide animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-2 md:px-4 py-4 overflow-x-auto"
        >
          <table className="w-full border-collapse text-gray-300 text-sm md:text-base">
            <tbody>
              {allprices.map((i) => {
                const isUp = i.price_change_percentage_24h >= 0;

                return (
                  <tr
                    key={i.id}
                    className="border-b border-gray-700 transition hover:bg-white/5 cursor-pointer"
                    onClick={() => { router.push(`coin/${i.id}`) }}
                  >
                    <td className="px-2 md:px-4 py-3">
                      <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-2">

                        {/* Coin */}
                        <div className="flex items-center gap-3">
                          <Image
                            src={i.image}
                            alt={i.name}
                            width={25}
                            height={25}
                          />
                          <div>
                            <p className="font-medium text-white">{i.name}</p>
                            <p className="text-xs uppercase text-gray-400">{i.symbol}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">{symbol}{i.current_price.toLocaleString()}</div>

                        {/* 24h Change */}
                        <div className={`text-right font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                          {isUp ? "▲" : "▼"} {Math.abs(i.price_change_percentage_24h).toFixed(2)}%
                        </div>

                        {/* Market Cap (Tablet+) */}
                        <div className="hidden md:block text-right">{symbol}{i.market_cap.toLocaleString()}</div>

                        {/* Volume (Desktop+) */}
                        <div className="hidden lg:block text-right">{symbol}{i.total_volume.toLocaleString()}</div>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div className="flex flex-row items-center gap-4 pb-6 md:flex-row md:justify-center md:gap-10 px-4">

          {/* Prev */}
          <button
            aria-label="Previous page"
            disabled={Page === 1}
            onClick={handlePrev}
            className="flex items-center gap-1 md:gap-2 px-1 md:px-4 py-1 rounded-md border border-gray-200 bg-white text-xs md:text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>

          {/* Page Numbers */}
          <div className="flex flex-wrap justify-center gap-1 md:gap-2">
            {pages.map((page, index) => {
              if (page === null) {
                return (
                  <span key={index} className="px-2 text-gray-300 text-sm">
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={index}
                  onClick={() => setPage(page)}
                  className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm transition cursor-pointer ${Page === page
                      ? "bg-black text-white"
                      : "bg-white text-black"
                    }`}
                >
                  {page}
                </button>
              );
            })}
          </div>

          {/* Next */}
          <button
            aria-label="Next page"
            disabled={Page === totalPages}
            onClick={handleNext}
            className="flex items-center gap-1 md:gap-2 px-1 md:px-4 py-1 rounded-md border border-gray-200 bg-white text-xs md:text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>

        </div>

      </article>
    </section>
  );
};

export default HoldingTable;
