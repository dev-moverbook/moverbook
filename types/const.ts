import { TravelChargingTypes } from "./enums";

export const DEFAULT_WEEKDAY_HOUR_MINIMUM = 2;
export const DEFAULT_WEEKEND_HOUR_MINIMUM = 2;
export const DEFAULT_DEPOSIT = 100.0;
export const DEFAULT_CANCELLATION_FEE = 0;
export const DEFAULT_CANCELLATION_CUTOFF_HOUR = 0;
export const DEFAULT_BILL_OF_LADING_DISCLAIMER_AND_TERMS =
  "By signing this Bill of Lading, the customer agrees to the terms and conditions set forth by the company. The company is not liable for damages resulting from improper packing by the customer, unforeseen delays, or circumstances beyond its control. Cancellations may be subject to additional fees as outlined in company policies. Payment in full is required upon completion of services.";

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
