"use client";
import CenteredContainer from "@/components/shared/containers/CenteredContainer";
import SectionContainer from "@/components/shared/section/SectionContainer";
import { Button } from "@/components/ui/button";
import { StripeAccountStatus } from "@/types/enums";
import { useShowOnboardingLink } from "@/hooks/connectedAccount";
import FieldDisplay from "@/components/shared/field/FieldDisplay";
import { useStripeDashboardLink } from "../../hooks/connectedAccount/useStripeDashboardLink";
import SectionHeaderWithAction from "@/components/shared/section/SectionHeaderWithAction";
import { Doc } from "@/convex/_generated/dataModel";

interface StripeContentProps {
  connectedAccount: Doc<"connectedAccounts"> | null;
}

const StripePage: React.FC<StripeContentProps> = ({ connectedAccount }) => {
  const showOnboardingLink =
    connectedAccount === null ||
    connectedAccount.status === StripeAccountStatus.NOT_ONBOARDED;

  const {
    getOnboardingLink,
    isLoading: onboardingLoading,
    error: onboardingLinkError,
  } = useShowOnboardingLink();
  const {
    fetchDashboardLink: getDashboardLink,
    isLoading: dashboardLoading,
    error: dashboardError,
  } = useStripeDashboardLink();

  const handleOnboardingClick = async () => {
    const url = await getOnboardingLink();
    if (url) {
      window.open(url, "_blank");
    }
  };

  const handleDashboardClick = async () => {
    const url = await getDashboardLink();

    if (url) {
      window.open(url, "_blank");
    }
  };

  const statusToDisplay =
    connectedAccount?.status || StripeAccountStatus.NOT_ONBOARDED;

  return (
    <SectionContainer isLast={true}>
      <SectionHeaderWithAction title="Stripe Connection" />

      <CenteredContainer className="md:px-0">
        <div className="mt-4">
          <FieldDisplay label="Status" value={statusToDisplay} />
        </div>

        {showOnboardingLink ? (
          <div className="mt-4">
            <Button
              onClick={handleOnboardingClick}
              disabled={onboardingLoading}
              isLoading={onboardingLoading}
              className=""
            >
              Connect with Stripe
            </Button>
            {onboardingLinkError && (
              <p className="text-red-500 mt-2">{onboardingLinkError}</p>
            )}
          </div>
        ) : (
          <div className="mt-4">
            <Button
              onClick={handleDashboardClick}
              disabled={dashboardLoading}
              className=""
              isLoading={dashboardLoading}
            >
              Stripe Dashboard
            </Button>
            {dashboardError && (
              <p className="text-red-500 mt-2">{dashboardError}</p>
            )}
          </div>
        )}
      </CenteredContainer>
    </SectionContainer>
  );
};

export default StripePage;
