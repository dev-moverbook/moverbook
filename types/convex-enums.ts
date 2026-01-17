import { v } from "convex/values";
import {
  CategorySize,
  ClerkRoles,
  InvitationStatus,
  PresSetScripts,
  StripeAccountStatus,
  SubscriptionStatus,
  TravelChargingTypes,
  UserStatus,
} from "./enums";

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
  v.literal(ClerkRoles.SALES_REP),
  v.literal(ClerkRoles.CUSTOMER)
);

export const CreatableUserRoleConvex = v.union(
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

export const InvitationStatusConvex = v.union(
  v.literal(InvitationStatus.PENDING),
  v.literal(InvitationStatus.ACCEPTED),
  v.literal(InvitationStatus.REVOKED)
);

export const StripeAccountStatusConvex = v.union(
  v.literal(StripeAccountStatus.NOT_ONBOARDED),
  v.literal(StripeAccountStatus.PENDING),
  v.literal(StripeAccountStatus.VERIFIED),
  v.literal(StripeAccountStatus.RESTRICTED),
  v.literal(StripeAccountStatus.REJECTED),
  v.literal(StripeAccountStatus.DISABLED)
);

export const CommunicationTypeConvex = v.union(
  v.literal("email"),
  v.literal("sms")
);

export const FollowUpCommunicationTypeConvex = v.union(
  v.literal("email"),
  v.literal("sms"),
  v.literal("phone")
);

export const PresSetScriptsConvex = v.union(
  v.literal(PresSetScripts.EMAIL_QUOTE),
  v.literal(PresSetScripts.SMS_QUOTE),
  v.literal(PresSetScripts.EMAIL_INVOICE),
  v.literal(PresSetScripts.SMS_INVOICE),
  v.literal(PresSetScripts.EMAIL_CONTRACT),
  v.literal(PresSetScripts.SMS_CONTRACT),
  v.literal(PresSetScripts.EMAIL_WAIVER),
  v.literal(PresSetScripts.SMS_WAIVER),
  v.literal(PresSetScripts.EMAIL_INTERNAL_REVIEW),
  v.literal(PresSetScripts.SMS_INTERNAL_REVIEW),
  v.literal(PresSetScripts.EMAIL_EXTERNAL_REVIEW),
  v.literal(PresSetScripts.SMS_EXTERNAL_REVIEW),
  v.literal(PresSetScripts.EMAIL_FOLLOW_UP),
  v.literal(PresSetScripts.SMS_FOLLOW_UP),
  v.literal(PresSetScripts.EMAIL_LOCATION_SHARING)
);

export const TravelChargingTypesConvex = v.union(
  v.literal(TravelChargingTypes.LABOR_HOURS),
  v.literal(TravelChargingTypes.MILEAGE),
  v.literal(TravelChargingTypes.FLAT)
);

export const CategorySizeConvex = v.union(
  v.literal(CategorySize.SMALL),
  v.literal(CategorySize.MEDIUM),
  v.literal(CategorySize.LARGE),
  v.literal(CategorySize.XL)
);

export const MoveStatusConvex = v.union(
  v.literal("New Lead"),
  v.literal("Quoted"),
  v.literal("Booked"),
  v.literal("Lost"),
  v.literal("Cancelled"),
  v.literal("Completed")
);

export const ServiceTypesConvex = v.union(
  v.literal("moving"),
  v.literal("packing"),
  v.literal("load_only"),
  v.literal("unload_only"),
  v.literal("moving_and_packing"),
  v.literal("commercial")
);

export const MoveTimesConvex = v.union(
  v.literal("morning"),
  v.literal("afternoon"),
  v.literal("custom")
);

export const JobTypeConvex = v.union(v.literal("hourly"), v.literal("flat"));

export const LocationRoleConvex = v.union(
  v.literal("starting"),
  v.literal("ending"),
  v.literal("stop")
);

export const AccessTypeConvex = v.union(
  v.literal("ground"),
  v.literal("one_flight"),
  v.literal("two_flights"),
  v.literal("three_or_more_flights"),
  v.literal("elevator")
);

export const MoveSizeConvex = v.union(
  v.literal("studio"),
  v.literal("1_bedroom"),
  v.literal("2_bedroom"),
  v.literal("3_bedroom"),
  v.literal("4_bedroom"),
  v.literal("5_bedroom"),
  v.literal("not_applicable")
);

export const LocationTypeConvex = v.union(
  v.literal("apartment"),
  v.literal("house"),
  v.literal("office"),
  v.literal("storage unit"),
  v.literal("speciality item")
);

export { CategorySize };

export const MessageStatusConvex = v.union(
  v.literal("pending"),
  v.literal("sent"),
  v.literal("failed"),
  v.literal("received")
);

export const MessageSentTypeConvex = v.union(
  v.literal("outgoing"),
  v.literal("incoming")
);
