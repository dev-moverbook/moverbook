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
import type * as additionalFees from "../additionalFees.js";
import type * as additionalLiabilityCoverage from "../additionalLiabilityCoverage.js";
import type * as arrivalWindow from "../arrivalWindow.js";
import type * as backendUtils_auth from "../backendUtils/auth.js";
import type * as backendUtils_checkUnique from "../backendUtils/checkUnique.js";
import type * as backendUtils_clerk from "../backendUtils/clerk.js";
import type * as backendUtils_connectedAccountWebhook from "../backendUtils/connectedAccountWebhook.js";
import type * as backendUtils_helper from "../backendUtils/helper.js";
import type * as backendUtils_nano from "../backendUtils/nano.js";
import type * as backendUtils_sendGrid from "../backendUtils/sendGrid.js";
import type * as backendUtils_stripe from "../backendUtils/stripe.js";
import type * as backendUtils_template from "../backendUtils/template.js";
import type * as backendUtils_twilio from "../backendUtils/twilio.js";
import type * as backendUtils_validate from "../backendUtils/validate.js";
import type * as categories from "../categories.js";
import type * as clerk from "../clerk.js";
import type * as companies from "../companies.js";
import type * as companyContact from "../companyContact.js";
import type * as compliance from "../compliance.js";
import type * as connectedAccount from "../connectedAccount.js";
import type * as creditCardFee from "../creditCardFee.js";
import type * as customers from "../customers.js";
import type * as discounts from "../discounts.js";
import type * as fees from "../fees.js";
import type * as google from "../google.js";
import type * as http from "../http.js";
import type * as insurancePolicies from "../insurancePolicies.js";
import type * as invitations from "../invitations.js";
import type * as invoices from "../invoices.js";
import type * as items from "../items.js";
import type * as labor from "../labor.js";
import type * as messages from "../messages.js";
import type * as move from "../move.js";
import type * as moveAssignments from "../moveAssignments.js";
import type * as moveCustomers from "../moveCustomers.js";
import type * as paymentStep from "../paymentStep.js";
import type * as policies from "../policies.js";
import type * as preMoveDocs from "../preMoveDocs.js";
import type * as quotes from "../quotes.js";
import type * as referrals from "../referrals.js";
import type * as rooms from "../rooms.js";
import type * as scripts from "../scripts.js";
import type * as sendgrid from "../sendgrid.js";
import type * as stripe from "../stripe.js";
import type * as travelFee from "../travelFee.js";
import type * as users from "../users.js";
import type * as variables from "../variables.js";
import type * as webIntegrations from "../webIntegrations.js";
import type * as webhooks_clerk from "../webhooks/clerk.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  additionalFees: typeof additionalFees;
  additionalLiabilityCoverage: typeof additionalLiabilityCoverage;
  arrivalWindow: typeof arrivalWindow;
  "backendUtils/auth": typeof backendUtils_auth;
  "backendUtils/checkUnique": typeof backendUtils_checkUnique;
  "backendUtils/clerk": typeof backendUtils_clerk;
  "backendUtils/connectedAccountWebhook": typeof backendUtils_connectedAccountWebhook;
  "backendUtils/helper": typeof backendUtils_helper;
  "backendUtils/nano": typeof backendUtils_nano;
  "backendUtils/sendGrid": typeof backendUtils_sendGrid;
  "backendUtils/stripe": typeof backendUtils_stripe;
  "backendUtils/template": typeof backendUtils_template;
  "backendUtils/twilio": typeof backendUtils_twilio;
  "backendUtils/validate": typeof backendUtils_validate;
  categories: typeof categories;
  clerk: typeof clerk;
  companies: typeof companies;
  companyContact: typeof companyContact;
  compliance: typeof compliance;
  connectedAccount: typeof connectedAccount;
  creditCardFee: typeof creditCardFee;
  customers: typeof customers;
  discounts: typeof discounts;
  fees: typeof fees;
  google: typeof google;
  http: typeof http;
  insurancePolicies: typeof insurancePolicies;
  invitations: typeof invitations;
  invoices: typeof invoices;
  items: typeof items;
  labor: typeof labor;
  messages: typeof messages;
  move: typeof move;
  moveAssignments: typeof moveAssignments;
  moveCustomers: typeof moveCustomers;
  paymentStep: typeof paymentStep;
  policies: typeof policies;
  preMoveDocs: typeof preMoveDocs;
  quotes: typeof quotes;
  referrals: typeof referrals;
  rooms: typeof rooms;
  scripts: typeof scripts;
  sendgrid: typeof sendgrid;
  stripe: typeof stripe;
  travelFee: typeof travelFee;
  users: typeof users;
  variables: typeof variables;
  webIntegrations: typeof webIntegrations;
  "webhooks/clerk": typeof webhooks_clerk;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
