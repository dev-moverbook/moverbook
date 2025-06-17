import { Id } from "@/convex/_generated/dataModel";
import { TravelChargingTypes } from "./enums";
import {
  AccessType,
  LocationType,
  MoveSize,
  MoveStatus,
  MoveTimes,
  MoveType,
  ServiceType,
  StopBehavior,
} from "./types";
import { ArrivalTimes } from "./convex-schemas";

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
  additionalTermsAndConditions?: string;
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
  price: number;
}

export interface FeeLineItemFormData {
  name: string;
  price: number;
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
  size: number | null;
  isPopular: boolean;
  weight: number | null;
}

export interface AddItemFormData {
  name: string;
  size: number | null;
  weight: number | null;
}

export interface MoveFeeInput {
  name: string;
  price: number;
  quantity: number;
}

export interface AddMoveLineItemInput {
  name: string;
  price: number | null;
  quantity: number;
}

export interface MoveItemInput {
  item: string;
  room: string;
  quantity: number;
  weight: number;
  size: number;
}

export interface FormMoveItemInput {
  item: string;
  room: string;
  quantity: number;
  weight: number | null;
  size: number | null;
}

export interface LocationInput {
  uid: string;
  locationType: LocationType;
  address: string | null;
  moveType: MoveType | null;
  aptNumber: string | null;
  aptName: string | null;
  squareFootage: number | null;
  accessType: AccessType | null;
  moveSize: MoveSize | null;
  stopBehavior?: StopBehavior[];
}

export interface InsurancePolicyInput {
  name: string;
  coverageAmount: number;
  coverageType: number;
  premium: number;
}

export interface InfoFormData {
  name: string;
  email: string | null;
  phoneNumber: string | null;
  altPhoneNumber: string | null;
  referral: string | null;
}

export interface MoveTypeFormData {
  moveDate: string | null;
  serviceType: ServiceType | null;
  moveWindow: MoveTimes;
  arrivalTimes: {
    arrivalWindowStarts: string | null;
    arrivalWindowEnds: string | null;
  };
}

export interface InternalNotesFormData {
  notes: string | null;
  status: MoveStatus;
  salesRep: Id<"users">;
}

export interface DepositFormData {
  deposit: number | null;
}
