"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search } from "lucide-react";

const SearchBox = () => {
  const [query, setQuery] = useState("");
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
          bg-gray-900
          px-4 py-3
          border border-gray-700
          focus-within:ring-2
          focus-within:ring-blue-400
          transition
        "
      >
        <Search size={20} className="text-white" />

        <input
          type="text"
          placeholder="Search coins..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            bg-transparent
            text-white
            placeholder-gray-400
            outline-none
          "
        />
      </div>
    </form>
  );
};

export default SearchBox;
