import { nanoid } from "nanoid";
import {
  MoveFormData,
  CustomerFormData,
  LocationInput,
} from "@/types/form-types";

export function buildDefaultCustomer(): CustomerFormData {
  return {
    name: "",
    email: "",
    phoneNumber: "",
    altPhoneNumber: "",
    referral: "",
  };
}

function makeLocation(role: LocationInput["locationRole"]): LocationInput {
  return {
    uid: nanoid(),
    locationRole: role,
    address: null,
    locationType: null,
    aptNumber: null,
    aptName: null,
    squareFootage: null,
    accessType: null,
    moveSize: null,
    timeDistanceRange: "0-30 sec (less than 100 ft)",
  };
}

export function buildDefaultMoveFormData(): MoveFormData {
  return {
    arrivalTimes: { arrivalWindowEnds: "", arrivalWindowStarts: "" },
    companyId: null,
    creditCardFee: 0,
    deposit: 0,
    paymentMethod: { kind: "credit_card" },
    destinationToOrigin: null,
    endingMoveTime: 1,
    liabilityCoverage: null,
    jobType: "hourly",
    jobTypeRate: null,
    locations: [makeLocation("starting"), makeLocation("ending")],
    moveCustomerId: null,
    moveDate: null,
    moveFees: [],
    moveItems: [],
    moveStatus: "New Lead",
    moveWindow: "morning",
    movers: 1,
    notes: "",
    officeToOrigin: null,
    roundTripDrive: null,
    roundTripMiles: null,
    salesRep: null,
    serviceType: null,
    segmentDistances: [],
    startingMoveTime: 1,
    totalMiles: null,
    trucks: 1,
  };
}
