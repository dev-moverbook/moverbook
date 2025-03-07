import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { FrontEndErrorMessages } from "@/types/errors";
import { isValidEmail } from "@/utils/helper";
import { ClerkRoles } from "@/types/enums";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { isValidHourlyRate } from "@/app/frontendUtils/helper";
import { Label } from "@/components/ui/label";
import { useSlugContext } from "@/app/contexts/SlugContext";

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
}

const InviteUserModal: React.FC<InviteUserModalProps> = ({
  isOpen,
  onClose,
  onInvite,
  inviteError,
  inviteLoading,
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
    <div className="space-y-4">
      {/* Email Input */}
      <div>
        <Label className="block text-sm font-medium">Email</Label>
        <Input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
          }}
        />
        {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
      </div>

      {/* Role Selection */}
      <div>
        <Label className="block text-sm font-medium">Role</Label>
        <Select
          value={role}
          onValueChange={(value) => {
            setRole(value as ClerkRoles);
            setHourlyRate(null);
            setHourlyRateError(null);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ClerkRoles.MANAGER}>Manager</SelectItem>
            <SelectItem value={ClerkRoles.MOVER}>Mover</SelectItem>
            <SelectItem value={ClerkRoles.SALES_REP}>Sales Rep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hourly Rate Input (Only for Movers) */}
      {role === ClerkRoles.MOVER && (
        <div>
          <Label className="block text-sm font-medium">Hourly Rate ($)</Label>
          <Input
            type="text"
            value={hourlyRate || ""}
            onChange={(e) => {
              setHourlyRate(e.target.value);
              setHourlyRateError(null);
            }}
            placeholder="Enter hourly rate"
          />
          {hourlyRateError && (
            <p className="text-red-500 text-sm">{hourlyRateError}</p>
          )}
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={handleInvite}
        disabled={inviteLoading}
        className="w-full"
      >
        {inviteLoading ? "Inviting..." : "Send Invite"}
      </Button>

      {inviteError && <p className="text-red-500 text-sm">{inviteError}</p>}
    </div>
  );

  return isMobile ? (
    <Drawer open={isOpen} onOpenChange={handleClose}>
      <DrawerContent>
        <DrawerTitle>Invite User</DrawerTitle>
        {formContent}
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogTitle>Invite User</DialogTitle>
        {formContent}
      </DialogContent>
    </Dialog>
  );
};

export default InviteUserModal;
