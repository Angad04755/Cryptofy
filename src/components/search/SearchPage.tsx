"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import SearchBox from "../ui/SearchBox";
import { CoinSearchItem } from "@/src/utilities/PricesType";
import {searchPrices} from "@/src/utilities/PricesApi";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
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
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <section>
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-700">
        <SearchBox />

        {/* Header */}
        <div className="sticky top-14 z-50 bg-gray-900 text-gray-300 text-xs md:text-lg">
          <div className="grid grid-cols-[3fr_1fr_1fr] px-4 md:px-10 py-3">
            <span>Coin</span>
            <span className="text-right">Symbol</span>
            <span className="text-right">Rank</span>
          </div>
        </div>

        {/* Table */}
        <div className="px-2 md:px-4 py-2 overflow-x-auto">
          <table className="w-full border-collapse text-gray-300 text-sm md:text-base">
            <tbody>
              {coins.map((coin) => (
                <tr
                  key={coin.id}
                  className="border-b border-gray-700 hover:bg-gray-800 transition" onClick={() => router.push(`coin/${coin.id}`)}
                >
                  <td className="px-4 py-3">
                    <div className="grid grid-cols-[3fr_1fr_1fr] items-center">

                      {/* Coin */}
                      <div className="flex items-center gap-3">
                        
                        
                        <span className="font-medium text-white">
                          {coin.name}
                        </span>
                      </div>

                      {/* Symbol */}
                      <div className="text-right uppercase text-gray-400">
                        {coin.symbol}
                      </div>

                      {/* Rank */}
                      <div className="text-right">
                        {coin.market_cap_rank ?? "—"}
                      </div>

                    </div>
                  </td>
                </tr>
              ))}
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
