import React from "react";

interface MessageContainerProps {
  children: React.ReactNode;
}

const MessageContainer: React.FC<MessageContainerProps> = ({ children }) => {
  return (
    <div className="flex flex-col gap-3 px-4 flex-1 overflow-y-auto py-16">
      {children}
    </div>
  );
};

export default MessageContainer;
