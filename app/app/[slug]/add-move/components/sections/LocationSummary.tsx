import CardContainer from "@/app/components/shared/CardContainer";
import SectionContainer from "@/app/components/shared/containers/SectionContainer";
import Header3 from "@/app/components/shared/heading/Header3";
import React from "react";
import LocationCard from "@/app/components/move/LocationCard";
import { useMoveForm } from "@/app/contexts/MoveFormContext";
import { AddressProvider } from "@/app/components/move/AddressContext";
import RouteMap from "@/app/components/move/RouteMap";

const LocationSummary = () => {
  const { companyContact, locations } = useMoveForm();

  const moveAddresses = locations.map((loc) => loc.address).filter(Boolean);
  const office = companyContact?.address;

  // Route: office ➝ origin ➝ stops ➝ destination ➝ office
  const addresses = [office, ...moveAddresses, office] as string[];

  return (
    <SectionContainer showBorder={false}>
      <Header3 showCheckmark={false}>Summary</Header3>

      <AddressProvider addresses={addresses}>
        <RouteMap />
      </AddressProvider>

      <CardContainer>
        <LocationCard />
      </CardContainer>
    </SectionContainer>
  );
};

export default LocationSummary;
