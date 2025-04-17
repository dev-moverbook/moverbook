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

export enum TravelChargingTypes {
  LABOR_HOURS = "Labor Hours",
  MILEAGE = "Mileage",
  FLAT = "Flat",
}

export enum CategorySize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  XL = "XL",
}

export const CategorySizeLabels: Record<CategorySize, string> = {
  [CategorySize.SMALL]: "Small - Nightstand",
  [CategorySize.MEDIUM]: "Medium - Recliner",
  [CategorySize.LARGE]: "Large - Couch",
  [CategorySize.XL]: "XL - Sectional",
};

export const ClerkRoleLabels: Record<ClerkRoles, string> = {
  [ClerkRoles.ADMIN]: "Admin",
  [ClerkRoles.APP_MODERATOR]: "App Moderator",
  [ClerkRoles.MANAGER]: "Manager",
  [ClerkRoles.MOVER]: "Mover",
  [ClerkRoles.SALES_REP]: "Sales Rep",
};

export enum StripeConnectionStatusEnum {
  NotConnected = "not_connected",
  OnboardingIncomplete = "onboarding_incomplete",
  Restricted = "restricted",
  Connected = "connected",
}

export const stripeConnectionStatusDisplay = {
  [StripeConnectionStatusEnum.NotConnected]: {
    label: "Not Connected",
    color: "red",
    description:
      "You need to connect your Stripe account to start getting paid.",
    icon: "🔴",
  },
  [StripeConnectionStatusEnum.OnboardingIncomplete]: {
    label: "Setup Incomplete",
    color: "orange",
    description: "Please finish setting up your Stripe account.",
    icon: "🟠",
  },
  [StripeConnectionStatusEnum.Restricted]: {
    label: "Action Required",
    color: "yellow",
    description: "Your Stripe account has restrictions. Please review it.",
    icon: "🟡",
  },
  [StripeConnectionStatusEnum.Connected]: {
    label: "Connected",
    color: "green",
    description: "You're connected to Stripe and ready to receive payouts.",
    icon: "🟢",
  },
};
