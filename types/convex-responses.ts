import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus, StripeAccountStatus } from "./enums";
import { ErrorMessages } from "./errors";
import {
  ArrivalWindowSchema,
  CategorySchema,
  CompanyContactSchema,
  CompanySchema,
  ComplianceSchema,
  ConnectedAccountSchema,
  CreditCardFeeSchema,
  FeeSchema,
  InsurancePolicySchema,
  InvitationSchema,
  ItemSchema,
  LaborSchema,
  MoveAssignmentSchema,
  MoveSchema,
  PolicySchema,
  PreMoveDocSchema,
  QuoteSchema,
  ReferralSchema,
  RoomSchema,
  ScriptSchema,
  TravelFeeSchema,
  UserSchema,
  VariableSchema,
  WebIntegrationsSchema,
} from "./convex-schemas";

export interface ErrorResponse {
  status: ResponseStatus.ERROR;
  data: null;
  error: ErrorMessages | string;
}

export type CreateCustomerWithSubscriptionResponse =
  | CreateCustomerWithSubscriptionSuccess
  | ErrorResponse;

export interface CreateCustomerWithSubscriptionSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateCustomerWithSubscriptionData;
}

export interface CreateCustomerWithSubscriptionData {
  customerId: Id<"customers">;
  status: "Created" | "Reactivated";
}

export type CreateOrganizationResponse =
  | CreateOrganizationSuccess
  | ErrorResponse;

export interface CreateOrganizationSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateOrganizationData;
}

export interface CreateOrganizationData {
  slug: string;
  clerkOrganizationId: string;
}

export type UpdateUserActiveStatusResponse =
  | UpdateUserActiveStatusSuccess
  | ErrorResponse;

export interface UpdateUserActiveStatusSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateUserActiveStatusData;
}

export interface UpdateUserActiveStatusData {
  userId: Id<"users">;
}

export type ClerkInviteUserToOrganizationResponse =
  | ClerkInviteUserToOrganizationSuccess
  | ErrorResponse;

export interface ClerkInviteUserToOrganizationSuccess {
  status: ResponseStatus.SUCCESS;
  data: ClerkInviteUserToOrganizationData;
}

export interface ClerkInviteUserToOrganizationData {
  invitationId: Id<"invitations">;
}

export type GetAllUsersByCompanyIdResponse =
  | GetAllUsersByCompanyIdSuccess
  | ErrorResponse;

export interface GetAllUsersByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetAllUsersByCompanyIdData;
}

export interface GetAllUsersByCompanyIdData {
  users: UserSchema[];
}

export type GetActiveInvitationsByCompanyIdResponse =
  | GetActiveInvitationsByCompanyIdSuccess
  | ErrorResponse;

export interface GetActiveInvitationsByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveInvitationsByCompanyIdData;
}

export interface GetActiveInvitationsByCompanyIdData {
  invitations: InvitationSchema[];
}

export type RevokeInviteUserResponse = RevokeInviteUserSuccess | ErrorResponse;

export interface RevokeInviteUserSuccess {
  status: ResponseStatus.SUCCESS;
  data: RevokeInviteUserData;
}

export interface RevokeInviteUserData {
  invitationId: Id<"invitations">;
}

export type GetUserByIdResponse = GetUserByIdSuccess | ErrorResponse;

export interface GetUserByIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetUserByIdData;
}

export interface GetUserByIdData {
  user: UserSchema;
}

export type GetActiveReferralsByCompanyIdResponse =
  | GetActiveReferralsByCompanyIdSuccess
  | ErrorResponse;

export interface GetActiveReferralsByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveReferralsByCompanyIdData;
}

export interface GetActiveReferralsByCompanyIdData {
  referrals: ReferralSchema[];
}

export type CreateReferralResponse = CreateReferralSuccess | ErrorResponse;

export interface CreateReferralSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateReferralData;
}

export interface CreateReferralData {
  referralId: Id<"referrals">;
}

export type UpdateReferralResponse = UpdateReferralSuccess | ErrorResponse;

export interface UpdateReferralSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateReferralData;
}

export interface UpdateReferralData {
  referralId: Id<"referrals">;
}

export type GetCompanyIdBySlugResponse =
  | GetCompanyIdBySlugSuccess
  | ErrorResponse;

export interface GetCompanyIdBySlugSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCompanyIdBySlugData;
}

export interface GetCompanyIdBySlugData {
  companyId: Id<"companies">;
  connectedAccountId: string | null;
  connectedAccountStatus: StripeAccountStatus | null;
}

export type GetActiveVariablesByCompanyIdResponse =
  | GetActiveVariablesByCompanyIdSuccess
  | ErrorResponse;

export interface GetActiveVariablesByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveVariablesByCompanyIdData;
}

export interface GetActiveVariablesByCompanyIdData {
  variables: VariableSchema[];
}

export type CreateVariableResponse = CreateVariableSuccess | ErrorResponse;

export interface CreateVariableSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateVariableData;
}

export interface CreateVariableData {
  variableId: Id<"variables">;
}

export type UpdateVariableResponse = UpdateVariableSuccess | ErrorResponse;

export interface UpdateVariableSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateVariableData;
}

export interface UpdateVariableData {
  variableId: Id<"variables">;
}

export type GetActiveScriptsByCompanyIdResponse =
  | GetActiveScriptsByCompanyIdSuccess
  | ErrorResponse;

export interface GetActiveScriptsByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveScriptsByCompanyIdData;
}

export interface GetActiveScriptsByCompanyIdData {
  scripts: ScriptSchema[];
}

export type CreateScriptResponse = CreateScriptResponseSuccess | ErrorResponse;

export interface CreateScriptResponseSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateScriptResponseData;
}

export interface CreateScriptResponseData {
  scriptId: Id<"scripts">;
}

export type UpdateScriptResponse = UpdateScriptResponseSuccess | ErrorResponse;

export interface UpdateScriptResponseSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateScriptResponseData;
}

export interface UpdateScriptResponseData {
  scriptId: Id<"scripts">;
}

export type DeleteScriptResponse = DeleteScriptResponseSuccess | ErrorResponse;

export interface DeleteScriptResponseSuccess {
  status: ResponseStatus.SUCCESS;
  data: DeleteScriptResponseData;
}

export interface DeleteScriptResponseData {
  scriptId: Id<"scripts">;
}

export type GetActiveScriptsAndVariablesByCompanyIdResponse =
  | GetActiveScriptsAndVariablesByCompanyIdSuccess
  | ErrorResponse;

export interface GetActiveScriptsAndVariablesByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveScriptsAndVariablesByCompanyIdData;
}

export interface GetActiveScriptsAndVariablesByCompanyIdData {
  scripts: ScriptSchema[];
  variables: VariableSchema[];
}

export type GetCompanyDetailsResponse =
  | GetCompanyDetailsSuccess
  | ErrorResponse;

export interface GetCompanyDetailsSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCompanyDetailsData;
}

export interface GetCompanyDetailsData {
  company: CompanySchema;
  compliance: ComplianceSchema;
  webIntegrations: WebIntegrationsSchema;
  companyContact: CompanyContactSchema;
}

export type UpdateComplianceResponse = UpdateComplianceSuccess | ErrorResponse;

export interface UpdateComplianceSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateComplianceData;
}

export interface UpdateComplianceData {
  complianceId: Id<"compliance">;
}

export type UpdateWebIntegrationsResponse =
  | UpdateWebIntegrationsSuccess
  | ErrorResponse;

export interface UpdateWebIntegrationsSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateWebIntegrationsData;
}

export interface UpdateWebIntegrationsData {
  webIntegrationsId: Id<"webIntegrations">;
}

export type UpdateCompanyContactResponse =
  | UpdateCompanyContactSuccess
  | ErrorResponse;

export interface UpdateCompanyContactSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateCompanyContactData;
}

export interface UpdateCompanyContactData {
  companyContactId: Id<"companyContact">;
}

export type UpdateCompanyResponse = UpdateCompanySuccess | ErrorResponse;

export interface UpdateCompanySuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateCompanyData;
}

export interface UpdateCompanyData {
  companyId: Id<"companies">;
  slug?: string;
}

export type UpdateCompanyLogoResponse =
  | UpdateCompanyLogoSuccess
  | ErrorResponse;

export interface UpdateCompanyLogoSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateCompanyLogoData;
}

export interface UpdateCompanyLogoData {
  companyId: Id<"companies">;
}

export type GetCompanyArrivalAndPoliciesResponse =
  | GetCompanyArrivalAndPoliciesSuccess
  | ErrorResponse;

export interface GetCompanyArrivalAndPoliciesSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCompanyArrivalAndPoliciesData;
}

export interface GetCompanyArrivalAndPoliciesData {
  arrivalWindow: ArrivalWindowSchema;
  policy: PolicySchema;
}

export type UpdateArrivalWindowResponse =
  | UpdateArrivalWindowSuccess
  | ErrorResponse;

export interface UpdateArrivalWindowSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateArrivalWindowData;
}

export interface UpdateArrivalWindowData {
  arrivalWindowId: Id<"arrivalWindow">;
}

export type UpdatePolicyResponse = UpdatePolicySuccess | ErrorResponse;

export interface UpdatePolicySuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdatePolicyData;
}

export interface UpdatePolicyData {
  policyId: Id<"policies">;
}

export type GetPolicyResponse = GetPolicySuccess | ErrorResponse;

export interface GetPolicySuccess {
  status: ResponseStatus.SUCCESS;
  data: GetPolicyData;
}

export interface GetPolicyData {
  policy: PolicySchema;
}

export type CreateLaborResponse = CreateLaborSuccess | ErrorResponse;

export interface CreateLaborSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateLaborData;
}

export interface CreateLaborData {
  laborId: Id<"labor">;
}

export type UpdateLaborResponse = UpdateLaborSuccess | ErrorResponse;

export interface UpdateLaborSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateLaborData;
}

export interface UpdateLaborData {
  laborId: Id<"labor">;
}

export type CreateInsurancePolicyResponse =
  | CreateInsurancePolicySuccess
  | ErrorResponse;

export interface CreateInsurancePolicySuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateInsurancePolicyData;
}

export interface CreateInsurancePolicyData {
  insurancePolicyId: Id<"insurancePolicies">;
}

export type UpdateInsurancePolicyResponse =
  | UpdateInsurancePolicySuccess
  | ErrorResponse;

export interface UpdateInsurancePolicySuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateInsurancePolicyData;
}

export interface UpdateInsurancePolicyData {
  insurancePolicyId: Id<"insurancePolicies">;
}

export type GetInsurancePoliciesResponse =
  | GetInsurancePoliciesSuccess
  | ErrorResponse;

export interface GetInsurancePoliciesSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetInsurancePoliciesData;
}

export interface GetInsurancePoliciesData {
  insurancePolicies: InsurancePolicySchema[];
}

export type UpdateCreditCardFeeResponse =
  | UpdateCreditCardFeeSuccess
  | ErrorResponse;

export interface UpdateCreditCardFeeSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateCreditCardFeeData;
}

export interface UpdateCreditCardFeeData {
  creditCardFeeId: Id<"creditCardFees">;
}

export type CreateFeeResponse = CreateFeeSuccess | ErrorResponse;

export interface CreateFeeSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateFeeData;
}

export interface CreateFeeData {
  feeId: Id<"fees">;
}

export type UpdateFeeResponse = UpdateFeeSuccess | ErrorResponse;

export interface UpdateFeeSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateFeeData;
}

export interface UpdateFeeData {
  feeId: Id<"fees">;
}

export type GetFeesResponse = GetFeesSuccess | ErrorResponse;

export interface GetFeesSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetFeesData;
}

export interface GetFeesData {
  fees: FeeSchema[];
}

export type UpdateTravelFeeResponse = UpdateTravelFeeSuccess | ErrorResponse;

export interface UpdateTravelFeeSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateTravelFeeData;
}

export interface UpdateTravelFeeData {
  travelFeeId: Id<"travelFee">;
}

export type GetActiveRoomsResponse = GetActiveRoomsSuccess | ErrorResponse;

export interface GetActiveRoomsSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveRoomsData;
}

export interface GetActiveRoomsData {
  rooms: RoomSchema[];
}

export type CreateRoomResponse = CreateRoomSuccess | ErrorResponse;

export interface CreateRoomSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateRoomData;
}

export interface CreateRoomData {
  roomId: Id<"rooms">;
}

export type UpdateRoomResponse = UpdateRoomSuccess | ErrorResponse;

export interface UpdateRoomSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateRoomData;
}

export interface UpdateRoomData {
  roomId: Id<"rooms">;
}

export type ResetRoomsAndCategoriesAndItemsResponse =
  | ResetRoomsAndCategoriesAndItemsSuccess
  | ErrorResponse;

export interface ResetRoomsAndCategoriesAndItemsSuccess {
  status: ResponseStatus.SUCCESS;
  data: ResetRoomsAndCategoriesAndItemsData;
}

export interface ResetRoomsAndCategoriesAndItemsData {
  companyId: Id<"companies">;
}

export type GetCategoriesResponse = GetCategoriesSuccess | ErrorResponse;

export interface GetCategoriesSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCategoriesData;
}

export interface GetCategoriesData {
  categories: CategorySchema[];
}

export type UpdateCategoryResponse = UpdateCategorySuccess | ErrorResponse;

export interface UpdateCategorySuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateCategoryData;
}

export interface UpdateCategoryData {
  categoryId: Id<"categories">;
}

export type GetItemsByCategoryResponse =
  | GetItemsByCategorySuccess
  | ErrorResponse;

export interface GetItemsByCategorySuccess {
  status: ResponseStatus.SUCCESS;
  data: GetItemsByCategoryData;
}

export interface GetItemsByCategoryData {
  items: ItemSchema[];
}

export type UpdateItemResponse = UpdateItemSuccess | ErrorResponse;

export interface UpdateItemSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateItemData;
}

export interface UpdateItemData {
  itemId: Id<"items">;
}

export type GetCompanyRatesResponse = GetCompanyRatesSuccess | ErrorResponse;

export interface GetCompanyRatesSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCompanyRatesData;
}

export interface GetCompanyRatesData {
  labor: LaborSchema[];
  insurancePolicies: InsurancePolicySchema[];
  travelFee: TravelFeeSchema;
  creditCardFee: CreditCardFeeSchema;
  fees: FeeSchema[];
}

export type GetConnectedAccountByCompanyIdResponse =
  | GetConnectedAccountByCompanyIdSuccess
  | ErrorResponse;

export interface GetConnectedAccountByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetConnectedAccountByCompanyIdData;
}

export interface GetConnectedAccountByCompanyIdData {
  labor: LaborSchema[];
  insurancePolicies: InsurancePolicySchema[];
  travelFee: TravelFeeSchema;
  creditCardFee: CreditCardFeeSchema;
  fees: FeeSchema[];
}

export type GetStripeConnectionResponse =
  | GetStripeConnectionSuccess
  | ErrorResponse;

export interface GetStripeConnectionSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetStripeConnectionData;
}

export interface GetStripeConnectionData {
  stripeConnected: ConnectedAccountSchema | null;
}

export type CreateStripeOnboardingLinkResponse =
  | CreateStripeOnboardingLinkSuccess
  | ErrorResponse;

export interface CreateStripeOnboardingLinkSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateStripeOnboardingLinkData;
}

export interface CreateStripeOnboardingLinkData {
  url: string;
}

export interface GetStripeDashboardLinkData {
  url: string;
}

export type GetStripeDashboardLinkResponse =
  | GetStripeDashboardLinkSuccess
  | ErrorResponse;

export interface GetStripeDashboardLinkSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetStripeDashboardLinkData;
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

export type GetCompanyClerkUserIdResponse =
  | GetCompanyClerkUserIdSuccess
  | ErrorResponse;

export interface GetCompanyClerkUserIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCompanyClerkUserIdData | null;
}

export interface GetCompanyClerkUserIdData {
  company: CompanySchema | null;
}

export type GetCompanyArrivalResponse =
  | GetCompanyArrivalSuccess
  | ErrorResponse;

export interface GetCompanyArrivalSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCompanyArrivalData;
}

export interface GetCompanyArrivalData {
  arrivalWindow: ArrivalWindowSchema;
}

export type GetItemsByCompanyResponse =
  | GetItemsByCompanySuccess
  | ErrorResponse;

export interface GetItemsByCompanySuccess {
  status: ResponseStatus.SUCCESS;
  data: GetItemsByCompanyData;
}

export interface GetItemsByCompanyData {
  items: ItemSchema[];
}

export type GetItemsAndCategoriesAndRoomsByCompanyResponse =
  | GetItemsAndCategoriesAndRoomsByCompanySuccess
  | ErrorResponse;

export interface GetItemsAndCategoriesAndRoomsByCompanySuccess {
  status: ResponseStatus.SUCCESS;
  data: GetItemsAndCategoriesAndRoomsByCompanyData;
}

export interface GetItemsAndCategoriesAndRoomsByCompanyData {
  items: ItemSchema[];
  categories: CategorySchema[];
  rooms: RoomSchema[];
}

export type GetSalesRepsByCompanyIdResponse =
  | GetSalesRepsByCompanyIdSuccess
  | ErrorResponse;

export interface GetSalesRepsByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetSalesRepsByCompanyIdData;
}

export interface GetSalesRepsByCompanyIdData {
  users: UserSchema[];
}

export type GetMoveOptionsResponse = GetMoveOptionsSuccess | ErrorResponse;

export interface GetMoveOptionsSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetMoveOptionsData;
}

export interface GetMoveOptionsData {
  arrivalWindow: ArrivalWindowSchema;
  labor: LaborSchema[];
  travelFee: TravelFeeSchema;
  insurancePolicies: InsurancePolicySchema[];
  fees: FeeSchema[];
  salesReps: UserSchema[];
  referrals: ReferralSchema[];
  laborRates: LaborSchema[];
  creditCardFee: CreditCardFeeSchema;
  rooms: RoomSchema[];
  categories: CategorySchema[];
  items: ItemSchema[];
  policy: PolicySchema;
  companyContact: CompanyContactSchema;
}

export type CreateMoveResponse = CreateMoveSuccess | ErrorResponse;

export interface CreateMoveSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateMoveData;
}

export interface CreateMoveData {
  moveId: Id<"move">;
}

export type GetUserByClerkIdResponse = GetUserByClerkIdSuccess | ErrorResponse;

export interface GetUserByClerkIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetUserByClerkIdData;
}

export interface GetUserByClerkIdData {
  user: UserSchema;
}
export type GetMoveResponse = GetMoveSuccess | ErrorResponse;

export interface GetMoveSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetMoveData;
}

export interface GetMoveData {
  move: MoveSchema;
  quote: QuoteSchema | null;
  company: CompanySchema;
  salesRep: UserSchema;
  companyContact: CompanyContactSchema;
  policy: PolicySchema;
}

export type UpdateMoveResponse = UpdateMoveSuccess | ErrorResponse;

export interface UpdateMoveSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateMoveData;
}

export interface UpdateMoveData {
  moveId: Id<"move">;
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

export type GetCompanyContactResponse =
  | GetCompanyContactSuccess
  | ErrorResponse;

export interface GetCompanyContactSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetCompanyContactData;
}

export interface GetCompanyContactData {
  companyContact: CompanyContactSchema;
}

export type CreateOrUpdateQuoteResponse =
  | CreateOrUpdateQuoteSuccess
  | ErrorResponse;

export interface CreateOrUpdateQuoteSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateOrUpdateQuoteData;
}

export interface CreateOrUpdateQuoteData {
  quoteId: Id<"quotes">;
}

export type GetMoversByCompanyIdResponse =
  | GetMoversByCompanyIdSuccess
  | ErrorResponse;

export interface GetMoversByCompanyIdSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetMoversByCompanyIdData;
}

export interface GetMoversByCompanyIdData {
  users: UserSchema[];
}

export type UpdateMoveAssignmentResponse =
  | UpdateMoveAssignmentSuccess
  | ErrorResponse;

export interface UpdateMoveAssignmentSuccess {
  status: ResponseStatus.SUCCESS;
  data: UpdateMoveAssignmentData;
}

export interface UpdateMoveAssignmentData {
  assignmentId: Id<"moveAssignments">;
}

export type CreateMoveAssignmentResponse =
  | CreateMoveAssignmentSuccess
  | ErrorResponse;

export interface CreateMoveAssignmentSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateMoveAssignmentData;
}

export interface CreateMoveAssignmentData {
  assignmentId: Id<"moveAssignments">;
}

export type GetMoveAssignmentsPageResponse =
  | GetMoveAssignmentsPageSuccess
  | ErrorResponse;

export interface GetMoveAssignmentsPageSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetMoveAssignmentsPageData;
}

export interface GetMoveAssignmentsPageData {
  assignments: MoveAssignmentSchema[];
  allMovers: UserSchema[];
  preMoveDoc: PreMoveDocSchema | null;
}

export type CreateOrUpdatePreMoveDocResponse =
  | CreateOrUpdatePreMoveDocSuccess
  | ErrorResponse;

export interface CreateOrUpdatePreMoveDocSuccess {
  status: ResponseStatus.SUCCESS;
  data: CreateOrUpdatePreMoveDocData;
}

export interface CreateOrUpdatePreMoveDocData {
  preMoveDocId: Id<"preMoveDocs">;
}
