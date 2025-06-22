// types.ts or wherever your constants/types are declared

import React from "react";
import { ArrowUp, ArrowDown, DollarSign } from "lucide-react";

// Define PriceFilter type
export type PriceFilter = "Highest to Lowest" | "Lowest to Highest";

// Define options with optional icon
export const PRICE_FILTER_OPTIONS = [
  {
    label: (
      <div className="flex items-center gap-1">
        <ArrowDown className="w-4 h-4" />
        <span>Price</span>
      </div>
    ),
    value: "Highest to Lowest",
  },
  {
    label: (
      <div className="flex items-center gap-1">
        <ArrowUp className="w-4 h-4" />
        <span>Price</span>
      </div>
    ),
    value: "Lowest to Highest",
  },
];

export const PRICE_FILTER_TAG_LABEL_MAP: Record<PriceFilter, React.ReactNode> =
  {
    "Highest to Lowest": (
      <span className="flex items-center gap-1">
        <ArrowDown className="w-3 h-3" />
        <span>Price</span>
      </span>
    ),
    "Lowest to Highest": (
      <span className="flex items-center gap-1">
        <ArrowUp className="w-3 h-3" />
        <span>Price</span>
      </span>
    ),
  };
