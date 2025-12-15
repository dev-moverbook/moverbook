// "use client";

// import { useState } from "react";
// import { useAction } from "convex/react";
// import { api } from "@/convex/_generated/api";
// import { Id } from "@/convex/_generated/dataModel";
// import { setErrorFromConvexError } from "@/frontendUtils/errorHelper";
// import { DeliveryType } from "@/types/types";

// // To be Deleted

// export const useSendContract = () => {
//   const [sendContractLoading, setSendContractLoading] =
//     useState<boolean>(false);
//   const [sendContractError, setSendContractError] = useState<string | null>(
//     null
//   );

//   const sendContractAction = useAction(api.contracts.sendContract);

//   const sendContract = async (
//     moveId: Id<"moves">,
//     channel: DeliveryType
//   ): Promise<boolean> => {
//     setSendContractLoading(true);
//     setSendContractError(null);

//     try {
//       return await sendContractAction({ moveId, channel });
//     } catch (error) {
//       setErrorFromConvexError(error, setSendContractError);
//       return false;
//     } finally {
//       setSendContractLoading(false);
//     }
//   };

//   return {
//     sendContract,
//     sendContractLoading,
//     sendContractError,
//     setSendContractError,
//   };
// };
