"use client";

import { useMessageContext } from "@/contexts/MessageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MessageSubject = () => {
  const { subject, setSubject } = useMessageContext();

  return (
    <div className="w-full mb-3">
      <span className="w-10" aria-hidden="true" />

      <div className="items-end  w-full px-10">
        <Label htmlFor="message-subject">Subject</Label>

        <Input
          id="message-subject"
          type="text"
          value={subject ?? ""}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Email Subject"
          className="flex-1 h-8"
        />
      </div>

      <span className="w-10" aria-hidden="true" />
    </div>
  );
};

export default MessageSubject;
