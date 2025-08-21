import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import LocationCard from "@/app/components/move/LocationCard";
import { AddressProvider } from "@/app/components/move/AddressContext";
import RouteMap from "@/app/components/move/RouteMap";
import { LocationInput } from "@/types/form-types";
import { SegmentDistance } from "@/types/types";
import { Doc } from "@/convex/_generated/dataModel";

interface LocationSummaryProps {
  companyContact?: Doc<"companyContact">;
  locations: LocationInput[];
  segmentDistances: SegmentDistance[];
  showBorder?: boolean;
}

const LocationSummary = ({
  companyContact,
  locations,
  segmentDistances,
  showBorder = false,
}: LocationSummaryProps) => {
  console.log("segmentDistances", segmentDistances);

  const moveAddresses = locations
    .map((loc) => loc.address?.placeId)
    .filter(Boolean);
  const office = companyContact?.address?.placeId ?? null;

  // Route: office ➝ origin ➝ stops ➝ destination ➝ office
  const placeIds = [office, ...moveAddresses, office] as string[];

  return (
    <>
      <SectionContainer showBorder={showBorder}>
        <Header3 wrapperClassName="px-0 pt-0" showCheckmark={false}>
          Location Summary
        </Header3>

        <AddressProvider placeIds={placeIds}>
          <RouteMap />
        </AddressProvider>
      </SectionContainer>
      <LocationCard segmentDistances={segmentDistances} />
    </>
  );
};

export default LocationSummary;
