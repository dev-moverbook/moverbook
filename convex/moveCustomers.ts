import { v } from "convex/values";
import {
  action,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";
import { requireAuthenticatedUser } from "./backendUtils/auth";
import { ClerkRoles } from "@/types/enums";
import {
  EnrichedMoveForMover,
  GetCustomerAndMovesData,
  newCustomerResponse,
} from "@/types/convex-responses";
import { Doc, Id } from "./_generated/dataModel";
import {
  assertCustomerUser,
  isUserInCompanyConvex,
  isUserInOrg,
  validateCompany,
  validateDocExists,
  validateDocument,
  validateUser,
} from "./backendUtils/validate";
import {
  buildMoverWageForMoveDisplay,
  scopeMovesToMover,
  resolveMoverContext,
} from "./backendUtils/queryHelpers";
import { CustomerUser, HourStatus } from "@/types/types";
import { ErrorMessages } from "@/types/errors";
import { internal } from "./_generated/api";
import { throwConvexError } from "./backendUtils/errors";
import { ServiceTypesConvex } from "@/types/convex-enums";
import { updateUserNameHelper } from "./functions/clerk";
import { validateAndFormatPhone } from "./backendUtils/helper";

export const searchMoveCustomersAndJobId = query({
  args: {
    companyId: v.id("companies"),
    searchTerm: v.string(),
  },
  handler: async (
    ctx,
    { companyId, searchTerm }
  ): Promise<{
    moveCustomers: Doc<"users">[];
    moves: EnrichedMoveForMover[];
  }> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const company = await validateCompany(ctx.db, companyId);
    isUserInOrg(identity, company.clerkOrganizationId);

    const {
      isMover,
      moverId: signedInMoverId,
      hourlyRate: signedInMoverHourlyRate,
    } = await resolveMoverContext(ctx, identity);

    const normalizedSearch = searchTerm.trim().toLowerCase();

    const allCustomers = await ctx.db
      .query("users")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .filter((q) => q.eq(q.field("role"), ClerkRoles.CUSTOMER))
      .filter((q) => q.eq(q.field("isActive"), true))
      .collect();

    const allCompanyMoves = await ctx.db
      .query("moves")
      .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
      .collect();

    let assignmentMapByMoveId: Map<string, Doc<"moveAssignments">> | undefined;

    let movesScopedToMover: Doc<"moves">[] = allCompanyMoves;

    if (isMover && signedInMoverId) {
      const { moves: scopedMoves, assignmentMap } = await scopeMovesToMover(
        ctx,
        allCompanyMoves,
        signedInMoverId
      );
      movesScopedToMover = scopedMoves;
      assignmentMapByMoveId = assignmentMap;
    }

    const allowedMoveIds: Set<Id<"moves">> | null =
      isMover && signedInMoverId
        ? new Set(movesScopedToMover.map((moveRecord) => moveRecord._id))
        : null;

    const matchingMovesBase = allCompanyMoves
      .filter(
        (moveRecord) =>
          (allowedMoveIds ? allowedMoveIds.has(moveRecord._id) : true) &&
          (moveRecord.jobId?.toLowerCase().includes(normalizedSearch) ?? false)
      )
      .slice(0, 10);

    const enrichedMoves: EnrichedMoveForMover[] =
      isMover && signedInMoverId && assignmentMapByMoveId
        ? matchingMovesBase.map((moveRecord) => {
            const assignment = assignmentMapByMoveId!.get(moveRecord._id);
            return {
              ...moveRecord,
              moverWageForMove: assignment
                ? buildMoverWageForMoveDisplay(
                    moveRecord,
                    assignment,
                    signedInMoverHourlyRate
                  )
                : undefined,
              hourStatus: (assignment?.hourStatus as HourStatus) ?? undefined,
            };
          })
        : (matchingMovesBase as EnrichedMoveForMover[]);

    const allowedCustomerIdsForMover = allowedMoveIds
      ? new Set(
          allCompanyMoves
            .filter((moveRecord) => allowedMoveIds!.has(moveRecord._id))
            .map((moveRecord) => moveRecord.moveCustomerId)
        )
      : null;

    const matchingCustomers = allCustomers
      .filter(
        (customerRecord) =>
          (allowedCustomerIdsForMover
            ? allowedCustomerIdsForMover.has(customerRecord._id)
            : true) &&
          ((customerRecord.name?.toLowerCase().includes(normalizedSearch) ??
            false) ||
            (customerRecord.email?.toLowerCase().includes(normalizedSearch) ??
              false) ||
            (customerRecord.phoneNumber
              ?.toLowerCase()
              .includes(normalizedSearch) ??
              false))
      )
      .slice(0, 10);

    return {
      moveCustomers: matchingCustomers,
      moves: enrichedMoves,
    };
  },
});

export const createMoveCustomer = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    altPhoneNumber: v.string(),
    companyId: v.id("companies"),
  },
  handler: async (ctx, args): Promise<newCustomerResponse> => {
    const { name, email, phoneNumber, altPhoneNumber, companyId } = args;

    const validatedPhoneNumber = validateAndFormatPhone(phoneNumber, "US");
    const validatedAltPhoneNumber = validateAndFormatPhone(
      altPhoneNumber,
      "US"
    );

    const byEmail: Doc<"users"> | null = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (byEmail) {
      return {
        moveCustomer: byEmail,
        isExistingCustomer: true,
      };
    }

    const byPhone: Doc<"users"> | null = await ctx.db
      .query("users")
      .withIndex("by_phoneNumber", (q) =>
        q.eq("phoneNumber", validatedPhoneNumber)
      )
      .first();

    if (byPhone) {
      return {
        moveCustomer: byPhone,
        isExistingCustomer: true,
      };
    }

    const moveCustomerId = await ctx.db.insert("users", {
      name,
      email,
      phoneNumber: validatedPhoneNumber,
      altPhoneNumber: validatedAltPhoneNumber,
      role: ClerkRoles.CUSTOMER,
      isActive: true,
      updatedAt: Date.now(),
    });

    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
        entry: {
          type: "CUSTOMER_CREATED",
          companyId,
          moveCustomerId,
          body: `A new customer, **${name}** was created.`,
        },
      });
      const moveCustomer = await validateDocument(
        ctx.db,
        "users",
        moveCustomerId,
        ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
      );
      return {
        moveCustomer: moveCustomer,
        isExistingCustomer: false,
      };
    }
    const identityVerified = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const currentUserId = identityVerified.convexId as Id<"users">;

    const user = validateUser(await ctx.db.get(currentUserId));
    isUserInCompanyConvex(user, companyId);

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_CREATED_BY_REP",
        companyId,
        moveCustomerId,
        userId: user._id,
        body: `**${user.name}** created a new customer, **${name}**`,
      },
    });

    const moveCustomer = await validateDocument(
      ctx.db,
      "users",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    return {
      moveCustomer: moveCustomer,
      isExistingCustomer: false,
    };
  },
});

export const updateMoveCustomer = action({
  args: {
    moveCustomerId: v.id("users"),
    companyId: v.id("companies"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      altPhoneNumber: v.optional(v.string()),
    }),
    moveId: v.optional(v.id("moves")),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { moveCustomerId, updates, companyId, moveId } = args;

    const identityVerified = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const currentUserId = identityVerified.convexId as Id<"users">;

    const user = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: currentUserId,
      })
    );
    isUserInCompanyConvex(user, companyId);

    const existingMoveCustomer = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId: moveCustomerId,
      })
    );

    if (updates.email && updates.email !== existingMoveCustomer.email) {
      const emailTaken = await ctx.runQuery(
        internal.moveCustomers.getUserByEmailInternal,
        { email: updates.email }
      );

      if (emailTaken) {
        throwConvexError(ErrorMessages.CUSTOMER_EMAIL_TAKEN, {
          code: "CONFLICT",
          showToUser: true,
        });
      }
    }

    let validatedPhoneNumber: string | undefined;
    if (updates.phoneNumber !== undefined) {
      validatedPhoneNumber = validateAndFormatPhone(updates.phoneNumber, "US");

      if (validatedPhoneNumber !== existingMoveCustomer.phoneNumber) {
        const phoneTaken = await ctx.runQuery(
          internal.moveCustomers.getUserByPhoneNumberInternal,
          { phoneNumber: validatedPhoneNumber }
        );

        if (phoneTaken) {
          throwConvexError(ErrorMessages.CUSTOMER_PHONE_TAKEN, {
            code: "CONFLICT",
            showToUser: true,
          });
        }
      }
    }

    let validatedAltPhoneNumber: string | undefined;
    if (updates.altPhoneNumber !== undefined) {
      const trimmed = updates.altPhoneNumber.trim();
      if (trimmed === "") {
        validatedAltPhoneNumber = undefined;
      } else {
        validatedAltPhoneNumber = validateAndFormatPhone(trimmed, "US");
      }
    }

    if (
      existingMoveCustomer.clerkUserId &&
      updates.name &&
      updates.name !== existingMoveCustomer.name
    ) {
      await updateUserNameHelper(
        existingMoveCustomer.clerkUserId,
        updates.name
      );
    }

    const dbUpdates: Partial<{
      name: string;
      email: string;
      phoneNumber: string;
      altPhoneNumber: string;
    }> = { ...updates };

    if (validatedPhoneNumber !== undefined) {
      dbUpdates.phoneNumber = validatedPhoneNumber;
    }
    if (validatedAltPhoneNumber !== undefined) {
      dbUpdates.altPhoneNumber = validatedAltPhoneNumber;
    }

    await ctx.runMutation(internal.users.updateUserInternal, {
      userId: moveCustomerId,
      updates: dbUpdates,
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_UPDATED_BY_REP",
        companyId,
        userId: user._id,
        body: `**${user.name}** updated customer details for **${existingMoveCustomer.name}**.`,
        moveCustomerId,
        moveId,
      },
    });

    return true;
  },
});

export const getMoveCustomer = query({
  args: {
    moveCustomerId: v.id("users"),
  },
  handler: async (ctx, { moveCustomerId }): Promise<CustomerUser> => {
    await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
    ]);

    const moveCustomer = await validateDocument(
      ctx.db,
      "users",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    return assertCustomerUser(moveCustomer);
  },
});

export const getMoveCustomerByIdInternal = internalQuery({
  args: { moveCustomerId: v.id("users") },
  handler: async (ctx, args): Promise<CustomerUser> => {
    const { moveCustomerId } = args;
    const moveCustomer = await validateDocument(
      ctx.db,
      "users",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );

    return assertCustomerUser(moveCustomer);
  },
});

export const getCustomerAndMoves = query({
  args: {
    moveCustomerId: v.id("users"),
    slug: v.string(),
  },
  handler: async (
    ctx,
    { moveCustomerId, slug }
  ): Promise<GetCustomerAndMovesData> => {
    const identity = await requireAuthenticatedUser(ctx, [
      ClerkRoles.ADMIN,
      ClerkRoles.APP_MODERATOR,
      ClerkRoles.MANAGER,
      ClerkRoles.SALES_REP,
      ClerkRoles.MOVER,
    ]);

    const moveCustomer = await validateDocument(
      ctx.db,
      "users",
      moveCustomerId,
      ErrorMessages.MOVE_CUSTOMER_NOT_FOUND
    );
    const customerUser = assertCustomerUser(moveCustomer);
    const company = await ctx.runQuery(
      internal.companies.getCompanyBySlugInternal,
      { slug }
    );
    const validatedCompany = validateDocExists(
      "companies",
      company,
      ErrorMessages.COMPANY_NOT_FOUND
    );
    isUserInOrg(identity, validatedCompany.clerkOrganizationId);

    const {
      isMover,
      moverId: selfMoverId,
      hourlyRate: selfHourlyRate,
    } = await resolveMoverContext(ctx, identity);

    const baseMoves: Doc<"moves">[] = await ctx.db
      .query("moves")
      .withIndex("by_moveCustomerIdAndCompanyId", (index) =>
        index
          .eq("moveCustomerId", moveCustomerId)
          .eq("companyId", validatedCompany._id)
      )
      .collect();

    if (!isMover || !selfMoverId) {
      return {
        moveCustomer: customerUser,
        moves: baseMoves,
      };
    }

    const { moves: scopedMoves, assignmentMap } = await scopeMovesToMover(
      ctx,
      baseMoves,
      selfMoverId
    );

    const moves: EnrichedMoveForMover[] = scopedMoves.map((moveRecord) => {
      const assignment = assignmentMap.get(moveRecord._id);
      return {
        ...moveRecord,
        moverWageForMove: assignment
          ? buildMoverWageForMoveDisplay(moveRecord, assignment, selfHourlyRate)
          : undefined,
        hourStatus: (assignment?.hourStatus as HourStatus) ?? undefined,
      };
    });

    return {
      moveCustomer: customerUser,
      moves,
    };
  },
});

export const createPublicMove = action({
  args: {
    companyId: v.id("companies"),
    name: v.string(),
    email: v.string(),
    phoneNumber: v.string(),
    altPhoneNumber: v.string(),
    serviceType: ServiceTypesConvex,
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { companyId, name, email, phoneNumber, altPhoneNumber, serviceType } =
      args;

    const company = await ctx.runQuery(
      internal.companies.getCompanyByIdInternal,
      { companyId }
    );
    validateDocExists("companies", company, ErrorMessages.COMPANY_NOT_FOUND);

    const existingCustomer = await ctx.runQuery(
      internal.moveCustomers.getExistingMoveCustomerInternal,
      { email, phoneNumber }
    );

    let moveCustomerId: Id<"users">;

    if (existingCustomer) {
      moveCustomerId = existingCustomer._id;
    } else {
      moveCustomerId = await ctx.runMutation(
        internal.moveCustomers.createMoveCustomerInternal,
        { email, phoneNumber, name, altPhoneNumber }
      );
    }

    const referral = await ctx.runQuery(
      internal.referrals.getReferralByNameInternal,
      { referralName: "Web Form" }
    );

    const moveId = await ctx.runMutation(internal.moves.createMoveInternal, {
      companyId,
      moveCustomerId,
      serviceType,
      referralId: referral?._id,
      moveStatus: "New Lead",
    });

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "NEW_LEAD",
        companyId,
        moveCustomerId,
        body: `A new lead was created from the web form.`,
        moveId,
      },
    });

    return true;
  },
});

export const getExistingMoveCustomerInternal = internalQuery({
  args: {
    email: v.string(),
    phoneNumber: v.string(),
  },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const { email, phoneNumber } = args;

    const existingCustomerByEmail = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingCustomerByEmail) {
      return existingCustomerByEmail;
    }

    const existingCustomerByPhone = await ctx.db
      .query("users")
      .withIndex("by_phoneNumber", (q) => q.eq("phoneNumber", phoneNumber))
      .first();

    if (existingCustomerByPhone) {
      return existingCustomerByPhone;
    }

    return null;
  },
});

export const createMoveCustomerInternal = internalMutation({
  args: {
    email: v.string(),
    phoneNumber: v.string(),
    name: v.string(),
    altPhoneNumber: v.string(),
  },
  handler: async (ctx, args): Promise<Id<"users">> => {
    const { email, phoneNumber, name, altPhoneNumber } = args;
    const moveCustomerId = await ctx.db.insert("users", {
      email,
      phoneNumber,
      name,
      altPhoneNumber,
      role: ClerkRoles.CUSTOMER,
      isActive: true,
      updatedAt: Date.now(),
    });
    return moveCustomerId;
  },
});

export const updateUserAsCustomer = action({
  args: {
    userId: v.id("users"),
    companyId: v.id("companies"),
    moveId: v.id("moves"),
    updates: v.object({
      name: v.optional(v.string()),
      email: v.optional(v.string()),
      phoneNumber: v.optional(v.string()),
      altPhoneNumber: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args): Promise<boolean> => {
    const { userId, updates, moveId, companyId } = args;
    const identity = await requireAuthenticatedUser(ctx, [ClerkRoles.CUSTOMER]);

    const existingUser = validateUser(
      await ctx.runQuery(internal.users.getUserByIdInternal, {
        userId,
      })
    );

    if (existingUser._id !== identity.convexId) {
      throwConvexError(ErrorMessages.USER_FORBIDDEN_PERMISSION, {
        code: "FORBIDDEN",
        showToUser: true,
      });
    }

    if (updates.email && updates.email !== existingUser.email) {
      const emailTaken = await ctx.runQuery(
        internal.moveCustomers.getUserByEmailInternal,
        {
          email: updates.email!,
        }
      );

      if (emailTaken) {
        throwConvexError(ErrorMessages.CUSTOMER_EMAIL_TAKEN, {
          code: "CONFLICT",
          showToUser: true,
        });
      }
    }

    if (
      updates.phoneNumber &&
      updates.phoneNumber !== existingUser.phoneNumber
    ) {
      const phoneTaken = await ctx.runQuery(
        internal.moveCustomers.getUserByPhoneNumberInternal,
        {
          phoneNumber: updates.phoneNumber!,
        }
      );

      if (phoneTaken) {
        throwConvexError(ErrorMessages.CUSTOMER_PHONE_TAKEN, {
          code: "CONFLICT",
          showToUser: true,
        });
      }
    }

    await ctx.runMutation(internal.users.updateUserInternal, {
      userId,
      updates: {
        ...updates,
      },
    });

    if (
      existingUser.clerkUserId &&
      updates.name &&
      updates.name !== existingUser.name
    ) {
      await updateUserNameHelper(existingUser.clerkUserId, updates.name);
    }

    await ctx.runMutation(internal.newsfeeds.createNewsFeedEntry, {
      entry: {
        type: "CUSTOMER_UPDATED",
        companyId: companyId,
        moveCustomerId: existingUser._id,
        body: `**${existingUser.name}** updated their details.`,
        moveId,
      },
    });

    return true;
  },
});

export const getUserByEmailInternal = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const { email } = args;
    return ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();
  },
});

export const getUserByPhoneNumberInternal = internalQuery({
  args: { phoneNumber: v.string() },
  handler: async (ctx, args): Promise<Doc<"users"> | null> => {
    const { phoneNumber } = args;
    return ctx.db
      .query("users")
      .withIndex("by_phoneNumber", (q) => q.eq("phoneNumber", phoneNumber))
      .first();
  },
});
