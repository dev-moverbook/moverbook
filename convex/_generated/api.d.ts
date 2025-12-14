/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as actions_messages from "../actions/messages.js";
import type * as additionalFees from "../additionalFees.js";
import type * as arrivalWindows from "../arrivalWindows.js";
import type * as backendUtils_analyticsHelper from "../backendUtils/analyticsHelper.js";
import type * as backendUtils_auth from "../backendUtils/auth.js";
import type * as backendUtils_calculations from "../backendUtils/calculations.js";
import type * as backendUtils_checkUnique from "../backendUtils/checkUnique.js";
import type * as backendUtils_connectedAccountWebhook from "../backendUtils/connectedAccountWebhook.js";
import type * as backendUtils_errors from "../backendUtils/errors.js";
import type * as backendUtils_helper from "../backendUtils/helper.js";
import type * as backendUtils_luxonHelper from "../backendUtils/luxonHelper.js";
import type * as backendUtils_moveHelper from "../backendUtils/moveHelper.js";
import type * as backendUtils_nano from "../backendUtils/nano.js";
import type * as backendUtils_newsFeedHelper from "../backendUtils/newsFeedHelper.js";
import type * as backendUtils_queries from "../backendUtils/queries.js";
import type * as backendUtils_queryHelpers from "../backendUtils/queryHelpers.js";
import type * as backendUtils_sendGrid from "../backendUtils/sendGrid.js";
import type * as backendUtils_serverEnv from "../backendUtils/serverEnv.js";
import type * as backendUtils_stripe from "../backendUtils/stripe.js";
import type * as backendUtils_template from "../backendUtils/template.js";
import type * as backendUtils_twilio from "../backendUtils/twilio.js";
import type * as backendUtils_validate from "../backendUtils/validate.js";
import type * as categories from "../categories.js";
import type * as clerk from "../clerk.js";
import type * as companies from "../companies.js";
import type * as companyContacts from "../companyContacts.js";
import type * as compliances from "../compliances.js";
import type * as connectedAccounts from "../connectedAccounts.js";
import type * as contracts from "../contracts.js";
import type * as creditCardFees from "../creditCardFees.js";
import type * as customerMove from "../customerMove.js";
import type * as customers from "../customers.js";
import type * as discounts from "../discounts.js";
import type * as externalReviews from "../externalReviews.js";
import type * as fees from "../fees.js";
import type * as followUps from "../followUps.js";
import type * as functions_clerk from "../functions/clerk.js";
import type * as google from "../google.js";
import type * as http from "../http.js";
import type * as insurancePolicies from "../insurancePolicies.js";
import type * as internalReviews from "../internalReviews.js";
import type * as invitations from "../invitations.js";
import type * as invoices from "../invoices.js";
import type * as items from "../items.js";
import type * as labors from "../labors.js";
import type * as lib_clerk from "../lib/clerk.js";
import type * as lib_stripe from "../lib/stripe.js";
import type * as lib_twilio from "../lib/twilio.js";
import type * as messages from "../messages.js";
import type * as moveAssignments from "../moveAssignments.js";
import type * as moveCustomers from "../moveCustomers.js";
import type * as moverLocations from "../moverLocations.js";
import type * as moves from "../moves.js";
import type * as newsfeeds from "../newsfeeds.js";
import type * as paymentStep from "../paymentStep.js";
import type * as policies from "../policies.js";
import type * as quotes from "../quotes.js";
import type * as referrals from "../referrals.js";
import type * as rooms from "../rooms.js";
import type * as scripts from "../scripts.js";
import type * as sendgrid from "../sendgrid.js";
import type * as stripe from "../stripe.js";
import type * as travelFees from "../travelFees.js";
import type * as twilioNumbers from "../twilioNumbers.js";
import type * as users from "../users.js";
import type * as variables from "../variables.js";
import type * as waivers from "../waivers.js";
import type * as webIntegrations from "../webIntegrations.js";
import type * as webhooks_clerk from "../webhooks/clerk.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/messages": typeof actions_messages;
  additionalFees: typeof additionalFees;
  arrivalWindows: typeof arrivalWindows;
  "backendUtils/analyticsHelper": typeof backendUtils_analyticsHelper;
  "backendUtils/auth": typeof backendUtils_auth;
  "backendUtils/calculations": typeof backendUtils_calculations;
  "backendUtils/checkUnique": typeof backendUtils_checkUnique;
  "backendUtils/connectedAccountWebhook": typeof backendUtils_connectedAccountWebhook;
  "backendUtils/errors": typeof backendUtils_errors;
  "backendUtils/helper": typeof backendUtils_helper;
  "backendUtils/luxonHelper": typeof backendUtils_luxonHelper;
  "backendUtils/moveHelper": typeof backendUtils_moveHelper;
  "backendUtils/nano": typeof backendUtils_nano;
  "backendUtils/newsFeedHelper": typeof backendUtils_newsFeedHelper;
  "backendUtils/queries": typeof backendUtils_queries;
  "backendUtils/queryHelpers": typeof backendUtils_queryHelpers;
  "backendUtils/sendGrid": typeof backendUtils_sendGrid;
  "backendUtils/serverEnv": typeof backendUtils_serverEnv;
  "backendUtils/stripe": typeof backendUtils_stripe;
  "backendUtils/template": typeof backendUtils_template;
  "backendUtils/twilio": typeof backendUtils_twilio;
  "backendUtils/validate": typeof backendUtils_validate;
  categories: typeof categories;
  clerk: typeof clerk;
  companies: typeof companies;
  companyContacts: typeof companyContacts;
  compliances: typeof compliances;
  connectedAccounts: typeof connectedAccounts;
  contracts: typeof contracts;
  creditCardFees: typeof creditCardFees;
  customerMove: typeof customerMove;
  customers: typeof customers;
  discounts: typeof discounts;
  externalReviews: typeof externalReviews;
  fees: typeof fees;
  followUps: typeof followUps;
  "functions/clerk": typeof functions_clerk;
  google: typeof google;
  http: typeof http;
  insurancePolicies: typeof insurancePolicies;
  internalReviews: typeof internalReviews;
  invitations: typeof invitations;
  invoices: typeof invoices;
  items: typeof items;
  labors: typeof labors;
  "lib/clerk": typeof lib_clerk;
  "lib/stripe": typeof lib_stripe;
  "lib/twilio": typeof lib_twilio;
  messages: typeof messages;
  moveAssignments: typeof moveAssignments;
  moveCustomers: typeof moveCustomers;
  moverLocations: typeof moverLocations;
  moves: typeof moves;
  newsfeeds: typeof newsfeeds;
  paymentStep: typeof paymentStep;
  policies: typeof policies;
  quotes: typeof quotes;
  referrals: typeof referrals;
  rooms: typeof rooms;
  scripts: typeof scripts;
  sendgrid: typeof sendgrid;
  stripe: typeof stripe;
  travelFees: typeof travelFees;
  twilioNumbers: typeof twilioNumbers;
  users: typeof users;
  variables: typeof variables;
  waivers: typeof waivers;
  webIntegrations: typeof webIntegrations;
  "webhooks/clerk": typeof webhooks_clerk;
}>;
declare const fullApiWithMounts: typeof fullApi;

export declare const api: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApiWithMounts,
  FunctionReference<any, "internal">
>;

export declare const components: {};
