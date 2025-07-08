// src/components/ui/card.jsx
import React from "react";
import clsx from "clsx";

export function Card({ children, className = "", ...props }) {
  return (
    <div
      className={clsx("rounded-2xl bg-neutral-800 border border-neutral-700 shadow-md", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardContent({ children, className = "", ...props }) {
  return (
    <div className={clsx("p-4", className)} {...props}>
      {children}
    </div>
  );
}
