// src/app/layout.tsx
import "./globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import Provider from "./_components/provider";
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import authOptions from "../auth"; // Adjust path if needed

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Provider session={session}>
          {children}
        </Provider>
      </body>
    </html>
  );
}
