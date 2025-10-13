import { Doc } from "@/convex/_generated/dataModel";

export type DuplicateFieldKey =
  | "serviceType"
  | "startingLocation"
  | "endingLocation"
  | "stops"
  | "inventory"
  | "movers"
  | "trucks"
  | "rate"
  | "addOns"
  | "liabilityCoverage";

export interface DuplicateOption {
  label: string;
  value: DuplicateFieldKey;
  getValue: (move: Doc<"move">) => string;
}
