// src/components/ui/button.jsx
import React from "react";
import clsx from "clsx";

export function Button({
  children,
  className = "",
  variant = "default",
  size = "md",
  asChild = false,
  ...props
}) {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-2.5 text-lg",
  };

  const variants = {
    default: "bg-violet-600 hover:bg-violet-700 text-white",
    ghost: "bg-transparent hover:bg-neutral-800 text-white border border-neutral-700",
    link: "text-violet-400 underline hover:text-violet-300 p-0",
  };

  const Comp = asChild ? "span" : "button";

  return (
    <Comp
      className={clsx(
        "rounded-xl font-medium transition",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}
