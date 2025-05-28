import { Id } from "@/convex/_generated/dataModel";
import { CategorySize, TravelChargingTypes } from "./enums";

export interface ComplianceFormData {
  statePucPermitNumber: string;
  dmvNumber: string;
  usDotNumber: string;
}

export interface WebIntegrationsFormData {
  webform?: string;
  webformEmbeddedCode?: string;
}

export interface CompanyContactFormData {
  email?: string;
  phoneNumber?: string;
  address?: string;
  website?: string;
}

export interface UpdateCompanyData {
  name?: string;
  timeZone?: string;
}

export interface TravelFeeData {
  isDefault?: boolean;
  chargingMethod?: TravelChargingTypes;
  rate?: number;
}

export interface ArrivalWindowFormData {
  morningArrival: string;
  morningEnd: string;
  afternoonArrival: string;
  afternoonEnd: string;
}

export interface PolicyFormData {
  weekdayHourMinimum: number;
  weekendHourMinimum: number;
  deposit: number;
  cancellationFee: number;
  cancellationCutoffHour: number;
  additionalTermsAndConditions: string;
}

export interface CreateLaborFormData {
  name: string;
  isDefault?: boolean;
  startDate: number | null;
  endDate: number | null;
  twoMovers: number;
  threeMovers: number;
  fourMovers: number;
  extra: number;
}

export interface InsurancePolicyFormData {
  name: string;
  coverageAmount: number;
  coverageType: number;
  premium: number;
  isDefault: boolean;
}

export interface FeeFormData {
  name: string;
  price: number | null;
}

export interface FeeLineItemFormData {
  name: string;
  price: number | null;
  quantity: number;
}

export interface CreateFeeData {
  name: string;
  price: number;
}

export interface TravelFeeFormData {
  isDefault: boolean;
  chargingMethod: TravelChargingTypes;
  rate?: number;
}
export interface RoomFormData {
  name: string;
}

export interface CategoryFormData {
  name: string;
  parentCategory?: Id<"categories">;
}

export interface ItemFormData {
  name: string;
  size: number | CategorySize;
  isPopular: boolean;
  weight: number;
}
