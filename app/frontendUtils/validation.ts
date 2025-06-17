import { FrontEndErrorMessages } from "@/types/errors";
import {
  AddMoveLineItemInput,
  FormMoveItemInput,
  InfoFormData,
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

export interface ContactValidationErrors {
  name?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  altPhoneNumber?: string | null;
  referral?: string | null;
}

export const validateContactForm = (
  formData: InfoFormData,
  allowedReferrals: string[]
): { isValid: boolean; errors: ContactValidationErrors } => {
  const errors: ContactValidationErrors = {};

  if (!formData.name.trim()) {
    errors.name = FrontEndErrorMessages.NAME_REQUIRED;
  }

  if (formData.email?.trim()) {
    if (!emailRegex.test(formData.email)) {
      errors.email = FrontEndErrorMessages.EMAIL_INVALID;
    }
  }

  const phoneError = validatePhoneNumber(formData.phoneNumber);
  if (phoneError) {
    errors.phoneNumber = phoneError;
  }

  const altPhoneError = validatePhoneNumber(formData.altPhoneNumber);
  if (altPhoneError) {
    errors.altPhoneNumber = altPhoneError;
  }

  if (formData.referral && !allowedReferrals.includes(formData.referral)) {
    errors.referral = FrontEndErrorMessages.REFERRAL_INVALID;
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validatePhoneNumber = (
  value: string | null | undefined
): string | null => {
  if (!value) return null;

  const phoneDigits = value.replace(/\D/g, "");
  if (phoneDigits.length < 10 || phoneDigits.length > 15) {
    return FrontEndErrorMessages.PHONE_NUMBER_INVALID;
  }

  return null;
};
