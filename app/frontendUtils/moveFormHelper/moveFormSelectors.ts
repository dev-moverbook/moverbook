import {
  CustomerFormData,
  LocationInput,
  MoveFormData,
} from "@/types/form-types";

export function isInfoSectionComplete(customer: CustomerFormData) {
  return (
    !!customer.email.trim() &&
    !!customer.phoneNumber.trim() &&
    (customer.altPhoneNumber ? !!customer.altPhoneNumber.trim() : true) &&
    !!customer.referral
  );
}

export function isLocationComplete(location: LocationInput) {
  return (
    !!location?.address?.formattedAddress &&
    !!location?.locationType &&
    !!location?.accessType &&
    !!location?.timeDistanceRange &&
    !!location?.locationRole &&
    location?.squareFootage !== null &&
    location?.squareFootage !== undefined &&
    (location?.locationRole === "ending" ||
      (location?.moveSize !== null && location?.moveSize !== undefined))
  );
}

export function isLocationSectionComplete(locations: LocationInput[]) {
  return locations.every(isLocationComplete);
}

export function isMoveDetailsComplete(m: MoveFormData) {
  return (
    m.serviceType !== null &&
    m.moveWindow !== null &&
    !!m.moveDate &&
    !!m.arrivalTimes.arrivalWindowStarts &&
    !!m.arrivalTimes.arrivalWindowEnds
  );
}
