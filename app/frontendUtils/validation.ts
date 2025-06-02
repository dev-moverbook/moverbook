import { FrontEndErrorMessages } from "@/types/errors";
import {
  AddMoveLineItemInput,
  FormMoveItemInput,
  RoomFormData,
} from "@/types/form-types";

export const validatePrice = (price: number | null): string | null => {
  if (price === null || isNaN(price)) {
    return "Price is required and must be a valid number.";
  }

  if (price < 0) {
    return "Price cannot be negative.";
  }

  const decimalPart = price.toString().split(".")[1];
  if (decimalPart && decimalPart.length > 2) {
    return "Price can only have up to 2 decimal places.";
  }

  return null;
};

export interface MoveItemValidationErrors {
  item?: string;
  room?: string;
  quantity?: string;
  weight?: string;
  size?: string;
}

export const validateMoveItemForm = (
  formData: FormMoveItemInput
): { isValid: boolean; errors: MoveItemValidationErrors } => {
  const errors: MoveItemValidationErrors = {};

  if (!formData.item.trim()) {
    errors.item = FrontEndErrorMessages.ITEM_NAME_REQUIRED;
  }

  if (!formData.room.trim()) {
    errors.room = FrontEndErrorMessages.ROOM_REQUIRED;
  }

  if (!formData.quantity || formData.quantity <= 0) {
    errors.quantity = FrontEndErrorMessages.QUANTITY_REQUIRED;
  }

  if (!formData.size || formData.size <= 0) {
    errors.size = FrontEndErrorMessages.SIZE_REQUIRED;
  }

  if (!formData.weight || formData.weight <= 0) {
    errors.weight = FrontEndErrorMessages.WEIGHT_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export interface RoomValidationErrors {
  name?: string;
}

export const validateRoomForm = (
  formData: RoomFormData
): { isValid: boolean; errors: RoomValidationErrors } => {
  const errors: RoomValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = FrontEndErrorMessages.ROOM_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
export type AddLineValidationErrors = {
  name?: string;
  price?: string;
  quantity?: string;
};

export const validateAddLineForm = (
  formData: AddMoveLineItemInput
): { isValid: boolean; errors: AddLineValidationErrors } => {
  const errors: AddLineValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = FrontEndErrorMessages.FEE_NAME_REQUIRED;
  }

  if (formData.price === null || isNaN(formData.price) || formData.price < 0) {
    errors.price = FrontEndErrorMessages.PRICE_REQUIRED;
  }

  if (!formData.quantity || formData.quantity < 1) {
    errors.quantity = FrontEndErrorMessages.QUANTITY_REQUIRED;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
