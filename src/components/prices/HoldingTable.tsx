"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { SyncLoader } from "react-spinners";
import { useQuery } from "@tanstack/react-query";
import SelectableButton from "../ui/SelectableButton";
import { getPrices } from "@/src/apis/PricesApi";
import { Price } from "@/src/types/PricesType";

const CURRENCY_OPTIONS = [
  { label: "USD", value: "usd" },
  { label: "EUR", value: "eur" },
  { label: "GBP", value: "gbp" },
  { label: "JPY", value: "jpy" },
  { label: "INR", value: "inr" },
  { label: "BTC", value: "btc" },
];

const currency_symbols = new Map<string, string>([
  ["usd", "$"],
  ["eur", "€"],
  ["gbp", "£"],
  ["jpy", "¥"],
  ["inr", "₹"],
  ["btc", "₿"],
])

const PAGE_SIZE = 20;
const BINANCE_EXCHANGE_INFO_URL = "https://api.binance.com/api/v3/exchangeInfo";
const BINANCE_WS_BASE = "wss://stream.binance.com:9443/stream?streams=";

type BinanceExchangeInfo = {
  symbols: {
    symbol: string;
    status: string;
  }[];
};

type LiveTicker = {
  price: number;
  changePercent: number;
};

const HoldingTable = () => {
  const router = useRouter();
  const wsRef = useRef<WebSocket | null>(null);

  const [page, setPage] = useState(1);
  const [currency, setCurrency] = useState("usd");
  const [liveData, setLiveData] = useState<Map<string, LiveTicker>>(new Map());
  const [wsFailed, setWsFailed] = useState(false);

  const { data: coins = [], isLoading: coinsLoading } = useQuery<Price[]>({
    queryKey: ["prices", currency],
    queryFn: () => getPrices(currency),
  });

  const { data: exchangeInfo, isLoading: exchangeLoading } =
    useQuery<BinanceExchangeInfo>({
      queryKey: ["binance-exchange-info"],
      queryFn: async () => {
        const res = await fetch(BINANCE_EXCHANGE_INFO_URL);
        if (!res.ok) throw new Error("Failed to fetch Binance exchange info");
        return res.json();
      },
      staleTime: 1000 * 60 * 30,
    });

  const binanceSymbols = useMemo(() => {
    const set = new Set<string>();

    if (!exchangeInfo?.symbols) return set;

    exchangeInfo.symbols.forEach((item) => {
      if (item.status !== "TRADING") return;
      if (!item.symbol.endsWith("USDT")) return;

      const baseSymbol = item.symbol.slice(0, -4).toLowerCase();
      set.add(baseSymbol);
    });

    return set;
  }, [exchangeInfo]);

  const filteredCoins = useMemo(() => {
    if (binanceSymbols.size === 0) return [];
    return coins.filter((coin) =>
      binanceSymbols.has(coin.symbol.toLowerCase())
    );
  }, [coins, binanceSymbols]);

  useEffect(() => {
    setPage(1);
  }, [currency]);

  useEffect(() => {
    if (filteredCoins.length === 0) return;

    const streams = filteredCoins
      .slice(0, 80)
      .map((coin) => `${coin.symbol.toLowerCase()}usdt@ticker`);

    if (streams.length === 0) return;

    wsRef.current?.close();
    setWsFailed(false);

    const ws = new WebSocket(`${BINANCE_WS_BASE}${streams.join("/")}`);
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const payload = JSON.parse(event.data);
      const ticker = payload?.data;

      if (!ticker?.s) return;

      const baseSymbol = ticker.s.replace(/USDT$/, "").toLowerCase();

      setLiveData((prev) => {
        const updated = new Map(prev);

        updated.set(baseSymbol, {
          price: Number(ticker.c),
          changePercent: Number(ticker.P),
        });

        return updated;
      });
    };

    ws.onerror = () => {
      setWsFailed(true);
    };

    ws.onclose = () => {};

    return () => ws.close();
  }, [filteredCoins]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [page]);

  const totalPages = Math.ceil(filteredCoins.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const visibleCoins = filteredCoins.slice(start, start + PAGE_SIZE);
  const isLastPage = page === totalPages || totalPages === 0;

  const pages: (number | null)[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      i === page ||
      i === page - 1 ||
      i === page + 1
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== null) {
      pages.push(null);
    }
  }

  if (coinsLoading || exchangeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-700 via-green-800 to-green-900">
        <SyncLoader size={15} color="white" />
      </div>
    );
  }

  const currencySymbol = currency_symbols.get(currency);

  return (
    <section className="min-h-screen bg-gradient-to-b from-green-700 via-green-800 to-green-900 text-white">
      <div className="sticky top-28.5 md:top-16.5 z-20 flex justify-center bg-black/10 p-2 backdrop-blur-xl">
        <SelectableButton
          options={CURRENCY_OPTIONS}
          selected={currency}
          onChange={setCurrency}
        />
      </div>

      <div className={`${wsFailed ? "text-red-200" : "text-green-200"} z-200 sticky top-42 md:top-30 backdrop-blur-xl bg-black/20 px-4 py-2 text-center text-xs md:text-sm`}>
        {wsFailed ? "connecting..." : "connected"}
      </div>

      <div className="sticky top-50 md:top-39 z-10 border-b border-gray-700 bg-gray-900/70 backdrop-blur-xl">
        <div className="grid grid-cols-[2fr_1fr_1fr] px-4 py-3 text-xs text-gray-300 md:grid-cols-[2fr_1fr_1fr_1fr] md:pl-40 md:text-lg lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
          <span className="pl-2 md:pl-65">Coin</span>
          <span className="pl-10 md:pl-42">Price</span>
          <span className="pl-12 md:pl-42">24h %</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="overflow-x-auto px-2 py-4 md:px-4"
      >
        <table className="w-full border-collapse text-sm text-gray-300 md:text-base">
          <tbody>
            {visibleCoins.map((coin) => {
              const symbol = coin.symbol.toLowerCase();
              const liveTicker = liveData.get(symbol);

              const displayPrice = liveTicker?.price ?? coin.current_price;
              const displayChange =
                liveTicker?.changePercent ??
                coin.price_change_percentage_24h;

              const isPositive = displayChange >= 0;

              return (
                <tr
                  key={coin.id}
                  className="cursor-pointer border-b border-gray-700 transition hover:bg-white/5"
                  onClick={() => router.push(`/coin/${coin.id}`)}
                >
                  <td className="px-2 py-3 md:pl-100">
                    <div className="grid grid-cols-[2fr_1fr_1fr] gap-2 md:grid-cols-[2fr_1fr_1fr] md:gap-30 lg:grid-cols-[2fr_1fr_1fr_1fr_1fr]">
                      <div className="flex items-center gap-3">
                        <Image
                          src={coin.image}
                          alt={coin.name}
                          width={25}
                          height={25}
                        />
                        <div>
                          <p className="font-medium text-white">
                            {coin.name}
                          </p>
                          <p className="text-xs uppercase text-gray-400">
                            {coin.symbol}
                          </p>
                        </div>
                      </div>

                      <motion.div
                        key={`${coin.id}-${displayPrice}`}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 0.3 }}
                        className="text-right font-semibold"
                      >
                        {currencySymbol}
                        {displayPrice.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 8,
                        })}
                      </motion.div>

                      <div
                        className={`text-right font-medium ${
                          isPositive
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {isPositive ? "▲" : "▼"}{" "}
                        {Math.abs(displayChange).toFixed(2)}%
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </motion.div>

      <div className="flex flex-wrap items-center justify-center gap-4 px-4 pb-6 md:gap-10">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-1 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronLeft size={16} />
        </button>

        <div className="flex flex-wrap justify-center gap-1 md:gap-2">
          {pages.map((p, i) =>
            p === null ? (
              <span key={i} className="px-2 text-gray-400">
                ...
              </span>
            ) : (
              <button
                key={i}
                onClick={() => setPage(p)}
                className={`rounded-md px-2 py-1 text-xs md:px-3 md:text-sm ${
                  page === p
                    ? "bg-black text-white"
                    : "bg-white text-black hover:bg-gray-200"
                }`}
              >
                {p}
              </button>
            )
          )}
        </div>

        <button
          disabled={isLastPage}
          onClick={() => setPage((p) => p + 1)}
          className="flex items-center gap-1 rounded-md border border-gray-200 bg-white px-1 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-40"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </section>
  );
};

export default HoldingTable;