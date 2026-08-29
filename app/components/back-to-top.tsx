"use client";

import { useState, useEffect } from "react";
import Tooltip from "@/app/components/ui/tooltip";
import { trackSectionView } from "@/app/lib/metrika";

export default function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.dispatchEvent(new CustomEvent("back-to-top"));
    trackSectionView("#about");
  };

  if (!visible) return null;

  return (
    <Tooltip content="Вернуться в начало страницы" position="top" className="fixed bottom-6 xl:bottom-16 right-6 xl:right-24 z-40">
      <button
        onClick={scrollToTop}
        aria-label="Вернуться в начало страницы"
        className="p-3 rounded-full bg-brand-green text-white shadow-lg hover:bg-dark-charcoal transition-all duration-300 transform hover:scale-105 active:scale-95 focus:outline-none cursor-pointer"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 15l-6-6-6 6" />
        </svg>
      </button>
    </Tooltip>
  );
}
