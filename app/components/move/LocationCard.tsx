// import React from "react";
// import CustomCard from "../shared/CustomCard";
// import CardDetailRow from "../shared/CardDetailRow";
// import CardDetailsWrapper from "../shared/CardDetailsWrapper";
// import { useMoveForm } from "@/app/contexts/MoveFormContext";
// import { formatDecimalNumber } from "@/app/frontendUtils/helper";

// const LocationCard = () => {
//   const {
//     officeToOrigin,
//     destinationToOrigin,
//     roundTripMiles,
//     roundTripDrive,
//   } = useMoveForm();
//   return (
//     <CustomCard>
//       <CardDetailsWrapper className="mt-0">
//         <CardDetailRow
//           label="Office to Origin"
//           value={formatDecimalNumber(officeToOrigin, "miles")}
//         />
//         <CardDetailRow
//           label="Destination to Office"
//           value={formatDecimalNumber(destinationToOrigin, "miles")}
//         />
//         <CardDetailRow
//           label="Total Miles"
//           value={formatDecimalNumber(roundTripMiles, "miles")}
//         />
//         <CardDetailRow
//           label="Total Drive Time"
//           value={formatDecimalNumber(roundTripDrive, "hours")}
//         />
//       </CardDetailsWrapper>
//     </CustomCard>
//   );
// };

// export default LocationCard;

import React from "react";
import CustomCard from "../shared/CustomCard";
import CardDetailRow from "../shared/CardDetailRow";
import CardDetailsWrapper from "../shared/CardDetailsWrapper";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { formatDecimalNumber } from "@/app/frontendUtils/helper";

const LocationCard = () => {
  const { segmentDistances, roundTripMiles, roundTripDrive } = useMoveForm();

  return (
    <CustomCard>
      <CardDetailsWrapper className="mt-0">
        {segmentDistances.map((seg, i) => (
          <CardDetailRow
            key={i}
            label={seg.label}
            value={formatDecimalNumber(seg.distance, "miles")}
          />
        ))}
        <CardDetailRow
          label="Total Miles"
          value={formatDecimalNumber(roundTripMiles, "miles")}
          className="font-bold"
        />
        <CardDetailRow
          label="Total Drive Time"
          value={formatDecimalNumber(roundTripDrive, "hours")}
          className="font-bold"
        />
      </CardDetailsWrapper>
    </CustomCard>
  );
};

export default LocationCard;
