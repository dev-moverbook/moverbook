"use client";

import CustomCard from "../shared/card/CustomCard";
import CardDetailRow from "../shared/card/CardDetailRow";
import CardDetailsWrapper from "../shared/card/CardDetailsWrapper";

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
