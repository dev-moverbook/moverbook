"use client";

import { useSearchContext } from "@/app/contexts/SearchContext";
import { X } from "lucide-react";

const SearchInput = () => {
  const { query, setQuery, setVisible } = useSearchContext();

  const clearSearch = () => {
    setQuery("");
    setVisible(false);
  };

  return (
    <div
      id="search-input-container"
      className="relative w-full max-w-screen-sm mx-auto"
    >
      <input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setVisible(true);
        }}
        onFocus={() => setVisible(true)}
        placeholder="Search Customer or Job ID"
        className="text-base w-full bg-transparent border border-grayCustom text-white placeholder-grayCustom rounded-custom px-4 py-1 pr-10 focus:outline-none focus:ring-1 focus:ring-grayCustom"
      />
      {query && (
        <button
          type="button"
          onClick={clearSearch}
          title="Clear Search"
          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
