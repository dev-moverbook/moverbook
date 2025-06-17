"use client";

import React from "react";
import Image from "next/image";
import { CompanySchema, MoveSchema } from "@/types/convex-schemas";
import {
  formatCurrency,
  formatDateToLong,
  formatMoveSize,
  formatTime,
  getTotalWeightAndSize,
} from "@/app/frontendUtils/helper";

interface QuoteSummaryProps {
  move: MoveSchema;
  company: CompanySchema;
}

const QuoteSummary = ({ move, company }: QuoteSummaryProps) => {
  const {
    moveDate,
    arrivalTimes,
    jobTypeRate,
    locations,
    trucks,
    movers,
    startingMoveTime,
    moveItems,
  } = move;

  const minHours = 2;
  const hourlyRate = jobTypeRate || 0;
  const estimateMin = hourlyRate * minHours;
  const estimateMax = estimateMin + 300;

  const { weight, size } = getTotalWeightAndSize(moveItems);

  return (
    <div className="bg-background2 text-white w-full mx-auto text-center py-6">
      {/* Logo using Next.js Image */}
      <div className="flex justify-center">
        <Image
          src={company.imageUrl || ""} // fallback to default if needed
          alt={company.name}
          width={80}
          height={80}
          //   className="object-contain"
        />
      </div>
      <h2 className="font-bold text-xl">{company.name}</h2>

      {/* Price Estimate */}
      <div className="text-2xl font-bold">
        {formatCurrency(estimateMin)} - {formatCurrency(estimateMax)}
      </div>

      {/* Date & Arrival */}
      <div className="text-sm">
        Starting on <strong>{formatDateToLong(moveDate)}</strong>
        <br />
        Arrival {formatTime(arrivalTimes?.arrivalWindowStarts)} –{" "}
        {formatTime(arrivalTimes?.arrivalWindowEnds)}
      </div>

      {/* Rate & Summary */}
      <div className="text-white text-sm">
        <p>{formatMoveSize(locations?.[0]?.moveSize)} </p>
        <p>{`${size} ft³ / ${weight} lbs`}</p>
        <p>{startingMoveTime} hour minimum</p>
        <p>
          Estimated: {trucks} truck{trucks !== 1 ? "s" : ""} & {movers} crew
        </p>
        <p className="italic text-xs mt-2 text-gray-400">
          Non-binding estimate
        </p>
      </div>
    </div>
  );
};

export default QuoteSummary;
