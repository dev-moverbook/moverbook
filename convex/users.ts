import { CustomerSchema, UserSchema } from "@/types/convex-schemas";
import { ErrorMessage, ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { internalQuery } from "./_generated/server";

export const viewUserByEmail = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<UserSchema | null> => {
    try {
      const user: UserSchema | null = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      return user;
    } catch (error) {
      console.error(ErrorMessages.USER_DB_QUERY, error);
      throw new Error(ErrorMessages.USER_DB_QUERY);
    }
  },
});
