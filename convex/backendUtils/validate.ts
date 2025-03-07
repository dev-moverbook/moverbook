import {
  CompanySchema,
  InvitationSchema,
  UserSchema,
} from "@/types/convex-schemas";
import { InvitationStatus, UserRole } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { UserIdentity } from "convex/server";

export function validateUser(
  user: UserSchema | null,
  checkActive: boolean = true,
  checkCompany?: boolean
): UserSchema {
  if (!user) {
    throw new Error(ErrorMessages.USER_NOT_FOUND);
  }

  if (checkActive && !user.isActive) {
    throw new Error(ErrorMessages.USER_INACTIVE);
  }

  if (checkCompany && !user.companyId) {
    throw new Error(ErrorMessages.USER_NO_COMPANY);
  }

  return user;
}

export function validateCompany(
  company: CompanySchema | null,
  checkActive: boolean = true
): CompanySchema {
  if (!company) {
    throw new Error(ErrorMessages.COMPANY_NOT_FOUND);
  }

  if (checkActive && !company.isActive) {
    throw new Error(ErrorMessages.COMPANY_INACTIVE);
  }

  return company;
}

export function validateInvitation(
  invitation: InvitationSchema | null
): InvitationSchema {
  if (!invitation) {
    throw new Error(ErrorMessages.INVITATION_NOT_FOUND);
  }

  if (invitation.status === InvitationStatus.ACCEPTED) {
    throw new Error(ErrorMessages.INVITATION_ALREADY_ACCEPTED);
  }
  if (invitation.status === InvitationStatus.REVOKED) {
    throw new Error(ErrorMessages.INVITATION_ALREADY_REVOKED);
  }

  return invitation;
}

export function isUserInOrg(
  identity: UserIdentity,
  clerkOrgId: string
): boolean {
  const allowedRoles = [UserRole.APP_MODERATOR];

  if (allowedRoles.includes(identity.role as UserRole)) {
    return true;
  }

  if (identity.org_id !== clerkOrgId) {
    throw new Error(ErrorMessages.FOBIDDEN_COMPANY);
  }

  return true;
}
