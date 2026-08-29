"use client";

import { useEffect, useRef } from "react";

const SECTION_IDS = [
  "about",
  "skills",
  "clients",
  "projects",
  "recommendations",
  "faq",
  "contacts",
];

const PROJECT_CASE_IDS = [
  "black-book",
  "conan",
  "irki",
  "breath-of-bones",
  "tamagotchi",
  "genius",
  "fanfics",
  "popcult",
];

const getTargetElement = (rawHash: string): HTMLElement | null => {
  const clean = rawHash.replace("#", "");
  if (!clean) return null;

  const elem = document.getElementById(clean);
  if (elem) return elem;

  if (clean.startsWith("rec:")) {
    return document.getElementById("recommendations");
  }

  if (clean.startsWith("projects-") || PROJECT_CASE_IDS.includes(clean)) {
    return document.getElementById("projects");
  }

  return null;
};

export default function SectionObserver() {
  const activeSectionRef = useRef<string>("");
  const isInitialLoadRef = useRef<boolean>(true);

  useEffect(() => {
    const loadTimer = setTimeout(() => {
      isInitialLoadRef.current = false;
    }, 1200);

    // 1. Initial scroll on load/refresh if URL contains a hash
    const hash = window.location.hash;
    if (hash && hash !== "#") {
      const scrollToHash = () => {
        const targetElem = getTargetElement(hash);
        if (targetElem) {
          targetElem.scrollIntoView({ behavior: "smooth" });
        }
      };

      setTimeout(scrollToHash, 100);
      setTimeout(scrollToHash, 350);
      setTimeout(scrollToHash, 750);
    }

    // 2. Scroll listener to update active section & URL hash deterministically
    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      requestAnimationFrame(() => {
        ticking = false;

        const headerOffset = 120;
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const bodyHeight = document.documentElement.scrollHeight;

        if (scrollPosition < 50) {
          if (activeSectionRef.current !== "about") {
            activeSectionRef.current = "about";
            window.dispatchEvent(new CustomEvent("section-change", { detail: { id: "about" } }));
            if (!isInitialLoadRef.current && window.location.hash && window.location.hash !== "#about") {
              window.history.replaceState(null, "", window.location.pathname + window.location.search);
            }
          }
          return;
        }

        if (scrollPosition + windowHeight >= bodyHeight - 50) {
          const lastId = SECTION_IDS[SECTION_IDS.length - 1];
          if (activeSectionRef.current !== lastId) {
            activeSectionRef.current = lastId;
            window.dispatchEvent(new CustomEvent("section-change", { detail: { id: lastId } }));
            window.history.replaceState(null, "", `#${lastId}`);
          }
          return;
        }

        let currentId = "";
        let minDistance = Infinity;

        SECTION_IDS.forEach((id) => {
          const elem = document.getElementById(id);
          if (!elem) return;

          const rect = elem.getBoundingClientRect();

          if (rect.top <= headerOffset && rect.bottom > headerOffset) {
            currentId = id;
          } else if (rect.top > 0 && rect.top < minDistance) {
            minDistance = rect.top;
            if (!currentId) currentId = id;
          }
        });

        if (currentId && currentId !== activeSectionRef.current) {
          activeSectionRef.current = currentId;

          window.dispatchEvent(new CustomEvent("section-change", { detail: { id: currentId } }));

          if (currentId === "about") {
            if (!isInitialLoadRef.current && window.location.hash && window.location.hash !== "#about") {
              window.history.replaceState(null, "", window.location.pathname + window.location.search);
            }
          } else if (currentId === "projects") {
            const currentHash = window.location.hash.replace("#", "");
            if (!currentHash.startsWith("projects-") && !PROJECT_CASE_IDS.includes(currentHash)) {
              window.history.replaceState(null, "", `#${currentId}`);
            }
          } else {
            window.history.replaceState(null, "", `#${currentId}`);
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    const handleBackToTop = () => {
      activeSectionRef.current = "about";
      if (window.location.hash) {
        window.history.replaceState(null, "", window.location.pathname + window.location.search);
      }
      window.dispatchEvent(new CustomEvent("section-change", { detail: { id: "about" } }));
    };

    window.addEventListener("back-to-top", handleBackToTop);

    onScroll();

    return () => {
      clearTimeout(loadTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("back-to-top", handleBackToTop);
    };
  }, []);

  return null;
}
