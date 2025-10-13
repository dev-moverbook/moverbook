import { ActionCtx, MutationCtx, QueryCtx } from "@/convex/_generated/server";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { UserIdentity } from "convex/server";
import { ConvexError } from "convex/values";

export async function requireAuthenticatedUser(
  ctx: MutationCtx | ActionCtx | QueryCtx,
  requiredRoles?: ClerkRoles[]
): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: ErrorMessages.USER_NOT_AUTHENTICATED,
    });
  }

  const userRole = identity.role as ClerkRoles;

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: ErrorMessages.USER_FORBIDDEN_PERMISSION,
    });
  }

  return identity;
}
