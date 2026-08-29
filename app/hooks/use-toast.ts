"use client";

import { useState, useRef, useCallback, useEffect } from "react";

export interface ToastState {
  show: boolean;
  message: string;
}

export function useToast(duration: number = 1300, fadeDuration: number = 400) {
  const [toast, setToast] = useState<ToastState>({ show: false, message: "" });
  const [isFadingOut, setIsFadingOut] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  const triggerToast = useCallback(
    (message: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);

      setIsFadingOut(false);
      setToast({ show: true, message });

      timerRef.current = setTimeout(() => {
        setIsFadingOut(true);
        fadeTimerRef.current = setTimeout(() => {
          setToast({ show: false, message: "" });
          setIsFadingOut(false);
        }, fadeDuration);
      }, duration);
    },
    [duration, fadeDuration]
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current);
    };
  }, []);

  return { toast, isFadingOut, triggerToast };
}
