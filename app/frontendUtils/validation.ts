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
