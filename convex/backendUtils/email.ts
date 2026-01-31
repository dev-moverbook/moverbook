import { Id } from "../_generated/dataModel";
import { serverEnv } from "./serverEnv";

export const getMoveRelayAddress = (moveId: Id<"moves">): string => {
    const domain = serverEnv().RELAY_DOMAIN;
  
    return `reply+${moveId}@${domain}`;
  };


export const extractEmail = (fromStr: string): string => {
    const match = fromStr.match(/<([^>]+)>/);
    return match ? match[1].toLowerCase().trim() : fromStr.toLowerCase().trim();
  };