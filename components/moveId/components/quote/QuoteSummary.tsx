"use client";

import Image from "next/image";
import {
  formatDateToLong,
  formatDisplayNumber,
  formatMoveSize,
  formatTime,
  getTotalWeightAndSize,
} from "@/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";

interface QuoteSummaryProps {
  move: Doc<"moves">;
  company: Doc<"companies">;
}

const QuoteSummary = ({ move, company }: QuoteSummaryProps) => {
  const {
    moveDate,
    arrivalTimes,
    locations,
    trucks,
    movers,
    moveItems,
    jobId,
  } = move;

  const { weight, size } = getTotalWeightAndSize(moveItems ?? []);

  return (
    <div className="bg-background2 text-white w-full mx-auto text-center py-6">
      <div className="flex justify-center">
        {company.imageUrl && (
          <Image
            src={company.imageUrl}
            alt={company.name}
            width={80}
            height={80}
            style={{ height: 40, width: "auto" }}
          />
        )}
      </div>
      <h2 className="">Job ID: {jobId}</h2>
      <h2 className="font-bold text-xl">Move Estimate</h2>

      <div>
        Starting on <strong>{formatDateToLong(moveDate)}</strong>
        <br />
        Arrival {formatTime(arrivalTimes?.arrivalWindowStarts)} –{" "}
        {formatTime(arrivalTimes?.arrivalWindowEnds)}
      </div>

      <div className="text-white ">
        <p>{formatMoveSize(locations?.[0]?.moveSize)} </p>
        <p>{`${formatDisplayNumber(size, "ft³")} / ${formatDisplayNumber(weight, "lbs")}`}</p>
        <p>
          Estimated: {trucks} truck{trucks !== 1 ? "s" : ""} & {movers} crew
        </p>
        <p className="italic  mt-2 text-gray-400">Non-binding estimate</p>
      </div>
    </div>
  );
};

export default QuoteSummary;
