"use client";
import { createContext, useContext, useState } from "react";

interface SearchContextValue {
  query: string;
  setQuery: (query: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const SearchContext = createContext<SearchContextValue | undefined>(undefined);

export const SearchProvider = ({ children }: { children: React.ReactNode }) => {
  const [query, setQuery] = useState<string>("");
  const [visible, setVisible] = useState<boolean>(false);

  return (
    <SearchContext.Provider value={{ query, setQuery, visible, setVisible }}>
      {children}
    </SearchContext.Provider>
  );
};

export const useSearchContext = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("Must use inside <SearchProvider>");
  }
  return context;
};
