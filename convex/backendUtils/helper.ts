import { ErrorMessages } from "@/types/errors";
import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";
import {
  DEFAULT_WEEKDAY_HOUR_MINIMUM,
  DEFAULT_WEEKEND_HOUR_MINIMUM,
  DEFAULT_DEPOSIT,
  DEFAULT_CANCELLATION_FEE,
  DEFAULT_CANCELLATION_CUTOFF_HOUR,
  DEFAULT_BILL_OF_LADING_DISCLAIMER_AND_TERMS,
  DEFAULT_EXTRA_RATE,
  DEFAULT_FOUR_MOVERS_RATE,
  DEFAULT_IS_ACTIVE,
  DEFAULT_IS_DEFAULT,
  DEFAULT_PRICING_NAME,
  DEFAULT_THREE_MOVERS_RATE,
  DEFAULT_TWO_MOVERS_RATE,
  DEFAULT_INSURANCE_NAME,
  DEFAULT_COVERAGE_AMOUNT,
  DEFAULT_COVERAGE_TYPE,
  DEFAULT_PREMIUM,
  DEFAULT_CREDIT_CARD_FEE_RATE,
  DEFAULT_TRAVEL_CHARGING_METHOD,
  DEFAULT_TRAVEL_RATE,
  DEFAULT_ROOMS,
} from "@/types/const";

export const createCompanyRecords = async (
  ctx: MutationCtx,
  companyId: Id<"companies">
): Promise<void> => {
  try {
    await ctx.db.insert("compliance", {
      companyId,
      statePucPermitNumber: "",
      dmvNumber: "",
      usDotNumber: "",
    });

    await ctx.db.insert("webIntegrations", {
      companyId,
      webform: "",
      webformEmbeddedCode: "",
    });

    await ctx.db.insert("companyContact", {
      companyId,
      email: "",
      phoneNumber: "",
      address: "",
      website: "",
    });

    await ctx.db.insert("arrivalWindow", {
      companyId,
      morningArrival: "08:00",
      morningEnd: "11:00",
      afternoonArrival: "13:00",
      afternoonEnd: "16:00",
    });

    await ctx.db.insert("policies", {
      companyId,
      weekdayHourMinimum: DEFAULT_WEEKDAY_HOUR_MINIMUM,
      weekendHourMinimum: DEFAULT_WEEKEND_HOUR_MINIMUM,
      deposit: DEFAULT_DEPOSIT,
      cancellationFee: DEFAULT_CANCELLATION_FEE,
      cancellationCutoffHour: DEFAULT_CANCELLATION_CUTOFF_HOUR,
      billOfLandingDisclaimerAndTerms:
        DEFAULT_BILL_OF_LADING_DISCLAIMER_AND_TERMS,
    });

    await ctx.db.insert("labor", {
      companyId,
      name: DEFAULT_PRICING_NAME,
      isDefault: DEFAULT_IS_DEFAULT,
      twoMovers: DEFAULT_TWO_MOVERS_RATE,
      threeMovers: DEFAULT_THREE_MOVERS_RATE,
      fourMovers: DEFAULT_FOUR_MOVERS_RATE,
      extra: DEFAULT_EXTRA_RATE,
      isActive: DEFAULT_IS_ACTIVE,
      startDate: null,
      endDate: null,
    });

    await ctx.db.insert("insurancePolicies", {
      companyId,
      name: DEFAULT_INSURANCE_NAME,
      premium: DEFAULT_PREMIUM,
      coverageType: DEFAULT_COVERAGE_TYPE,
      coverageAmount: DEFAULT_COVERAGE_AMOUNT,
      isActive: DEFAULT_IS_ACTIVE,
      isDefault: DEFAULT_IS_DEFAULT,
    });

    await ctx.db.insert("creditCardFees", {
      companyId,
      rate: DEFAULT_CREDIT_CARD_FEE_RATE,
    });

    await ctx.db.insert("travelFee", {
      companyId,
      isDefault: true,
      chargingMethod: DEFAULT_TRAVEL_CHARGING_METHOD,
      rate: DEFAULT_TRAVEL_RATE,
    });

    // Create Default Variables
    const defaultVariables = [
      {
        name: "customer_name",
        defaultValue: "customer",
      },
      { name: "move_date", defaultValue: "move date" },
    ];

    // Insert default starter rooms
    for (const name of DEFAULT_ROOMS) {
      await ctx.db.insert("rooms", {
        companyId,
        name,
        isActive: true,
        isStarter: true,
      });
    }

    for (const variable of defaultVariables) {
      await ctx.db.insert("variables", { companyId, ...variable });
    }
  } catch (error) {
    console.error("Error creating company-related records:", error);
    throw new Error(ErrorMessages.COMPANY_RELATED_RECORDS_CREATE_ERROR);
  }
};

export const shouldExposeError = (errorMessage: string): boolean => {
  const allowedErrors: string[] = [
    ErrorMessages.LABOR_START_DATES_INCOMPLETE,
    ErrorMessages.LABOR_OVERLAPS,
    ErrorMessages.ROOM_NAME_ALREADY_EXISTS,
  ];

  return allowedErrors.includes(errorMessage);
};

type ParsedAddress = {
  line1: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export function parseFullAddressToSendgridFormat(
  fullAddress: string
): ParsedAddress {
  const parts = fullAddress.split(",").map((p) => p.trim());

  const [line1 = "", city = "", stateZip = "", country = ""] = parts;
  const [state = "", zip = ""] = stateZip.split(" ").map((p) => p.trim());

  return {
    line1,
    city,
    state,
    zip,
    country,
  };
}

export async function unsetOtherDefaultPolicies(
  ctx: MutationCtx,
  companyId: Id<"companies">
) {
  const existingPolicies = await ctx.db
    .query("insurancePolicies")
    .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
    .collect();

  const updates = existingPolicies
    .filter((policy) => policy.isDefault)
    .map((policy) => ctx.db.patch(policy._id, { isDefault: false }));

  await Promise.all(updates);
}

export async function unsetOtherDefaultLabor(
  ctx: MutationCtx,
  companyId: Id<"companies">
): Promise<void> {
  const existing = await ctx.db
    .query("labor")
    .withIndex("by_companyId", (q) => q.eq("companyId", companyId))
    .collect();

  const updates = existing
    .filter((item) => item.isDefault)
    .map((item) => ctx.db.patch(item._id, { isDefault: false }));

  await Promise.all(updates);
}
