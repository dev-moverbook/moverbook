"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ErrorMessages } from "@/types/errors";
import { isValidEmail } from "@/utils/helper";
import { ResponseStatus } from "@/types/enums";

const SignUpPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomerWithSubscription = useAction(
    api.stripe.createCustomerWithSubscription
  );
  const handleSignUp = async () => {
    setError(null);
    if (!isValidEmail(email)) {
      setError(ErrorMessages.INVALID_EMAIL);
      return;
    }

    setIsLoading(true);
    try {
      const response = await createCustomerWithSubscription({ email });
      if (response.status === ResponseStatus.ERROR) {
        console.error("error signing up subscriber", response.error);
        setError(response.error);
      } else {
        setEmail("");
      }
    } catch (error) {
      console.error("error signing up subscriber", error);
      setError(ErrorMessages.GENERIC);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(null);
    }
    setEmail(e.target.value);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md max-w-sm mx-auto">
      <h2 className="text-lg font-semibold mb-3">Invite User</h2>
      <Input
        type="email"
        placeholder="Enter email"
        value={email}
        onChange={handleInputChange}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <Button
        className="mt-3 w-full"
        onClick={handleSignUp}
        disabled={isLoading || !email}
      >
        {isLoading ? "Sending..." : "Invite"}
      </Button>
    </div>
  );
};

export default SignUpPage;
