import { Doc } from "@/convex/_generated/dataModel";
import { MS_PER_HOUR } from "@/types/const";
import { EnrichedMove, EnrichedMoveAssignment } from "@/types/convex-responses";
import { TravelChargingTypes } from "@/types/enums";
import {
  CostFormat,
  FinalMoveCost,
  JobType,
  PaymentMethod,
  SegmentDistance,
} from "@/types/types";
import { formatCurrency } from "./helper";

const to2Decimals = (n: number) => Math.round(n * 100) / 100;

export function sumPayoutTotals(moves: EnrichedMove[]): {
  pendingTotal: number;
  approvedTotal: number;
  pendingHours: number;
  approvedHours: number;
} {
  let pending = 0;
  let approved = 0;
  let pendingHours = 0;
  let approvedHours = 0;

  for (const move of moves) {
    const wage = move.moverWageForMove;
    if (!wage) continue;

    if (move.hourStatus === "approved") {
      approved += wage.approvedPayout ?? 0;
      approvedHours += wage.approvedHours ?? 0;
    } else if (
      move.hourStatus === "pending" ||
      move.hourStatus === "rejected"
    ) {
      pending += wage.pendingPayout ?? 0;
      pendingHours += wage.pendingHours ?? 0;
    }
  }

  return {
    pendingTotal: to2Decimals(pending),
    approvedTotal: to2Decimals(approved),
    pendingHours: to2Decimals(pendingHours),
    approvedHours: to2Decimals(approvedHours),
  };
}

export function sumMoverExpense(assignments: EnrichedMoveAssignment[]): number {
  return assignments.reduce((total, assignment) => {
    return total + (assignment.approvedPay ?? 0);
  }, 0);
}

export function computeProfit(revenue: number, expense: number): number {
  return revenue - expense;
}

type ComputeQuoteMoveCostParams = {
  creditCardFee: number;
  endingMoveTime: number;
  jobType: JobType;
  jobTypeRate: number | null;
  liabilityCoverage: Doc<"insurancePolicies"> | null;
  moveFees: LineFee[];
  paymentMethod: PaymentMethod;
  segmentDistance: SegmentDistance;
  showTotal?: boolean;
  startingMoveTime: number;
  travelFeeMethod: TravelChargingTypes | null;
  travelFeeRate: number | null;
};

export function computeQuoteMoveCost(
  params: ComputeQuoteMoveCostParams
): FinalMoveCost {
  const {
    creditCardFee,
    endingMoveTime,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    moveFees,
    paymentMethod,
    segmentDistance,
    showTotal,
    startingMoveTime,
    travelFeeMethod,
    travelFeeRate,
  } = params;

  const items: CostFormat[] = [];

  const labor = computeQuoteLaborRate({
    jobType,
    jobTypeRate: jobTypeRate ?? 0,
    startingMoveTime,
    endingMoveTime,
  });
  if (labor) {
    items.push(labor);
  }
  const travel = computeTravelRate({
    segmentDistance,
    travelFeeMethod,
    travelFeeRate,
  });
  if (travel) {
    items.push(travel);
  }

  const liability = formatLiabilityPremium(liabilityCoverage);
  if (liability) {
    items.push(liability);
  }

  items.push(...formatMoveFeeLines(moveFees));

  const subtotalValue = sumCostFormats(items);

  if (showTotal) {
    items.push({ label: "Subtotal", value: subtotalValue });
  }

  if (paymentMethod.kind === "credit_card") {
    const ccFeeItem = formatCreditCardFee(subtotalValue, creditCardFee);
    items.push(ccFeeItem);
  }

  return {
    items,
    total: subtotalValue,
  };
}

type LineFee = { name: string; quantity: number; price: number };
type ComputeFinalMoveCostParams = {
  actualArrivalTime: number;
  actualBreakTime: number;
  actualEndTime: number;
  actualStartTime: number;
  additionalFees: Doc<"additionalFees">[];
  creditCardFee: number;
  deposit: number;
  discounts: Doc<"discounts">[];
  jobType: "hourly" | "flat";
  jobTypeRate: number;
  liabilityCoverage: Doc<"insurancePolicies"> | null;
  moveFees: LineFee[];
  paymentMethod: PaymentMethod;
  segmentDistances: SegmentDistance[];
  travelFeeMethod: TravelChargingTypes | null;
  travelFeeRate: number | null;
};

export function computeFinalMoveCost(
  params: ComputeFinalMoveCostParams
): FinalMoveCost {
  const {
    actualArrivalTime,
    actualBreakTime,
    actualEndTime,
    actualStartTime,
    additionalFees,
    creditCardFee,
    deposit,
    discounts,
    jobType,
    jobTypeRate,
    liabilityCoverage,
    moveFees,
    paymentMethod,
    segmentDistances,
    travelFeeMethod,
    travelFeeRate,
  } = params;

  const items: CostFormat[] = [];

  const labor = computeActualLaborRate({
    actualStartTime,
    actualEndTime,
    actualBreakTime,
    jobType,
    jobTypeRate,
  });
  if (labor) {
    items.push(labor);
  }

  const travel = computeTravelRate({
    actualArrivalTime,
    actualStartTime,
    segmentDistance: segmentDistances[0],
    travelFeeMethod,
    travelFeeRate,
  });
  if (travel) {
    items.push(travel);
  }

  items.push(...formatMoveFeeLines(moveFees));
  items.push(...formatAdditionalFeeLines(additionalFees));

  const liability = formatLiabilityPremium(liabilityCoverage);
  if (liability) {
    items.push(liability);
  }

  items.push(...formatDiscountLines(discounts));

  const depositItem = formatDeposit(deposit);
  if (depositItem) {
    items.push(depositItem);
  }

  const subTotalValue = sumCostFormats(items);
  let total = subTotalValue;

  if (paymentMethod.kind === "credit_card") {
    items.push({ label: "Sub Total", value: subTotalValue });
    const ccFee = formatCreditCardFee(subTotalValue, creditCardFee);

    items.push(ccFee);
    const totalWithFee = formatTotalWithFee(subTotalValue, ccFee.value);
    items.push(totalWithFee);
    total = totalWithFee.value;
  }

  return { items, total };
}
export function computeWorkedHours(
  actualStartTime: number,
  actualEndTime: number,
  actualBreakTime: number
): number {
  const rawHours = (actualEndTime - actualStartTime) / MS_PER_HOUR;
  const worked = rawHours - actualBreakTime;
  return to2Decimals(Math.max(0, worked));
}

function formatLaborLabelAndValue(
  jobType: JobType,
  jobTypeRate: number,
  totalHours: number
): CostFormat {
  if (jobType === "flat") {
    return {
      label: "Labor (flat)",
      value: jobTypeRate,
    };
  }

  if (jobType === "hourly") {
    const value = Number((totalHours * jobTypeRate).toFixed(2));
    const label = `Labor (${totalHours.toFixed(2)} hrs @ ${jobTypeRate.toFixed(
      2
    )}/hr)`;
    return { label, value };
  }

  return { label: "Labor", value: 0 };
}

export function computeQuoteLaborRate(params: {
  jobType: JobType;
  jobTypeRate: number;
  startingMoveTime: number;
  endingMoveTime: number;
}): CostFormat {
  const { jobType, jobTypeRate, startingMoveTime, endingMoveTime } = params;
  const totalHours = endingMoveTime - startingMoveTime;
  return formatLaborLabelAndValue(jobType, jobTypeRate, totalHours);
}

export function computeActualLaborRate({
  actualStartTime,
  actualEndTime,
  actualBreakTime,
  jobType,
  jobTypeRate,
}: {
  actualStartTime: number;
  actualEndTime: number;
  actualBreakTime: number;
  jobType: JobType;
  jobTypeRate: number;
}): CostFormat {
  const totalHours = computeWorkedHours(
    actualStartTime,
    actualEndTime,
    actualBreakTime
  );

  return formatLaborLabelAndValue(jobType, jobTypeRate, totalHours);
}

export function computeTravelHours(
  actualArrivalTime: number,
  actualStartTime: number
): number {
  const rawHours = (actualArrivalTime - actualStartTime) / MS_PER_HOUR;
  return Number(Math.max(0, rawHours).toFixed(2));
}

export function computeQuoteTravelRate(params: {
  segmentDistance: SegmentDistance;
  travelFeeMethod: TravelChargingTypes | null | undefined;
  travelFeeRate: number | null | undefined;
}): CostFormat | null {
  const { segmentDistance, travelFeeMethod, travelFeeRate } = params;

  if (!travelFeeMethod || travelFeeRate == null) {
    return null;
  }

  const traveFeeLabel = "Travel Fee";

  switch (travelFeeMethod) {
    case TravelChargingTypes.FLAT:
      return {
        label: traveFeeLabel,
        value: Number(travelFeeRate.toFixed(2)),
      };

    case TravelChargingTypes.LABOR_HOURS: {
      let hours = segmentDistance?.duration ? segmentDistance.duration / 60 : 0;
      return {
        label: traveFeeLabel,
        value: Number((hours * travelFeeRate).toFixed(2)),
      };
    }

    case TravelChargingTypes.MILEAGE: {
      const miles = segmentDistance?.distance ?? 0;
      return {
        label: traveFeeLabel,
        value: Number((miles * travelFeeRate).toFixed(2)),
      };
    }

    default:
      return null;
  }
}

export function computeTravelRate(params: {
  actualArrivalTime?: number;
  actualStartTime?: number;
  segmentDistance: SegmentDistance;
  travelFeeMethod: TravelChargingTypes | null | undefined;
  travelFeeRate: number | null | undefined;
}): CostFormat | null {
  const {
    actualArrivalTime,
    actualStartTime,
    segmentDistance,
    travelFeeMethod,
    travelFeeRate,
  } = params;

  if (!travelFeeMethod || travelFeeRate == null) {
    return null;
  }

  switch (travelFeeMethod) {
    case TravelChargingTypes.FLAT:
      return {
        label: `Travel Fee: (Flat)`,
        value: Number(travelFeeRate.toFixed(2)),
      };

    case TravelChargingTypes.LABOR_HOURS: {
      let hours = segmentDistance?.duration ?? 0;
      if (actualArrivalTime && actualStartTime) {
        hours = computeTravelHours(actualArrivalTime, actualStartTime);
      }
      return {
        label: `Travel Fee: (${hours.toFixed(2)} hrs @ ${travelFeeRate.toFixed(2)}/hr)`,
        value: Number((hours * travelFeeRate).toFixed(2)),
      };
    }

    case TravelChargingTypes.MILEAGE: {
      const miles = segmentDistance?.distance ?? 0;
      return {
        label: `Travel Fee: (${miles.toFixed(2)} mi @ ${travelFeeRate.toFixed(2)}/mi)`,
        value: Number((miles * travelFeeRate).toFixed(2)),
      };
    }

    default:
      return null;
  }
}

const sumFeeLines = (feeLines: LineFee[] = []): number => {
  const total = feeLines.reduce((accumulator, fee) => {
    return accumulator + (fee.price || 0) * (fee.quantity ?? 1);
  }, 0);

  return to2Decimals(total);
};

export function sumNonLaborTravelFees(params: {
  moveFees: LineFee[];
  additionalFees: Doc<"additionalFees">[];
  liabilityCoverage: Doc<"insurancePolicies">;
}): number {
  const { moveFees, additionalFees, liabilityCoverage } = params;
  const moveFeesTotal = sumFeeLines(moveFees);
  const additionalFeesTotal = sumFeeLines(
    additionalFees.filter((f) => f.isActive !== false)
  );
  const premium = liabilityCoverage?.premium ?? 0;
  return to2Decimals(moveFeesTotal + additionalFeesTotal + premium);
}

export function sumDiscounts(discounts: Doc<"discounts">[] = []): number {
  return discounts
    .filter((discount) => discount.isActive)
    .reduce((total, discount) => total + (discount.price || 0), 0);
}

export function formatCreditCardFee(
  amount: number,
  creditCardFee: number
): CostFormat {
  const feeRate = creditCardFee / 100;

  const base = Math.max(0, amount);
  const feeValue = to2Decimals(base * feeRate);
  return {
    label: `Credit Card Fee (${creditCardFee.toFixed(2)}%)`,
    value: feeValue,
  };
}

export const formatMoveFeeLines = (fees: LineFee[] = []): CostFormat[] =>
  fees.map((f) => ({
    label: `${f.name} (${f.quantity} @ ${formatCurrency(f.price)})`,
    value: to2Decimals((f.price || 0) * (f.quantity ?? 1)),
  }));

export const formatAdditionalFeeLines = (
  fees: Doc<"additionalFees">[] = []
): CostFormat[] =>
  fees
    .filter((f) => f.isActive !== false)
    .map((f) => ({
      label: `${f.name} (${f.quantity} @ ${formatCurrency(f.price)})`,
      value: to2Decimals((f.price || 0) * (f.quantity ?? 1)),
    }));

export const formatLiabilityPremium = (
  policy?: Doc<"insurancePolicies"> | null
): CostFormat => ({
  label: `Liability Coverage${policy?.name ? ` (${policy.name})` : ""}`,
  value: to2Decimals(policy?.premium ?? 0),
});

export const formatDiscountLines = (
  discounts: Doc<"discounts">[] = []
): CostFormat[] =>
  discounts
    .filter((d) => d.isActive)
    .map((d) => ({
      label: `${d.name} (discount)`,
      value: -to2Decimals(d.price || 0),
    }));

export const formatDeposit = (deposit: number): CostFormat => ({
  label: "Deposit",
  value: -to2Decimals(deposit ?? 0),
});

export function sumCostFormats(
  costItems: (CostFormat | CostFormat[] | null | undefined)[]
): number {
  const flattenedItems: CostFormat[] = costItems
    .flat()
    .filter(
      (costItem): costItem is CostFormat =>
        costItem != null && "value" in costItem
    );
  return to2Decimals(
    flattenedItems.reduce(
      (runningTotal, currentItem) => runningTotal + (currentItem.value ?? 0),
      0
    )
  );
}

export function formatTotalWithFee(
  subtotal: number,
  creditCardFeeAmount: number
): CostFormat {
  return {
    label: "Total",
    value: to2Decimals(subtotal + creditCardFeeAmount),
  };
}
