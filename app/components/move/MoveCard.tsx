"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CopyPlus, Eye, MessageSquare } from "lucide-react";
import {
  formatDateToLong,
  formatLocationType,
  formatPriceRange,
  getStatusColor,
  getInitials,
  computeMoveTotal,
  formatCurrency,
} from "@/app/frontendUtils/helper";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Doc } from "@/convex/_generated/dataModel";
import { Button } from "../ui/button";
import { HourStatus } from "@/convex/backendUtils/queryHelpers";
import { MoverWageForMove, WINDOW_LABEL } from "@/types/types";

interface MoveCardProps {
  move: Doc<"move">;
  moveCustomer: Doc<"moveCustomers"> | null;
  showActions?: boolean;
  onDuplicate?: (move: Doc<"move">) => void;
  salesRep: Doc<"users"> | null;
  asCustomerLink?: boolean;
  isMover?: boolean;
  hourStatus?: HourStatus;
  slug: string;
  moverWageDisplay?: MoverWageForMove | null;
}

const MoveCard: React.FC<MoveCardProps> = ({
  move,
  moveCustomer,
  showActions = false,
  onDuplicate,
  salesRep,
  asCustomerLink = false,
  isMover,
  hourStatus,
  slug,
  moverWageDisplay,
}) => {
  const { moveDate, moveStatus, _id } = move;
  const name = moveCustomer?.name;
  const router = useRouter();

  const tags = [
    move.jobId ? `Job ID: ${move.jobId}` : null,
    formatLocationType(move.locations[0].locationType),
  ].filter(Boolean) as string[];

  const { minTotal, maxTotal } = computeMoveTotal({
    moveFees: move.moveFees,
    jobType: move.jobType,
    jobTypeRate: move.jobTypeRate,
    paymentMethod: move.paymentMethod,
    creditCardFee: move.creditCardFee,
    startingMoveTime: move.startingMoveTime,
    endingMoveTime: move.endingMoveTime,
    liabilityCoverage: move.liabilityCoverage,
    travelFeeRate: move.travelFeeRate ?? null,
    travelFeeMethod: move.travelFeeMethod ?? null,
    segmentDistances: move.segmentDistances,
  });

  let min = minTotal;
  let max = maxTotal;

  let price = min === max ? formatCurrency(min) : formatPriceRange(min, max);

  if (isMover) {
    price = formatPriceRange(
      moverWageDisplay?.estimatedMin ?? 0,
      moverWageDisplay?.estimatedMax ?? 0
    );
  }

  if (isMover && move.moveStatus === "Completed" && hourStatus === "approved") {
    price = formatCurrency(moverWageDisplay?.approvedPayout ?? 0);
  }

  if (isMover && move.moveStatus === "Completed" && hourStatus === "pending") {
    price = formatCurrency(moverWageDisplay?.pendingPayout ?? 0);
  }

  if (!isMover && move.moveStatus === "Completed" && move.invoiceAmountPaid) {
    price = formatCurrency(move.invoiceAmountPaid + move.deposit);
  }

  const repInitials = getInitials(salesRep?.name || "Rep");

  const hrefLink = asCustomerLink
    ? `/app/${slug}/customer/${moveCustomer?._id}`
    : `/app/${slug}/moves/${_id}`;

  const showHourStatus =
    !!isMover && (hourStatus === "pending" || hourStatus === "rejected");

  const hourStatusClass =
    hourStatus === "pending"
      ? "text-grayCustom2"
      : hourStatus === "rejected"
        ? "text-red-400"
        : "";

  const isCompleted = moveStatus === "Completed";
  const displayStatus =
    isMover && !isCompleted ? WINDOW_LABEL[move.moveWindow] : moveStatus;
  const statusDotColor =
    isMover && !isCompleted
      ? getStatusColor(move.moveWindow)
      : getStatusColor(moveStatus);

  const content = (
    <div
      className={`py-4 px-4 text-white shadow-md ${
        !showActions
          ? "hover:bg-background2 transition-colors duration-200"
          : ""
      }`}
    >
      <div className="max-w-screen-sm mx-auto">
        <div className="flex items-stretch justify-between gap-4">
          <div className="flex flex-col min-w-0">
            <p className="text-grayCustom2">{formatDateToLong(moveDate)}</p>
            <h3 className="text-lg font-medium truncate">
              {name ?? "No name"}
            </h3>
            <div className="flex items-center gap-2 min-w-0">
              <span style={{ color: statusDotColor }}>●</span>
              <span className="truncate">{displayStatus}</span>
              <span className="text-greenCustom font-semibold pl-1">
                {price}
              </span>
              {showHourStatus && (
                <span className={`${hourStatusClass} italic`}>
                  ({hourStatus})
                </span>
              )}
            </div>
          </div>

          <div className="flex flex-col items-center self-stretch">
            <div className="mt-auto flex flex-col items-center">
              <div className="w-10 h-10 border border-grayCustom rounded-full overflow-hidden flex items-center justify-center bg-background2">
                {salesRep?.imageUrl ? (
                  <Image
                    src={salesRep.imageUrl}
                    alt={salesRep?.name ?? "Sales rep"}
                    width={40}
                    height={40}
                    className="rounded-full object-cover w-10 h-10"
                  />
                ) : (
                  <span className="text-sm text-white font-medium">
                    {repInitials}
                  </span>
                )}
              </div>
              <span className="text-sm text-grayCustom2 text-center max-w-[9rem] truncate">
                {salesRep?.name}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-1 flex-wrap mt-1">
          {tags.map((tag, i) => (
            <Badge key={i}>{tag}</Badge>
          ))}
        </div>

        {showActions && (
          <div className="flex gap-4 mt-2 justify-start">
            <Button
              size="auto"
              variant="link"
              onClick={() => router.push(`/app/${slug}/moves/${_id}/messages`)}
            >
              <div className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                <span className="text-base">Messages</span>
              </div>
            </Button>
            <Button
              size="auto"
              variant="link"
              onClick={() =>
                router.push(`/app/${slug}/customer/${moveCustomer?._id}`)
              }
            >
              <div className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                <span className="text-base">View Customer</span>
              </div>
            </Button>
            <Button
              size="auto"
              variant="link"
              onClick={() => onDuplicate?.(move)}
            >
              <div className="flex items-center gap-1">
                <CopyPlus className="w-4 h-4" />
                <span className="text-base">Duplicate Move</span>
              </div>
            </Button>
          </div>
        )}
      </div>
    </div>
  );

  return showActions ? content : <Link href={hrefLink}>{content}</Link>;
};

export default MoveCard;
