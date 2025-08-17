import React from "react";

interface MessageContainerProps {
  children: React.ReactNode;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col gap-3 px-4 flex-1 overflow-y-auto ">
      {children}
    </div>
  );
};

export default MessageContainer;
