import { ErrorMessages } from "@/types/errors";
import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { UserRoleConvex } from "@/types/convex-enums";
import { Doc, Id } from "./_generated/dataModel";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles, ResponseStatus } from "@/types/enums";
import {
  isUserInOrg,
  validateCompany,
  validateUser,
} from "./backendUtils/validate";
import { internal } from "./_generated/api";
import {
  GetMoversByCompanyIdResponse,
  GetSalesRepsAndReferralByCompanyIdData,
  UpdateUserActiveStatusResponse,
  UpdateUserResponse,
} from "@/types/convex-responses";
import {
  updateOrganizationMembershipHelper,
  updateUserNameHelper,
} from "./backendUtils/clerk";
import { handleInternalError } from "./backendUtils/helper";

export const getUserByEmailInternal = internalQuery({
  args: {
    email: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    try {
      const user: Doc<"users"> | null = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", args.email))
        .first();

      return user;
    } catch (error) {
      console.error(ErrorMessages.USER_DB_QUERY_BY_EMAIL, error);
      throw new Error(ErrorMessages.USER_DB_QUERY_BY_EMAIL);
    }
  },
});

export const getAllUsersByCompanyId = query({
  args: {
    companyId: v.id("companies"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args): Promise<Doc<"users">[]> => {
    const { companyId, isActive } = args;

    const identity = await requireAuthenticatedUser(ctx);

    const company = await ctx.db.get(companyId);

    const validatedCompany = validateCompany(company);

    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const users: Doc<"users">[] = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("companyId"), validatedCompany._id))
      .filter((q) => q.eq(q.field("isActive"), isActive))
      .collect();

    return users;
  },
});

export const updateUserInternal = internalMutation({
  args: {
    userId: v.id("users"),
    updates: v.object({
      hourlyRate: v.optional(v.union(v.number(), v.null())),
      imageUrl: v.optional(v.string()),
      name: v.optional(v.string()),
      role: v.optional(UserRoleConvex),
      companyId: v.optional(v.id("companies")),
    }),
  },
  handler: async (ctx, args): Promise<Id<"users">> => {
    const { userId, updates } = args;
    try {
      await ctx.db.patch(userId, updates);
      return userId;
    } catch (error) {
      console.error(ErrorMessages.USER_DB_UPDATE, error);
      throw new Error(ErrorMessages.USER_DB_UPDATE);
    }
  },
});

export const getUserByIdInternal = internalQuery({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const { userId } = args;

    return await ctx.db.get(userId);
  },
});

export const getUserById = query({
  args: {
    userId: v.id("users"),
  },
  handler: async (ctx, args): Promise<Doc<"users">> => {
    const { userId } = args;

    const identity = await requireAuthenticatedUser(ctx);
    const user = await ctx.db.get(userId);
    const validatedUser = validateUser(user, false, true);

    const company = await ctx.db.get(validatedUser.companyId!);
    const validatedCompany = validateCompany(company);

    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    return validatedUser;
  },
});

export const createUser = internalMutation({
  args: {
    clerkUserId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.optional(UserRoleConvex),
    companyId: v.optional(v.id("companies")),
    customerId: v.optional(v.id("customers")),
    hourlyRate: v.optional(v.union(v.number(), v.null())),
    imageUrl: v.string(),
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

    const userId = await ctx.db.insert("users", {
      clerkUserId,
      email,
      name,
      role,
      companyId,
      customerId,
      hourlyRate,
      imageUrl,
      isActive: true,
    });

    return userId;
  },
});

export const updateUserActiveStatus = mutation({
  args: {
    userId: v.id("users"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args): Promise<UpdateUserActiveStatusResponse> => {
    const { userId, isActive } = args;
    try {
      await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const user = await ctx.db.get(userId);
      const validatedUser = validateUser(user, false);

      await ctx.db.patch(validatedUser._id, { isActive });

      return {
        status: ResponseStatus.SUCCESS,
        data: {
          userId: validatedUser._id,
        },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const updateUser = action({
  args: {
    userId: v.id("users"),
    updates: v.object({
      hourlyRate: v.optional(v.union(v.number(), v.null())),
      imageUrl: v.optional(v.string()),
      name: v.optional(v.string()),
      role: v.optional(UserRoleConvex),
    }),
  },
  handler: async (ctx, args): Promise<UpdateUserResponse> => {
    const { userId, updates } = args;
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
      ]);

      const user = await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId,
      });
      const validatedUser = validateUser(user, true, true);

      const company = await ctx.runQuery(
        internal.companies.getCompanyByIdInternal,
        { companyId: validatedUser.companyId! }
      );
      const validatedCompany = validateCompany(company);

      isUserInOrg(identity, validatedCompany.clerkOrganizationId);

      await ctx.runMutation(internal.users.updateUserInternal, {
        userId: validatedUser._id,
        updates,
      });

      if (updates.name) {
        await updateUserNameHelper(validatedUser.clerkUserId, updates.name);
      }

      if (updates.role) {
        updateOrganizationMembershipHelper(
          validatedCompany.clerkOrganizationId,
          validatedUser.clerkUserId,
          updates.role
        );
      }

      return {
        status: ResponseStatus.SUCCESS,
        data: { userId },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const updateUserByEmailInternal = internalMutation({
  args: {
    email: v.string(),
    role: UserRoleConvex,
    clerkOrganizationId: v.string(),
    hourlyRate: v.union(v.number(), v.null()),
  },
  handler: async (ctx, args): Promise<Id<"users">> => {
    const { email, role, clerkOrganizationId, hourlyRate } = args;
    try {
      const user: Doc<"users"> | null = await ctx.db
        .query("users")
        .withIndex("by_email", (q) => q.eq("email", email))
        .first();

      const validatedUser = validateUser(user);

      const company: Doc<"companies"> | null = await ctx.db
        .query("companies")
        .filter((q) =>
          q.eq(q.field("clerkOrganizationId"), clerkOrganizationId)
        )
        .first();

      const validatedCompany = validateCompany(company);

      await ctx.db.patch(validatedUser._id, {
        role,
        companyId: validatedCompany._id,
        hourlyRate,
      });
      return validatedUser._id;
    } catch (error) {
      throw new Error(ErrorMessages.USER_DB_UPDATE);
    }
  },
});

export const getSalesRepsByCompanyId = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<Doc<"users">[]> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
    const moveReps = sortedUsers.filter(
      (user) =>
        user.role === ClerkRoles.SALES_REP ||
        user.role === ClerkRoles.ADMIN ||
        user.role === ClerkRoles.MANAGER
    );

    return moveReps;
  },
});

export const getUserByClerkId = query({
  args: {},
  handler: async (ctx): Promise<Doc<"users">> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const clerkId = identity.id as string;
    const user = validateUser(
      await ctx.db
        .query("users")
        .withIndex("by_clerkUserId", (q) => q.eq("clerkUserId", clerkId))
        .first()
    );
    return user;
  },
});

// not used
export const getMoversByCompanyId = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<GetMoversByCompanyIdResponse> => {
    const { companyId } = args;
    try {
      const identity = await requireAuthenticatedUser(ctx, [
        ClerkRoles.ADMIN,
        ClerkRoles.APP_MODERATOR,
        ClerkRoles.MANAGER,
        ClerkRoles.SALES_REP,
      ]);

      const company = validateCompany(await ctx.db.get(companyId));
      isUserInOrg(identity, company.clerkOrganizationId);

      const users = await ctx.db
        .query("users")
        .filter((q) => q.eq(q.field("companyId"), companyId))
        .filter((q) => q.eq(q.field("isActive"), true))
        .collect();

      const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));
      const movers = sortedUsers.filter(
        (user) => user.role === ClerkRoles.MOVER
      );

      return {
        status: ResponseStatus.SUCCESS,
        data: { users: movers },
      };
    } catch (error) {
      return handleInternalError(error);
    }
  },
});

export const getSalesRepsAndReferralByCompanyId = query({
  args: {
    companyId: v.id("companies"),
  },
  handler: async (
    ctx,
    args
  ): Promise<GetSalesRepsAndReferralByCompanyIdData> => {
    const { companyId } = args;

    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const company = validateCompany(await ctx.db.get(companyId));
    isUserInOrg(identity, company.clerkOrganizationId);

    const users = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .filter((q) =>
        q.or(
          q.eq(q.field("role"), ClerkRoles.SALES_REP),
          q.eq(q.field("role"), ClerkRoles.ADMIN),
          q.eq(q.field("role"), ClerkRoles.MANAGER)
        )
      )
      .collect();

    const sortedUsers = users.sort((a, b) => a.name.localeCompare(b.name));

    const referrals = await ctx.db
      .query("referrals")
      .filter((q) => q.eq(q.field("companyId"), companyId))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    return {
      users: sortedUsers,
      referrals,
    };
  },
});
