"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import Link from "next/link";
import { useSlugContext } from "@/contexts/SlugContext";
import { Button } from "@/components/ui/button";

const AdminAlert: React.FC = () => {
  const { slug, isCompanyContactComplete, isStripeComplete, companyId } =
    useSlugContext();

  const isSetupStatusReady =
    companyId !== null &&
    typeof isCompanyContactComplete === "boolean" &&
    typeof isStripeComplete === "boolean";

  const needsStripe = !isStripeComplete;
  const needsCompanySetup = !isCompanyContactComplete;

  const stripeSetupLink = `/app/${slug}/stripe`;
  const companySetupLink = `/app/${slug}/company-setup`;

  if ((!needsStripe && !needsCompanySetup) || !isSetupStatusReady) {
    return null;
  }

  let alertText = "";
  switch (true) {
    case needsStripe && needsCompanySetup: {
      alertText =
        "You must complete your Stripe setup and company setup to access all features.";
      break;
    }
    case needsStripe: {
      alertText = "You must complete your Stripe setup to access all features.";
      break;
    }
    case needsCompanySetup: {
      alertText =
        "You must complete your company setup to access all features.";
      break;
    }
    default: {
      alertText = "";
    }
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
