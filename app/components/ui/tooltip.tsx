"use client";

import { ReactNode, useState } from "react";

interface TooltipProps {
  content: string;
  children: ReactNode;
  position?: "top" | "bottom";
  className?: string;
}

export default function Tooltip({
  content,
  children,
  position = "top",
  className = "",
}: TooltipProps) {
  const [visible, setVisible] = useState(false);

  if (!content) return <>{children}</>;

  const hasPositionClass = className.includes("fixed") || className.includes("absolute");

  return (
    <div
      className={`${hasPositionClass ? "" : "relative "}inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onMouseDown={() => setVisible(false)}
      onClick={() => setVisible(false)}
      onTouchStart={() => setVisible(false)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div
          role="tooltip"
          className={`hidden md:block absolute z-50 pointer-events-none whitespace-pre px-3 py-1.5 text-xs font-medium text-white bg-dark-charcoal/95 backdrop-blur-xs rounded-lg shadow-md transition-all duration-200 ${
            position === "top"
              ? "bottom-full mb-2 left-1/2 -translate-x-1/2"
              : "top-full mt-2 left-1/2 -translate-x-1/2"
          }`}
        >
          {content}
          <div
            className={`absolute left-1/2 -translate-x-1/2 border-4 border-transparent ${
              position === "top"
                ? "top-full border-t-dark-charcoal/95"
                : "bottom-full border-b-dark-charcoal/95"
            }`}
          />
        </div>
      )}
    </div>
  );
}
