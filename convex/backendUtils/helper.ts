import { ErrorMessages } from "@/types/errors";
import { Doc, Id } from "../_generated/dataModel";
import { MutationCtx, QueryCtx } from "../_generated/server";
import {
  DEFAULT_WEEKDAY_HOUR_MINIMUM,
  DEFAULT_WEEKEND_HOUR_MINIMUM,
  DEFAULT_DEPOSIT,
  DEFAULT_CANCELLATION_FEE,
  DEFAULT_CANCELLATION_CUTOFF_HOUR,
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
  DEFAULT_ROOMS,
  DEFAULT_ADDITIONAL_TERMS_AND_CONDITIONS,
  STARTER_ITEMS,
  STARTER_CATEGORIES,
} from "@/types/const";
import { ResponseStatus } from "@/types/enums";
import { ErrorResponse } from "@/types/convex-responses";
import { HistoricalPoint, IncomeTotals, MoveExpenseInfo } from "@/types/types";

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
      externalReviewUrl: "",
    });

    await ctx.db.insert("companyContact", {
      companyId,
      email: "",
      phoneNumber: "",
      address: null,
      website: "",
    });

    await ctx.db.insert("arrivalWindow", {
      companyId,
      morningArrival: "08:00",
      morningEnd: "11:00",
      afternoonArrival: "12:00",
      afternoonEnd: "15:00",
    });

    await ctx.db.insert("policies", {
      companyId,
      weekdayHourMinimum: DEFAULT_WEEKDAY_HOUR_MINIMUM,
      weekendHourMinimum: DEFAULT_WEEKEND_HOUR_MINIMUM,
      deposit: DEFAULT_DEPOSIT,
      cancellationFee: DEFAULT_CANCELLATION_FEE,
      cancellationCutoffHour: DEFAULT_CANCELLATION_CUTOFF_HOUR,
      additionalTermsAndConditions: DEFAULT_ADDITIONAL_TERMS_AND_CONDITIONS,
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
      defaultMethod: DEFAULT_TRAVEL_CHARGING_METHOD,
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

    for (const category of STARTER_CATEGORIES) {
      await ctx.db.insert("categories", {
        companyId,
        name: category.name,
        isActive: true,
        isStarter: true,
      });
    }

    for (const item of STARTER_ITEMS) {
      await ctx.db.insert("items", {
        ...item,
        companyId,
        isStarter: true,
        isActive: true,
        isPopular: false,
      });
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
    ErrorMessages.INVALID_MOVE_ID,
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

export function handleInternalError(error: unknown): ErrorResponse {
  const errorMessage =
    error instanceof Error ? error.message : ErrorMessages.GENERIC_ERROR;
  console.error(errorMessage);
  return {
    status: ResponseStatus.ERROR,
    data: null,
    error: shouldExposeError(errorMessage)
      ? errorMessage
      : ErrorMessages.GENERIC_ERROR,
  };
}

export function toIsoDateInTimeZone(input: string, timeZone: string): string {
  const date = new Date(input);
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((map, part) => {
      if (part.type !== "literal") map[part.type] = part.value;
      return map;
    }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
}

export function enumerateDaysInclusive(
  startDay: string,
  endDay: string
): string[] {
  const dayList: string[] = [];
  const startDateUtc = new Date(`${startDay}T00:00:00Z`);
  const endDateUtc = new Date(`${endDay}T00:00:00Z`);
  for (
    let currentDateUtc = startDateUtc;
    currentDateUtc <= endDateUtc;
    currentDateUtc = new Date(currentDateUtc.getTime() + 86_400_000)
  ) {
    dayList.push(currentDateUtc.toISOString().slice(0, 10));
  }
  return dayList;
}

function initializeTotalsByDay(
  startDay: string,
  endDay: string
): Record<string, IncomeTotals> {
  const totals: Record<string, IncomeTotals> = {};
  for (const day of enumerateDaysInclusive(startDay, endDay)) {
    totals[day] = { revenue: 0, expense: 0, profit: 0 };
  }
  return totals;
}

function addMoveToTotals(
  move: Doc<"move">,
  expenseByMoveId: Map<Id<"move">, MoveExpenseInfo>,
  timeZone: string,
  totals: Record<string, IncomeTotals>
) {
  if (!move.moveDate) {
    return;
  }
  const expenseInfo = expenseByMoveId.get(move._id);
  if (!expenseInfo || !expenseInfo.hasApproved) {
    return;
  }
  const bucketDay = toIsoDateInTimeZone(move.moveDate, timeZone);
  const revenue =
    Number(move.deposit ?? 0) + Number(move.invoiceAmountPaid ?? 0);
  const expense = expenseInfo.expense;
  const profit = revenue - expense;
  if (!totals[bucketDay])
    totals[bucketDay] = { revenue: 0, expense: 0, profit: 0 };
  totals[bucketDay].revenue += revenue;
  totals[bucketDay].expense += expense;
  totals[bucketDay].profit += profit;
}

function formatHistoricalSeries(
  totals: Record<string, { revenue: number; expense: number; profit: number }>
): HistoricalPoint[] {
  return Object.entries(totals)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, sums]) => ({
      date,
      expense: sums.expense ?? 0,
      profit: sums.profit ?? 0,
      revenue: sums.revenue ?? 0,
    }));
}

export function buildHistoricalSeries(
  startDay: string,
  endDay: string,
  moves: Doc<"move">[],
  timeZone: string,
  expenseByMoveId: Map<Id<"move">, MoveExpenseInfo>
): HistoricalPoint[] {
  const totals = initializeTotalsByDay(startDay, endDay);
  for (const move of moves)
    addMoveToTotals(move, expenseByMoveId, timeZone, totals);
  return formatHistoricalSeries(totals);
}

export async function getApprovedPayTotalsForMoves(
  context: QueryCtx,
  moveIds: Id<"move">[]
): Promise<Map<Id<"move">, MoveExpenseInfo>> {
  const entries: Array<readonly [Id<"move">, MoveExpenseInfo]> =
    await Promise.all(
      moveIds.map(async (moveId) => {
        const assignments = await context.db
          .query("moveAssignments")
          .withIndex("by_move", (indexRange) => indexRange.eq("moveId", moveId))
          .collect();

        const approvedPays = assignments
          .map((assignment) => assignment.approvedPay)
          .filter(
            (value): value is number =>
              typeof value === "number" && Number.isFinite(value)
          );

        const hasApproved = approvedPays.length > 0;
        const expense = hasApproved
          ? approvedPays.reduce((sum, value) => sum + value, 0)
          : 0;

        const info: MoveExpenseInfo = { expense, hasApproved };
        return [moveId, info] as const;
      })
    );

  return new Map(entries);
}
