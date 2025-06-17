import React from "react";
import CustomCard from "@/app/components/shared/CustomCard";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import { formatCurrency } from "@/app/frontendUtils/helper";

interface ReusableCardProps {
  title: string;
  texts: [string, string | number | null, boolean?][];
  isCurrency?: boolean;
  isBold?: boolean; // fallback for all
}

const ReusableCard = ({
  title,
  texts,
  isCurrency = false,
  isBold = false,
}: ReusableCardProps) => {
  return (
    <CustomCard className="flex flex-col justify-between gap-4 p-4">
      <CardHeaderWithActions title={title} className="p-0" />
      <div className="flex flex-col gap-1 text-grayCustom2">
        {texts.map(([label, value, bold], index) => (
          <div
            key={index}
            className={`flex items-center justify-between ${
              (bold ?? isBold) ? "font-bold" : ""
            }`}
          >
            <p>{label}</p>
            <p>
              {value == null
                ? ""
                : isCurrency
                  ? formatCurrency(value as number)
                  : value}
            </p>
          </div>
        ))}
      </div>
    </CustomCard>
  );
};

export default ReusableCard;
