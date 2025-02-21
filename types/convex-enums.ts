import { v } from "convex/values";
import { SubscriptionStatus, UserRole, UserStatus } from "./enums";

export const SubscriptionStatusConvex = v.union(
  v.literal(SubscriptionStatus.ACTIVE),
  v.literal(SubscriptionStatus.CANCELLED),
  v.literal(SubscriptionStatus.PAST_DUE)
);

export const UserRoleConvex = v.union(
  v.literal(UserRole.ADMIN),
  v.literal(UserRole.APP_MODERATOR),
  v.literal(UserRole.MANAGER),
  v.literal(UserRole.SALES_REP),
  v.literal(UserRole.MOVER)
);

export const UserStatusConvex = v.union(
  v.literal(UserStatus.INVITED),
  v.literal(UserStatus.ACTIVE),
  v.literal(UserStatus.REVOKED),
  v.literal(UserStatus.INACTIVE)
);
