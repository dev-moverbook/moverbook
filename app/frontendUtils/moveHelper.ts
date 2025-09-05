import { Doc } from "@/convex/_generated/dataModel";
import { HourStatus, MoverWageForMove, WINDOW_LABEL } from "@/types/types";
import {
  computeMoveTotal,
  formatCurrency,
  formatHourStatus,
  formatPriceRange,
  formatTwoDecimals,
  getStatusColor,
  roundToTwoDecimals,
} from "./helper";
import { EnrichedMoveAssignment } from "@/types/convex-responses";
import { formatLongDateTime } from "./luxonUtils";

export function getDisplayedPrice(
  move: Doc<"move">,
  isMover: boolean | undefined,
  hourStatus: HourStatus | undefined,
  moverWageDisplay?: MoverWageForMove | null
): string {
  const { minTotal, maxTotal } = computeMoveTotal({
    moveFees: move.moveFees,
    jobType: move.jobType,
    jobTypeRate: move.jobTypeRate,
    startingMoveTime: move.startingMoveTime,
    endingMoveTime: move.endingMoveTime,
    liabilityCoverage: move.liabilityCoverage,
    travelFeeRate: move.travelFeeRate ?? null,
    travelFeeMethod: move.travelFeeMethod ?? null,
    segmentDistances: move.segmentDistances,
  });

  if (isMover) {
    switch (hourStatus) {
      case "approved":
        return formatCurrency(moverWageDisplay?.approvedPayout ?? 0);
      case "pending":
      case "incomplete":
        return formatCurrency(moverWageDisplay?.pendingPayout ?? 0);
      default:
        return formatPriceRange(
          moverWageDisplay?.estimatedMin ?? 0,
          moverWageDisplay?.estimatedMax ?? 0
        );
    }
  }

  if (move.moveStatus === "Completed" && move.invoiceAmountPaid) {
    return formatCurrency(move.invoiceAmountPaid + move.deposit);
  }

  return minTotal === maxTotal
    ? formatCurrency(minTotal)
    : formatPriceRange(minTotal, maxTotal);
}

export function getStatusDisplay(
  move: Doc<"move">,
  isMover: boolean | undefined
): { label: string; color: string } {
  const isCompleted = move.moveStatus === "Completed";

  if (isMover && !isCompleted) {
    return {
      label: WINDOW_LABEL[move.moveWindow],
      color: getStatusColor(move.moveWindow),
    };
  }

  return {
    label: move.moveStatus,
    color: getStatusColor(move.moveStatus),
  };
}

export function getHourStatusClass(status: HourStatus | undefined): string {
  if (status === "pending") return "text-grayCustom2";
  if (status === "rejected") return "text-red-400";
  return "";
}

export function buildMoverHoursTexts(
  assignment: EnrichedMoveAssignment,
  timeZone: string
): [string, string | number | null][] {
  const {
    startTime,
    endTime,
    breakAmount,
    approvedHours,
    approvedPay,
    hourStatus,
    managerNotes,
    pendingHours,
    pendingPayout,
  } = assignment;

  const isPendingOrRejected =
    hourStatus === "pending" || hourStatus === "rejected";

  const approvedPayRounded =
    approvedPay != null ? roundToTwoDecimals(Math.max(0, approvedPay)) : null;

  const pendingPayRounded =
    pendingPayout != null
      ? roundToTwoDecimals(Math.max(0, pendingPayout))
      : null;

  const totalHoursDisplay = isPendingOrRejected
    ? formatTwoDecimals(pendingHours, "hours")
    : formatTwoDecimals(approvedHours, "hours");

  const totalPayDisplay = isPendingOrRejected
    ? pendingPayRounded != null
      ? formatCurrency(pendingPayRounded)
      : "—"
    : approvedPayRounded != null
      ? formatCurrency(approvedPayRounded)
      : "—";

  const texts: [string, string | number | null][] = [
    ["Start Time", startTime ? formatLongDateTime(startTime, timeZone) : "—"],
    ["End Time", endTime ? formatLongDateTime(endTime, timeZone) : "—"],
    ["Break", formatTwoDecimals(breakAmount, "hours") ?? ""],
    ["Total Hours", totalHoursDisplay],
    ["Total Pay", totalPayDisplay],
    ["Status", formatHourStatus(hourStatus) ?? "—"],
  ];

  if (managerNotes) {
    texts.push(["Manager Notes", managerNotes]);
  }

  return texts;
}
