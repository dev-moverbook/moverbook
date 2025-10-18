import { ArrowUp, ArrowDown } from "lucide-react";

export type PriceOrder = "desc" | "asc";
export const PRICE_FILTER_OPTIONS: {
  label: React.ReactNode;
  value: PriceOrder;
}[] = [
  {
    label: (
      <div className="flex items-center gap-1">
        <ArrowDown className="w-4 h-4" />
        <span>Price</span>
      </div>
    ),
    value: "desc",
  },
  {
    label: (
      <div className="flex items-center gap-1">
        <ArrowUp className="w-4 h-4" />
        <span>Price</span>
      </div>
    ),
    value: "asc",
  },
];

export const PRICE_ORDER_TAG_LABEL_MAP: Record<PriceOrder, React.ReactNode> = {
  desc: (
    <span className="flex items-center gap-1">
      <ArrowDown className="w-3 h-3" />
      <span>Price</span>
    </span>
  ),
  asc: (
    <span className="flex items-center gap-1">
      <ArrowUp className="w-3 h-3" />
      <span>Price</span>
    </span>
  ),
};
