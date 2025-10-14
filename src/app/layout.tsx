import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { cookies } from "next/headers";
import { parseClientSettings } from "@/lib/clientSettings";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Voxa | Chat. Connect. Collaborate.",
  description:
    "Voxa is a modern chat app built for speed, simplicity, and collaboration. Experience real-time messaging with powerful tools for teams and communities.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();

  const settings = parseClientSettings(cookieStore.get("settings")?.value);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased ${settings.theme}`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
