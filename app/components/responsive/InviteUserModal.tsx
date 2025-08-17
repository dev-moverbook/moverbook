import React, { useState } from "react";
import { FrontEndErrorMessages } from "@/types/errors";
import { isValidEmail } from "@/utils/helper";
import { ClerkRoles } from "@/types/enums";
import { isValidHourlyRate } from "@/app/frontendUtils/helper";
import FormActions from "@/app/components/shared/FormActions";
import LabeledInput from "../shared/labeled/LabeledInput";
import LabeledSelect from "../shared/labeled/LabeledSelect";
import SectionLabeled from "../shared/labeled/SectionLabeled";
import CurrencyInput from "../shared/labeled/CurrencyInput";
import ResponsiveModal from "../shared/modal/ResponsiveModal";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (
    email: string,
    role: ClerkRoles,
    hourlyRate: number | null
  ) => Promise<boolean>;
  inviteLoading: boolean;
  inviteError: string | null;
  setInviteError: (error: string | null) => void;
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  inviteError,
  inviteLoading,
  setInviteError,
}) => {
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<number | null>(null);
  const [role, setRole] = useState<ClerkRoles>(ClerkRoles.SALES_REP);
  const [hourlyRateError, setHourlyRateError] = useState<string | null>(null);

  const resetState = () => {
    setEmail("");
    setEmailError(null);
    setHourlyRate(null);
    setHourlyRateError(null);
    setRole(ClerkRoles.SALES_REP);
    setInviteError(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  const handleInvite = async () => {
    let hasError: boolean = false;

    if (!email.trim()) {
      setEmailError(FrontEndErrorMessages.EMAIL_REQUIRED);
      hasError = true;
    } else if (!isValidEmail(email)) {
      setEmailError(FrontEndErrorMessages.EMAIL_INVALID);
      hasError = true;
    }

    if (role === ClerkRoles.MOVER) {
      if (!hourlyRate || !isValidHourlyRate(hourlyRate)) {
        setHourlyRateError(FrontEndErrorMessages.HOURLY_RATE_INVALID);
        hasError = true;
      }
    }

    if (hasError) return;

    const success = await onInvite(email, role, hourlyRate);
    if (success) {
      handleClose();
    }
  };

  const isDisabled =
    !isValidEmail(email) ||
    emailError !== null ||
    (role === ClerkRoles.MOVER &&
      (!hourlyRate || !isValidHourlyRate(hourlyRate)));

  const formContent = (
    <SectionLabeled>
      {/* Email Input */}
      <LabeledInput
        label="Email"
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          setEmailError(null);
        }}
        error={emailError}
      />

      {/* Role Selection */}
      <LabeledSelect
        label="Role"
        value={role}
        onChange={(value) => {
          setRole(value as ClerkRoles);
          setHourlyRateError(null);
        }}
        options={[
          { label: ClerkRoles.MANAGER, value: ClerkRoles.MANAGER },
          { label: ClerkRoles.MOVER, value: ClerkRoles.MOVER },
          { label: ClerkRoles.SALES_REP, value: ClerkRoles.SALES_REP },
        ]}
      />

      {/* Hourly Rate Input (Only for Movers) */}
      {role === ClerkRoles.MOVER && (
        <CurrencyInput
          label="Hourly Rate ($)"
          value={hourlyRate}
          onChange={(value) => {
            setHourlyRate(value);
            setHourlyRateError(null);
          }}
          error={hourlyRateError}
        />
      )}

      {/* Submit Button */}
      <FormActions
        onSave={(e) => {
          e.preventDefault();
          handleInvite();
        }}
        onCancel={handleClose}
        isSaving={inviteLoading}
        saveLabel="Send Invite"
        cancelLabel="Cancel"
        error={inviteError}
        disabled={isDisabled}
      />
    </SectionLabeled>
  );

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invite User"
      description="Enter in the email of the user you want to invite and select their role."
    >
      {formContent}
    </ResponsiveModal>
  );
};

export default InviteUserModal;
