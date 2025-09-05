import React from "react";
import {
  formatCurrency,
  formatHourStatus,
  formatTwoDecimals,
  statusColorMap,
} from "@/app/frontendUtils/helper";
import ReusableCard from "@/app/app/[slug]/moves/[moveId]/components/card/ReusableCard";
import { Doc } from "@/convex/_generated/dataModel";
import { MoverWageForMove } from "@/convex/backendUtils/queryHelpers";

type TextMeta = { valueClassName?: string };
type TextRow = [string, string | number | null, TextMeta?];

interface PayOutCardProps {
  moveAssignment: Doc<"moveAssignments">;
  wageDisplay: MoverWageForMove | null;
}

const PayOutCard = ({ moveAssignment, wageDisplay }: PayOutCardProps) => {
  if (!moveAssignment.endTime || !moveAssignment.startTime) {
    return null;
  }

  const approved = moveAssignment.hourStatus === "approved";

  const totalHours: number =
    (approved ? wageDisplay?.approvedHours : wageDisplay?.pendingHours) ?? 0;

  const totalPayout: number =
    (approved ? wageDisplay?.approvedPayout : wageDisplay?.pendingPayout) ?? 0;

  const status = formatHourStatus(moveAssignment.hourStatus);
  const statusKey = status.toLowerCase() as keyof typeof statusColorMap;

  const texts: TextRow[] = [
    ["Total Hours", formatTwoDecimals(totalHours, "hours")],
    ["Total Payout", formatCurrency(totalPayout)],
    ["Status", status, { valueClassName: statusColorMap[statusKey] }],
  ];

  if (moveAssignment.managerNotes) {
    texts.push(["Manager Notes", moveAssignment.managerNotes]);
  }

  return <ReusableCard title="Payout Summary" texts={texts} />;
};

export default PayOutCard;
