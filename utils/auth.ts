import { ActionCtx, MutationCtx } from "@/convex/_generated/server";
import { UserRole } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { UserIdentity } from "convex/server";

export async function requireAuthenticatedUser(
  ctx: MutationCtx | ActionCtx,
  requiredRoles?: UserRole[]
): Promise<UserIdentity> {
  const identity = await ctx.auth.getUserIdentity();
  console.log("idendity", identity);
  if (!identity) {
    throw new Error(ErrorMessages.USER_NOT_AUTHENTICATED);
  }

  const userRole = identity.role as UserRole;

  if (requiredRoles && !requiredRoles.includes(userRole)) {
    throw new Error(ErrorMessages.USER_FORBIDDEN_PERMISSION);
  }

  return identity;
}
