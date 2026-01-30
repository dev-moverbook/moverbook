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
  ADMIN = "Admin",
  APP_MODERATOR = "App Moderator",
  MANAGER = "Manager",
  MOVER = "Mover",
  SALES_REP = "Sales Rep",
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
  EMAIL_QUOTE = "Email Quote",
  SMS_QUOTE = "Sms Quote",
  EMAIL_INVOICE = "Email Invoice",
  SMS_INVOICE = "Sms Invoice",
  EMAIL_CONTRACT = "Email Contract",
  SMS_CONTRACT = "Sms Contract",
  EMAIL_WAIVER = "Email Waiver",
  SMS_WAIVER = "Sms Waiver",
  EMAIL_INTERNAL_REVIEW = "Email Internal Review",
  SMS_INTERNAL_REVIEW = "Sms Internal Review",
  EMAIL_EXTERNAL_REVIEW = "Email External Review",
  SMS_EXTERNAL_REVIEW = "Sms External Review",
  EMAIL_FOLLOW_UP = "Email Follow Up",
  SMS_FOLLOW_UP = "Sms Follow Up",
  EMAIL_LOCATION_SHARING = "Email Location Sharing",
}

export enum TravelChargingTypes {
  LABOR_HOURS = "Labor Rate",
  MILEAGE = "Mileage",
  FLAT = "Flat",
}

export enum CategorySize {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE",
  XL = "XL",
}

export const CategorySizeLabels: Record<
  CategorySize,
  { label: string; example: string; size: string }
> = {
  [CategorySize.SMALL]: {
    label: "Small",
    example: "Nightstand",
    size: "5",
  },
  [CategorySize.MEDIUM]: {
    label: "Medium",
    example: "Recliner",
    size: "25",
  },
  [CategorySize.LARGE]: {
    label: "Large",
    example: "Couch",
    size: "50",
  },
  [CategorySize.XL]: {
    label: "XL",
    example: "Sectional",
    size: "80",
  },
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

export enum QueryStatus {
  LOADING = "loading",
  ERROR = "error",
  SUCCESS = "success",
}
