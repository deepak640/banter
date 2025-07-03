// src/app/_components/provider.tsx
"use client";

import React from "react";
import {
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";

export default function Provider({
  children,
  session,
}: Readonly<{ children: React.ReactNode; session: Session | null | undefined }>) {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
      <Toaster />
    </QueryClientProvider>
  );
}
