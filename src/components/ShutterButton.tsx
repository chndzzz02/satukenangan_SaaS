"use client";

import { useState } from "react";
import { Camera } from "lucide-react";

interface ShutterButtonProps {
  label?: string;
  onClick?: () => void;
  size?: "normal" | "large";
}

export default function ShutterButton({
  label = "Mulai Buat Roll Acara",
  onClick,
  size = "normal",
}: ShutterButtonProps) {
  const [isClicking, setIsClicking] = useState(false);

  const handleClick = () => {
    setIsClicking(true);
    // Dispatch custom flash event
    window.dispatchEvent(new Event("trigger-camera-flash"));

    if (onClick) {
      onClick();
    }

    setTimeout(() => setIsClicking(false), 200);
  };

  return (
    <button
      onClick={handleClick}
      type="button"
      className={`group relative inline-flex items-center gap-3 bg-terracotta hover:bg-terracotta-hover text-paper font-ui font-semibold rounded-full transition-all duration-300 shadow-shutter hover:shadow-lg active:scale-95 ${
        size === "large" ? "px-8 py-4 text-lg" : "px-6 py-3.5 text-base"
      } ${isClicking ? "scale-95 ring-4 ring-terracotta/30" : ""}`}
    >
      {/* Outer Shutter Ring (Rotates 15deg on hover) */}
      <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-paper/20 border border-paper/40 transition-transform duration-500 group-hover:rotate-45">
        {/* Inner shutter blade visual */}
        <span className="w-4 h-4 rounded-full bg-paper/90 flex items-center justify-center text-terracotta group-hover:scale-110 transition-transform">
          <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
        </span>
      </span>

      <span>{label}</span>

      {/* Tactile Shutter Counter Tag */}
      <span className="font-mono text-xs px-2 py-0.5 rounded bg-black/20 text-mustard border border-mustard/30">
        24 EXP
      </span>
    </button>
  );
}
