import React from "react";
import CustomCard from "@/app/components/shared/CustomCard";
import { CompanyContactSchema, UserSchema } from "@/types/convex-schemas";
import { Phone, Mail } from "lucide-react";
import { MoveSchema } from "@/types/convex-schemas";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import { formatPhoneNumber } from "@/app/frontendUtils/helper";

interface CustomerCardProps {
  move: MoveSchema;
}

const CustomerCard = ({ move }: CustomerCardProps) => {
  const { name, phoneNumber, email, altPhoneNumber } = move;
  return (
    <CustomCard className="items-center justify-between gap-4 p-4">
      <div className="flex justify-between items-center gap-1">
        <div>
          <CardHeaderWithActions title="Customer" className="p-0" />
          <p className="font-medium text-grayCustom2">{name}</p>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center text-sm  text-grayCustom2 gap-2 mt-1">
          <Phone className="w-4 h-4 text-white" />
          <span>{phoneNumber && formatPhoneNumber(phoneNumber)}</span>
        </div>
        <div className="flex items-center text-sm  text-grayCustom2 gap-2 mt-1">
          <Phone className="w-4 h-4 text-white" />
          <span>
            {altPhoneNumber && formatPhoneNumber(altPhoneNumber)}
            <span className="italic"> &#40;alternative&#41;</span>
          </span>
        </div>

        <div className="flex items-center text-sm  text-grayCustom2 gap-2">
          <Mail className="w-4 h-4 text-white" />
          <span>{email}</span>
        </div>
      </div>
    </CustomCard>
  );
};

export default CustomerCard;
