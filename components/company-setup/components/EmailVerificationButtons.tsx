"use client";

import { Button } from "@/components/ui/button";
import { Doc } from "@/convex/_generated/dataModel";
import { useCheckSenderVerified, useCreateSender } from "@/hooks/sendGrid";
import { CheckCircle, Mail } from "lucide-react";
import { useState } from "react";

interface EmailVerificationButtonsProps {
  companyContact: Doc<"companyContacts">;
}

const EmailVerificationButtons = ({
  companyContact,
}: EmailVerificationButtonsProps) => {
  const {
    createSender,
    isLoading: isCreatingSender,
    error: createSenderError,
  } = useCreateSender();
  const {
    checkSenderVerified,
    isLoading: isCheckingVerification,
    error: checkVerificationError,
  } = useCheckSenderVerified();

  const [verificationStatus, setVerificationStatus] = useState<
    "unverified" | "pending" | "verifying" | "verified" | "error"
  >(() => {
    if (companyContact.sendgridVerified) {
      return "verified";
    }
    if (companyContact.sendgridSenderId && !companyContact.sendgridVerified)
      return "pending";
    return "unverified";
  });

  const [verificationError, setVerificationError] = useState<string | null>(
    null
  );

  const handleCreateSender = async () => {
    try {
      setVerificationError(null);
      setVerificationStatus("verifying");

      const success = await createSender(companyContact._id);
      if (success) {
        setVerificationStatus("pending");
      } else {
        setVerificationStatus("error");
        setVerificationError(
          createSenderError || "Failed to create sender. Please try again."
        );
      }
    } catch (error) {
      console.error("Error creating sender:", error);
      setVerificationStatus("error");
      setVerificationError(
        "An unexpected error occurred while creating the sender."
      );
    }
  };

  const handleCheckVerification = async () => {
    try {
      setVerificationError(null);
      setVerificationStatus("verifying");

      const isVerified = await checkSenderVerified(companyContact._id);
      setVerificationStatus(isVerified ? "verified" : "pending");

      if (!isVerified) {
        setVerificationError(
          "Email not yet verified. Please check your email for a verification link from SendGrid."
        );
      }
    } catch (error) {
      console.error("Error checking verification:", error);
      setVerificationStatus("error");
      setVerificationError(
        checkVerificationError ||
          "Failed to check verification status. Please try again."
      );
    }
  };

  const renderVerificationButton = () => {
    if (verificationStatus === "verified") {
      return (
        <div className="flex items-center text-green-600">
          <CheckCircle className="h-4 w-4 mr-1" />
          <span className="text-sm">Email verified</span>
        </div>
      );
    }

    if (verificationStatus === "pending") {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={handleCheckVerification}
          disabled={isCheckingVerification}
        >
          <div className="flex items-center">
            <Mail className="h-4 w-4 mr-1" />
            Pending Verification
          </div>
        </Button>
      );
    }

    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleCreateSender}
        disabled={isCreatingSender}
        isLoading={isCreatingSender}
      >
        <div className="flex items-center">
          <Mail className="h-4 w-4 mr-1" />
          Verify Email
        </div>
      </Button>
    );
  };

  return (
    <div className="flex flex-col gap-1 w-[200px]">
      {renderVerificationButton()}
      {verificationError && (
        <div className="text-sm text-red-600 mt-1">{verificationError}</div>
      )}
    </div>
  );
};

export default EmailVerificationButtons;
