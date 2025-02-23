import { v } from "convex/values";
import { ClerkRoles, SubscriptionStatus, UserRole, UserStatus } from "./enums";

export const SubscriptionStatusConvex = v.union(
  v.literal(SubscriptionStatus.ACTIVE),
  v.literal(SubscriptionStatus.CANCELLED),
  v.literal(SubscriptionStatus.PAST_DUE)
);

export const UserRoleConvex = v.union(
  v.literal(ClerkRoles.ADMIN),
  v.literal(ClerkRoles.APP_MODERATOR),
  v.literal(ClerkRoles.MANAGER),
  v.literal(ClerkRoles.MOVER),
  v.literal(ClerkRoles.SALES_REP)
);

export const UserStatusConvex = v.union(
  v.literal(UserStatus.INVITED),
  v.literal(UserStatus.ACTIVE),
  v.literal(UserStatus.REVOKED),
  v.literal(UserStatus.INACTIVE)
);
