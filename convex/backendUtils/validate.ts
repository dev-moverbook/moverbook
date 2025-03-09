import {
  ArrivalWindowSchema,
  CategorySchema,
  CompanyContactSchema,
  CompanySchema,
  ComplianceSchema,
  CreditCardFeeSchema,
  FeeSchema,
  InsurancePolicySchema,
  InvitationSchema,
  ItemSchema,
  LaborSchema,
  PolicySchema,
  ReferralSchema,
  RoomSchema,
  ScriptSchema,
  TravelFeeSchema,
  UserSchema,
  VariableSchema,
  WebIntegrationsSchema,
} from "@/types/convex-schemas";
import { CommunicationType, InvitationStatus, UserRole } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { UserIdentity } from "convex/server";
import { MutationCtx } from "../_generated/server";
import { Id } from "../_generated/dataModel";

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

export function validateArrivalWindow(
  arrivalWindow: ArrivalWindowSchema | null
): ArrivalWindowSchema {
  if (!arrivalWindow) {
    throw new Error(ErrorMessages.ARRIVAL_WINDOW_NOT_FOUND);
  }
  return arrivalWindow;
}

export function validatePolicy(policy: PolicySchema | null): PolicySchema {
  if (!policy) {
    throw new Error(ErrorMessages.POLICY_NOT_FOUND);
  }
  return policy;
}

export const validateLaborDateOverlap = async (
  ctx: MutationCtx,
  companyId: Id<"companies">,
  startDate?: number,
  endDate?: number
): Promise<void> => {
  if (!startDate && !endDate) {
    return;
  }

  if (!startDate !== !endDate) {
    throw new Error(ErrorMessages.LABOR_START_DATES_INCOMPLETE);
  }

  const existingLabors = await ctx.db
    .query("labor")
    .filter((q) => q.eq(q.field("companyId"), companyId))
    .collect();

  const hasOverlap = existingLabors.some(
    (labor) =>
      labor.startDate !== undefined &&
      labor.endDate !== undefined &&
      startDate! < labor.endDate &&
      endDate! > labor.startDate
  );

  if (hasOverlap) {
    throw new Error(ErrorMessages.LABOR_OVERLAPS);
  }
};

export function validateLabor(labor: LaborSchema | null): LaborSchema {
  if (!labor) {
    throw new Error(ErrorMessages.LABOR_NOT_FOUND);
  }
  return labor;
}

export function validateInsurancePolicy(
  insurancePolicy: InsurancePolicySchema | null
): InsurancePolicySchema {
  if (!insurancePolicy) {
    throw new Error(ErrorMessages.INSURANCE_POLICY_NOT_FOUND);
  }
  return insurancePolicy;
}

export function validateCreditCardFee(
  creditCardFee: CreditCardFeeSchema | null
): CreditCardFeeSchema {
  if (!creditCardFee) {
    throw new Error(ErrorMessages.CREDIT_CARD_FEE_NOT_FOUND);
  }
  return creditCardFee;
}

export function validateFee(fee: FeeSchema | null): FeeSchema {
  if (!fee) {
    throw new Error(ErrorMessages.FEE_NOT_FOUND);
  }
  return fee;
}

export function validateTravelFee(
  travelFee: TravelFeeSchema | null
): TravelFeeSchema {
  if (!travelFee) {
    throw new Error(ErrorMessages.TRAVEL_FEE_NOT_FOUND);
  }
  return travelFee;
}

export async function validateUniqueRoomName(
  ctx: MutationCtx,
  companyId: Id<"companies">,
  name: string
): Promise<void> {
  const existingRoom = await ctx.db
    .query("rooms")
    .filter((q) => q.eq(q.field("companyId"), companyId))
    .filter((q) => q.eq(q.field("name"), name))
    .first();

  if (existingRoom) {
    throw new Error(ErrorMessages.ROOM_NAME_ALREADY_EXISTS);
  }
}

export function validateRoom(room: RoomSchema | null): RoomSchema {
  if (!room) {
    throw new Error(ErrorMessages.ROOM_NOT_FOUND);
  }

  if (!room.isActive) {
    throw new Error(ErrorMessages.ROOM_INACTIVE);
  }

  return room;
}

export function validateCategory(
  category: CategorySchema | null
): CategorySchema {
  if (!category) {
    throw new Error(ErrorMessages.CATEGORY_NOT_FOUND);
  }

  if (!category.isActive) {
    throw new Error(ErrorMessages.CATEGORY_INACTIVE);
  }

  return category;
}

export function validateItem(item: ItemSchema | null): ItemSchema {
  if (!item) {
    throw new Error(ErrorMessages.ITEM_NOT_FOUND);
  }
  if (!item.isActive) {
    throw new Error(ErrorMessages.ITEM_INACTIVE);
  }
  return item;
}
