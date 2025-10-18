import { Doc, Id } from "@/convex/_generated/dataModel";
import { ResponseStatus, StripeAccountStatus } from "./enums";
import { ErrorMessages } from "./errors";
import { HourStatus, MoverWageForMove } from "./types";

export interface ErrorResponse {
  status: ResponseStatus.ERROR;
  data: null;
  error: ErrorMessages | string;
}

export interface CreateCustomerWithSubscriptionData {
  customerId: Id<"customers">;
  status: "Created" | "Reactivated";
}

export interface GetCompanyIdBySlugResponse {
  companyId: Id<"companies">;
  connectedAccountId: string | null;
  connectedAccountStatus: StripeAccountStatus | null;
  timeZone: string;
  isCompanyContactComplete: boolean;
  isStripeComplete: boolean;
  user: Doc<"users">;
}

export interface GetCompanyDetailsData {
  company: Doc<"companies">;
  compliance: Doc<"compliance">;
  webIntegrations: Doc<"webIntegrations">;
  companyContact: Doc<"companyContact">;
}

export interface GetCompanyArrivalAndPoliciesData {
  arrivalWindow: Doc<"arrivalWindow">;
  policy: Doc<"policies">;
}

export type GetActiveRoomsResponse = GetActiveRoomsSuccess | ErrorResponse;

export interface GetActiveRoomsSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveRoomsData;
}

export interface GetActiveRoomsData {
  rooms: Doc<"rooms">[];
}

export type GetItemsByCategoryResponse =
  | GetItemsByCategorySuccess
  | ErrorResponse;

export interface GetItemsByCategorySuccess {
  status: ResponseStatus.SUCCESS;
  data: GetItemsByCategoryData;
}

export interface GetItemsByCategoryData {
  items: Doc<"items">[];
}

export interface GetCompanyRatesData {
  labor: Doc<"labor">[];
  insurancePolicies: Doc<"insurancePolicies">[];
  travelFee: Doc<"travelFee">;
  creditCardFee: Doc<"creditCardFees">;
  fees: Doc<"fees">[];
}

export interface GetStripeDashboardLinkData {
  url: string;
}

export interface WebhookHandlerResponse {
  success: boolean;
  error?: string;
}

export type CreateSenderResponse = CreateSenderSuccess | ErrorResponse;

export interface CreateSenderSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateSenderData;
}

export interface CreateSenderData {
  sendgridSenderId: string;
}

export type CheckSenderResponse = CheckSenderSuccess | ErrorResponse;

export interface CheckSenderSuccess {
  status: ResponseStatus.SUCCESS;
  data: CheckSenderData;
}

export interface CheckSenderData {
  isVerified: boolean;
}

export interface GetItemsAndCategoriesAndRoomsByCompanyData {
  items: Doc<"items">[];
  categories: Doc<"categories">[];
  rooms: Doc<"rooms">[];
}

export interface GetMoveOptionsData {
  arrivalWindow: Doc<"arrivalWindow">;
  labor: Doc<"labor">[];
  travelFee: Doc<"travelFee">;
  insurancePolicies: Doc<"insurancePolicies">[];
  fees: Doc<"fees">[];
  salesReps: Doc<"users">[];
  referrals: Doc<"referrals">[];
  laborRates: Doc<"labor">[];
  creditCardFee: Doc<"creditCardFees">;
  rooms: Doc<"rooms">[];
  categories: Doc<"categories">[];
  items: Doc<"items">[];
  policy: Doc<"policies">;
  companyContact: Doc<"companyContact">;
}

export interface GetMoveData {
  additionalFees: Doc<"additionalFees">[];
  discounts: Doc<"discounts">[];
  move: Doc<"move">;
  quote: Doc<"quotes"> | null;
  company: Doc<"companies">;
  companyContact: Doc<"companyContact">;
  moveCustomer: Doc<"moveCustomers">;
  salesRepUser: Doc<"users"> | null;
  myAssignment: Doc<"moveAssignments"> | null;
  wageDisplay: MoverWageForMove | null;
  travelFee: Doc<"travelFee">;
  policy: Doc<"policies">;
}

export type GetDistanceMatrixResponse =
  | GetDistanceMatrixSuccess
  | ErrorResponse;

export interface GetDistanceMatrixSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetDistanceMatrixData;
}

export interface GetDistanceMatrixData {
  distanceMiles: number;
  durationMinutes: number;
}

export interface GetMoveAssignmentsPageData {
  assignments: Doc<"moveAssignments">[];
  allMovers: Doc<"users">[];
  preMoveDoc: Doc<"preMoveDocs"> | null;
  additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null;
}

export interface GetPaymentPageData {
  additionalFees: Doc<"additionalFees">[];
  discounts: Doc<"discounts">[];
  invoice: Doc<"invoices"> | null;
  internalReview: Doc<"internalReview"> | null;
  fees: Doc<"fees">[];
}

export interface EnrichedMove extends Doc<"move"> {
  moveCustomer: Doc<"moveCustomers"> | null;
  salesRepUser: Doc<"users"> | null;
  moverWageForMove?: MoverWageForMove;
  hourStatus?: HourStatus;
}

export type CreateMessageResponse = CreateMessageSuccess | ErrorResponse;

export interface CreateMessageSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateMessageData;
}

export interface CreateMessageData {
  messageId: Id<"messages">;
}

export interface GetCustomerAndMovesData {
  moveCustomer: Doc<"moveCustomers">;
  moves: EnrichedMoveForMover[] | Doc<"move">[];
}

export interface GetMovePageForMoverLeadData {
  isLead: true;
  assignment: Doc<"moveAssignments">;
  preMoveDoc: Doc<"preMoveDocs"> | null;
  discounts: Doc<"discounts">[];
  additionalFees: Doc<"additionalFees">[];
  invoice: Doc<"invoices"> | null;
  additionalLiabilityCoverage: Doc<"additionalLiabilityCoverage"> | null;
  fees: Doc<"fees">[];
}

export interface GetMovePageForMoverMemberData {
  isLead: false;
  assignment: Doc<"moveAssignments">;
}

export interface EnrichedMoveAssignment extends Doc<"moveAssignments"> {
  moverName: string | null;
  hourlyRate: number | null;
  pendingHours: number | null;
  pendingPayout: number | null;
}

export interface EnrichedMoveForMover extends Doc<"move"> {
  moverWageForMove?: MoverWageForMove;
  hourStatus?: HourStatus;
}

export interface GetSalesRepsAndReferralByCompanyIdData {
  users: Doc<"users">[];
  referrals: Doc<"referrals">[];
}
