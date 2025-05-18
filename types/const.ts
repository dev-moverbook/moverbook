import { TravelChargingTypes } from "./enums";

export const DEFAULT_WEEKDAY_HOUR_MINIMUM = 2;
export const DEFAULT_WEEKEND_HOUR_MINIMUM = 2;
export const DEFAULT_DEPOSIT = 100.0;
export const DEFAULT_CANCELLATION_FEE = 0;
export const DEFAULT_CANCELLATION_CUTOFF_HOUR = 0;
export const DEFAULT_ADDITIONAL_TERMS_AND_CONDITIONS = "";

export const DEFAULT_PRICING_NAME = "Standard";
export const DEFAULT_TWO_MOVERS_RATE = 169;
export const DEFAULT_THREE_MOVERS_RATE = 229;
export const DEFAULT_FOUR_MOVERS_RATE = 299;
export const DEFAULT_EXTRA_RATE = 65;

export const DEFAULT_INSURANCE_NAME = "Standard";
export const DEFAULT_PREMIUM = 0;
export const DEFAULT_COVERAGE_TYPE = 0.6;
export const DEFAULT_COVERAGE_AMOUNT = 0;
export const DEFAULT_IS_ACTIVE = true;
export const DEFAULT_IS_DEFAULT = true;

export const DEFAULT_CREDIT_CARD_FEE_RATE = 3;

export const DEFAULT_TRAVEL_CHARGING_METHOD = TravelChargingTypes.FLAT;
export const DEFAULT_TRAVEL_RATE = 159;

export const STRIPE_API_VERSION = "2025-02-24.acacia";

export const DEFAULT_ROOMS = [
  "Bedroom #1",
  "Bedroom #2",
  "Bedroom #3",
  "Bedroom #4",
  "Living Room",
  "Office",
  "Kitchen",
  "Patio",
  "Garage",
  "Basement",
  "Shed",
  "Family Room",
  "Dinning Room",
  "Den",
];

export const TIMEZONE_OPTIONS = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Phoenix",
  "America/Anchorage",
  "Pacific/Honolulu",
  "UTC",
];
