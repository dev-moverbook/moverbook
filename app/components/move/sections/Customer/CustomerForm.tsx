import React from "react";
import LabeledInput from "@/app/components/shared/labeled/LabeledInput";
import PhoneNumberInput from "@/app/components/shared/labeled/PhoneNumberInput";
import { CustomerFormData, CustomerFormErrors } from "@/types/form-types";

interface CustomerFormProps {
  customer: CustomerFormData;
  errors: CustomerFormErrors;
  onChange: (key: keyof CustomerFormData, value: string) => void;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  errors,
  onChange,
}) => {
  return (
    <div className="px-4 md:px-0 mt-4 md:mt-0">
      <LabeledInput
        label="Full Name*"
        value={customer.name}
        onChange={(e) => onChange("name", e.target.value)}
        placeholder="Enter full name"
        error={errors.name}
      />
      <LabeledInput
        label="Email*"
        value={customer.email}
        onChange={(e) => onChange("email", e.target.value)}
        placeholder="Enter email"
        error={errors.email}
      />
      <PhoneNumberInput
        label="Phone Number*"
        value={customer.phoneNumber ?? ""}
        onChange={(val) => onChange("phoneNumber", val)}
        error={errors.phoneNumber}
        placeholder="Enter phone number"
        isEditing={true}
      />
      <PhoneNumberInput
        label="Alternate Phone Number*"
        value={customer.altPhoneNumber ?? ""}
        onChange={(val) => onChange("altPhoneNumber", val)}
        error={errors.altPhoneNumber}
        placeholder="Enter alternative phone number"
        isEditing={true}
      />
    </div>
  );
};

export default CustomerForm;
