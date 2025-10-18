import CustomCard from "../shared/CustomCard";
import CardDetailRow from "../shared/CardDetailRow";
import CardDetailsWrapper from "../shared/CardDetailsWrapper";

const CostCard = () => {
  return (
    <CustomCard>
      <CardDetailsWrapper className="mt-0">
        <CardDetailRow label="Costs" value={"11"} className="font-bold" />
      </CardDetailsWrapper>
    </CustomCard>
  );
};

export default CostCard;
