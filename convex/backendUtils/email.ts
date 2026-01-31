import { Id } from "../_generated/dataModel";
import { serverEnv } from "./serverEnv";

export const getMoveRelayAddress = (moveId: Id<"moves">): string => {
    const domain = serverEnv().RELAY_ADDRESS;
  
    return `reply+${moveId}@${domain}`;
  };