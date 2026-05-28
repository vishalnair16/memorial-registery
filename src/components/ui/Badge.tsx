import React from "react";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "success";
  className?: string;
}

export function Badge({
  children,
  variant = "primary",
  className = "",
}: BadgeProps) {
  const variants = {
    primary: "bg-blue-100 text-blue-800",
    secondary: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
