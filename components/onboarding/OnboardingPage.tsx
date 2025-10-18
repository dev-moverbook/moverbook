"use client";
import SingleFormAction from "@/components/shared/buttons/SingleFormAction";
import LabeledInput from "@/components/shared/labeled/LabeledInput";
import { useCreateCompany } from "@/hooks/companies";
import { useOrganizationList } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

const OnboardingPage = () => {
  const router = useRouter();
  const { setActive } = useOrganizationList();

  const [companyName, setCompanyName] = useState<string>("");

  const { createCompany, createCompanyLoading, createCompanyError } =
    useCreateCompany();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyName(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await createCompany(companyName);

    if (response.success) {
      await setActive?.({
        organization: response.data?.clerkOrganizationId,
      });
      const slug = response.data?.slug;
      router.replace(`/app/${slug}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4">
      <h1 className="text-3xl font-bold mb-6">Onboarding</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full max-w-md"
      >
        <LabeledInput
          label="Company Name"
          value={companyName}
          onChange={handleInputChange}
          placeholder="Enter your company name"
        />

        <SingleFormAction
          isSubmitting={createCompanyLoading}
          submitLabel="Submit"
          error={createCompanyError}
          disabled={companyName.trim().length === 0}
        />
      </form>
    </div>
  );
};

export default OnboardingPage;
