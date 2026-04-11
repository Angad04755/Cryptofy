"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { CoinSearchItem } from "../search/types"
import { searchPrices } from "@/src/apis/PricesApi";

const SearchBox = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchparams = useSearchParams();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<CoinSearchItem[]>([]);
  const [istyping, setIsTyping] = useState(false);

  // ✅ Debounce search
  useEffect(() => {
    if (!istyping) return;
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }
   

    const timer = setTimeout(async () => {
      try {
        const res = await searchPrices(query);
        setSuggestions(res.slice(0, 5));
      } catch (error) {
        console.error(error);
      }
    }, 200);

    return () => clearTimeout(timer);

  }, [query]);

   useEffect(() => {
      const urlQuery = searchparams.get("query");
      if (!urlQuery) return;
      setQuery(urlQuery);
      setSuggestions([]);
      setIsTyping(false)
    },[searchparams]);

  // Clear on route change
  useEffect(() => {
    setSuggestions([]);
    if (pathname === "/") setQuery("");
  }, [pathname]);

  const goToSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    setQuery(trimmed);
    setSuggestions([]);
    router.push(`/search?query=${trimmed}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    goToSearch(query);
  };
  const handleChange = (value: string) => {
    setIsTyping(true)
    setQuery(value);
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <Search size={22} className="absolute text-white mt-[12px] ml-[10px]"/>
        <div className="w-full flex items-center gap-3 rounded-xl bg-black px-4 py-3 border border-gray-700 focus-within:ring-4 focus-within:ring-white transition-all 0.3s">
          <input
            type="text"
            placeholder="Search coins..."
            value={query}
            onChange={(e) => {handleChange(e.target.value)}}
            className="bg-transparent text-white placeholder-gray-400 outline-none ml-[30px]"
          />
          
        </div>
      </form>

      {istyping && suggestions.length > 0 && (
        <div className="absolute w-fit mt-2 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-100">
          {suggestions.map((item) => (
            <div
              key={item.id}
              onClick={() => goToSearch(item.name)}
              className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-blue-50"
            >
              <Search size={16} className="text-gray-400" />
              <span className="text-gray-700 text-sm font-medium">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBox;
