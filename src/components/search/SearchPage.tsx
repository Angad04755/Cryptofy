"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { CoinSearchItem } from "@/src/utilities/PricesType";
import {searchPrices} from "@/src/utilities/PricesApi";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { SyncLoader } from "react-spinners";
const SearchPage = () => {
  const [coins, setCoins] = useState<CoinSearchItem[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("query");

  useEffect(() => {
    if (!query) return;

    const fetchCoins = async () => {
      try {
        setLoading(true);
        const data = await searchPrices(query);
        setCoins(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoins();
  }, [query]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white">
        <SyncLoader size={25} color="white"/>
      </div>
    );
  }

  return (
    <section>
      <div className="min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900">
        {/* Header */}
        <div className="sticky top-28.5 md:top-16.5 z-10 bg-white text-black text-xs md:text-lg backdrop-blur-xl shadow-xl">
          <div className="grid md:grid-cols-[3fr_1fr_1fr] grid-cols-[3fr_1fr_1fr] px-6 md:px-10 py-3">
            <span>Coin</span>
            <span className="text-right">Symbol</span>
            <span className="text-right">Rank</span>
          </div>
        </div>

        {/* Table */}
        <div className="px-2 md:px-4 py-2 overflow-x-auto">
          <table className="w-full border-collapse text-gray-300 text-sm md:text-base">
            <tbody>
              {coins.map((i) => {
                return (
                <tr
                  key={i.id}
                  className="border-b border-gray-700 hover:bg-white/5 transition cursor-pointer" onClick={() => router.push(`coin/${i.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="grid grid-cols-[3fr_1fr_1fr] items-center">

                      {/* Coin */}
                      <div className="flex items-center gap-3">
                        
                        
                        <span className="font-medium text-white">
                          {i.name}
                        </span>
                      </div>

                      {/* Symbol */}
                      <div className="text-right uppercase text-gray-400">
                        {i.symbol}
                      </div>

                      {/* Rank */}
                      <div className="text-right">
                        {i.market_cap_rank ?? "—"}
                      </div>

                    </div>
                  </td>
                </tr>
              )})}
            </tbody>
          </table>

          {coins.length === 0 && (
            <p className="text-center text-gray-400 mt-6">
              No results found
            </p>
          )}
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
