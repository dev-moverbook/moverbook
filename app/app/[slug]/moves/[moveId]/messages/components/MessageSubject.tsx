"use client";

import { useMessageContext } from "@/app/contexts/MessageContext";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MessageSubject = () => {
  const { subject, setSubject } = useMessageContext();

  return (
    <div className="w-full">
      <span className="w-10" aria-hidden="true" />
      <div className=" items-end gap-2 w-full  px-10">
        <Label className="text-sm text-white  block">Title</Label>

        <Input
          type="text"
          value={subject ?? ""}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="Subject"
          className="flex-1 h-8"
        />
      </div>
      <span className="w-10" aria-hidden="true" />
    </div>
  );
};

export default MessageSubject;
