"use client";

import MessageHeader from "./MessageHeader";
import MessageInputBar from "./MessageInputBar";
import MessageThread from "./MessageThread";

const MoveMessagesPage = () => {
  return (
    <div className="flex flex-col h-[95vh] md:h-[90vh]">
      <div className="w-full  mx-auto ">
        <MessageHeader />
      </div>
      <div className="flex-1 overflow-y-auto flex justify-center w-full max-w-screen-sm mx-auto px-4 py-6">
        <MessageThread />
      </div>

      <MessageInputBar />
    </div>
  );
};

export default MoveMessagesPage;
