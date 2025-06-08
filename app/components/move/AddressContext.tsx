// AddressContext.tsx
import React, { createContext, useContext } from "react";

export type AddressContextType = {
  addresses: string[];
};

const AddressContext = createContext<AddressContextType>({ addresses: [] });

export const useAddresses = () => useContext(AddressContext);

export const AddressProvider: React.FC<{
  addresses: string[];
  children: React.ReactNode;
}> = ({ addresses, children }) => (
  <AddressContext.Provider value={{ addresses }}>
    {children}
  </AddressContext.Provider>
);
