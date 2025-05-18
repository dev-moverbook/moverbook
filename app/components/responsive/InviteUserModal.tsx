import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerTitle,
} from "@/components/ui/drawer";
import { FrontEndErrorMessages } from "@/types/errors";
import { isValidEmail } from "@/utils/helper";
import { ClerkRoles } from "@/types/enums";
import { isValidHourlyRate } from "@/app/frontendUtils/helper";
import FormActions from "@/app/components/shared/FormActions";
import LabeledInput from "../shared/labeled/LabeledInput";
import LabeledSelect from "../shared/labeled/LabeledSelect";
import SectionLabeled from "../shared/labeled/SectionLabeled";

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (
    email: string,
    role: ClerkRoles,
    hourlyRate: string | null
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
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const [email, setEmail] = useState<string>("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [hourlyRate, setHourlyRate] = useState<string | null>(null);
  const [hourlyRateError, setHourlyRateError] = useState<string | null>(null);
  const [role, setRole] = useState<ClerkRoles>(ClerkRoles.SALES_REP);

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
          { label: "Manager", value: ClerkRoles.MANAGER },
          { label: "Mover", value: ClerkRoles.MOVER },
          { label: "Sales Rep", value: ClerkRoles.SALES_REP },
        ]}
      />

      {/* Hourly Rate Input (Only for Movers) */}
      {role === ClerkRoles.MOVER && (
        <LabeledInput
          label="Hourly Rate ($)"
          type="text"
          value={hourlyRate || ""}
          onChange={(e) => {
            setHourlyRate(e.target.value);
            setHourlyRateError(null);
          }}
          placeholder="Enter hourly rate"
          error={hourlyRateError}
        />
      )}

      {/* Submit Button */}
      <FormActions
        onSave={handleInvite}
        onCancel={handleClose}
        isSaving={inviteLoading}
        saveLabel="Send Invite"
        cancelLabel="Cancel"
        error={inviteError}
      />
    </SectionLabeled>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>Invite User</DrawerTitle>
        <DrawerDescription>Invite a new user to your team.</DrawerDescription>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Invite User</DialogTitle>
        <DialogDescription>Invite a new user to your team.</DialogDescription>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
