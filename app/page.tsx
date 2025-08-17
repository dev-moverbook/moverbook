"use client";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { ClerkLoaded, ClerkLoading } from "@clerk/nextjs";
import FullLoading from "./components/shared/FullLoading";

export default function AuthButtons() {
  return (
    <div>
      <ClerkLoading>
        <FullLoading />
      </ClerkLoading>
      <ClerkLoaded>
        <SignedIn>
          <SignOutButton>
            <button className="bg-red-500 text-white px-4 py-2 rounded">
              Sign Out
            </button>
          </SignOutButton>
        </SignedIn>

        <SignedOut>
          <div className="flex gap-4">
            <Link href="/sign-in">
              <button className="bg-blue-500 text-white px-4 py-2 rounded">
                Sign In
              </button>
            </Link>
            <Link href="/sign-up">
              <button className="bg-green-500 text-white px-4 py-2 rounded">
                Sign Up
              </button>
            </Link>
          </div>
        </SignedOut>
      </ClerkLoaded>
    </div>
  );
}
