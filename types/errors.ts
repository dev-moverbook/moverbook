export enum ErrorMessages {
  ARRIVAL_WINDOW_NOT_FOUND = "Arrival window not found",
  CLERK_INVITATION_SENT_ERROR = "Clerk error sending invitation to new user",
  CLERK_ORG_CREATE_ERROR = "Error creating Clerk organization",
  CLERK_ORG_INVITATION_ERROR = "Clerk error inviting user to organization",
  CLERK_ORG_UPDATE_MEMBERSHIP = "Clerk error updating organization membership",
  CLERK_ORG_UPDATE_NAME = "Clerk error updating organization name",
  CLERK_ORG_REVOKE_ERROR = "Cler error revoking invitation",
  CLERK_UPDATE_NAME = "Clerk error updating name",
  COMPANY_DB_CREATE_ERROR = "Database error creating company",
  COMPANY_DB_QUERY_BY_ID = "DB error query company by Id",
  COMPANY_DB_QUERY_BY_CLERK_ORG_ID = "DB error query company by clerk org Id",
  COMPANY_DB_QUERY_BY_SLUG = "DB error query company by slug",
  COMPANY_DB_UPDATE = "DB error updating company",
  COMPANY_RELATED_RECORDS_CREATE_ERROR = "DB error creating related records",
  COMPANY_INACTIVE = "Company is inactive",
  COMPANY_NOT_FOUND = "Company not found",
  CONNECTED_ACCOUNT_NO_CUSTOMER_ID = "No customerId found in account metadata",
  CONNECTED_ACCOUNT_UPDATE_ERROR = "Error updating connected account",
  CONTEXT_USE_TEAM_PROVIDER = "useTeamContext must be used within a TeamProvider",
  CONTEXT_SLUG_PROVER = "useSlugContext must be used within a SlugProvider",
  CUSTOMER_EXISTS = "Customer already exists.",
  CUSTOMER_DB_CREATE_ERROR = "Database error creating user",
  CUSTOMER_DB_QUERY_BY_EMAIL_ERROR = "Database error query customer by email",
  CUSTOMER_DB_UPDATE_ERROR = "Database error updating user",
  ENV_CLERK_SECRET_KEY_NOT_SET = "ENV_CLERK_SECRET_KEY_NOT_SET is not set. Please configure it in your environment variables.",
  ENV_NEXT_PUBLIC_CONVEX_UR_NOT_SET = "NEXT_PUBLIC_CONVEX_URL is not set. Please configure it in your environment variables.",
  ENV_NOT_SET_SENDGRID_KEY = "Missing SENDGRID_API_KEY",
  ENV_NOT_SET_CONNECTED = "Missing STRIPE_CONNECTED_WEBHOOK_SECRET",
  ENV_NOT_SET_STRIPE_CONNECTED_WEBHOOK_SECRET = "Missing STRIPE_CONNECTED_WEBHOOK_SECRET",
  CONNECTED_ACCOUNT_VERIFICATION = "Webhook Connected Account verification failed",
  POLICY_NOT_FOUND = "Policy not found",
  FOBIDDEN_COMPANY = "User does not belong to company",
  MIDDLEWARE_REDIRECT_HOME = "Middleware error redirect user for home route",
  USER_DB_QUERY_BY_EMAIL = "Database error querying user by email",
  USER_DB_QUERY_BY_ID = "Database error querying user by id",
  USER_DB_CREATE = "Database error creating user",
  USER_DB_UPDATE = "DB error updating user",
  USER_EXISTS = "User already exists",
  USER_FORBIDDEN_PERMISSION = "You do not have permission to perform this action.",
  USER_INACTIVE = "User is inactive",
  USER_NO_COMPANY = "User does not have a company",
  USER_NOT_AUTHENTICATED = "User is not authenticated",
  USER_NOT_CUSTOMER = "User is not a customer",
  USER_NOT_FOUND = "User not found",
  USER_WITH_EMAIL_EXISTS = "User with email exists",
  GENERIC_ERROR = "An unexpected error occurred. Please try again later.",
  INVALID_EMAIL = "Please enter a valid email address.",
  INTERNAL_ERROR = "Internal Error",
  INVITATION_ALREADY_ACCEPTED = "Invitation already accepted. It cannot be revoked",
  INVITATION_ALREADY_REVOKED = "Invitation already revoked",
  INVITATION_DB_CREATE = "DB error creating an invitation",
  INVITATION_DB_QUERY_BY_EMAIL = "DB error query invitation by email",
  INVITATION_DB_QUERY_BY_ID = "DB error query invitation by id",
  INVITATION_DB_UPDATE = "DB error updating invitation status",
  INVITATION_NOT_FOUND = "Invitation not found",
  REFERRAL_INACTIVE = "Referral inactive",
  REFERRAL_NOT_FOUND = "Referral not found",
  VARIABLE_INACTIVE = "Variable is inactive",
  VARIABLE_NAME_EXISTS = "Variable name already exists",
  VARIABLE_NOT_FOUND = "Variable not found",
  SCRIPT_WITH_TITLE_EXITS = "Script with this title already exists",
  SCRIPT_NOT_FOUND = "Script not found",
  SCRIPT_INACTIVE = "Script is inactive",
  SCRIPT_PRESET_CANNOT_BE_DELETED = "Preset scripts cannot be deleted",
  EMAIL_TITLE_REQUIRED = "Email title required",
  COMPLIANCE_NOT_FOUND = "Compliance not found",
  WEB_INTEGRATIONS_NOT_FOUND = "Web integrations not found",
  COMPANY_CONTACT_NOT_FOUND = "Company contact not found",
  LABOR_START_DATES_INCOMPLETE = "Both startDate and endDate must be provided or neither.",
  LABOR_OVERLAPS = "Labor schedule overlaps with an existing entry.",
  LABOR_NOT_FOUND = "Labor not found",
  INSURANCE_POLICY_NOT_FOUND = "Insurance policy not found",
  CREDIT_CARD_FEE_NOT_FOUND = "Credit card fee not found",
  FEE_NOT_FOUND = "Fee not found",
  TRAVEL_FEE_NOT_FOUND = "Travel fee not found",
  ROOM_NAME_ALREADY_EXISTS = "Room name already exists",
  ROOM_NOT_FOUND = "Room not foun ",
  ROOM_INACTIVE = "Room inactive",
  CATEGORY_NOT_FOUND = "Category not found",
  CATEGORY_INACTIVE = "Category inactive",
  ITEM_INACTIVE = "Item inactive",
  ITEM_NOT_FOUND = "Item not found",
  ENV_NOT_SET_STRIPE_KEY = "Stripe env not set",
  ENV_NOT_SET_GOOGLE_MAPS_API_KEY = "Google Maps API key not set",
  STRIPE_CONNECTED_DEACTIVATE_ERROR = "Stripe error deactivating account",
  STRIPE_CONNECTED_DB_CREATE = "Db error creating stripe connected account",
  STRIPE_CREATE = "Stripe connected error creating account",
  STRIPE_CONNECTED_ONBOARDING_LINK = "Stripe connected error generating onboarding link",
  SENDGRID_SENDER_CREATION_ERROR = "SendGrid sender creation failed",
  SENDGRID_SENDER_VERIFICATION_ERROR = "SendGrid sender verification failed",
  COMPANY_CONTACT_UPDATE = "DB error updating company contact",
  COMPANY_CONTACT_QUERY = "DB error querying company contact",
  COMPANY_CONTACT_SENDGRID_SENDER_NOT_FOUND = "SendGrid sender not found in Company Contact",
  WORLD_TIME_API_ERROR = "World Time API Error fetching timezones",
  CLERK_WEBHOOK_ORG_INV_ACCEPTED = "Error handling organizationInvitation.accepted",
  CLERK_USER_NOT_FOUND = "Clerk user not found",
  CLERK_USER_METADATA_UPDATE_ERROR = "Error updating public metadata for user",
  CLERK_WEBHOOK_USER_CREATED = "Error handling user.created",
  MOVE_NOT_FOUND = "Move not found",
  INVALID_MOVE_ID = "Invalid move ID",
  QUOTE_NOT_FOUND = "Quote not found",
  MISSING_REQUIRED_STATUS = "Missing required status when creating new quote.",
  MOVE_ASSIGNMENT_NOT_FOUND = "Move assignment not found",
  ADDITIONAL_FEE_NOT_FOUND = "Additional fee not found",
  DISCOUNT_NOT_FOUND = "Discount not found",
}

export enum FrontEndErrorMessages {
  COMPANY_ID_NOT_FOUND = "Company Id not found",
  COMPANY_NOT_FOUND = "Company not found from params",
  EMAIL_INVALID = "Invalid email format.",
  EMAIL_REQUIRED = "Email is required.",
  EMAIL_TITLE_REQUIRED = "Email title required",
  HOURLY_RATE_INVALID = "Invalid hourly rate.",
  INVITE_USER_ERROR = "Error occured inviting user.",
  GENERIC = "An unexpected error occurred. Please try again later.",
  REFERARAL_NAME_REQUIRED = "Referral name required.",
  ROLE_INVALID = "Invalid role.",
  SCRIPT_MESSAGE_REQUIRED = "Script message required",
  SCRIPT_TITLE_REQUIRED = "Script title required.",
  VARIABLE_DEFAULT_REQUIRED = "Default value required.",
  VARIABLE_NAME_REQUIRED = "Variable name required.",
  NO_ORGANIZATION_SELECTED = "No organization selected.",
  LABOR_NAME_REQUIRED = "Labor name required",
  ROOM_NAME_EMPTY = "Room name cannot be empty.",
  NO_CATEGORY_SELECTED = "No category selected",
  CATEGORY_NAME_EMPTY = "Category name cannot be empty.",
  ITEM_NAME_REQUIRED = "Item name is required",
  START_DATE_AFTER_END_DATE = "Start date must be before end date",
  START_DATE_REQUIRED = "Start date is required",
  END_DATE_REQUIRED = "End date is required",
  ROOM_REQUIRED = "Room is required",
  QUANTITY_REQUIRED = "Quantity must be greater than 0.",
  SIZE_REQUIRED = "Size must be greater than 0.",
  WEIGHT_REQUIRED = "Weight must be greater than 0.",
  FEE_NAME_REQUIRED = "Fee name is required",
  PRICE_REQUIRED = "Valid price is required",
  INVALID_MOVE_ID = "Invalid  move ID",
  NAME_REQUIRED = "Full name is required",
  PHONE_NUMBER_INVALID = "Enter a valid phone number (10–15 digits).",
  REFERRAL_INVALID = "Referral must be a valid option.",
}
