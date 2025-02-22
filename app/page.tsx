"use client";
import { SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const router = useRouter();

  return (
    <div>
      {/* Show Sign Out button if the user is signed in */}
      <SignedIn>
        <SignOutButton>
          <button className="bg-red-500 text-white px-4 py-2 rounded">
            Sign Out
          </button>
        </SignOutButton>
      </SignedIn>

      {/* Show Sign In and Sign Up buttons if the user is signed out */}
      <SignedOut>
        <div className="flex gap-4">
          <button
            onClick={() => router.push("/sign-in")}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Sign In
          </button>
          <button
            onClick={() => router.push("/sign-up")}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Sign Up
          </button>
        </div>
      </SignedOut>
    </div>
  );
}
