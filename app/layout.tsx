import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { ConvexClientProvider } from "@/providers/ConvexClientProvider";
import { GoogleMapsProvider } from "@/providers/GoogleMapsProvider";
import RouteChangeProgress from "../components/layout/Nprogress";
import { Suspense } from "react";
import FullLoading from "../components/shared/skeleton/FullLoading";

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
  icons: [
    { rel: "icon", url: "/icon-192x192.png", sizes: "192x192" },
    { rel: "icon", url: "/icon-512x512.png", sizes: "512x512" },
  ],
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="icon" href="/icon-192x192.png" sizes="192x192" />
        <link rel="icon" href="/icon-512x512.png" sizes="512x512" />
      </head>
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
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <ConvexClientProvider>
            <GoogleMapsProvider>
              <RouteChangeProgress />
              <Suspense fallback={<FullLoading />}>{children}</Suspense>
            </GoogleMapsProvider>
          </ConvexClientProvider>
        </body>
      </ClerkProvider>
    </html>
  );
}
