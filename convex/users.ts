import { CustomerSchema, UserSchema } from "@/types/convex-schemas";
import { ErrorMessage, ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import { UserRoleConvex, UserStatusConvex } from "@/types/convex-enums";
import { Id } from "./_generated/dataModel";

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

export const createUser = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    role: UserRoleConvex,
    companyId: v.optional(v.id("companies")),
    customerId: v.optional(v.id("customers")),
    hourlyRate: v.optional(v.number()),
    imageUrl: v.optional(v.union(v.string(), v.null())),
  },
  handler: async (ctx, args): Promise<Id<"users">> => {
    const {
      clerkUserId,
      email,
      name,
      role,
      companyId,
      customerId,
      hourlyRate,
      imageUrl,
    } = args;

    try {
      const userId = await ctx.db.insert("users", {
        clerkUserId,
        email,
        name,
        role,
        companyId,
        customerId,
        hourlyRate,
        imageUrl: imageUrl ?? null,
        isActive: true,
      });

      return userId;
    } catch (error) {
      console.error(ErrorMessages.USER_DB_CREATE, error);
      throw new Error(ErrorMessages.USER_DB_CREATE);
    }
  },
});
