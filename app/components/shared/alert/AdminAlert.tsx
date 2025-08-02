"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { Button } from "../../ui/button";

interface AdminAlertProps {
  stripeCompleted: boolean;
  companySetupCompleted: boolean;
  stripeSetupLink: string;
  companySetupLink: string;
}

const AdminAlert: React.FC<AdminAlertProps> = ({
  stripeCompleted,
  companySetupCompleted,
  stripeSetupLink,
  companySetupLink,
}) => {
  const needsStripe = !stripeCompleted;
  const needsCompanySetup = !companySetupCompleted;

  if (!needsStripe && !needsCompanySetup) return null;

  let alertText = "";

  if (needsStripe && needsCompanySetup) {
    alertText =
      "You must complete your Stripe setup and company setup to access all features.";
  } else if (needsStripe) {
    alertText = "You must complete your Stripe setup to access all features.";
  } else if (needsCompanySetup) {
    alertText = "You must complete your company setup to access all features.";
  }

  return (
    <div className="mx-4 mb-2">
      <Alert
        variant="destructive"
        className="flex flex-col gap-4 max-w-screen-sm mx-auto"
      >
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive">Action Required</AlertTitle>
        </div>

        <AlertDescription>
          {alertText}
          <div className="flex flex-col items-start pt-1 gap-1">
            {needsStripe && (
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href={stripeSetupLink}>Go to Stripe Setup</Link>
              </Button>
            )}
            {needsCompanySetup && (
              <Button asChild variant="link" size="sm" className="px-0">
                <Link href={companySetupLink}>Complete Company Setup</Link>
              </Button>
            )}
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default AdminAlert;
