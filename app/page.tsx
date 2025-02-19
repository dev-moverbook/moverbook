"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const InviteUserForm = () => {
  const [email, setEmail] = useState("");

  const handleInvite = () => {
    if (!email) {
      alert("Please enter an email.");
      return;
    }
    console.log("Inviting:", email);
    // Call API or backend action to send invite
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-3">Invite User</h2>
      <Input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Button className="mt-3 w-full" onClick={handleInvite}>
        Send Invite
      </Button>
    </div>
  );
};

export default InviteUserForm;
