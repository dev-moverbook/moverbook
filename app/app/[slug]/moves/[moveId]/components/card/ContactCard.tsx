import React from "react";
import CustomCard from "@/app/components/shared/CustomCard";
import { CompanyContactSchema } from "@/types/convex-schemas";
import { Phone, Mail } from "lucide-react";
import Image from "next/image";
import CardHeaderWithActions from "@/app/components/shared/CardHeaderWithActions";
import { Doc } from "@/convex/_generated/dataModel";
import { formatPhoneNumber } from "@/app/frontendUtils/helper";

interface ContactCardProps {
  salesRep: Doc<"users"> | null;
  companyContact: CompanyContactSchema;
}

const ContactCard = ({ salesRep, companyContact }: ContactCardProps) => {
  const { name, email, imageUrl } = salesRep ?? {};
  const { phoneNumber } = companyContact;
  return (
    <CustomCard className="items-center justify-between gap-4 p-4">
      <div className="flex justify-between items-center gap-1">
        <div>
          <CardHeaderWithActions title="Sales Rep" className="p-0" />
          <p className="font-medium text-grayCustom2">{name}</p>
        </div>
        {imageUrl && (
          <div className="shrink-0">
            <Image
              src={imageUrl}
              alt={name ?? "Sales Rep"}
              width={48}
              height={48}
              className="rounded-full object-cover"
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex items-center text-sm  text-grayCustom2 gap-2 mt-1">
          <Phone className="w-4 h-4 text-white" />
          <span>{formatPhoneNumber(phoneNumber)}</span>
        </div>

        <div className="flex items-center text-sm  text-grayCustom2 gap-2">
          <Mail className="w-4 h-4 text-white" />
          <span>{email}</span>
        </div>
      </div>
    </CustomCard>
  );
};

export default ContactCard;
