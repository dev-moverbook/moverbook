import { CreatableUserRole, TravelChargingTypes } from "@/types/enums";
import {
  AccessType,
  CustomerUser,
  HourStatus,
  JobType,
  LocationType,
  MoveItem,
  MoveSize,
  MoveStatus,
  MoveTimes,
  PaymentMethod,
  PriceFilter,
  PriceOrder,
  QUOTE_STATUS_LABELS,
  SegmentDistance,
  ServiceType,
  StopBehavior,
} from "@/types/types";
import { DateTime, DateTimeOptions } from "luxon";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { Doc } from "@/convex/_generated/dataModel";
import { AddressInput, LocationInput } from "@/types/form-types";
import { EnrichedMove } from "@/types/convex-responses";
import { WageRange } from "@/convex/backendUtils/queryHelpers";
import { formatLiabilityPremium, formatMoveFeeLines } from "./payout";

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
  if (!value) {
    return "";
  }

  const month = Math.floor(value / 100);
  const day = value % 100;

  const dateTime = DateTime.fromObject({ month, day });
  return dateTime.isValid ? dateTime.toFormat("MMM d") : "";
};

export const formatTime = (time: string | null | undefined): string =>
  time ? DateTime.fromFormat(time, "HH:mm").toFormat("h:mm a") : "TBD";

export const formatDecimalNumber = (
  value: number | null | undefined,
  unit: string
) => {
  if (value == null || isNaN(value)) {
    return "—";
  }
  return `${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${unit}`;
};

export const formatDisplayNumber = (
  value: number | null | undefined,
  unit: string
) => {
  if (value == null || isNaN(value)) {
    return "—";
  }
  return `${value.toLocaleString()} ${unit}`;
};

export function formatDateToLong(
  dateString: string | null | undefined
): string {
  if (!dateString) {
    return "Missing Date";
  }
  return DateTime.fromISO(dateString).toFormat("MMMM d, yyyy");
}

export const formatDateShort = (timestamp: number): string => {
  return DateTime.fromMillis(timestamp).toFormat("M/d/yy");
};

export function formatMoveSize(
  size: MoveSize | null | undefined
): string | null {
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
  if (!type) {
    return null;
  }

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
  if (!type) {
    return null;
  }

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
  move: Doc<"moves">,
  moveCustomer: CustomerUser,
  quote: Doc<"quotes"> | null
): string => {
  if (quote) {
    return QUOTE_STATUS_LABELS[quote.status] || quote.status;
  }
  return hasRequiredMoveFields(move, moveCustomer)
    ? "Ready to Send"
    : "Missing Information";
};

export const hasRequiredMoveFields = (
  move: Doc<"moves">,
  moveCustomer: CustomerUser
): boolean => {
  const hasInfoSection =
    !!moveCustomer.email?.trim() &&
    !!moveCustomer.phoneNumber?.trim() &&
    (!!moveCustomer.altPhoneNumber
      ? !!moveCustomer.altPhoneNumber.trim()
      : true);

  const isLocationComplete = (location: LocationInput): boolean => {
    if (!location) {
      return false;
    }
    const baseOk =
      !!location.address?.formattedAddress &&
      location.locationType != null &&
      location.accessType != null &&
      !!location.timeDistanceRange &&
      !!location.locationRole &&
      location.squareFootage !== null &&
      location.squareFootage !== undefined;

    const sizeOk =
      location.locationRole === "ending"
        ? true
        : location.moveSize !== null && location.moveSize !== undefined;

    return baseOk && sizeOk;
  };

  const hasLocationSection =
    Array.isArray(move.locations) &&
    move.locations.length >= 2 &&
    move.locations.every(isLocationComplete);

  const hasMoveDetailsSection =
    move.serviceType !== null &&
    move.moveWindow !== null &&
    !!move.moveDate &&
    !!move.arrivalTimes?.arrivalWindowStarts &&
    !!move.arrivalTimes?.arrivalWindowEnds;

  return hasInfoSection && hasLocationSection && hasMoveDetailsSection;
};

export function formatServiceTypeLabel(
  type: ServiceType | null
): string | null {
  if (!type) {
    return null;
  }

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
  if (!type) {
    return null;
  }

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

export const formatLongDate = (date: Date | null | undefined): string => {
  if (!date || Number.isNaN(date.getTime())) {
    return "Missing Date";
  }
  return DateTime.fromJSDate(date).toLocaleString({
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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

export const getStatusColor = (
  status: MoveStatus | MoveTimes | undefined
): string => {
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
    case "morning":
      return "#60a5fa";
    case "afternoon":
      return "#f59e0b";
    case "custom":
      return "#a78bfa";
    default:
      return "#FFC107";
  }
};

export const getMoverStatusColor = (
  status: MoveTimes | "completed"
): string => {
  switch (status) {
    case "morning":
      return "#60a5fa";
    case "afternoon":
      return "#f59e0b";
    case "custom":
      return "#a78bfa";
    case "completed":
      return "#F57EF1";
    default:
      return "#FFC107";
  }
};

export function getMoveCostRange(move: Doc<"moves">): [number, number?] {
  if (move.invoiceAmountPaid) {
    const deposit = move.deposit ?? 0;
    const total = move.invoiceAmountPaid + deposit;
    return [total];
  }

  let base = 0;

  const liabilityValue = formatLiabilityPremium(move.liabilityCoverage).value;

  const moveFeesTotal = formatMoveFeeLines(move.moveFees).reduce(
    (totalValue, feeItem) => {
      return totalValue + feeItem.value;
    },
    0
  );

  const extras = liabilityValue + moveFeesTotal;

  if (move.jobType === "flat") {
    base = (move.jobTypeRate ?? 0) + extras;
    return [base];
  }

  if (
    move.jobType === "hourly" &&
    move.startingMoveTime &&
    move.endingMoveTime &&
    move.jobTypeRate
  ) {
    const rate = move.jobTypeRate;
    const low = move.startingMoveTime * rate + extras;
    const high = move.endingMoveTime * rate + extras;

    return [low, high];
  }

  return [extras];
}

export const formatPriceRange = (low: number, high?: number): string => {
  if (!high || low === high) {
    return formatCurrency(low);
  }
  return `${formatCurrency(low)} \u2013 ${formatCurrency(high)}`;
};

export const priceFilterToOrder = (
  filter: PriceFilter | null
): PriceOrder | null => {
  if (filter === "Lowest to Highest") {
    return "asc";
  }
  if (filter === "Highest to Lowest") {
    return "desc";
  }
  return null;
};

export const priceOrderToFilter = (
  order: PriceOrder | null
): PriceFilter | null => {
  if (order === "asc") {
    return "Lowest to Highest";
  }
  if (order === "desc") {
    return "Highest to Lowest";
  }
  return null;
};
export const formatTimestamp = (
  timestamp: number,
  timeZone: string
): string => {
  return DateTime.fromMillis(Math.floor(timestamp), {
    zone: timeZone,
  }).toFormat("LLL d, h:mm a");
};

export const getInitials = (name: string): string => {
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0][0]?.toUpperCase() ?? "";
  }
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
};

export const getHourlyRateFromLabor = (
  movers: number,
  laborRates?: Doc<"labors">[]
): number | null => {
  if (!laborRates) {
    return null;
  }

  const active = laborRates.find((l) => l.isDefault && l.isActive);
  if (!active) {
    return null;
  }

  switch (movers) {
    case 2:
      return active.twoMovers;
    case 3:
      return active.threeMovers;
    case 4:
      return active.fourMovers;
    default:
      if (movers > 4) {
        return active.fourMovers + (movers - 4) * active.extra;
      }
      return null;
  }
};

export interface ListRowType {
  left: string;
  right: string | null;
}

type LineFee = { name: string; quantity: number; price: number };

type ComputeQuoteTotalParams = {
  endingMoveTime?: number | null;
  jobType: JobType;
  jobTypeRate: number | null;
  liabilityCoverage?: { premium: number } | null;
  moveFees: LineFee[];
  segmentDistances: SegmentDistance[];
  startingMoveTime?: number | null;
  travelFeeMethod: TravelChargingTypes | null;
  travelFeeRate: number | null;
};

const calcTravelCost = (
  method: TravelChargingTypes | null,
  rate: number | null,
  segmentDistances?: SegmentDistance[] | null
) => {
  const segs = Array.isArray(segmentDistances) ? segmentDistances : [];
  if (!segs.length || !rate) return 0;

  const first = segs[0];
  const miles = first.distance ?? 0;
  const hours = first.duration ? first.duration / 60 : 0;

  switch (method) {
    case TravelChargingTypes.LABOR_HOURS:
      return (rate ?? 0) * hours;
    case TravelChargingTypes.MILEAGE:
      return (rate ?? 0) * miles;
    case TravelChargingTypes.FLAT:
      return rate ?? 0;
    default:
      return 0;
  }
};

function isQuoteComputable(params: ComputeQuoteTotalParams): boolean {
  if (!params.jobType) {
    return false;
  }

  if (params.jobType === "hourly") {
    if (params.jobTypeRate == null) {
      return false;
    }

    if (params.startingMoveTime == null && params.endingMoveTime == null) {
      return false;
    }
  }

  if (params.jobType === "flat") {
    if (params.jobTypeRate == null) {
      return false;
    }
  }

  return true;
}

export function computeMoveTotal(
  params: ComputeQuoteTotalParams
): { minTotal: number; maxTotal: number } | null {
  if (!isQuoteComputable(params)) {
    return null;
  }

  const feesSubtotal = params.moveFees.reduce(
    (sum, fee) => sum + fee.price * fee.quantity,
    0
  );
  const liabilityCost = params.liabilityCoverage?.premium ?? 0;
  const travelCost = calcTravelCost(
    params.travelFeeMethod,
    params.travelFeeRate,
    params.segmentDistances
  );

  if (params.jobType === "hourly") {
    const rate = params.jobTypeRate ?? 0;
    const minHours = Math.max(0, params.startingMoveTime ?? 0);
    const maxHours = Math.max(minHours, params.endingMoveTime ?? minHours);

    const preMin = feesSubtotal + liabilityCost + travelCost + rate * minHours;
    const preMax = feesSubtotal + liabilityCost + travelCost + rate * maxHours;

    return {
      minTotal: preMin,
      maxTotal: preMax,
    };
  }

  const jobTotal = params.jobTypeRate ?? 0;
  const total = feesSubtotal + liabilityCost + travelCost + jobTotal;

  return {
    minTotal: total,
    maxTotal: total,
  };
}

const formatToTwoDecimals = (number: number) =>
  Number.isFinite(number) ? number.toFixed(2) : "0.00";

const formatSmartDecimal = (number: number) =>
  Number.isInteger(number) ? String(number) : number.toFixed(2);

export const buildHourlySuffix = (
  minimumHours?: number | null,
  maximumHours?: number | null
) => {
  const hasMinimumHours = typeof minimumHours === "number";
  const hasMaximumHours = typeof maximumHours === "number";

  if (hasMinimumHours && hasMaximumHours) {
    const safeMinimumHours = Math.max(0, minimumHours!);
    const safeMaximumHours = Math.max(safeMinimumHours, maximumHours!);

    return safeMinimumHours === safeMaximumHours
      ? ` (${formatSmartDecimal(safeMinimumHours)} hrs)`
      : ` (${formatSmartDecimal(safeMinimumHours)} - ${formatSmartDecimal(safeMaximumHours)} hrs)`;
  }

  if (hasMinimumHours) {
    return ` (${formatSmartDecimal(Math.max(0, minimumHours!))} hrs)`;
  }

  return "";
};

const buildTravelSuffix = (
  method: TravelChargingTypes | null,
  segmentDistances: SegmentDistance[]
) => {
  if (!segmentDistances.length) {
    return "";
  }

  const first = segmentDistances[0];
  const miles = first.distance ?? 0;
  const hours = first.duration ? first.duration / 60 : 0;

  switch (method) {
    case TravelChargingTypes.LABOR_HOURS:
      return ` (${formatToTwoDecimals(Math.max(0, hours))} hrs)`;
    case TravelChargingTypes.MILEAGE:
      return ` (${formatToTwoDecimals(Math.max(0, miles))} mi)`;
    default:
      return "";
  }
};

export function computeInvoiceTotals({
  baseMin,
  baseMax,
  additionalFees = [],
  discounts = [],
  deposit = 0,
}: {
  baseMin: number;
  baseMax: number;
  additionalFees?: { price: number }[];
  discounts?: { price: number }[];
  deposit?: number | null;
}) {
  const addl = additionalFees.reduce((s, f) => s + (f.price || 0), 0);
  const disc = discounts.reduce((s, d) => s + (d.price || 0), 0);
  const dep = deposit ?? 0;
  const invoiceMin = Math.max(0, baseMin + addl - disc - dep);
  const invoiceMax = Math.max(0, baseMax + addl - disc - dep);
  return { invoiceMin, invoiceMax };
}

export function getMoveDisplayRows({
  endingMoveTime,
  getTotal = false,
  jobType,
  jobTypeRate,
  liabilityCoverage,
  moveFees,
  paymentMethod,
  creditCardFee,
  segmentDistances,
  startingMoveTime,
  travelFeeMethod,
  travelFeeRate,
}: {
  endingMoveTime?: number | null;
  getTotal?: boolean;
  jobType: JobType;
  jobTypeRate: number | null;
  liabilityCoverage?: { premium: number } | null;
  moveFees: { name: string; quantity: number; price: number }[];
  paymentMethod: PaymentMethod;
  creditCardFee: number;
  segmentDistances: SegmentDistance[];
  startingMoveTime?: number | null;
  travelFeeMethod: TravelChargingTypes | null;
  travelFeeRate?: number | null;
}): ListRowType[] {
  const jobTypeRateDisplayBase =
    jobType === "hourly" ? "Hourly Rate" : "Job Rate";
  const jobRateValue =
    jobType === "hourly"
      ? `${formatCurrency(jobTypeRate ?? 0)}/hr`
      : `${formatCurrency(jobTypeRate ?? 0)}`;

  const rows: ListRowType[] = [
    ...moveFees.map((fee) => ({
      left: `${fee.name} (${fee.quantity} @ ${formatCurrency(fee.price)})`,
      right: `${formatCurrency(fee.price * fee.quantity)}`,
    })),
    {
      left: "Liability Coverage",
      right: formatCurrency(liabilityCoverage?.premium ?? 0),
    },
  ];

  if (travelFeeMethod != null) {
    const travelSuffix = getTotal
      ? buildTravelSuffix(travelFeeMethod, segmentDistances)
      : "";
    rows.push({
      left: `Travel Fee${travelSuffix}`,
      right: buildTravelRow(travelFeeMethod, travelFeeRate ?? 0).right,
    });
  }

  let jobSuffix = "";
  if (getTotal && jobType === "hourly") {
    jobSuffix = buildHourlySuffix(startingMoveTime, endingMoveTime);
  }

  rows.push({
    left: `${jobTypeRateDisplayBase}${jobSuffix}`,
    right: jobRateValue,
  });

  if (paymentMethod?.kind === "credit_card") {
    const pct = creditCardFee <= 1 ? creditCardFee * 100 : creditCardFee;
    rows.push({ left: "Credit Card Fee", right: `${pct.toFixed(2)}%` });
  }

  if (!getTotal) {
    return rows;
  }

  const result = computeMoveTotal({
    moveFees,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    travelFeeRate: travelFeeRate ?? null,
    travelFeeMethod,
    segmentDistances,
    startingMoveTime,
    endingMoveTime,
  });
  const minTotal = result?.minTotal ?? 0;
  const maxTotal = result?.maxTotal ?? 0;

  rows.push({
    left: "Total",
    right:
      minTotal === maxTotal
        ? formatCurrency(minTotal)
        : `${formatCurrency(minTotal)} - ${formatCurrency(maxTotal)}`,
  });

  return rows;
}

function buildTravelRow(
  method: TravelChargingTypes,
  rate: number
): ListRowType {
  switch (method) {
    case TravelChargingTypes.LABOR_HOURS:
      return {
        left: "Travel (Labor Rate)",
        right: `${formatCurrency(rate)}/hr`,
      };
    case TravelChargingTypes.MILEAGE:
      return { left: "Travel (Mileage)", right: `${formatCurrency(rate)}/mi` };
    case TravelChargingTypes.FLAT:
      return { left: "Travel (Flat)", right: `${formatCurrency(rate)}` };
    default:
      return { left: "Travel Fee", right: formatCurrency(rate) };
  }
}

export function getTotalHoursRange(
  start: number,
  end: number,
  drive: number = 0
): string {
  if (typeof start !== "number" || typeof end !== "number") {
    return "-";
  }
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

export const placeIdToRef = (pid: string | null) =>
  pid ? `place_id:${pid}` : null;

export const isLikelyPlaceId = (id?: string | null) =>
  !!id && !/[ ,]/.test(id) && id.length >= 10;

// export const toDistanceRef = (addr?: AddressInput | null): string | null => {
//   if (!addr) return null;

//   if (isLikelyPlaceId(addr.placeId)) {
//     return addr.placeId!;
//   }

//   const lat = addr.location?.lat ?? null;
//   const lng = addr.location?.lng ?? null;
//   if (
//     typeof lat === "number" &&
//     typeof lng === "number" &&
//     !Number.isNaN(lat) &&
//     !Number.isNaN(lng)
//   ) {
//     return `${lat},${lng}`;
//   }

//   const fa = addr.formattedAddress?.trim();
//   return fa && fa.length > 0 ? fa : null;
// };

export const toDistanceRef = (addr?: AddressInput | null): string | null => {
  if (!addr) return null;

  const fa = addr.formattedAddress?.trim();
  return fa && fa.length > 0 ? fa : null;
};

export const segmentsEqual = (a: SegmentDistance[], b: SegmentDistance[]) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    const x = a[i];
    const y = b[i];

    const round2 = (num: number | null) =>
      num === null ? null : Math.round(num * 100) / 100;

    if (
      x.label !== y.label ||
      round2(x.distance) !== round2(y.distance) ||
      round2(x.duration) !== round2(y.duration)
    ) {
      return false;
    }
  }
  return true;
};

export const buildOrderedRefs = (
  originRef: string | null,
  distanceRefs: string[]
): string[] => {
  if (!originRef) return [];
  const middles = distanceRefs.filter(Boolean);
  return [originRef, ...middles, originRef];
};

export const legLabel = (index: number, totalMiddles: number): string => {
  if (index === 0) {
    return "Office → Starting";
  }
  if (index === totalMiddles) {
    return "Ending → Office";
  }
  return `Stop ${index} → Stop ${index + 1}`;
};

export const formatNumber = (
  value: number | null | undefined,
  decimals = 2
): string => {
  if (value == null) return "—";
  return value.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const formatMiles = (miles: number | null | undefined): string => {
  if (miles == null) {
    return "—";
  }
  return `${formatNumber(miles)} miles`;
};

export const minutesFromHours = (
  hours: number | null | undefined
): number | null => {
  if (hours == null) return null;
  return Math.round(hours * 60);
};

export const formatDurationFromMinutes = (
  minutes: number | null | undefined
): string => {
  if (minutes == null) return "—";
  const m = Math.max(0, Math.round(minutes));
  const h = Math.floor(m / 60);
  const r = m % 60;
  if (h === 0) return `${m.toLocaleString()} min${m === 1 ? "" : "s"}`;
  if (r === 0) return `${h.toLocaleString()} hr${h === 1 ? "" : "s"}`;
  return `${h.toLocaleString()} hr${h === 1 ? "" : "s"} ${r.toLocaleString()} min${r === 1 ? "" : "s"}`;
};

export const formatMilesAndTime = (
  miles: number | null | undefined,
  hours: number | null | undefined
): string => {
  const milesPart = formatMiles(miles);
  const mins = minutesFromHours(hours);
  const timePart = mins == null ? null : formatDurationFromMinutes(mins);
  return timePart ? `${milesPart} (${timePart})` : milesPart;
};

export const sumSegments = (
  segments: {
    distance: number | null | undefined;
    duration: number | null | undefined;
  }[]
): { totalMiles: number | null; totalMinutes: number | null } => {
  let miles = 0;
  let mins = 0;
  let anyMiles = false;
  let anyTime = false;

  for (const s of segments) {
    if (s.distance != null) {
      miles += s.distance;
      anyMiles = true;
    }
    if (s.duration != null) {
      mins += s.duration;
      anyTime = true;
    }
  }

  return {
    totalMiles: anyMiles ? miles : null,
    totalMinutes: anyTime ? mins : null,
  };
};

export const toHHmmInZone = (
  milliseconds: number | null | undefined,
  timeZone: string,
  fallback = ""
): string => {
  if (milliseconds == null || !Number.isFinite(milliseconds)) {
    return fallback;
  }
  const dateTime = DateTime.fromMillis(milliseconds, { zone: timeZone });
  return dateTime.isValid ? dateTime.toFormat("HH:mm") : fallback;
};

export const withHHmmInZone = (
  baseMilliseconds: number,
  timeString: string,
  timeZone: string
): number => {
  const [hours, minutes] = timeString.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return baseMilliseconds;
  }

  const adjustedDateTime = DateTime.fromMillis(baseMilliseconds, {
    zone: timeZone,
  }).set({
    hour: hours,
    minute: minutes,
    second: 0,
    millisecond: 0,
  });

  return adjustedDateTime.toMillis();
};

export const formatDateTimeLocal = (val: string) => {
  if (!val || !val.includes("T")) {
    return "";
  }
  const [datePart, timePart] = val.split("T");
  if (!datePart || !timePart) {
    return "";
  }
  return `${formatDateToLong(datePart)} ${formatTime(timePart)}`;
};

export const toLocalDT = (ms: number, zone: string) =>
  DateTime.fromMillis(ms, { zone }).toFormat("yyyy-LL-dd'T'HH:mm");

export const fromLocalDT = (val: string, zone: string) =>
  DateTime.fromISO(val, { zone }).toMillis();

export const normalizeBreakMinutes = (
  actualBreakTime?: number | null
): number => {
  if (actualBreakTime == null || Number.isNaN(actualBreakTime)) {
    return 0;
  }

  return actualBreakTime <= 10
    ? Math.round(actualBreakTime * 60)
    : Math.round(actualBreakTime);
};

export const getWeekDates = (currentDate: Date, timeZone: string) => {
  const startOfWeek = DateTime.fromJSDate(currentDate)
    .setZone(timeZone)
    .startOf("week");

  return Array.from({ length: 7 }, (_, i) =>
    startOfWeek.plus({ days: i }).toJSDate()
  );
};

export const getMonthGrid = (viewDate: Date, timeZone: string) => {
  const month = DateTime.fromJSDate(viewDate).setZone(timeZone).month;
  const start = DateTime.fromJSDate(viewDate)
    .setZone(timeZone)
    .startOf("month")
    .startOf("week");

  const allDates = Array.from({ length: 42 }, (_, i) =>
    start.plus({ days: i }).toJSDate()
  );

  const weeks = Array.from({ length: 6 }, (_, i) =>
    allDates.slice(i * 7, i * 7 + 7)
  );

  const trimmedWeeks = weeks.filter((week) =>
    week.some(
      (date) => DateTime.fromJSDate(date).setZone(timeZone).month === month
    )
  );

  return trimmedWeeks.flat();
};

export function getWeekdays(selectedDate: Date, timeZone: string): Date[] {
  const dateTime = DateTime.fromJSDate(selectedDate).setZone(timeZone);

  const sunday = dateTime.minus({ days: dateTime.weekday % 7 });

  return Array.from({ length: 7 }, (_, i) =>
    sunday.plus({ days: i }).toJSDate()
  );
}

export const shouldDimDateForMonth = (
  day: Date,
  reference: Date,
  timeZone: string
): boolean => {
  const dayDT = DateTime.fromJSDate(day).setZone(timeZone);
  const refDT = DateTime.fromJSDate(reference).setZone(timeZone);

  return dayDT.month !== refDT.month || dayDT.year !== refDT.year;
};

export function formatLongDateInZone(
  value: number | string | Date,
  timeZone: string
): string {
  const dateTime =
    typeof value === "number"
      ? DateTime.fromMillis(value, { zone: timeZone })
      : typeof value === "string"
        ? DateTime.fromISO(value, { zone: timeZone })
        : DateTime.fromJSDate(value, { zone: timeZone });

  return dateTime.isValid ? dateTime.toFormat("MMM d, yyyy") : "Missing Date";
}

export function formatWeekRange(
  value: number | string | Date,
  timeZone: string
): string {
  const dateTime =
    typeof value === "number"
      ? DateTime.fromMillis(value, { zone: timeZone })
      : typeof value === "string"
        ? DateTime.fromISO(value, { zone: timeZone })
        : DateTime.fromJSDate(value, { zone: timeZone });

  if (!dateTime.isValid) {
    return "Missing Date";
  }

  const weekStart = dateTime
    .minus({ days: dateTime.weekday % 7 })
    .startOf("day");
  const weekEnd = weekStart.plus({ days: 6 }).endOf("day");

  return `${weekStart.toFormat("MMM d, yyyy")} - ${weekEnd.toFormat("MMM d,  yyyy")}`;
}

export const getMajorityMonth = (weekDates: Date[], timeZone: string): Date => {
  const monthCount: Record<number, number> = {};
  for (const date of weekDates) {
    const month = DateTime.fromJSDate(date).setZone(timeZone).month;
    monthCount[month] = (monthCount[month] || 0) + 1;
  }

  const sortedMonths = Object.entries(monthCount).sort((a, b) => b[1] - a[1]);
  const majorityMonth = Number(sortedMonths[0][0]);
  const majorityDate = weekDates.find(
    (date) =>
      DateTime.fromJSDate(date).setZone(timeZone).month === majorityMonth
  );
  return majorityDate ?? weekDates[0];
};

type MoveForCost = Parameters<typeof getMoveCostRange>[0];

export type CalendarMove = MoveForCost & {
  moveDate?: string | null;
  moveStatus: string;
  moveWindow: string;
  estimatedWage?: WageRange;
};

export function toISODateInZone(date: Date, timeZone: string): string {
  return DateTime.fromJSDate(date).setZone(timeZone).toISODate() ?? "";
}

export function movesOnISODate(
  moves: EnrichedMove[],
  isoDate: string,
  timeZone: string
): EnrichedMove[] {
  return moves.filter((move) => {
    const moveDate = DateTime.fromISO(move.moveDate ?? "")
      .setZone(timeZone)
      .toISODate();
    return moveDate === isoDate;
  });
}

export function computeMoveStatusesForDay(
  movesOnDate: EnrichedMove[],
  isMoverUser: boolean
): string[] {
  return movesOnDate.map((move) => {
    const moverDisplay =
      move.moveStatus === "Completed"
        ? move.moveStatus
        : (move.moveWindow ?? "No window");

    const statusOrWindow: MoveStatus | MoveTimes | undefined = isMoverUser
      ? (moverDisplay as MoveStatus | MoveTimes)
      : move.moveStatus;

    return getStatusColor(statusOrWindow as MoveStatus | MoveTimes);
  });
}
export function computeDailyTotal(
  movesOnDate: EnrichedMove[],
  isMoverUser: boolean,
  selectedStatuses: MoveStatus[]
): number {
  if (isMoverUser) {
    const includesCompleted = selectedStatuses?.includes(
      "Completed" as MoveStatus
    );
    if (includesCompleted) {
      return movesOnDate.reduce((total, move) => {
        const wage = move.moverWageForMove;
        const payout = wage?.approvedPayout ?? wage?.pendingPayout ?? 0;
        return total + (Number.isFinite(payout) ? payout : 0);
      }, 0);
    }
    return movesOnDate.reduce((total, move) => {
      const estimated = move.moverWageForMove?.estimatedMin ?? 0;
      return total + (Number.isFinite(estimated) ? estimated : 0);
    }, 0);
  }
  return movesOnDate.reduce((total, move) => {
    const [low] = getMoveCostRange(move);
    return total + (low || 0);
  }, 0);
}

export const formatHourStatus = (status?: HourStatus): string => {
  if (!status) {
    return "Incomplete";
  }

  switch (status) {
    case "incomplete":
      return "Incomplete";
    case "pending":
      return "Pending";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return "Incomplete";
  }
};

export const statusColorMap = {
  pending: "text-yellow-400",
  rejected: "text-red-400",
  approved: "text-green-400",
} as const;

export const formatTwoDecimals = (
  value: number | null | undefined,
  suffix?: string
): string => {
  if (value == null || isNaN(value)) {
    return "—";
  }
  return `${value.toFixed(2)}${suffix ? ` ${suffix}` : ""}`;
};

export function roundToTwoDecimals(num: number): number {
  return Math.round(num * 100) / 100;
}

export function formatHours(ms: number): string {
  return `${formatToTwoDecimals(ms)} hours`;
}

export function formatHoursAbbreviated(ms: number): string {
  return `${ms} hrs`;
}

export const getMoveStatusFromBody = (body: string): MoveStatus | undefined => {
  const regex = /\*\*(.*?)\*\*/;
  const match = body.match(regex);

  if (match && match[1]) {
    const extractedStatus = match[1].trim() as MoveStatus;

    const validStatuses: MoveStatus[] = [
      "New Lead",
      "Quoted",
      "Booked",
      "Lost",
      "Cancelled",
      "Completed",
    ];

    if (validStatuses.includes(extractedStatus)) {
      return extractedStatus;
    }
  }

  return undefined;
};

export function findUnacknowledgedResolvedChangeRequest(
  changeRequests: Doc<"moveChangeRequests">[]
): Doc<"moveChangeRequests"> | undefined {
  return changeRequests.find((req) => {
    const isResolved = req.status === "approved" || req.status === "rejected";
    const notAcknowledged = req.customerAcknowledgedAt == null;

    return isResolved && notAcknowledged;
  });
}

export function hasPendingChangeRequest(
  changeRequests: Doc<"moveChangeRequests">[]
): boolean {
  return changeRequests.some((req) => req.status === "pending");
}
