"use client";
import React from "react";

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function IconButton({ children, ...props }: IconButtonProps) {
  return (
    <button
      {...props}
      className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
    >
      {children}
    </button>
  );
}
