"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CoinSearchItem } from "@/src/utilities/PricesType";
import { getPrices } from "@/src/utilities/PricesApi";

const SearchBox = () => {
  const router = useRouter();
  const pathname = usePathname();

  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<CoinSearchItem[]>([]);
  const [suggestions, setSuggestions] = useState<CoinSearchItem[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const data = await getPrices();
        setProducts(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPrices();
  }, []);

  useEffect(() => {
    setShowSuggestions(false);
    setSuggestions([]);
    if (pathname === "/") setQuery("");
  }, [pathname]);

  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = products
      .filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, 6);

    setSuggestions(filtered);
    setShowSuggestions(true);
  }, [query, products]);

  const goToSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setShowSuggestions(false);
    router.push(`/search?query=${trimmed}`);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    goToSearch(query);
  };

  return (
    <div className="relative w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="w-full flex items-center gap-3 rounded-xl bg-black px-4 py-3 border border-gray-700 focus-within:ring-2 focus-within:ring-blue-400">
          <input
            type="text"
            placeholder="Search coins..."
            value={query}
            onChange={(e) => {setQuery(e.target.value)}}
            className="w-full bg-transparent text-white placeholder-gray-400 outline-none"
          />
          <Search size={22} className="text-white" />
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50">
          {suggestions.map((i) => {
            return (
            <div
              key={i.id}
              onClick={() => {goToSearch(i.name)}}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50"
            >
              <Search size={16} className="text-gray-400" />
              <span className="text-gray-700 text-sm font-medium">
                {i.name}
              </span>
            </div>
          )
})}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
