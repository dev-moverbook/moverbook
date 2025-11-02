import { Doc } from "@/convex/_generated/dataModel";
import { formatJobRate, formatServiceTypeName } from "@/frontendUtils/helper";
import { DuplicateOption } from "./duplicateMove.types";

function formatAddress(
  address: Doc<"moves">["locations"][number]["address"] | null | undefined
) {
  return address?.formattedAddress ?? "—";
}

function getStartingAddress(move: Doc<"moves">, isSwapped: boolean) {
  if (!move.locations?.length) {
    return "—";
  }
  const firstLocation = move.locations[0]?.address ?? null;
  const lastLocation =
    move.locations[move.locations.length - 1]?.address ?? null;
  return isSwapped ? formatAddress(lastLocation) : formatAddress(firstLocation);
}

function getEndingAddress(move: Doc<"moves">, isSwapped: boolean) {
  if (!move.locations?.length) {
    return "—";
  }
  const firstLocation = move.locations[0]?.address ?? null;
  const lastLocation =
    move.locations[move.locations.length - 1]?.address ?? null;
  return isSwapped ? formatAddress(firstLocation) : formatAddress(lastLocation);
}

function getStopsCount(move: Doc<"moves">) {
  return Math.max(0, (move.locations?.length ?? 0) - 2);
}

export function buildSectionOptions(isSwapped: boolean): DuplicateOption[] {
  return [
    {
      label: "Type of Service",
      value: "serviceType",
      getValue: (move) => formatServiceTypeName(move.serviceType) ?? "—",
    },
    {
      label: "Starting Location",
      value: "startingLocation",
      getValue: (move) => getStartingAddress(move, isSwapped),
    },
    {
      label: "Ending Location",
      value: "endingLocation",
      getValue: (move) => getEndingAddress(move, isSwapped),
    },
    {
      label: "Stops",
      value: "stops",
      getValue: (move) => {
        const count = getStopsCount(move);
        return count > 0 ? `${count} stops` : "None";
      },
    },
    {
      label: "Inventory",
      value: "inventory",
      getValue: (move) =>
        move.moveItems.length > 0 ? `${move.moveItems.length} items` : "None",
    },
    {
      label: "Movers",
      value: "movers",
      getValue: (move) => `${move.movers} movers`,
    },
    {
      label: "Trucks",
      value: "trucks",
      getValue: (move) => `${move.trucks} trucks`,
    },
    {
      label: "Rate",
      value: "rate",
      getValue: (move) => formatJobRate(move.jobType, move.jobTypeRate),
    },
    {
      label: "Add Ons",
      value: "addOns",
      getValue: (move) =>
        move.moveFees.length > 0 ? `${move.moveFees.length} items` : "None",
    },
    {
      label: "Liability Coverage",
      value: "liabilityCoverage",
      getValue: (move) => move.liabilityCoverage?.name ?? "Not selected",
    },
  ];
}

export function buildDuplicateMoveUrl(
  baseUrl: string,
  move: Doc<"moves">,
  selectedFields: string[]
) {
  const origin = typeof window !== "undefined" ? window.location.origin : "";

  const url = new URL(baseUrl, origin || "http://localhost");
  if (move.moveCustomerId) {
    url.searchParams.set("moveCustomerId", String(move.moveCustomerId));
  }
  if (selectedFields.length > 0) {
    url.searchParams.set("duplicateFrom", String(move._id));
    url.searchParams.set("fields", selectedFields.join(","));
  }
  url.searchParams.set("referral", "repeat");
  return `${baseUrl}?${url.searchParams.toString()}`;
}
