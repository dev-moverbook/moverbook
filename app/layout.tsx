// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "./providers/ConvexClientProvider";
import { dark } from "@clerk/themes";
import { GoogleMapsProvider } from "./providers/GoogleMapsProvider";
import RouteChangeProgress from "./components/layout/Nprogress";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Moverbook",
  description: "Move with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClerkProvider
          publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
          signInUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_IN_URL}
          signUpUrl={process.env.NEXT_PUBLIC_CLERK_SIGN_UP_URL}
          signInForceRedirectUrl={
            process.env.NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL
          }
          signUpForceRedirectUrl={
            process.env.NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL
          }
          appearance={{ baseTheme: dark }}
        >
          <ConvexClientProvider>
            <GoogleMapsProvider>
              <RouteChangeProgress />
              {children}
            </GoogleMapsProvider>
          </ConvexClientProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
