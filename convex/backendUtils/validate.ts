import {
  AdditionalFeeSchema,
  ArrivalWindowSchema,
  CategorySchema,
  CompanyContactSchema,
  CompanySchema,
  ComplianceSchema,
  CreditCardFeeSchema,
  DiscountSchema,
  FeeSchema,
  InsurancePolicySchema,
  InvitationSchema,
  ItemSchema,
  LaborSchema,
  MoveAssignmentSchema,
  MoveCustomerSchema,
  MoveSchema,
  PolicySchema,
  QuoteSchema,
  ReferralSchema,
  RoomSchema,
  ScriptSchema,
  TravelFeeSchema,
  VariableSchema,
  WebIntegrationsSchema,
} from "@/types/convex-schemas";
import { InvitationStatus, UserRole } from "@/types/enums";
import { CommunicationType } from "@/types/types";
import { ErrorMessages } from "@/types/errors";
import { UserIdentity } from "convex/server";
import { MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";

export function validateUser(
  user: Doc<"users"> | null,
  checkActive: boolean = true,
  checkCompany?: boolean,
  checkCustomer?: boolean
): Doc<"users"> {
  if (!user) {
    throw new Error(ErrorMessages.USER_NOT_FOUND);
  }

  if (checkActive && !user.isActive) {
    throw new Error(ErrorMessages.USER_INACTIVE);
  }

  if (checkCompany && !user.companyId) {
    throw new Error(ErrorMessages.USER_NO_COMPANY);
  }

  if (checkCustomer && !user.customerId) {
    throw new Error(ErrorMessages.USER_NOT_CUSTOMER);
  }

  return user;
}

export function validateCompany(
  company: Doc<"companies"> | null,
  checkActive: boolean = true
): Doc<"companies"> {
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

  if (identity.clerk_org_id !== clerkOrgId) {
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

export function validateQuote(quote: QuoteSchema | null): QuoteSchema {
  if (!quote) {
    throw new Error(ErrorMessages.QUOTE_NOT_FOUND);
  }

  return quote;
}

export const validateScriptFields = (
  type: CommunicationType,
  emailTitle?: string
) => {
  if (type === "email" && (!emailTitle || emailTitle.trim() === "")) {
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
  compliance: Doc<"compliance"> | null
): Doc<"compliance"> {
  if (!compliance) {
    throw new Error(ErrorMessages.COMPLIANCE_NOT_FOUND);
  }
  return compliance;
}

export function validateWebIntegrations(
  webIntegrations: Doc<"webIntegrations"> | null
): Doc<"webIntegrations"> {
  if (!webIntegrations) {
    throw new Error(ErrorMessages.WEB_INTEGRATIONS_NOT_FOUND);
  }
  return webIntegrations;
}

export function validateCompanyContact(
  companyContact: Doc<"companyContact"> | null
): Doc<"companyContact"> {
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

export function validatePolicy(
  policy: Doc<"policies"> | null
): Doc<"policies"> {
  if (!policy) {
    throw new Error(ErrorMessages.POLICY_NOT_FOUND);
  }
  return policy;
}

export const validateLaborDateOverlap = async (
  ctx: MutationCtx,
  companyId: Id<"companies">,
  startDate: number | null,
  endDate: number | null
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
      labor.startDate !== null &&
      labor.endDate !== null &&
      startDate! < labor.endDate! &&
      endDate! > labor.startDate!
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
  creditCardFee: Doc<"creditCardFees"> | null
): Doc<"creditCardFees"> {
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
  travelFee: Doc<"travelFee"> | null
): Doc<"travelFee"> {
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

export function validateMove(move: Doc<"move"> | null): Doc<"move"> {
  if (!move) {
    throw new Error(ErrorMessages.MOVE_NOT_FOUND);
  }
  return move;
}

export function validateMoveAssignment(
  moveAssignment: MoveAssignmentSchema | null
): MoveAssignmentSchema {
  if (!moveAssignment) {
    throw new Error(ErrorMessages.MOVE_ASSIGNMENT_NOT_FOUND);
  }
  return moveAssignment;
}

export function validateAdditionalFee(
  additionalFee: AdditionalFeeSchema | null
): AdditionalFeeSchema {
  if (!additionalFee) {
    throw new Error(ErrorMessages.ADDITIONAL_FEE_NOT_FOUND);
  }
  return additionalFee;
}

export function validateDiscount(
  discount: DiscountSchema | null
): DiscountSchema {
  if (!discount) {
    throw new Error(ErrorMessages.DISCOUNT_NOT_FOUND);
  }
  return discount;
}

export function validateMoveCustomer(
  moveCustomer: Doc<"moveCustomers"> | null
): Doc<"moveCustomers"> {
  if (!moveCustomer) {
    throw new Error(ErrorMessages.MOVE_CUSTOMER_NOT_FOUND);
  }
  return moveCustomer;
}
