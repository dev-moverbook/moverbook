"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useMoveContext } from "@/app/contexts/MoveContext";
import MessageHeader from "./components/MessageHeader";
import MessageInputBar from "./components/MessageInputBar";
import MessageThread from "./components/MessageThread";

const MessagesPage = () => {
  const { moveData } = useMoveContext();
  const router = useRouter();

  return (
    <div className="flex flex-col h-[95vh] md:h-[90vh]">
      <div className="w-full  mx-auto ">
        <MessageHeader
          move={moveData.move}
          moveCustomer={moveData.moveCustomer}
          onBack={() => router.back()}
          onCall={() => {}}
        />
      </div>

      <div className="flex-1 overflow-y-auto flex justify-center w-full max-w-screen-sm mx-auto px-4 py-6">
        <MessageThread />
      </div>

      <MessageInputBar />
    </div>
  );
};

export default MessagesPage;
