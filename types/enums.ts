export enum SubscriptionStatus {
  ACTIVE = "Active",
  CANCELLED = "Cancelled",
  PAST_DUE = "Past Due",
}

export enum UserRole {
  APP_MODERATOR = "App Moderator",
  ADMIN = "Admin",
  MANAGER = "Manager",
  SALES_REP = "Sales Rep",
  MOVER = "Mover",
}

export enum CreatableUserRole {
  MANAGER = UserRole.MANAGER,
  SALES_REP = UserRole.SALES_REP,
  MOVER = UserRole.MOVER,
}

export enum OperationalUsers {
  MANAGER = "Manager",
  SALES_REP = "Sales Rep",
  MOVER = "Mover",
}

export enum UserStatus {
  INVITED = "Invited",
  ACTIVE = "Active",
  REVOKED = "Revoked",
  INACTIVE = "Inactive",
}

export enum ResponseStatus {
  SUCCESS = "success",
  ERROR = "error",
}

export enum ClerkRoles {
  ADMIN = "org:admin",
  APP_MODERATOR = "org:app_moderator",
  MANAGER = "org:manager",
  MOVER = "org:mover",
  SALES_REP = "org:sales_rep",
}

export enum InvitationStatus {
  PENDING = "Pending",
  ACCEPTED = "Accepted",
  REVOKED = "Revoked",
}

export enum StripeAccountStatus {
  NOT_ONBOARDED = "Not Onboarded Yet", // User hasn't completed Stripe onboarding
  PENDING = "Pending", // Account created but not yet verified
  VERIFIED = "Verified", // Fully approved, can process payments
  RESTRICTED = "Restricted", // Needs more verification (e.g., missing ID)
  REJECTED = "Rejected", // Permanently rejected by Stripe
  DISABLED = "Disabled", // Manually disabled (optional for admin actions)
}

export enum CommunicationType {
  EMAIL = "Email",
  SMS = "Sms",
}

export enum PresSetScripts {
  QUOTE_SENT = "Quote Sent",
  INVOICE_SENT = "Invoice Sent",
  PRE_MOVE_DOC_SENT = "Pre Move Doc Sent",
  INTERNAL_REVIEW_SENT = "Internal Review Sent",
  EXTERNAL_REVIEW_SENT = "External Review Sent",
}
