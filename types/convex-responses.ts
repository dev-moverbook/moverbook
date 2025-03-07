import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "./enums";
import { ErrorMessages } from "./errors";
import { InvitationSchema, UserSchema } from "./convex-schemas";

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

export type GetAllUsersBySlugResponse =
  | GetAllUsersBySlugSuccess
  | ErrorResponse;

export interface GetAllUsersBySlugSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetAllUsersBySlugData;
}

export interface GetAllUsersBySlugData {
  users: UserSchema[];
}

export type GetActiveInvitationsBySlugResponse =
  | GetActiveInvitationsBySlugSuccess
  | ErrorResponse;

export interface GetActiveInvitationsBySlugSuccess {
  status: ResponseStatus.SUCCESS;
  data: GetActiveInvitationsBySlugData;
}

export interface GetActiveInvitationsBySlugData {
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
