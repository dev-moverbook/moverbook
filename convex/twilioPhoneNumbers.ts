import { v } from "convex/values";
import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

import { TollfreeVerificationStatusConvex } from "./schema";
import { isIdentityInCompany, validateCompany } from "./backendUtils/validate";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { Doc } from "./_generated/dataModel";
import { ClerkRoles } from "@/types/enums";

export const insertTwilioPhoneNumber = internalMutation({
  args: {
    companyId: v.id("companies"),
    phoneNumberE164: v.string(),
    sid: v.string(),
  },
  handler: async (ctx, args) => {
    const { companyId, phoneNumberE164, sid } = args;

    return await ctx.db.insert("twilioPhoneNumbers", {
      companyId,
      phoneNumberE164,
      sid,
      isActive: true,
      tollfreeVerificationStatus: "Verification Required",
      updatedAt: Date.now(),
    });
  },
});

export const getTwilioPhoneNumber = internalQuery({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("twilioPhoneNumbers")
      .withIndex("by_companyId", (q) => q.eq("companyId", args.companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .first();
  },
});

export const getPhoneNumber = query({
  args: { companyId: v.id("companies") },
  handler: async (ctx, args): Promise<Doc<"twilioPhoneNumbers"> | null> => {
    const { companyId } = args;
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isIdentityInCompany(identity, company._id);

    return await ctx.db
      .query("twilioPhoneNumbers")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .first();
  },
});

export const updateTwilioPhoneNumber = mutation({
  args: {
    id: v.id("twilioPhoneNumbers"),
    updates: v.object({
      tollfreeInquiryId: v.optional(v.string()),
      tollfreeVerificationSid: v.optional(v.string()),
      tollfreeRegistrationSid: v.optional(v.string()),
      tollfreeVerifiedAt: v.optional(v.number()),
      tollfreeRejectionReasons: v.optional(v.string()),
      tollfreeVerificationStatus: v.optional(TollfreeVerificationStatusConvex),
    }),
  },
  handler: async (ctx, args) => {
    const { id, updates } = args;
    await requireAuthenticatedUser(ctx, [ClerkRoles.ADMIN]);
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
    return true;
  },
});

export const getTwilioPhoneNumberBySid = internalQuery({
  args: { sid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("twilioPhoneNumbers")
      .withIndex("by_sid", (q) => q.eq("sid", args.sid))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});

export const updateTwilioPhoneNumberInternal = internalMutation({
  args: {
    id: v.id("twilioPhoneNumbers"),
    updates: v.object({
      tollfreeInquiryId: v.optional(v.string()),
      tollfreeVerificationSid: v.optional(v.string()),
      tollfreeRegistrationSid: v.optional(v.string()),
      tollfreeVerifiedAt: v.optional(v.number()),
      tollfreeRejectionReasons: v.optional(v.string()),
      tollfreeVerificationStatus: v.optional(TollfreeVerificationStatusConvex),
    }),
  },
  handler: async (ctx, args) => {
    const { id, updates } = args;
    await ctx.db.patch(id, { ...updates, updatedAt: Date.now() });
  },
});
