import { Id } from "@/convex/_generated/dataModel";
import { ResponseStatus } from "./enums";
import { ErrorMessages } from "./errors";

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
