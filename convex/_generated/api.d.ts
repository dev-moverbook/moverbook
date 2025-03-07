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
import type * as backendUtils_clerk from "../backendUtils/clerk.js";
import type * as backendUtils_validate from "../backendUtils/validate.js";
import type * as clerk from "../clerk.js";
import type * as companies from "../companies.js";
import type * as customers from "../customers.js";
import type * as http from "../http.js";
import type * as invitations from "../invitations.js";
import type * as stripe from "../stripe.js";
import type * as users from "../users.js";

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
  "backendUtils/clerk": typeof backendUtils_clerk;
  "backendUtils/validate": typeof backendUtils_validate;
  clerk: typeof clerk;
  companies: typeof companies;
  customers: typeof customers;
  http: typeof http;
  invitations: typeof invitations;
  stripe: typeof stripe;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
