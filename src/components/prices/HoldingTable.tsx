"use client";

import { useEffect, useState } from "react";
import { getPrices } from "@/src/utilities/PricesApi";
import { Price } from "@/src/utilities/PricesType";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {SyncLoader} from "react-spinners"
const HoldingTable = () => {
  const router = useRouter();
  const limit = 20;
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  // Fetch prices
  useEffect(() => {
    const getPricesList = async () => {
      try {
        const data = await getPrices();
        setPrices(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getPricesList();
  }, []);

  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [page]);

  const totalPages = Math.ceil(prices.length / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  const allprices = prices.slice(start, end);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white">
        <SyncLoader size={15} color="white"/>
      </div>
    );
  }
  const handlePrev = () => {
    setPage(page - 1);
  }
  const handleNext = () => {
    setPage(page + 1);
  }

  return (
    <section>
      {/* Stylish animated background */}
      <div className="min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white">

        {/* 🔒 Sticky Header */}
        <div className="sticky top-16.5 z-10 bg-gray-900/70 backdrop-blur-md text-gray-300 text-xs md:text-lg">
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
          <table className="min-w-full border-collapse text-gray-300 text-sm md:text-base">
            <tbody>
              {allprices.map((i) => {
                const isUp = i.price_change_percentage_24h >= 0;

                return (
                  <tr
                    key={i.id}
                    className="border-b border-gray-700 transition hover:bg-white/5 cursor-pointer"
                    onClick={() => {router.push(`coin/${i.id}`)}}
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
                            className="shrink-0"
                          />
                          <div>
                            <p className="font-medium text-white">{i.name}</p>
                            <p className="text-xs uppercase text-gray-400">{i.symbol}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">${i.current_price.toLocaleString()}</div>

                        {/* 24h Change */}
                        <div className={`text-right font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                          {isUp ? "▲" : "▼"} {Math.abs(i.price_change_percentage_24h).toFixed(2)}%
                        </div>

                        {/* Market Cap (Tablet+) */}
                        <div className="hidden md:block text-right">${i.market_cap.toLocaleString()}</div>

                        {/* Volume (Desktop+) */}
                        <div className="hidden lg:block text-right">${i.total_volume.toLocaleString()}</div>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-10 pb-5">
          <button
            aria-label="Previous page"
            disabled={page === 1}
            onClick={handlePrev}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <ChevronLeft size={18} />
            <span>Prev</span>
          </button>

          <button
            aria-label="Next page"
            disabled={page === totalPages}
            onClick={handleNext}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-700 shadow-sm transition-all duration-200 hover:bg-gray-50 hover:shadow active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white"
          >
            <span>Next</span>
            <ChevronRight size={18} />
          </button>
        </div>

      </div>
    </section>
  );
};

export default HoldingTable;
