"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ErrorMessages } from "@/types/errors";
import { isValidEmail } from "@/utils/helper";
import FormErrorMessage from "../components/shared/error/FormErrorMessage";
import { setErrorFromConvexError } from "../frontendUtils/errorHelper";

const SignUpPage = () => {
  const [email, setEmail] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const createCustomerWithSubscription = useAction(
    api.stripe.createCustomerWithSubscription
  );
  const handleSignUp = async (): Promise<boolean> => {
    setError(null);
    if (!isValidEmail(email)) {
      setError(ErrorMessages.INVALID_EMAIL);
      return false;
    }

    setIsLoading(true);
    try {
      await createCustomerWithSubscription({ email });
      return true;
    } catch (error) {
      setErrorFromConvexError(error, setError);
      console.error("error signing up subscriber", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = email.trim() === "";

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
      <FormErrorMessage message={error} />
      <Button
        className="mt-3 w-full"
        onClick={handleSignUp}
        disabled={isDisabled}
        isLoading={isLoading}
      >
        Invite
      </Button>
    </div>
  );
};

export default SignUpPage;
