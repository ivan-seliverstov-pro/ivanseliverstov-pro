"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import rawContent from "@/public/content.json";
import { SiteContent } from "@/data/content";

const ContentContext = createContext<SiteContent>(rawContent as unknown as SiteContent);

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(rawContent as unknown as SiteContent);

  useEffect(() => {
    fetch(`/content.json?v=${Date.now()}`)
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error("Failed to load content.json");
      })
      .then((data: SiteContent) => {
        if (data && data.siteMetadata) {
          setContent(data);
        }
      })
      .catch((err) => {
        console.warn("Using fallback content.json:", err);
      });
  }, []);

  return (
    <ContentContext.Provider value={content}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent(): SiteContent {
  return useContext(ContentContext);
}
