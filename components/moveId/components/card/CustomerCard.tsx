"use client";

import CustomCard from "@/components/shared/card/CustomCard";
import { Phone, Mail, PhoneForwarded } from "lucide-react";
import CardHeaderWithActions from "@/components/shared/card/CardHeaderWithActions";
import { formatPhoneNumber } from "@/frontendUtils/helper";
import { Doc } from "@/convex/_generated/dataModel";

interface CustomerCardProps {
  moveCustomer: Doc<"users">;
}

const CustomerCard = ({ moveCustomer }: CustomerCardProps) => {
  const { name, phoneNumber, email, altPhoneNumber } = moveCustomer;

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
          <PhoneForwarded className="w-4 h-4 text-white" />
          <span>{altPhoneNumber && formatPhoneNumber(altPhoneNumber)}</span>
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
