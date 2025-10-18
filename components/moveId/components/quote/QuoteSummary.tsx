"use client";

import Image from "next/image";
import {
  formatDateToLong,
  formatDisplayNumber,
  formatMoveSize,
  formatTime,
  getTotalWeightAndSize,
} from "@/frontendUtils/helper";
import { useMoveContext } from "@/contexts/MoveContext";

const QuoteSummary = () => {
  const { moveData } = useMoveContext();
  const { move, company } = moveData;

  const {
    moveDate,
    arrivalTimes,
    locations,
    trucks,
    movers,
    moveItems,
    jobId,
  } = move;

  const { weight, size } = getTotalWeightAndSize(moveItems);

  return (
    <div className="bg-background2 text-white w-full mx-auto text-center py-6">
      {/* Logo using Next.js Image */}
      <div className="flex justify-center">
        {company.imageUrl && (
          <Image
            src={company.imageUrl} // fallback to default if needed
            alt={company.name}
            width={80}
            height={80}
            //   className="object-contain"
          />
        )}
      </div>
      <h2 className="">Job ID: {jobId}</h2>
      <h2 className="font-bold text-xl">Move Estimate</h2>

      {/* Date & Arrival */}
      <div>
        Starting on <strong>{formatDateToLong(moveDate)}</strong>
        <br />
        Arrival {formatTime(arrivalTimes?.arrivalWindowStarts)} –{" "}
        {formatTime(arrivalTimes?.arrivalWindowEnds)}
      </div>

      {/* Rate & Summary */}
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
