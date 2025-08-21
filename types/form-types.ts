import { Doc, Id } from "@/convex/_generated/dataModel";
import { TravelChargingTypes } from "./enums";
import {
  AccessType,
  JobType,
  LocationRole,
  LocationType,
  MoveSize,
  MoveStatus,
  MoveTimes,
  PaymentMethod,
  SegmentDistance,
  ServiceType,
  StopBehavior,
  TimeDistanceRange,
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
  externalReviewUrl?: string;
}

export interface CompanyContactFormData {
  email?: string;
  phoneNumber?: string;
  address?: AddressInput;
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
  deposit: number | null;
  cancellationFee: number | null;
  cancellationCutoffHour: number;
  additionalTermsAndConditions?: string;
}

export interface CreateLaborFormData {
  name: string;
  startDate: number | null;
  endDate: number | null;
  twoMovers: number | null;
  threeMovers: number | null;
  fourMovers: number | null;
  extra: number | null;
}

export interface InsurancePolicyFormData {
  name: string;
  coverageAmount: number | null;
  coverageType: number | null;
  premium: number | null;
}

export interface FeeFormData {
  name: string;
  price: number | null;
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
  rate?: number | null;
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
  feeId?: Id<"fees">;
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
  locationRole: LocationRole;
  address: AddressInput | null;
  locationType: LocationType | null;
  aptNumber: string | null;
  aptName: string | null;
  squareFootage: number | null;
  accessType: AccessType | null;
  moveSize: MoveSize | null;
  stopBehavior?: StopBehavior[];
  timeDistanceRange: TimeDistanceRange;
}

export interface AddressInput {
  formattedAddress: string;
  placeId: string | null;
  location: {
    lat: number | null;
    lng: number | null;
  };
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
  moveStatus: MoveStatus;
  salesRep: Id<"users">;
}

export interface DepositFormData {
  deposit: number;
}

export interface MoveTravelFeeFormData {
  travelFeeRate?: number | null;
  travelFeeMethod?: TravelChargingTypes | null;
}

export interface MoveCreditCardFeeFormData {
  creditCardFeeRate: number;
}

export interface MovePaymentTypeFormData {
  paymentMethod: PaymentMethod;
}

export interface CustomerFormData {
  name: string;
  email: string;
  phoneNumber: string;
  altPhoneNumber: string | null;
  referral: string | null;
}

export interface CustomerFormErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  altPhoneNumber?: string;
  referral?: string;
}

export interface MoveFormData {
  arrivalTimes: ArrivalTimes;
  companyId: Id<"companies"> | null;
  creditCardFee: number;
  deposit: number;
  destinationToOrigin: number | null;
  endingMoveTime: number | null;
  liabilityCoverage: Doc<"insurancePolicies"> | null;
  jobType: JobType;
  jobTypeRate: number | null;
  locations: LocationInput[];
  moveCustomerId: Id<"moveCustomers"> | null;
  moveDate: string | null;
  moveFees: MoveFeeInput[];
  moveItems: MoveItemInput[];
  moveStatus: MoveStatus;
  moveWindow: MoveTimes;
  movers: number;
  notes: string | null;
  officeToOrigin: number | null;
  paymentMethod: PaymentMethod;
  roundTripDrive: number | null;
  roundTripMiles: number | null;
  salesRep: Id<"users"> | null;
  serviceType: ServiceType | null;
  segmentDistances: SegmentDistance[];
  startingMoveTime: number | null;
  totalMiles: number | null;
  travelFeeRate?: number | null;
  travelFeeMethod?: TravelChargingTypes | null;
  trucks: number;
}

export interface MoveFormErrors {
  arrivalWindowStarts?: string;
  arrivalWindowEnds?: string;
  companyId?: string;
  deposit?: string;
  depositMethod?: string;
  destinationToOrigin?: string;
  endingMoveTime?: string;
  liabilityCoverage?: string;
  jobType?: string;
  jobTypeRate?: string;
  locations?: string;
  moveCustomerId?: string;
  moveDate?: string;
  moveFees?: string;
  moveItems?: string;
  moveStatus?: string;
  moveWindow?: string;
  movers?: string;
  notes?: string;
  officeToOrigin?: string;
  referralSource?: string;
  roundTripDrive?: string;
  roundTripMiles?: string;
  salesRep?: string;
  segmentDistances?: string;
  serviceType?: string;
  startingMoveTime?: string;
  totalMiles?: string;
  trucks?: string;
}
