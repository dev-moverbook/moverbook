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
  CUSTOMER_EXISTS = "Customer already exists.",
  CUSTOMER_DB_CREATE_ERROR = "Database error creating user",
  CUSTOMER_DB_UPDATE_ERROR = "Database error updating user",
  USER_DB_QUERY = "Database error querying user by email",
  USER_EXISTS = "User already exists",
  GENERIC = "An unexpected error occurred. Please try again later.",
  INVALID_EMAIL = "Please enter a valid email address.",
}
