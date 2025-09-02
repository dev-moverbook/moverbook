import React from "react";
import CustomCard from "@/app/components/shared/CustomCard";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import { formatCurrency } from "@/app/frontendUtils/helper";
import { cn } from "@/lib/utils";

interface RowOptions {
  isCurrency?: boolean;
  isBold?: boolean;
  className?: string;
  labelClassName?: string;
  valueClassName?: string;
}

interface ReusableCardProps {
  title: string | React.ReactNode;
  texts: [string, string | number | null, RowOptions?][];
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
  rowClassName?: string;
  labelClassName?: string;
  valueClassName?: string;
  actions?: React.ReactNode;
  actionsClassName?: string;
  titleActions?: React.ReactNode;
}

const ReusableCard = ({
  title,
  texts,
  className,
  headerClassName,
  contentClassName,
  rowClassName,
  labelClassName,
  valueClassName,
  actions,
  actionsClassName,
  titleActions,
}: ReusableCardProps) => {
  return (
    <CustomCard
      className={cn("flex flex-col justify-between gap-4 p-4", className)}
    >
      <CardHeaderWithActions
        title={title}
        className={cn("p-0", headerClassName)}
        actions={titleActions} // 🔹 pass optional actions here
      />
      <div className={cn("flex flex-col gap-4", contentClassName)}>
        {texts.map(([label, value, options], index) => {
          const {
            isCurrency,
            isBold,
            className: rowCls,
            labelClassName: rowLabelCls,
            valueClassName: rowValueCls,
          } = options || {};
          return (
            <div
              key={index}
              className={cn(
                "flex items-center justify-between",
                isBold && "font-bold",
                rowClassName,
                rowCls
              )}
            >
              <p className={cn(labelClassName, rowLabelCls)}>{label}</p>
              <p className={cn(valueClassName, rowValueCls)}>
                {value == null
                  ? ""
                  : isCurrency
                    ? formatCurrency(value as number)
                    : value}
              </p>
            </div>
          );
        })}
      </div>

      {actions && <div className={cn("pt-2", actionsClassName)}>{actions}</div>}
    </CustomCard>
  );
};

export default ReusableCard;
