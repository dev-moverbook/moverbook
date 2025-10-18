"use client";
import React from "react";
import { Mail, Phone } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { formatPhoneNumber } from "@/frontendUtils/helper";

interface MoveCustomerCardProps {
  moveCustomer: Doc<"moveCustomers">;
  onClick?: () => void;
  className?: string;
}

const MoveCustomerCard: React.FC<MoveCustomerCardProps> = ({
  moveCustomer,
  onClick,
  className = "",
}) => {
  const { name, phoneNumber, email } = moveCustomer;

  return (
    <div
      onClick={onClick}
      className={`
        relative max-w-screen-sm mx-auto flex items-start
        bg-black py-2 px-4 text-white shadow-md border-b border-grayCustom
        ${onClick ? "cursor-pointer hover:bg-background2 transition-colors duration-200" : ""}
        ${className}
      `}
    >
      <div className="space-y-1">
        <p className="font-medium text-lg">{name}</p>
        <div className="flex gap-2 items-center  text-gray-300">
          <Phone className="w-4 h-4" />
          <p>{formatPhoneNumber(phoneNumber)}</p>
        </div>
        <div className="flex gap-2 items-center  text-gray-300">
          <Mail className="w-4 h-4" />
          <p>{email}</p>
        </div>
      </div>
    </div>
  );
};

export default MoveCustomerCard;
