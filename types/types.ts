import { Id } from "@/convex/_generated/dataModel";

export interface SelectOption {
  label: string;
  value: string;
}

export type ServiceType = "moving" | "packing" | "labor";

export const SERVICE_TYPE_OPTIONS: { label: string; value: ServiceType }[] = [
  { label: "Moving", value: "moving" },
  { label: "Packing", value: "packing" },
  { label: "Labor Only", value: "labor" },
];

export type StartWindowOption = "available" | "custom";

export const START_WINDOW_OPTIONS: {
  label: string;
  value: StartWindowOption;
}[] = [
  { label: "Available Start Windows", value: "available" },
  { label: "Custom Start Window", value: "custom" },
];

export type MoveType =
  | "apartment"
  | "house"
  | "office"
  | "storage unit"
  | "speciality item";

export const MOVE_TYPE_OPTIONS: { label: string; value: MoveType }[] = [
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
  | "5_bedroom";

export const MOVE_SIZE_OPTIONS: { label: string; value: MoveSize }[] = [
  { label: "Studio", value: "studio" },
  { label: "1 Bedroom", value: "1_bedroom" },
  { label: "2 Bedroom", value: "2_bedroom" },
  { label: "3 Bedroom", value: "3_bedroom" },
  { label: "4 Bedroom", value: "4_bedroom" },
  { label: "5 Bedroom", value: "5_bedroom" },
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

export type MoveTimes = "morning" | "afternoon" | "custom";

export type LocationType = "starting" | "ending" | "stop";

export type StopBehavior = "drop_off" | "pick_up";

export interface SegmentDistance {
  label: string;
  distance: number | null;
  duration: number | null;
}

export type QuoteStatus = "pending" | "completed" | "customer_change";

export const PAYMENT_METHOD_OPTIONS: {
  label: string;
  value: PaymentMethod;
}[] = [
  { label: "Credit Card", value: "credit_card" },
  { label: "Check", value: "check" },
  { label: "Cash", value: "cash" },
];

export type PaymentMethod = "credit_card" | "check" | "cash";

export const QUOTE_STATUS_LABELS: Record<QuoteStatus, string> = {
  pending: "Pending",
  completed: "Completed",
  customer_change: "Customer Requested Changes",
};

export type HourStatus = "pending" | "approved" | "rejected";

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
  timestamp: number; // _creationTime
  status: MoveStatus; // from your MoveStatusConvex union
}

export type CommunicationType = "email" | "sms";

export type MessageSentType = "outgoing" | "incoming";
export type MessageVariablesTarget = "subject" | "body";
