"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import ContactCard from "../card/ContactCard";
import CustomerCard from "../card/CustomerCard";
import { Doc } from "@/convex/_generated/dataModel";
import { CustomerUser } from "@/types/types";
import IconButton from "@/components/shared/buttons/IconButton";
import { PencilIcon } from "lucide-react";

interface QuoteContactProps {
  companyContact: Doc<"companyContacts">;
  moveCustomer: CustomerUser;
  salesRepUser: Doc<"users"> | null;
  onEditClick?: () => void;
  isEditing?: boolean;
}
const QuoteContact = ({
  companyContact,
  moveCustomer,
  salesRepUser,
  onEditClick,
  isEditing = false,
}: QuoteContactProps) => {
  const showEditButton = onEditClick !== undefined;

  return (
    <div>
      <div className="flex items-center justify-between ">
        <SectionHeader className="px-0" title="Contact Information" />
        {showEditButton && (
          <IconButton icon={<PencilIcon size={20} />} onClick={onEditClick} />
        )}
      </div>
      <SectionContainer>
        <ContactCard salesRep={salesRepUser} companyContact={companyContact} />
        {!isEditing && <CustomerCard moveCustomer={moveCustomer} />}
      </SectionContainer>
    </div>
  );
};

export default QuoteContact;
