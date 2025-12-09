import { v } from "convex/values";
import { internalQuery } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

export const getTwilioNumberByCompanyIdInternal = internalQuery({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, { companyId }): Promise<Doc<"twilioNumbers"> | null> => {
    return await ctx.db
      .query("twilioNumbers")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .first();
  },
});
