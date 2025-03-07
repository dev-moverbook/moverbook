import { ActionCtx, MutationCtx, QueryCtx } from "@/convex/_generated/server";
import { ClerkRoles } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { UserIdentity } from "convex/server";

export async function requireAuthenticatedUser(
  ctx: MutationCtx | ActionCtx | QueryCtx,
  requiredRoles?: ClerkRoles[]
): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error(ErrorMessages.USER_NOT_AUTHENTICATED);
  }

  const userRole = identity.role as ClerkRoles;

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    throw new Error(ErrorMessages.USER_FORBIDDEN_PERMISSION);
  }

  return identity;
}
