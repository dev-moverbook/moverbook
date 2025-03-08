import { Id } from "@/convex/_generated/dataModel";
import {
  ClerkRoles,
  CommunicationType,
  InvitationStatus,
  PresSetScripts,
  SubscriptionStatus,
  UserRole,
  UserStatus,
} from "./enums";

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
  companyId: Id<"companies">;
  statePucPermitNumber: string;
  dmvNumber: string;
  usDotNumber: string;
}

export interface WebIntegrationsSchema {
  _id: Id<"webIntegrations">;
  companyId: Id<"companies">;
  webform: string;
  webformEmbeddedCode: string;
}

export interface CompanyContactSchema {
  _id: Id<"companyContact">;
  companyId: Id<"companies">;
  email: string;
  phoneNumber: string;
  address: string;
  website: string;
}
