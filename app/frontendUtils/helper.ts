import { PreMoveDocSchema, QuoteSchema } from "@/types/convex-schemas";
import { MoveSchema } from "@/types/convex-schemas";
import { CreatableUserRole } from "@/types/enums";
import {
  AccessType,
  MoveSize,
  MoveType,
  PaymentMethod,
  QUOTE_STATUS_LABELS,
  ServiceType,
  StopBehavior,
} from "@/types/types";
import { DateTime, DateTimeOptions } from "luxon";
import { MoveItem } from "@/types/convex-schemas";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const isValidRole = (role: string): role is CreatableUserRole => {
  return Object.values(CreatableUserRole).includes(role as CreatableUserRole);
};

export const isValidHourlyRate = (rate: string): boolean => {
  const numericRate = parseFloat(rate);
  return (
    !isNaN(numericRate) && numericRate >= 0 && /^\d+(\.\d{1,2})?$/.test(rate)
  );
};

export const formatMonthDay = (value: number | null | undefined) => {
  if (!value) return "";
  const month = Math.floor(value / 100);
  const day = value % 100;
  return `${month}-${day}`;
};

export const formatTime = (time: string | null) =>
  time ? DateTime.fromFormat(time, "HH:mm").toFormat("h:mm a") : null;

export const formatDecimalNumber = (
  value: number | null | undefined,
  unit: string
) => {
  if (value == null || isNaN(value)) return "—";
  return `${value.toFixed(2)} ${unit}`;
};

export function formatDateToLong(dateString: string | null): string | null {
  if (!dateString) return "Unknown Date";
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

export function formatMoveType(type?: MoveType | null): string | null {
  if (!type) return null;

  const map: Record<MoveType, string> = {
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
    maximumFractionDigits: 2,
  }).format(amount);
}

export const getMoveStatusType = (
  move: MoveSchema,
  quote: QuoteSchema | null
): string => {
  if (quote) {
    return QUOTE_STATUS_LABELS[quote.status] || quote.status;
  }
  return hasRequiredMoveFields(move) ? "Ready to Send" : "Missing Information";
};

// Need to update
const hasRequiredMoveFields = (move: MoveSchema): boolean => {
  const hasContactInfo =
    move.name?.trim() && move.email?.trim() && move.phoneNumber?.trim();

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
    case "labor":
      return "Labor Service Proposal";
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
  if (!method) return null;

  const map: Record<PaymentMethod, string> = {
    credit_card: "Credit Card",
    check: "Check",
    cash: "Cash",
  };

  return map[method];
}

export const getMoveStatus = (
  move: MoveSchema,
  quote: QuoteSchema | null,
  assignedMovers: number,
  preMoveDoc: PreMoveDocSchema | null
):
  | "Pending Quote"
  | "Assign Movers"
  | "Pre Doc Ready To Send"
  | "Pending Customer Pre Doc Signature"
  | "Pre Doc Signed"
  | "Booked" => {
  const quoteIsIncomplete = !quote || quote.status !== "completed";

  console.log("preMoveDoc", preMoveDoc);
  if (quoteIsIncomplete) {
    return "Pending Quote";
  }

  if (assignedMovers < move.movers) {
    return "Assign Movers";
  }

  if (!preMoveDoc) {
    return "Pre Doc Ready To Send";
  }

  const { repSignature, customerSignature } = preMoveDoc;

  if (repSignature && !customerSignature) {
    return "Pending Customer Pre Doc Signature";
  }

  if (repSignature && customerSignature) {
    return "Pre Doc Signed";
  }

  return "Booked";
};

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
