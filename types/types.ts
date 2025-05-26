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

export type MoveType = "apartment" | "house";

export const MOVE_TYPE_OPTIONS: { label: string; value: MoveType }[] = [
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
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
