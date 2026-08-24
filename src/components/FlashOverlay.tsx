"use me";
"use client";

import { useEffect, useState } from "react";

export default function FlashOverlay() {
  const [flashing, setFlashing] = useState(false);

  useEffect(() => {
    const handleFlash = () => {
      setFlashing(true);
      setTimeout(() => setFlashing(false), 250);
    };

    window.addEventListener("trigger-camera-flash", handleFlash);
    return () => window.removeEventListener("trigger-camera-flash", handleFlash);
  }, []);

  if (!flashing) return null;

  return (
    <div
      className="fixed inset-0 bg-white z-[9999] pointer-events-none animate-flash"
      aria-hidden="true"
    />
  );
}
