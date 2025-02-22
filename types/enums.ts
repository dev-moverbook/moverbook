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
