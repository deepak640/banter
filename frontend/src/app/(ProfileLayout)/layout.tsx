import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Header from "@/app/_components/Header";
import React, { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="h-screen flex flex-col app-bg">
          <Header />
          <main className="flex-1 overflow-y-auto">
            <div className="h-full bg-white dark:bg-gray-900 shadow-lg">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}
