"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { CoinById } from "@/src/utilities/PricesType";
import { getCoinbyId, getCoinMarketChart } from "@/src/utilities/PricesApi";
import PriceChart from "./PriceChart";
import { motion } from "framer-motion";
import { SyncLoader } from "react-spinners";
interface Props {
  id: string;
}

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const PriceDetails = ({ id }: Props) => {
  const [coin, setCoin] = useState<CoinById | null>(null);
  const [chartPrices, setChartPrices] = useState<number[][]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrice = async() => {
        try {
        setLoading(true)
        const res = await getCoinbyId(id);
        setCoin(res);
        setLoading(false);
        }
        catch (error) {
            console.error(error);
        }
    }
    fetchPrice();
  }, [id]);

  useEffect(() => {
    const fetchMarketchat = async() => {
        try {
        setLoading(true)
        const res = await getCoinMarketChart(id);
        setChartPrices(res);
        setLoading(false);
        }
        catch (error) {
            console.error(error);
        }
    }
    fetchMarketchat();
  }, [id]);

  useEffect(() => {
    window.scrollTo({
        top: 0,
        behavior: "instant",
    })
  }, [id]);
        

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-white">
        <SyncLoader size={25} color="black"/>
      </div>
    );
  }

  if (!coin) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">
        <SyncLoader size={25} color="black"/>
      </div>
    );
  }

  const priceChange = coin.market_data.price_change_percentage_24h;
  const isPositive = priceChange >= 0;

  return (
    <section className="min-h-screen bg-white text-black px-6 py-10">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        transition={{ duration: 0.4 }}
        className="max-w-5xl mx-auto space-y-10"
      >
        {/* Header */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.1 }}
          className="flex items-center gap-5"
        >
          <Image
            src={coin.image.large}
            alt={coin.name}
            width={64}
            height={64}
            priority
          />

          <div>
            <h1 className="text-3xl font-bold">
              {coin.name}
              <span className="ml-2 text-gray-400 uppercase text-sm">
                ({coin.symbol})
              </span>
            </h1>
            <p className="text-gray-400 text-sm">
              Rank #{coin.market_cap_rank}
            </p>
          </div>
        </motion.div>

        {/* Price Section */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.2 }}
          className="flex items-end justify-between flex-wrap gap-6"
        >
          <div className="bg-black  rounded-xl px-4 py-2 w-fit">
            <p className="text-4xl font-semibold text-white">
              ${coin.market_data.current_price.usd.toLocaleString()}
            </p>
            <p
              className={`text-sm font-semibold ${
                isPositive ? "text-green-400" : "text-red-400"
              }`}
            >
              {priceChange.toFixed(2)}% (24h)
            </p>
          </div>
        </motion.div>

        {/* Chart */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.3 }}
          className="bg-black rounded-xl p-5"
        >
          <p className="text-gray-400 text-sm mb-3">Last 7 Days</p>
          <PriceChart prices={chartPrices} />
        </motion.div>

        {/* Market Stats */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-3 gap-6 bg-black rounded-xl p-6"
        >
          <Stat label="Market Cap" value={`$${coin.market_data.market_cap.usd.toLocaleString()}`} />
          <Stat label="FDV" value={`$${coin.market_data.fully_diluted_valuation.usd.toLocaleString()}`} />
          <Stat label="24h Volume" value={`$${coin.market_data.total_volume.usd.toLocaleString()}`} />
          <Stat label="Circulating Supply" value={coin.market_data.circulating_supply.toLocaleString()} />
          <Stat label="Max Supply" value={coin.market_data.max_supply ? coin.market_data.max_supply.toLocaleString() : "∞"} />
          <Stat label="All Time High" value={`$${coin.market_data.ath.usd.toLocaleString()}`} />
        </motion.div>

        {/* About */}
        {coin.description.en && (
          <motion.div
            variants={fadeUp}
            transition={{ delay: 0.5 }}
            className="bg-black rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-white mb-2">
              About {coin.name}
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              {coin.description.en.replace(/<[^>]+>/g, "").slice(0, 500)}...
            </p>
          </motion.div>
        )}

        {/* Links */}
        <motion.div
          variants={fadeUp}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap gap-6 text-sm"
        >
          {coin.links.homepage[0] && (
            <ExternalLink href={coin.links.homepage[0]} label="Website" />
          )}
          {coin.links.blockchain_site[0] && (
            <ExternalLink href={coin.links.blockchain_site[0]} label="Explorer" />
          )}
          {coin.links.repos_url.github[0] && (
            <ExternalLink href={coin.links.repos_url.github[0]} label="GitHub" />
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-gray-400 text-sm">{label}</p>
    <p className="text-white font-medium">{value}</p>
  </div>
);

const ExternalLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    className="text-blue-400 hover:underline"
  >
    {label}
  </a>
);

export default PriceDetails;
