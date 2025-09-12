"use client";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function Button({ children, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className="px-4 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
