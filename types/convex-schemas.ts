import { Id } from "@/convex/_generated/dataModel";
import {
  ClerkRoles,
  InvitationStatus,
  SubscriptionStatus,
  UserRole,
  UserStatus,
} from "./enums";

export interface CompanySchema {
  _id: Id<"companies">;
  _creationTime: number;
  calendarEmail: string | null;
  clerkOrganizationId: string;
  companyEmail: string | null;
  companyPhone: string | null;
  customerId: Id<"customers">;
  imageUrl: string | null;
  isActive: boolean;
  name: string;
  slug: string;
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
