import ErrorComponent from "@/app/components/shared/ErrorComponent";
import { useSlugContext } from "@/app/contexts/SlugContext";
import { useSalesRepsAndReferrals } from "@/app/hooks/queries/analytics/useSalesRepsAndReferrals";
import { QueryStatus } from "@/types/enums";
import AnalyticsHeader from "../header/AnalyticsHeader";
import AnalyticsTabSuccess from "./AnalyticsTabSuccess";

interface AnalyticsTabProps {
  tab: "FORECASTED" | "HISTORICAL";
  headerRight?: React.ReactNode;
}

const AnalyticsTab = ({ tab, headerRight }: AnalyticsTabProps) => {
  const { companyId } = useSlugContext();

  const result = useSalesRepsAndReferrals(companyId);

  let body: React.ReactNode = null;

  switch (result.status) {
    case QueryStatus.LOADING:
      break;
    case QueryStatus.ERROR:
      body = <ErrorComponent message={result.errorMessage} />;
      break;
    case QueryStatus.SUCCESS: {
      const { users, referrals } = result.data;
      body = (
        <AnalyticsTabSuccess tab={tab} users={users} referrals={referrals} />
      );
      break;
    }
  }

  return (
    <section>
      <AnalyticsHeader tab={tab} right={headerRight} />
      {body}
    </section>
  );
};

export default AnalyticsTab;
