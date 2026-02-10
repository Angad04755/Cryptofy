"use client";

import { useEffect, useRef, useState } from "react";
import { getPrices } from "@/src/utilities/PricesApi";
import { Price } from "@/src/utilities/PricesType";
import Image from "next/image";
import SearchBox from "../ui/SearchBox";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LIMIT = 20;

const MobileHoldingTable = () => {
  const router = useRouter();
  const [prices, setPrices] = useState<Price[]>([]);
  const [visibleCount, setVisibleCount] = useState(LIMIT);
  const [loading, setLoading] = useState(true);
  const observerTarget = useRef<HTMLDivElement | null>(null);

  // 1️⃣ Fetch prices
  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        setPrices(data);
      } catch (error) {
        console.error("Failed to fetch prices", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrices();
  }, []);

  // 2️⃣ Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerTarget.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleCount((prev) => Math.min(prev + LIMIT, prices.length));
      }
    });

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [prices]);

  const visiblePrices = prices.slice(0, visibleCount);
  const hasMore = visibleCount < prices.length;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <section>
      {/* Stylish futuristic background */}
      <div className="min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white">

        {/* Sticky Header */}
        <div className="sticky top-34 z-50 bg-gray-900/70 backdrop-blur-md text-gray-300 text-xs md:text-lg">
          <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] px-4 md:px-10 py-3">
            <span>Coin</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h %</span>
            <span className="hidden md:block text-right">Market Cap</span>
            <span className="hidden lg:block text-right">Volume</span>
          </div>
        </div>

        {/* Table with animation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="px-2 md:px-4 py-2 overflow-x-auto"
        >
          <table className="min-w-full border-collapse text-gray-300 text-sm md:text-base">
            <tbody>
              {visiblePrices.map((price) => {
                const isUp = price.price_change_percentage_24h >= 0;
                return (
                  <tr
                    key={price.id}
                    className="border-b border-gray-700 transition hover:bg-white/5 cursor-pointer"
                    onClick={() => router.push(`coin/${price.id}`)}
                  >
                    <td className="px-2 md:px-4 py-3">
                      <div className="grid grid-cols-[2fr_1fr_1fr] md:grid-cols-[2fr_1fr_1fr_1fr] lg:grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-2">

                        {/* Coin */}
                        <div className="flex items-center gap-3">
                          <Image
                            src={price.image}
                            alt={price.name}
                            width={25}
                            height={25}
                          />
                          <div>
                            <p className="font-medium text-white">{price.name}</p>
                            <p className="text-xs uppercase text-gray-400">{price.symbol}</p>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">${price.current_price.toLocaleString()}</div>

                        {/* 24h Change */}
                        <div className={`text-right font-medium ${isUp ? "text-green-400" : "text-red-400"}`}>
                          {isUp ? "▲" : "▼"} {Math.abs(price.price_change_percentage_24h).toFixed(2)}%
                        </div>

                        {/* Market Cap */}
                        <div className="hidden md:block text-right">${price.market_cap.toLocaleString()}</div>

                        {/* Volume */}
                        <div className="hidden lg:block text-right">${price.total_volume.toLocaleString()}</div>

                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </motion.div>

        {/* Infinite Scroll Trigger */}
        <div ref={observerTarget} className="h-16 flex items-center justify-center">
          {hasMore && <p className="text-gray-400 text-sm">Loading more coins...</p>}
        </div>

        {/* End Message */}
        {!hasMore && (
          <p className="text-center text-gray-400 text-sm pb-10">You’ve reached the end</p>
        )}
      </div>
    </section>
  );
};

export default MobileHoldingTable;
