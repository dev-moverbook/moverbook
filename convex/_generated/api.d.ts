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
import type * as arrivalWindow from "../arrivalWindow.js";
import type * as backendUtils_auth from "../backendUtils/auth.js";
import type * as backendUtils_checkUnique from "../backendUtils/checkUnique.js";
import type * as backendUtils_clerk from "../backendUtils/clerk.js";
import type * as backendUtils_helper from "../backendUtils/helper.js";
import type * as backendUtils_stripe from "../backendUtils/stripe.js";
import type * as backendUtils_validate from "../backendUtils/validate.js";
import type * as categories from "../categories.js";
import type * as clerk from "../clerk.js";
import type * as companies from "../companies.js";
import type * as companyContact from "../companyContact.js";
import type * as compliance from "../compliance.js";
import type * as connectedAccount from "../connectedAccount.js";
import type * as creditCardFee from "../creditCardFee.js";
import type * as customers from "../customers.js";
import type * as fees from "../fees.js";
import type * as http from "../http.js";
import type * as insurancePolicies from "../insurancePolicies.js";
import type * as invitations from "../invitations.js";
import type * as items from "../items.js";
import type * as labor from "../labor.js";
import type * as policies from "../policies.js";
import type * as referrals from "../referrals.js";
import type * as rooms from "../rooms.js";
import type * as scripts from "../scripts.js";
import type * as stripe from "../stripe.js";
import type * as travelFee from "../travelFee.js";
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
  arrivalWindow: typeof arrivalWindow;
  "backendUtils/auth": typeof backendUtils_auth;
  "backendUtils/checkUnique": typeof backendUtils_checkUnique;
  "backendUtils/clerk": typeof backendUtils_clerk;
  "backendUtils/helper": typeof backendUtils_helper;
  "backendUtils/stripe": typeof backendUtils_stripe;
  "backendUtils/validate": typeof backendUtils_validate;
  categories: typeof categories;
  clerk: typeof clerk;
  companies: typeof companies;
  companyContact: typeof companyContact;
  compliance: typeof compliance;
  connectedAccount: typeof connectedAccount;
  creditCardFee: typeof creditCardFee;
  customers: typeof customers;
  fees: typeof fees;
  http: typeof http;
  insurancePolicies: typeof insurancePolicies;
  invitations: typeof invitations;
  items: typeof items;
  labor: typeof labor;
  policies: typeof policies;
  referrals: typeof referrals;
  rooms: typeof rooms;
  scripts: typeof scripts;
  stripe: typeof stripe;
  travelFee: typeof travelFee;
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
