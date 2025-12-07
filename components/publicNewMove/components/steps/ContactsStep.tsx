"use client";

import CustomerForm from "@/components/move/sections/Customer/CustomerForm";
import { usePublicNewMoveForm } from "@/contexts/PublicNewMoveFormContext";

const ContactsStep = () => {
  const { publicNewMoveFormData, setPublicNewMoveFormData } =
    usePublicNewMoveForm();

  const handleChange = (
    key: keyof typeof publicNewMoveFormData,
    value: string
  ) => {
    setPublicNewMoveFormData({ ...publicNewMoveFormData, [key]: value });
  };

  const customer = {
    name: publicNewMoveFormData.name,
    email: publicNewMoveFormData.email,
    phoneNumber: publicNewMoveFormData.phoneNumber,
    altPhoneNumber: publicNewMoveFormData.altPhoneNumber,
  };

  const customerErrors = {};

  return (
    <CustomerForm
      customer={customer}
      errors={customerErrors}
      onChange={handleChange}
    />
  );
};

export default ContactsStep;
