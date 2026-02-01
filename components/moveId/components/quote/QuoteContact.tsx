"use client";

import SectionContainer from "@/components/shared/containers/SectionContainer";
import SectionHeader from "@/components/shared/section/SectionHeader";
import ContactCard from "../card/ContactCard";
import CustomerCard from "../card/CustomerCard";
import { Doc } from "@/convex/_generated/dataModel";
import IconButton from "@/components/shared/buttons/IconButton";
import { PencilIcon } from "lucide-react";

interface QuoteContactProps {
  companyContact: Doc<"companyContacts">;
  moveCustomer: Doc<"moveCustomers">;
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
        <SectionHeader className="" title="Contact Information" />
        {showEditButton && (
          <IconButton
            title="Edit Contact Information"
            icon={<PencilIcon className="w-4 h-4" />}
            onClick={onEditClick}
          />
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
