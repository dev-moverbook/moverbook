/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as backendUtils_auth from "../backendUtils/auth.js";
import type * as backendUtils_checkUnique from "../backendUtils/checkUnique.js";
import type * as backendUtils_clerk from "../backendUtils/clerk.js";
import type * as backendUtils_helper from "../backendUtils/helper.js";
import type * as backendUtils_validate from "../backendUtils/validate.js";
import type * as clerk from "../clerk.js";
import type * as companies from "../companies.js";
import type * as companyContact from "../companyContact.js";
import type * as compliance from "../compliance.js";
import type * as customers from "../customers.js";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as referrals from "../referrals.js";
import type * as scripts from "../scripts.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";
import type * as variables from "../variables.js";
import type * as webIntegrations from "../webIntegrations.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "backendUtils/auth": typeof backendUtils_auth;
  "backendUtils/checkUnique": typeof backendUtils_checkUnique;
  "backendUtils/clerk": typeof backendUtils_clerk;
  "backendUtils/helper": typeof backendUtils_helper;
  "backendUtils/validate": typeof backendUtils_validate;
  clerk: typeof clerk;
  companies: typeof companies;
  companyContact: typeof companyContact;
  compliance: typeof compliance;
  customers: typeof customers;
  http: typeof http;
  invitations: typeof invitations;
  referrals: typeof referrals;
  scripts: typeof scripts;
  stripe: typeof stripe;
  users: typeof users;
  variables: typeof variables;
  webIntegrations: typeof webIntegrations;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
