import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "./enums";
import { ErrorMessages } from "./errors";
import {
  ArrivalWindowSchema,
  CategorySchema,
  CompanyContactSchema,
  CompanySchema,
  ComplianceSchema,
  CreditCardFeeSchema,
  FeeSchema,
  InsurancePolicySchema,
  InvitationSchema,
  ItemSchema,
  LaborSchema,
  PolicySchema,
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
