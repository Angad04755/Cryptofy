"use client";

import { useEffect, useState } from "react";
import { getPrices } from "@/src/utilities/PricesApi";
import { Price } from "@/src/utilities/PricesType";
import Image from "next/image";

const HoldingTable = () => {
  const [prices, setPrices] = useState<Price[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <section>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-700">

        {/* ✅ Sticky Header (NO overflow parent) */}
        <div className="sticky top-15 z-50 bg-gray-900 text-gray-300 text-sm md:text-lg">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] px-10 py-3">
            <span className="text-left">Coin</span>
            <span className="text-right">Price</span>
            <span className="text-right">24h %</span>
            <span className="text-right">Market Cap</span>
            <span className="text-right">Volume</span>
          </div>
        </div>

        {/* Table wrapper (overflow only for X axis) */}
        <div className="px-4 py-2 overflow-x-auto">
          <table className="w-full border-collapse text-gray-300">
            <tbody>
              {prices.map((price) => (
                <tr
                  key={price.id}
                  className="border-b border-gray-700 transition hover:bg-gray-800"
                >
                  <td className="px-4 py-3">
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center">

                      <div className="flex items-center gap-3">
                        <Image
                          src={price.image}
                          alt={price.name}
                          width={25} height={25}
                        />
                        <div>
                          <p className="font-medium text-white">
                            {price.name}
                          </p>
                          <p className="text-xs uppercase text-gray-400">
                            {price.symbol}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        ${price.current_price.toLocaleString()}
                      </div>

                      <div
                        className={`text-right font-medium ${
                          price.price_change_percentage_24h >= 0
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {price.price_change_percentage_24h}%
                      </div>

                      <div className="text-right">
                        ${price.market_cap.toLocaleString()}
                      </div>

                      <div className="text-right">
                        ${price.total_volume.toLocaleString()}
                      </div>

                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </section>
  );
};

export default HoldingTable;
