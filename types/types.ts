import { Id } from "@/convex/_generated/dataModel";
import { TravelChargingTypes } from "./enums";

export interface SelectOption {
  label: string;
  value: string;
}

export type ServiceType =
  | "moving"
  | "packing"
  | "load_only"
  | "unload_only"
  | "moving_and_packing"
  | "commercial";

export const SERVICE_TYPE_OPTIONS: { label: string; value: ServiceType }[] = [
  { label: "Moving", value: "moving" },
  { label: "Packing", value: "packing" },
  { label: "Load Only", value: "load_only" },
  { label: "Unload Only", value: "unload_only" },
  { label: "Moving and Packing", value: "moving_and_packing" },
  { label: "Commercial", value: "commercial" },
];

export type StartWindowOption = "available" | "custom";

export const START_WINDOW_OPTIONS: {
  label: string;
  value: StartWindowOption;
}[] = [
  { label: "Available Start Windows", value: "available" },
  { label: "Custom Start Window", value: "custom" },
];

export type LocationType =
  | "apartment"
  | "house"
  | "office"
  | "storage unit"
  | "speciality item";

export const LOCATION_TYPE_OPTIONS: { label: string; value: LocationType }[] = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Office", value: "office" },
  { label: "Storage Unit", value: "storage unit" },
  { label: "Speciality Item", value: "speciality item" },
];

export type AccessType =
  | "ground"
  | "one_flight"
  | "two_flights"
  | "three_or_more_flights"
  | "elevator";

export const ACCESS_TYPE_OPTIONS: { label: string; value: AccessType }[] = [
  { label: "Ground", value: "ground" },
  { label: "One Flight", value: "one_flight" },
  { label: "Two Flights", value: "two_flights" },
  { label: "Three or More Flights", value: "three_or_more_flights" },
  { label: "Elevator", value: "elevator" },
];

export type JobType = "hourly" | "flat";

export const JOB_TYPE_OPTIONS: { label: string; value: JobType }[] = [
  { label: "Hourly", value: "hourly" },
  { label: "Flat Rate", value: "flat" },
];

export type MoveSize =
  | "studio"
  | "1_bedroom"
  | "2_bedroom"
  | "3_bedroom"
  | "4_bedroom"
  | "5_bedroom"
  | "not_applicable";

export const MOVE_SIZE_OPTIONS: { label: string; value: MoveSize }[] = [
  { label: "Studio", value: "studio" },
  { label: "1 Bedroom", value: "1_bedroom" },
  { label: "2 Bedroom", value: "2_bedroom" },
  { label: "3 Bedroom", value: "3_bedroom" },
  { label: "4 Bedroom", value: "4_bedroom" },
  { label: "5 Bedroom", value: "5_bedroom" },
  { label: "Not Applicable", value: "not_applicable" },
];

export type ManageMode = "edit" | "delete";

export type MoveStatus =
  | "New Lead"
  | "Quoted"
  | "Booked"
  | "Lost"
  | "Cancelled"
  | "Completed";

export const MOVE_STATUS_OPTIONS: { label: string; value: MoveStatus }[] = [
  { label: "New Lead", value: "New Lead" },
  { label: "Quoted", value: "Quoted" },
  { label: "Booked", value: "Booked" },
  { label: "Lost", value: "Lost" },
  { label: "Cancelled", value: "Cancelled" },
  { label: "Completed", value: "Completed" },
];

export const MOVER_MOVE_STATUS_OPTIONS: { label: string; value: MoveStatus }[] =
  [{ label: "Completed", value: "Completed" }];

export type TimeDistanceRange =
  | "0-30 sec (less than 100 ft)"
  | "30-50 sec (200 ft)"
  | "50-70 sec (300 ft)"
  | "70-90 sec (400 ft)";

export const TIME_DISTANCE_OPTIONS: {
  label: string;
  value: TimeDistanceRange;
}[] = [
  {
    label: "0-30 sec (less than 100 ft)",
    value: "0-30 sec (less than 100 ft)",
  },
  { label: "30-50 sec (200 ft)", value: "30-50 sec (200 ft)" },
  { label: "50-70 sec (300 ft)", value: "50-70 sec (300 ft)" },
  { label: "70-90 sec (400 ft)", value: "70-90 sec (400 ft)" },
];

export type MoveTimes = "morning" | "afternoon" | "custom";

export const WINDOW_LABEL: Record<MoveTimes, string> = {
  morning: "Morning",
  afternoon: "Afternoon",
  custom: "Custom",
};

export type LocationRole = "starting" | "ending" | "stop";

export type StopBehavior = "drop_off" | "pick_up";

export const STOP_BEHAVIOR_OPTIONS: { label: string; value: StopBehavior }[] = [
  { label: "Pickup", value: "pick_up" },
  { label: "Drop", value: "drop_off" },
];

export interface SegmentDistance {
  label: string;
  distance: number | null;
  duration: number | null;
}

export type QuoteStatus = "pending" | "completed" | "customer_change";

export const TRAVEL_FEE_METHOD_OPTIONS: {
  label: string;
  value: TravelChargingTypes | "None";
}[] = [
  { label: "Mileage Rate", value: TravelChargingTypes.MILEAGE },
  { label: "Flat Rate", value: TravelChargingTypes.FLAT },
  { label: "Labor Rate", value: TravelChargingTypes.LABOR_HOURS },
  { label: "None", value: "None" },
];

// types/types.ts
export type PaymentMethod =
  | { kind: "credit_card" }
  | { kind: "other"; label: string };

export const PAYMENT_METHOD_OPTIONS = [
  { label: "Credit Card", value: "credit_card" },
  { label: "Other", value: "other" },
];

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  customer_change: "Customer Requested Changes",
};

export type HourStatus = "approved" | "incomplete" | "pending" | "rejected";

export interface DisplayRow {
  left: string;
  right: string;
  className?: string;
}

export type CalendarValue = Date | null | [Date | null, Date | null];

export type PriceFilter = "Highest to Lowest" | "Lowest to Highest";

export type PriceOrder = "asc" | "desc";

export type MessageStatus = "pending" | "sent" | "failed";

export interface RecentMoveMessageSummary {
  moveId: Id<"move">;
  customerName: string;
  lastMessage: string;
  timestamp: number;
  status: MoveStatus;
}

export type CommunicationType = "email" | "sms";

export type MessageSentType = "outgoing" | "incoming";
export type MessageVariablesTarget = "subject" | "body";

export type MoverWageForMove = {
  estimatedMin: number | null;
  estimatedMax: number | null;
  pendingPayout: number | null;
  pendingHours: number | null;
  approvedPayout: number | null;
  approvedHours: number | null;
};

export type LaborCalculationResult = {
  totalHours: number;
  totalPay: number;
};

export type CostFormat = {
  label: string;
  value: number;
};

export type FinalMoveCost = {
  items: CostFormat[];
  total: number;
};
