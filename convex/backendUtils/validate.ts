import {
  CompanyContactSchema,
  CompanySchema,
  ComplianceSchema,
  InvitationSchema,
  ReferralSchema,
  ScriptSchema,
  UserSchema,
  VariableSchema,
  WebIntegrationsSchema,
} from "@/types/convex-schemas";
import { CommunicationType, InvitationStatus, UserRole } from "@/types/enums";
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

export function validateReferral(
  referral: ReferralSchema | null
): ReferralSchema {
  if (!referral) {
    throw new Error(ErrorMessages.REFERRAL_NOT_FOUND);
  }

  if (!referral.isActive) {
    throw new Error(ErrorMessages.REFERRAL_INACTIVE);
  }

  return referral;
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

export function validateVariable(
  variable: VariableSchema | null
): VariableSchema {
  if (!variable) {
    throw new Error(ErrorMessages.VARIABLE_NOT_FOUND);
  }

  return variable;
}

export const validateScriptFields = (
  type: CommunicationType,
  emailTitle?: string
) => {
  if (
    type === CommunicationType.EMAIL &&
    (!emailTitle || emailTitle.trim() === "")
  ) {
    throw new Error(ErrorMessages.EMAIL_TITLE_REQUIRED);
  }
};

export function validateScript(
  script: ScriptSchema | null,
  checkActive: boolean = true,
  checkIfPreset?: boolean
): ScriptSchema {
  if (!script) {
    throw new Error(ErrorMessages.SCRIPT_NOT_FOUND);
  }

  if (checkActive && !script.isActive) {
    throw new Error(ErrorMessages.SCRIPT_INACTIVE);
  }
  if (checkIfPreset && script.preSetTypes) {
    throw new Error(ErrorMessages.SCRIPT_PRESET_CANNOT_BE_DELETED);
  }

  return script;
}

export function validateCompliance(
  compliance: ComplianceSchema | null
): ComplianceSchema {
  if (!compliance) {
    throw new Error(ErrorMessages.COMPLIANCE_NOT_FOUND);
  }
  return compliance;
}

export function validateWebIntegrations(
  webIntegrations: WebIntegrationsSchema | null
): WebIntegrationsSchema {
  if (!webIntegrations) {
    throw new Error(ErrorMessages.WEB_INTEGRATIONS_NOT_FOUND);
  }
  return webIntegrations;
}

export function validateCompanyContact(
  companyContact: CompanyContactSchema | null
): CompanyContactSchema {
  if (!companyContact) {
    throw new Error(ErrorMessages.COMPANY_CONTACT_NOT_FOUND);
  }
  return companyContact;
}
