import { Id } from "@/convex/_generated/dataModel";
import {
  CategorySize,
  ClerkRoles,
  CommunicationType,
  InvitationStatus,
  PresSetScripts,
  StripeAccountStatus,
  SubscriptionStatus,
  TravelChargingTypes,
} from "./enums";
import {
  AccessType,
  HourStatus,
  JobType,
  LocationType,
  MoveSize,
  MoveStatus,
  MoveTimes,
  MoveType,
  PaymentMethod,
  QuoteStatus,
  SegmentDistance,
  ServiceType,
  StopBehavior,
} from "./types";
import { MoveFeeInput } from "./form-types";

export interface CompanySchema {
  _id: Id<"companies">;
  _creationTime: number;
  clerkOrganizationId: string;
  customerId: Id<"customers">;
  imageUrl: string | null;
  isActive: boolean;
  name: string;
  slug: string;
  timeZone: string;
}

export interface CustomerSchema {
  _id: Id<"customers">;
  _creationTime: number;
  email: string;
  isActive: boolean;
  name?: string;
  paymentMethodId?: string;
  stripeCustomerId?: string;
  subscriptionStatus?: SubscriptionStatus;
}

export interface UserSchema {
  _id: Id<"users">;
  _creationTime: number;
  clerkUserId: string;
  companyId?: Id<"companies"> | null;
  customerId?: Id<"customers"> | null;
  email: string;
  hourlyRate?: number | null;
  imageUrl: string | null;
  name: string;
  role?: ClerkRoles;
  isActive: boolean;
}

export interface InvitationSchema {
  _id: Id<"invitations">;
  _creationTime: number;
  clerkInvitationId: string;
  status: InvitationStatus;
  clerkOrganizationId: string;
  role: ClerkRoles;
  email: string;
  hourlyRate?: number | null;
}

export interface ReferralSchema {
  _id: Id<"referrals">;
  _creationTime: number;
  name: string;
  companyId: Id<"companies">;
  isActive: boolean;
}

export interface VariableSchema {
  _id: Id<"variables">;
  _creationTime: number;
  companyId: Id<"companies">;
  name: string;
  defaultValue: string;
}

export interface ScriptSchema {
  _id: Id<"scripts">;
  _creationTime: number;
  companyId: Id<"companies">;
  title: string;
  type: CommunicationType;
  message: string;
  preSetTypes?: PresSetScripts;
  isActive: boolean;
  emailTitle?: string;
}

export interface ComplianceSchema {
  _id: Id<"compliance">;
  _creationTime: number;
  companyId: Id<"companies">;
  statePucPermitNumber: string;
  dmvNumber: string;
  usDotNumber: string;
}

export interface WebIntegrationsSchema {
  _id: Id<"webIntegrations">;
  _creationTime: number;
  companyId: Id<"companies">;
  webform: string;
  webformEmbeddedCode: string;
}

export interface CompanyContactSchema {
  _id: Id<"companyContact">;
  _creationTime: number;
  companyId: Id<"companies">;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
  sendgridSenderId?: string;
  sendgridVerified?: boolean;
  sendgridName?: string;
}

export interface ArrivalWindowSchema {
  _id: Id<"arrivalWindow">;
  _creationTime: number;
  afternoonArrival: string;
  afternoonEnd: string;
  companyId: Id<"companies">;
  morningArrival: string;
  morningEnd: string;
}

export interface PolicySchema {
  _id: Id<"policies">;
  _creationTime: number;
  additionalTermsAndConditions?: string;
  cancellationCutoffHour: number;
  cancellationFee: number;
  companyId: Id<"companies">;
  deposit: number;
  weekdayHourMinimum: number;
  weekendHourMinimum: number;
}

export interface LaborSchema {
  _id: Id<"labor">;
  _creationTime: number;
  companyId: Id<"companies">;
  endDate: number | null;
  extra: number;
  fourMovers: number;
  isActive: boolean;
  isDefault: boolean;
  name: string;
  startDate: number | null;
  threeMovers: number;
  twoMovers: number;
}

export interface InsurancePolicySchema {
  _id: Id<"insurancePolicies">;
  _creationTime: number;
  companyId: Id<"companies">;
  coverageAmount: number;
  coverageType: number;
  isActive: boolean;
  isDefault: boolean;
  name: string;
  premium: number;
}

export interface CreditCardFeeSchema {
  _id: Id<"creditCardFees">;
  _creationTime: number;
  companyId: Id<"companies">;
  rate: number;
}

export interface FeeSchema {
  _id: Id<"fees">;
  _creationTime: number;
  companyId: Id<"companies">;
  isActive: boolean;
  name: string;
  price: number;
}

export interface TravelFeeSchema {
  _id: Id<"travelFee">;
  _creationTime: number;
  chargingMethod: TravelChargingTypes;
  companyId: Id<"companies">;
  isDefault: boolean;
  rate?: number;
}

export interface RoomSchema {
  _id: Id<"rooms">;
  _creationTime: number;
  companyId: Id<"companies">;
  isActive: boolean;
  isStarter: boolean;
  name: string;
}

export interface CategorySchema {
  _id: Id<"categories">;
  _creationTime: number;
  companyId: Id<"companies">;
  name: string;
  parentCategory?: Id<"categories">;
  isActive: boolean;
  isStarter: boolean;
}

export interface ItemSchema {
  _id: Id<"items">;
  _creationTime: number;
  categoryId?: Id<"categories">;
  companyId: Id<"companies">;
  isActive: boolean;
  isStarter: boolean;
  name: string;
  size: number | null;
  isPopular?: boolean;
  weight: number | null;
}

export interface ConnectedAccountSchema {
  _id: Id<"connectedAccounts">;
  customerId: Id<"customers">;
  status: StripeAccountStatus;
  chargesEnabled?: boolean;
  payoutsEnabled?: boolean;
  lastStripeUpdate?: number;
  stripeAccountId: string;
  _creationTime: number;
}

export interface MoveSchema {
  _id: Id<"move">;
  _creationTime: number;
  altPhoneNumber: string | null;
  arrivalTimes: ArrivalTimes;
  companyId: Id<"companies">;
  deposit: number | null;
  destinationToOrigin: number | null;
  email: string | null;
  endingMoveTime: number | null;
  jobType: JobType;
  jobTypeRate: number | null;
  liabilityCoverage: InsurancePolicySchema | null;
  locations: MoveLocation[];
  moveDate: string | null;
  moveFees: MoveFeeInput[];
  moveItems: MoveItem[];
  salesRep: Id<"users">;
  moveWindow: MoveTimes;
  movers: number;
  name: string;
  notes: string | null;
  officeToOrigin: number | null;
  phoneNumber: string | null;
  referral: string | null;
  roundTripDrive: number | null;
  roundTripMiles: number | null;
  serviceType: ServiceType | null;
  startingMoveTime: number | null;
  status: MoveStatus;
  totalMiles: number | null;
  trucks: number;
  segmentDistances: SegmentDistance[];
  depositMethod: PaymentMethod;
}

export interface MoveItem {
  quantity: number;
  item: string;
  room: string;
  weight: number;
  size: number;
}

export interface MoveFee {
  name: string;
  price: number;
}

export interface MoveLocation {
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

export interface MoveInsurancePolicy {
  name: string;
  coverageType: number;
  coverageAmount: number;
  premium: number;
}

export interface ArrivalTimes {
  arrivalWindowStarts: string | null;
  arrivalWindowEnds: string | null;
}

export interface QuoteSchema {
  _id: Id<"quotes">;
  _creationTime: number;
  moveId: Id<"move">;
  status: QuoteStatus;
  customerSignature?: string;
  customerSignedAt?: number;
  repSignature?: string;
  repSignedAt?: number;
}

export interface MoveAssignmentSchema {
  _id: Id<"moveAssignments">;
  _creationTime: number;
  moveId: Id<"move">;
  moverId: Id<"users">;
  isLead: boolean;
  startTime?: number;
  endTime?: number;
  breakAmount?: number;
  hourStatus?: HourStatus;
  managerNotes?: string;
}

export interface PreMoveDocSchema {
  _id: Id<"preMoveDocs">;
  _creationTime: number;
  moveId: Id<"move">;
  customerSignature?: string;
  customerSignedAt?: number;
  repSignature?: string;
  repSignedAt?: number;
}
