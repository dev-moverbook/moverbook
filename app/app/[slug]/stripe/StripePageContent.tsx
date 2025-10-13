import CenteredContainer from "@/app/components/shared/CenteredContainer";
import SectionContainer from "@/app/components/shared/SectionContainer";
import { Button } from "@/app/components/ui/button";
import { StripeAccountStatus } from "@/types/enums";
import { useShowOnboardingLink } from "./hooks/useShowOnboardingLink";
import FieldDisplay from "@/app/components/shared/FieldDisplay";
import { useStripeDashboardLink } from "./hooks/useStripeDashboardLink";
import SectionHeaderWithAction from "@/app/components/shared/ SectionHeaderWithAction";
import { Doc } from "@/convex/_generated/dataModel";

interface StripePageContentProps {
  connectedAccount: Doc<"connectedAccounts"> | null;
}

const StripePageContent: React.FC<StripePageContentProps> = ({
  connectedAccount,
}) => {
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

export default StripePageContent;
