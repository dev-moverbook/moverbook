import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "./enums";
import { ErrorMessages } from "./errors";
import {
  CompanyContactSchema,
  CompanySchema,
  ComplianceSchema,
  InvitationSchema,
  ReferralSchema,
  ScriptSchema,
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
