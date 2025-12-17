"use client";

import QuoteContact from "@/components/moveId/components/quote/QuoteContact";
import { usePublicMoveIdContext } from "@/contexts/PublicMovIdContext";
import { useState } from "react";
import MoveCustomerUpdateActions from "./MoveCustomerUpdateActions";
import { CustomerFormData } from "@/types/form-types";
import IconButton from "@/components/shared/buttons/IconButton";
import SectionHeader from "@/components/shared/section/SectionHeader";
import { X } from "lucide-react";
import SectionContainer from "@/components/shared/containers/SectionContainer";
import ContactCard from "@/components/moveId/components/card/ContactCard";
import CustomerForm from "@/components/move/sections/Customer/CustomerForm";

const QuoteContactProvider = () => {
  const { move } = usePublicMoveIdContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const { companyContact, moveCustomer, salesRepUser } = move;

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const { name, phoneNumber, altPhoneNumber, email } = moveCustomer;

  const [formData, setFormData] = useState<CustomerFormData>({
    name,
    email,
    phoneNumber,
    altPhoneNumber,
  });

  const handleChange = (key: keyof CustomerFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const errors = {};

  if (isEditing) {
    return (
      <div>
        <div className="flex items-center justify-between ">
          <SectionHeader className="px-0" title="Contact Information" />

          <IconButton icon={<X size={20} />} onClick={handleCancel} />
        </div>
        <SectionContainer>
          <ContactCard
            salesRep={salesRepUser}
            companyContact={companyContact}
          />
          <CustomerForm
            customer={formData}
            errors={errors}
            onChange={handleChange}
          />
        </SectionContainer>
        <MoveCustomerUpdateActions
          onCancel={handleCancel}
          moveCustomerformData={formData}
        />
      </div>
    );
  }

  return (
    <QuoteContact
      companyContact={companyContact}
      moveCustomer={moveCustomer}
      salesRepUser={salesRepUser}
      onEditClick={handleEditClick}
      isEditing={isEditing}
    />
  );
};

export default QuoteContactProvider;
