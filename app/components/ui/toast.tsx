"use client";

interface ToastProps {
  show: boolean;
  message: string;
  isFadingOut?: boolean;
}

export default function Toast({ show, message, isFadingOut = false }: ToastProps) {
  if (!show) return null;

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 bg-dark-charcoal text-white text-sm font-medium px-5 py-3 rounded-full shadow-xl flex items-center gap-2.5 transition-all duration-300 transform ${
        isFadingOut
          ? "opacity-0 translate-y-2 scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-bottom-3"
      }`}
    >
      <span className="w-2 h-2 rounded-full bg-brand-green" />
      <span>{message}</span>
    </div>
  );
}
