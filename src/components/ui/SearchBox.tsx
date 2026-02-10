"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";
import { Debounce } from "@/src/utilities/Debounce";
import { CoinSearchItem } from "@/src/utilities/PricesType";
import { getPrices } from "@/src/utilities/PricesApi";
const SearchBox = () => {
  const [query, setQuery] = useState("");
  const [value, setValue] = useState("");
  const [suggestions, setSuggestons] = useState<CoinSearchItem[]>([]);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedQuery = query.trim();
    if (!trimmedQuery) return;

    router.push(`/search?query=${trimmedQuery}`);
  };

  return (
    <form
      onSubmit={handleSearch}
      className="min-w-full px-4 md:px-10 py-4 flex justify-center items-center"
    >
      <div
        className="
          min-w-full
          flex items-center gap-3
          rounded-xl
          bg-black
          px-4 py-3
          border border-gray-700
          focus-within:ring-2
          focus-within:ring-blue-400
          transition
        "
      >
        
        <input
          type="text"
          placeholder="Search coins..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="min-w-full
            bg-transparent
            text-white
            placeholder-gray-400
            outline-none 
          "
        />
        <Search size={30} color="white" className="" />

      </div>
    </form>
  );
};

export default SearchBox;
