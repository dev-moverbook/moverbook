"use client";

import CustomCard from "@/components/shared/card/CustomCard";
import CardHeaderWithActions from "@/components/shared/card/CardHeaderWithActions";
import { formatCurrency } from "@/frontendUtils/helper";
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
      className={cn(
        "w-full max-w-full flex flex-col gap-4 p-4 overflow-hidden",
        className
      )}
    >
      <CardHeaderWithActions
        title={title}
        className={cn("p-0", headerClassName)}
        actions={titleActions}
      />

      <div className={cn("flex flex-col gap-3", contentClassName)}>
        {texts.map(([label, value, options], index) => {
          const {
            isCurrency,
            isBold,
            className: rowCls,
            labelClassName: rowLabelCls,
            valueClassName: rowValueCls,
          } = options || {};
          const rendered =
            value == null
              ? ""
              : isCurrency
                ? formatCurrency(value as number)
                : value;

          return (
            <div
              key={index}
              className={cn(
                "grid grid-cols-[auto,1fr] items-start gap-x-3",
                isBold && "font-bold",
                rowClassName,
                rowCls
              )}
            >
              <p
                className={cn("whitespace-nowrap", labelClassName, rowLabelCls)}
              >
                {label}
              </p>
              <p
                className={cn(
                  "min-w-0 text-right break-words break-all",
                  valueClassName,
                  rowValueCls
                )}
              >
                {rendered}
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
