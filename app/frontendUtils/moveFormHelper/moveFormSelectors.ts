import {
  CustomerFormData,
  LocationInput,
  MoveFormData,
} from "@/types/form-types";

export function isInfoSectionComplete(customer: CustomerFormData) {
  return (
    !!customer.name.trim() &&
    !!customer.email.trim() &&
    !!customer.phoneNumber.trim() &&
    !!customer.altPhoneNumber.trim()
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
