import { nanoid } from "nanoid";
import {
  LocationInput,
  MoveFeeInput,
  MoveItemInput,
  MoveFormData,
} from "@/types/form-types";

export function createMoveFormActions(
  setMoveFormData: React.Dispatch<React.SetStateAction<MoveFormData>>
) {
  const addStopLocation = () => {
    const newStop: LocationInput = {
      uid: nanoid(),
      locationRole: "stop",
      address: null,
      locationType: null,
      aptNumber: null,
      aptName: null,
      squareFootage: null,
      accessType: null,
      moveSize: null,
      timeDistanceRange: "0-30 sec (less than 100 ft)",
    };
    setMoveFormData((prev) => ({
      ...prev,
      locations: [
        ...prev.locations.slice(0, -1),
        newStop,
        prev.locations[prev.locations.length - 1],
      ],
    }));
  };

  const updateLocation = (index: number, updated: Partial<LocationInput>) => {
    const cleaned = Object.fromEntries(
      Object.entries(updated).filter(([, v]) => v !== undefined)
    ) as Partial<LocationInput>;
    setMoveFormData((prev) => ({
      ...prev,
      locations: prev.locations.map((loc, i) =>
        i === index ? { ...loc, ...cleaned } : loc
      ),
    }));
  };

  const removeLocation = (index: number) => {
    setMoveFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, i) => i !== index),
    }));
  };

  const addMoveFee = (fee: MoveFeeInput) => {
    setMoveFormData((prev) => ({ ...prev, moveFees: [...prev.moveFees, fee] }));
  };

  const updateMoveFee = (index: number, updated: Partial<MoveFeeInput>) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveFees: prev.moveFees.map((fee, i) =>
        i === index ? { ...fee, ...updated } : fee
      ),
    }));
  };

  const deleteMoveFee = (index: number) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveFees: prev.moveFees.filter((_, i) => i !== index),
    }));
  };

  const addMoveItem = (item: MoveItemInput) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveItems: [...prev.moveItems, item],
    }));
  };

  const updateMoveItem = (index: number, updated: Partial<MoveItemInput>) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveItems: prev.moveItems.map((it, i) =>
        i === index ? { ...it, ...updated } : it
      ),
    }));
  };

  const removeMoveItem = (index: number) => {
    setMoveFormData((prev) => ({
      ...prev,
      moveItems: prev.moveItems.filter((_, i) => i !== index),
    }));
  };

  return {
    addStopLocation,
    updateLocation,
    removeLocation,
    addMoveFee,
    updateMoveFee,
    deleteMoveFee,
    addMoveItem,
    updateMoveItem,
    removeMoveItem,
  };
}
