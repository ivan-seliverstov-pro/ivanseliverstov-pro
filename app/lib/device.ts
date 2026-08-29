export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(pointer: coarse)").matches ||
    /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent)
  );
}
