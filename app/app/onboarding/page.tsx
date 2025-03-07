"use client";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/convex/_generated/api";
import { ResponseStatus } from "@/types/enums";
import { ErrorMessages } from "@/types/errors";
import { useOrganizationList } from "@clerk/nextjs";
import { useAction } from "convex/react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const OnboardingPage = () => {
  const router = useRouter();
  const { setActive } = useOrganizationList();

  const [companyName, setCompanyName] = useState<string>("");

  const [isCreateCompanyLoading, setIsCreateCompanyLoading] =
    useState<boolean>(false);
  const [createCompanyError, setCreateCompanyError] = useState<string | null>(
    null
  );

  const createOrganization = useAction(api.clerk.createOrganization);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsCreateCompanyLoading(true);
    setCreateCompanyError(null);
    try {
      const response = await createOrganization({ name: companyName });
      if (response.status === ResponseStatus.ERROR) {
        console.error(
          "Error from createOrganization response:",
          response.error
        );
        setCreateCompanyError(ErrorMessages.GENERIC_ERROR);
      } else {
        await setActive?.({ organization: response.data.clerkOrganizationId });
        const slug = response.data.slug;
        router.replace(`/app/${slug}`);
      }
    } catch (error) {
      console.error("error creating company", error);
      setCreateCompanyError(ErrorMessages.GENERIC_ERROR);
    } finally {
      setIsCreateCompanyLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Onboarding</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <div>
          <Label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700"
          >
            Company Name
          </Label>
          <Input
            type="text"
            id="companyName"
            value={companyName}
            onChange={handleInputChange}
            placeholder="Enter your company name"
            className="mt-1"
          />
        </div>
        <Button
          type="submit"
          disabled={isCreateCompanyLoading || companyName.trim() === ""}
        >
          {" "}
          {isCreateCompanyLoading ? "Submitting..." : "Submit"}
        </Button>
        <p
          className={`text-red-500 text-sm mt-1 ${createCompanyError ? "visible" : "invisible"}`}
        >
          {createCompanyError || "Placeholder for error"}
        </p>
      </form>
    </div>
  );
};

export default OnboardingPage;
