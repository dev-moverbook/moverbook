import { ErrorMessages } from "@/types/errors";
import { Id } from "../_generated/dataModel";
import { MutationCtx } from "../_generated/server";

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

    // Create Default Variables
    const defaultVariables = [
      {
        name: "customer_name",
        defaultValue: "customer",
      },
      { name: "move_date", defaultValue: "move date" },
    ];

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
    ErrorMessages.VARIABLE_NOT_FOUND,
    ErrorMessages.COMPANY_NOT_FOUND,
  ];

  return allowedErrors.includes(errorMessage);
};
