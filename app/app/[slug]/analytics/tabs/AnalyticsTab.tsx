import { useSlugContext } from "@/app/contexts/SlugContext";
import { useSalesRepsAndReferrals } from "@/app/hooks/queries/analytics/useSalesRepsAndReferrals";
import AnalyticsTabSuccess from "./AnalyticsTabSuccess";

interface AnalyticsTabProps {
  tab: "FORECASTED" | "HISTORICAL";
}

const AnalyticsTab = ({ tab }: AnalyticsTabProps) => {
  const { companyId } = useSlugContext();

  const result = useSalesRepsAndReferrals(companyId);

  let body: React.ReactNode = null;

  switch (result) {
    case undefined:
      break;
    default: {
      const { users, referrals } = result;
      body = (
        <AnalyticsTabSuccess tab={tab} users={users} referrals={referrals} />
      );
      break;
    }
  }

  return <>{body}</>;
};

export default AnalyticsTab;
