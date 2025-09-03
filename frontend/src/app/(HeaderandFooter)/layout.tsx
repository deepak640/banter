import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";
import Container from "@/app/_components/Container";
import { getServerSession } from "next-auth";
import authOptions from "@/auth";
import React, { ReactNode } from "react";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Container>
          {typeof children === "function"
            ? (children as (props: { session: any }) => React.ReactNode)({ session })
            : children}
        </Container>
      </body>
    </html>
  );
}
