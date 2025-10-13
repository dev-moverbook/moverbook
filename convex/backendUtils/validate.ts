import { InvitationStatus, UserRole } from "@/types/enums";
import { CommunicationType } from "@/types/types";
import { ErrorMessages } from "@/types/errors";
import { UserIdentity } from "convex/server";
import { MutationCtx } from "../_generated/server";
import { Doc, Id } from "../_generated/dataModel";
import { ConvexError } from "convex/values";

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
  invitation: Doc<"invitations"> | null
): Doc<"invitations"> {
  if (!invitation) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.INVITATION_NOT_FOUND,
    });
  }

  if (invitation.status === InvitationStatus.ACCEPTED) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.INVITATION_ALREADY_ACCEPTED,
    });
  }
  if (invitation.status === InvitationStatus.REVOKED) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.INVITATION_ALREADY_REVOKED,
    });
  }

  return invitation;
}

export function validateReferral(
  referral: Doc<"referrals"> | null
): Doc<"referrals"> {
  if (!referral) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.REFERRAL_NOT_FOUND,
    });
  }

  if (!referral.isActive) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.REFERRAL_INACTIVE,
    });
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
    throw new ConvexError({
      code: "FORBIDDEN",
      message: ErrorMessages.FOBIDDEN_COMPANY,
    });
  }

  return true;
}

export function validateVariable(
  variable: Doc<"variables"> | null
): Doc<"variables"> {
  if (!variable) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.VARIABLE_NOT_FOUND,
    });
  }

  return variable;
}

export function validateQuote(quote: Doc<"quotes"> | null): Doc<"quotes"> {
  if (!quote) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.QUOTE_NOT_FOUND,
    });
  }

  return quote;
}

export const validateScriptFields = (
  type: CommunicationType,
  emailTitle?: string
) => {
  if (type === "email" && (!emailTitle || emailTitle.trim() === "")) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.EMAIL_TITLE_REQUIRED,
    });
  }
};

export function validateScript(
  script: Doc<"scripts"> | null,
  checkActive: boolean = true,
  checkIfPreset?: boolean
): Doc<"scripts"> {
  if (!script) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.SCRIPT_NOT_FOUND,
    });
  }

  if (checkActive && !script.isActive) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.SCRIPT_INACTIVE,
    });
  }
  if (checkIfPreset && script.preSetTypes) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.SCRIPT_PRESET_CANNOT_BE_DELETED,
    });
  }

  return script;
}

export function validateCompliance(
  compliance: Doc<"compliance"> | null
): Doc<"compliance"> {
  if (!compliance) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.COMPLIANCE_NOT_FOUND,
    });
  }
  return compliance;
}

export function validateWebIntegrations(
  webIntegrations: Doc<"webIntegrations"> | null
): Doc<"webIntegrations"> {
  if (!webIntegrations) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.WEB_INTEGRATIONS_NOT_FOUND,
    });
  }
  return webIntegrations;
}

export function validateCompanyContact(
  companyContact: Doc<"companyContact"> | null
): Doc<"companyContact"> {
  if (!companyContact) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.COMPANY_CONTACT_NOT_FOUND,
    });
  }
  return companyContact;
}

export function validateArrivalWindow(
  arrivalWindow: Doc<"arrivalWindow"> | null
): Doc<"arrivalWindow"> {
  if (!arrivalWindow) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.ARRIVAL_WINDOW_NOT_FOUND,
    });
  }
  return arrivalWindow;
}

export function validatePolicy(
  policy: Doc<"policies"> | null
): Doc<"policies"> {
  if (!policy) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.POLICY_NOT_FOUND,
    });
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
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.LABOR_START_DATES_INCOMPLETE,
    });
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
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.LABOR_OVERLAPS,
    });
  }
};

export function validateLabor(labor: Doc<"labor"> | null): Doc<"labor"> {
  if (!labor) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.LABOR_NOT_FOUND,
    });
  }
  return labor;
}

export function validateInsurancePolicy(
  insurancePolicy: Doc<"insurancePolicies"> | null
): Doc<"insurancePolicies"> {
  if (!insurancePolicy) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.INSURANCE_POLICY_NOT_FOUND,
    });
  }
  return insurancePolicy;
}

export function validateCreditCardFee(
  creditCardFee: Doc<"creditCardFees"> | null
): Doc<"creditCardFees"> {
  if (!creditCardFee) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.CREDIT_CARD_FEE_NOT_FOUND,
    });
  }
  return creditCardFee;
}

export function validateFee(fee: Doc<"fees"> | null): Doc<"fees"> {
  if (!fee) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.FEE_NOT_FOUND,
    });
  }
  return fee;
}

export function validateTravelFee(
  travelFee: Doc<"travelFee"> | null
): Doc<"travelFee"> {
  if (!travelFee) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.TRAVEL_FEE_NOT_FOUND,
    });
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
    throw new ConvexError({
      code: "CONFLICT",
      message: ErrorMessages.ROOM_NAME_ALREADY_EXISTS,
    });
  }
}

export function validateRoom(room: Doc<"rooms"> | null): Doc<"rooms"> {
  if (!room) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.ROOM_NOT_FOUND,
    });
  }

  if (!room.isActive) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.ROOM_INACTIVE,
    });
  }

  return room;
}

export function validateCategory(
  category: Doc<"categories"> | null
): Doc<"categories"> {
  if (!category) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.CATEGORY_NOT_FOUND,
    });
  }

  if (!category.isActive) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.CATEGORY_INACTIVE,
    });
  }

  return category;
}

export function validateItem(item: Doc<"items"> | null): Doc<"items"> {
  if (!item) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.ITEM_NOT_FOUND,
    });
  }
  if (!item.isActive) {
    throw new ConvexError({
      code: "BAD_REQUEST",
      message: ErrorMessages.ITEM_INACTIVE,
    });
  }
  return item;
}

export function validateMove(move: Doc<"move"> | null): Doc<"move"> {
  if (!move) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.MOVE_NOT_FOUND,
    });
  }
  return move;
}

export function validateMoveAssignment(
  moveAssignment: Doc<"moveAssignments"> | null
): Doc<"moveAssignments"> {
  if (!moveAssignment) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.MOVE_ASSIGNMENT_NOT_FOUND,
    });
  }
  return moveAssignment;
}

export function validateAdditionalFee(
  additionalFee: Doc<"additionalFees"> | null
): Doc<"additionalFees"> {
  if (!additionalFee) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.ADDITIONAL_FEE_NOT_FOUND,
    });
  }
  return additionalFee;
}

export function validateDiscount(
  discount: Doc<"discounts"> | null
): Doc<"discounts"> {
  if (!discount) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.DISCOUNT_NOT_FOUND,
    });
  }
  return discount;
}

export function validateMoveCustomer(
  moveCustomer: Doc<"moveCustomers"> | null
): Doc<"moveCustomers"> {
  if (!moveCustomer) {
    throw new ConvexError({
      code: "NOT_FOUND",
      message: ErrorMessages.MOVE_CUSTOMER_NOT_FOUND,
    });
  }
  return moveCustomer;
}
