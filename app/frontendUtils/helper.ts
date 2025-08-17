import { CreatableUserRole, TravelChargingTypes } from "@/types/enums";
import {
  AccessType,
  JobType,
  LocationType,
  MoveSize,
  MoveStatus,
  PaymentMethod,
  PriceFilter,
  PriceOrder,
  QUOTE_STATUS_LABELS,
  ServiceType,
  StopBehavior,
} from "@/types/types";
import { DateTime, DateTimeOptions } from "luxon";
import { MoveItem } from "@/types/convex-schemas";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Doc } from "@/convex/_generated/dataModel";

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidRole = (role: string): role is CreatableUserRole => {
  return Object.values(CreatableUserRole).includes(role as CreatableUserRole);
};

export const isValidHourlyRate = (rate: number): boolean => {
  return !isNaN(rate) && rate >= 0;
};

export const formatMonthDay = (value: number | null | undefined) => {
  if (!value) return "";

  const month = Math.floor(value / 100);
  const day = value % 100;

  const dt = DateTime.fromObject({ month, day });
  return dt.isValid ? dt.toFormat("MMM d") : "";
};

export const formatTime = (time: string | null) =>
  time ? DateTime.fromFormat(time, "HH:mm").toFormat("h:mm a") : null;

export const formatDecimalNumber = (
  value: number | null | undefined,
  unit: string
) => {
  if (value == null || isNaN(value)) return "—";
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
};

export const formatDisplayNumber = (
  value: number | null | undefined,
  unit: string
) => {
  if (value == null || isNaN(value)) return "—";
  return `${value.toLocaleString()} ${unit}`;
};

export function formatDateToLong(dateString: string | null): string | null {
  if (!dateString) return "Missing Date";
  return DateTime.fromISO(dateString).toFormat("MMMM d, yyyy");
}

export const formatDateShort = (timestamp: number): string => {
  return DateTime.fromMillis(timestamp).toFormat("M/d/yy");
};

export function formatMoveSize(size: MoveSize | null): string | null {
  const map: Record<MoveSize, string> = {
    studio: "Studio",
    "1_bedroom": "1 Bedroom",
    "2_bedroom": "2 Bedroom",
    "3_bedroom": "3 Bedroom",
    "4_bedroom": "4 Bedroom",
    "5_bedroom": "5 Bedroom",
    not_applicable: "Not Applicable",
  };

  return size ? map[size] : null;
}

export function formatAccessType(type?: AccessType | null): string | null {
  if (!type) return null;

  const map: Record<AccessType, string> = {
    ground: "Ground Level",
    one_flight: "1 Flight",
    two_flights: "2 Flights",
    three_or_more_flights: "3+ Flights",
    elevator: "Elevator Access",
  };

  return map[type];
}

export function formatLocationType(type?: LocationType | null): string | null {
  if (!type) return null;

  const map: Record<LocationType, string> = {
    apartment: "Apartment",
    house: "House",
    office: "Office",
    "storage unit": "Storage Unit",
    "speciality item": "Specialty Item",
  };

  return map[type];
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatCurrencyCompact(amount: number): string {
  if (amount < 1000) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }

  const compactAmount = amount / 1000;
  const rounded =
    compactAmount % 1 === 0
      ? compactAmount.toFixed(0)
      : compactAmount.toFixed(1);

  return `$${rounded}K`;
}

export const getMoveStatusType = (
  move: Doc<"move">,
  moveCustomer: Doc<"moveCustomers">,
  quote: Doc<"quotes"> | null
): string => {
  if (quote) {
    return QUOTE_STATUS_LABELS[quote.status] || quote.status;
  }
  return hasRequiredMoveFields(move, moveCustomer)
    ? "Ready to Send"
    : "Missing Information";
};

// Need to update
export const hasRequiredMoveFields = (
  move: Doc<"move">,
  moveCustomer: Doc<"moveCustomers">
): boolean => {
  const hasContactInfo =
    moveCustomer.name?.trim() &&
    moveCustomer.email?.trim() &&
    moveCustomer.phoneNumber?.trim() &&
    moveCustomer.altPhoneNumber?.trim() &&
    moveCustomer.referral?.trim();

  const hasLocations =
    Array.isArray(move.locations) &&
    move.locations.length >= 2 &&
    move.locations.every((loc) => loc?.address?.trim());

  return Boolean(hasContactInfo && hasLocations);
};

export function formatServiceTypeLabel(
  type: ServiceType | null
): string | null {
  if (!type) return null;

  switch (type) {
    case "moving":
      return "Moving Service Proposal";
    case "packing":
      return "Packing Service Proposal";
    case "load_only":
      return "Load Only Service Proposal";
    case "unload_only":
      return "Unload Only Service Proposal";
    case "moving_and_packing":
      return "Moving and Packing Service Proposal";
    case "commercial":
      return "Commercial Service Proposal";
    default:
      return null;
  }
}

export function formatServiceTypeName(type: ServiceType | null): string | null {
  if (!type) return null;

  switch (type) {
    case "moving":
      return "Moving";
    case "packing":
      return "Packing";
    case "load_only":
      return "Load Only";
    case "unload_only":
      return "Unload Only";
    case "moving_and_packing":
      return "Moving and Packing";
    case "commercial":
      return "Commercial";
    default:
      return null;
  }
}

export function getTotalWeightAndSize(items: MoveItem[]): {
  weight: number;
  size: number;
} {
  return items.reduce(
    (totals, item) => {
      totals.weight += item.weight * item.quantity;
      totals.size += item.size * item.quantity;
      return totals;
    },
    { weight: 0, size: 0 }
  );
}

export function formatPhoneNumber(input: string): string {
  const number = parsePhoneNumberFromString(input, "US");
  return number?.isValid() ? number.formatNational() : input;
}

export function getLocationLabel(index: number, total: number): string {
  if (index === 0) return "Starting Location";
  if (index === total - 1) return "Ending Location";
  return `Stop #${index}`;
}

export function formatStopBehaviorTags(behavior?: StopBehavior[]): string[] {
  if (!behavior || behavior.length === 0) return [];
  return behavior.map((b) =>
    b === "pick_up" ? "Pickup" : b === "drop_off" ? "Dropoff" : b
  );
}

export function groupItemsByRoom(
  items: MoveItem[]
): Record<string, MoveItem[]> {
  return items.reduce(
    (acc, item) => {
      if (!acc[item.room]) acc[item.room] = [];
      acc[item.room].push(item);
      return acc;
    },
    {} as Record<string, MoveItem[]>
  );
}

export function formatPaymentMethod(
  method?: PaymentMethod | null
): string | null {
  if (!method) return "";

  const map: Record<PaymentMethod, string> = {
    credit_card: "Credit Card",
    check: "Check",
    cash: "Cash",
  };

  return map[method];
}

export const formatNarrowWeekday = (
  locale: string | undefined,
  date: Date
): string => {
  const dt = DateTime.fromJSDate(date, {
    locale: locale || "en",
  } as DateTimeOptions);

  const shortWeekday = dt.toLocaleString({ weekday: "short" });

  return shortWeekday.charAt(0);
};

export const formatShortDate = (date: Date): string => {
  const dt = DateTime.fromJSDate(date);
  return dt.toLocaleString({ month: "short", day: "numeric", year: "numeric" });
};

export const formatLongDate = (date: Date): string => {
  const dt = DateTime.fromJSDate(date);
  return dt.toLocaleString({ month: "long", day: "numeric", year: "numeric" });
};

export const getCurrentDate = (timeZone: string): Date => {
  return DateTime.now().setZone(timeZone).toJSDate();
};

export function navigateDate(
  currentDate: Date,
  direction: "prev" | "next",
  timeZone: string
): Date {
  return DateTime.fromJSDate(currentDate)
    .setZone(timeZone)
    .plus({ days: direction === "next" ? 7 : -7 })
    .toJSDate();
}

export const formatMonthYear = (date: Date, timeZone: string): string => {
  return DateTime.fromJSDate(date).setZone(timeZone).toFormat("LLLL yyyy");
};

export const getStatusColor = (status: MoveStatus): string => {
  switch (status) {
    case "New Lead":
      return "#108A01";
    case "Quoted":
      return "#FFC107";
    case "Booked":
      return "#2196F3";
    case "Completed":
      return "#F57EF1";
    case "Lost":
      return "#FF5252";
    case "Cancelled":
      return "#9E9E9E";
    default:
      return "#FFC107";
  }
};

export function getMoveCostRange(move: Doc<"move">): [number, number?] {
  let base = 0;

  // Flat rate
  if (move.jobType === "flat") {
    base = move.jobTypeRate ?? 0;
  }

  // Hourly rate (use starting and ending time)
  if (move.jobType === "hourly" && move.startingMoveTime) {
    const start = move.startingMoveTime;
    const end = move.endingMoveTime ?? start;

    const highHours = (end - start) / (1000 * 60 * 60);
    const rate = move.jobTypeRate ?? 0;

    const low = base; // starting at base 0 for hourly
    const high = highHours * rate;

    // Add insurance and fees to both
    const extras =
      (move.liabilityCoverage?.premium ?? 0) +
      move.moveFees.reduce(
        (sum, fee) => sum + (fee.price ?? 0) * (fee.quantity ?? 1),
        0
      );

    return [low + extras, high + extras];
  }

  // Add extras for flat jobs
  base += move.liabilityCoverage?.premium ?? 0;
  base += move.moveFees.reduce(
    (sum, fee) => sum + (fee.price ?? 0) * (fee.quantity ?? 1),
    0
  );

  return [base]; // only one value for flat jobs
}

export const formatPriceRange = (low: number, high?: number): string => {
  if (!high || low === high) {
    return formatCurrency(low);
  }
  return `${formatCurrency(low)} – ${formatCurrency(high)}`;
};

export const priceFilterToOrder = (
  filter: PriceFilter | null
): PriceOrder | null => {
  if (filter === "Lowest to Highest") return "asc";
  if (filter === "Highest to Lowest") return "desc";
  return null;
};

export const priceOrderToFilter = (
  order: PriceOrder | null
): PriceFilter | null => {
  if (order === "asc") return "Lowest to Highest";
  if (order === "desc") return "Highest to Lowest";
  return null;
};
export const formatTimestamp = (
  timestamp: number,
  timeZone: string
): string => {
  return DateTime.fromMillis(Math.floor(timestamp), {
    zone: timeZone,
  }).toFormat("LLL d, h:mm a"); // e.g., "Aug 16, 3:45 PM"
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const getHourlyRateFromLabor = (
  movers: number,
  laborRates?: Doc<"labor">[]
): number | null => {
  if (!laborRates) return null;

  const active = laborRates.find((l) => l.isDefault && l.isActive);
  if (!active) return null;

  if (movers === 2) return active.twoMovers;
  if (movers === 3) return active.threeMovers;
  if (movers === 4) return active.fourMovers;
  if (movers > 4) return active.fourMovers + (movers - 4) * active.extra;

  return null;
};

export interface ListRowType {
  left: string;
  right: string | null;
}

\
export function getMoveDisplayRows({
  moveFees,
  jobType,
  jobTypeRate,
  liabilityCoverage,
  travelFeeRate,
  travelFeeMethod,
}: {
  moveFees: { name: string; quantity: number; price: number }[];
  jobType: "hourly" | "flat";
  jobTypeRate: number | null;
  liabilityCoverage?: { premium: number } | null;
  travelFeeRate?: number | null;
  travelFeeMethod?: TravelChargingTypes | null;
}): ListRowType[] {
  const jobTypeRateDisplay = jobType === "hourly" ? "Hourly Rate" : "Job Rate";
  const jobRateValue =
    jobType === "hourly"
      ? `${formatCurrency(jobTypeRate ?? 0)}/hr`
      : `${formatCurrency(jobTypeRate ?? 0)}`;

  // Optional Travel Fee row
  const travelRow =
    travelFeeMethod != null
      ? buildTravelRow(travelFeeMethod, travelFeeRate ?? 0)
      : null;

  const baseRows: ListRowType[] = [
    ...moveFees.map((fee) => ({
      left: `${fee.name} (${fee.quantity} @ ${formatCurrency(fee.price)})`,
      right: `${formatCurrency(fee.price * fee.quantity)}`,
    })),
    {
      left: "Liability Coverage",
      right: formatCurrency(liabilityCoverage?.premium ?? 0),
    },
  ];

  if (travelRow) {
    // insert travel fee after liability coverage (adjust ordering if you prefer)
    baseRows.push(travelRow);
  }

  baseRows.push({
    left: jobTypeRateDisplay,
    right: jobRateValue,
  });

  return baseRows;
}

function buildTravelRow(
  method: TravelChargingTypes,
  rate: number
): ListRowType {
  switch (method) {
    case TravelChargingTypes.LABOR_HOURS:
      return { left: "Travel (Labor Rate)", right: `${formatCurrency(rate)}/hr` };
    case TravelChargingTypes.MILEAGE:
      return { left: "Travel (Mileage)", right: `${formatCurrency(rate)}/mi` };
    case TravelChargingTypes.FLAT:
      return { left: "Travel (Flat)", right: `${formatCurrency(rate)}` };
    default:
      // Fallback (shouldn't happen if enum is exhaustive)
      return { left: "Travel Fee", right: formatCurrency(rate) };
  }
}

export function getTotalHoursRange(
  start: number,
  end: number,
  drive: number = 0
): string {
  if (typeof start !== "number" || typeof end !== "number") return "-";
  const totalStart = formatDisplayNumber(start + drive, "");
  const totalEnd = formatDisplayNumber(end + drive, "");
  return `${totalStart} - ${totalEnd} hours`;
}

export function formatJobTypeRateRow(
  jobType: JobType,
  rate: number | null | undefined
): string {
  if (rate == null) return "";
  const formatted = formatCurrency(rate);
  return jobType === "hourly" ? `${formatted}/hr` : formatted;
}

export function formatJobRate(
  jobType: JobType | null | undefined,
  jobTypeRate: number | null | undefined
): string {
  if (!jobTypeRate || !jobType) return "—";

  const amount = formatCurrency(jobTypeRate);
  return jobType === "hourly" ? `${amount}/hr` : `${amount} flat`;
}

export function formatMonthDayTimestamp(
  timestamp: number | string,
  timezone: string = "UTC"
): string {
  const millis =
    typeof timestamp === "number" ? timestamp : new Date(timestamp).getTime();

  return DateTime.fromMillis(millis, { zone: timezone }).toFormat("LLL d");
}
