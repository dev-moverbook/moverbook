"use client";
import { createContext, useContext, useState } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (q: string) => void;
  visible: boolean;
  setVisible: (v: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState("");
  const [visible, setVisible] = useState(false);

  return (
    <SearchContext.Provider value={{ query, setQuery, visible, setVisible }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("Must use inside <SearchProvider>");
  return context;
};
