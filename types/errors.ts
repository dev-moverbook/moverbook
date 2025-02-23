export const ErrorMessage = {
  Customer: {
    Fetch: "Error fetching customer.",
  },
  Clerk: {
    Env: {
      Secret: "CLERK_SECRET_KEY is missing in environment variables.",
    },
    Sdk: {
      InvitationFailed: "Failed to send Clerk invitation.",
    },
  },
} as const;

export enum ErrorMessages {
  CLERK_ORG_CREATE_ERROR = "Error creating Clerk organization",
  COMPANY_DB_CREATE_ERROR = "Database error creating company",
  CUSTOMER_EXISTS = "Customer already exists.",
  CUSTOMER_DB_CREATE_ERROR = "Database error creating user",
  CUSTOMER_DB_UPDATE_ERROR = "Database error updating user",
  USER_DB_QUERY = "Database error querying user by email",
  USER_DB_CREATE = "Database error creating user",
  USER_EXISTS = "User already exists",
  USER_FORBIDDEN_PERMISSION = "You do not have permission to perform this action.",
  USER_INACTIVE = "User is inactive",
  USER_NOT_AUTHENTICATED = "User is not authenticated",
  USER_NOT_CUSTOMER = "User is not a customer",
  USER_NOT_FOUND = "User not found",
  GENERIC = "An unexpected error occurred. Please try again later.",
  INVALID_EMAIL = "Please enter a valid email address.",
}
