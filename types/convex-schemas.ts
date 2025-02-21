import { Id } from "@/convex/_generated/dataModel";
import { SubscriptionStatus, UserRole, UserStatus } from "./enums";

export interface Company {
  _id: Id<"companies">;
  _creationTime: number;
  calendarEmail: string | null;
  clerkOrganizationId: string;
  companyEmail: string | null;
  companyPhone: string | null;
  customerId?: Id<"customers"> | null;
  imageUrl: string | null;
  isActive: boolean;
  name: string;
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
  hourlyRate?: number;
  imageUrl: string | null;
  name: string;
  role: UserRole;
  status: UserStatus;
}
