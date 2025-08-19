// AddressContext.tsx
import React, { createContext, useContext } from "react";

export type AddressContextType = {
  placeIds: string[]; // first = origin, last = destination, middle = stops
};

const AddressContext = createContext<AddressContextType>({ placeIds: [] });

export const usePlaceIds = () => useContext(AddressContext);

export const AddressProvider: React.FC<{
  placeIds: string[];
  children: React.ReactNode;
}> = ({ placeIds, children }) => (
  <AddressContext.Provider value={{ placeIds }}>
    {children}
  </AddressContext.Provider>
);
