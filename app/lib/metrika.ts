"use client";

import { siteMetadata } from "@/data/content";

export const METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID || siteMetadata.yandexMetrikaId || "";

declare global {
  interface Window {
    ym?: (
      counterId: string | number,
      action: string,
      target: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Sends a reachGoal event to Yandex.Metrika safely.
 *
 * @param target Goal identifier in Yandex Metrika (e.g. 'section_view', 'contact_telegram', 'contact_click')
 * @param params Optional event parameters
 */
export const reachGoal = (target: string, params?: Record<string, unknown>) => {
  if (typeof window !== "undefined" && window.ym && METRIKA_ID) {
    try {
      window.ym(METRIKA_ID, "reachGoal", target, params);
    } catch (err) {
      console.warn("[Yandex.Metrika] Error firing reachGoal:", err);
    }
  }

  if (process.env.NODE_ENV === "development") {
    console.log(`[Yandex.Metrika] reachGoal -> target: "${target}"`, params || "");
  }
};

/**
 * Triggers Yandex.Metrika goal for anchor section navigation views (TZ Goal 1).
 */
export const trackSectionView = (sectionId: string) => {
  const cleanId = sectionId.replace(/^#/, "");
  reachGoal("section_view", { section: cleanId });
  reachGoal(`view_${cleanId}`);
};

/**
 * Triggers Yandex.Metrika goal for contact links (TZ Goal 2).
 */
export const trackContactClick = (channel: "telegram" | "email" | "resume" | "vk" | "phone", detail?: string) => {
  reachGoal("contact_click", { channel, detail });
  reachGoal(`contact_${channel}`);
};

/**
 * Triggers Yandex.Metrika event for contact copying.
 */
export const trackContactCopy = (channel: "telegram" | "email" | "phone") => {
  reachGoal("copy_contact", { channel });
  reachGoal(`copy_${channel}`);
};
