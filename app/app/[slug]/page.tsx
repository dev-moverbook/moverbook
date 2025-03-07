"use client";
import React from "react";
import { useSlugContext } from "@/app/contexts/SlugContext";

const TeamPage = () => {
  const { state } = useSlugContext();
  console.log("Slug from context:", state.slug);
  return <div>Team Page for company: {state.slug}</div>;
};

export default TeamPage;
