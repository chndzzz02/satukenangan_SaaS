"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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

    // Haptic vibration feedback if supported
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      navigator.vibrate(40);
    }

    if (onClick) {
      onClick();
    }

    setTimeout(() => setIsClicking(false), 200);
  };

  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.94 }}
      onClick={handleClick}
      type="button"
      className={`group relative inline-flex items-center gap-3 bg-terracotta hover:bg-terracotta-hover text-paper font-ui font-semibold rounded-2xl transition-all duration-300 shadow-shutter hover:shadow-xl ${
        size === "large" ? "px-8 py-4 text-lg" : "px-6 py-3.5 text-base"
      } ${isClicking ? "ring-4 ring-terracotta/30" : ""}`}
    >
      {/* Outer Shutter Ring */}
      <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-paper/20 border border-paper/40 transition-transform duration-500 group-hover:rotate-45">
        <span className="w-4 h-4 rounded-full bg-paper flex items-center justify-center text-terracotta group-hover:scale-110 transition-transform shadow-inner">
          <Camera className="w-2.5 h-2.5 stroke-[2.5]" />
        </span>
      </span>

      <span>{label}</span>

      {/* Tactile Shutter Counter Tag */}
      <span className="font-mono text-xs px-2 py-0.5 rounded-lg bg-black/20 text-amber-300 border border-amber-300/30 font-bold">
        24 EXP
      </span>
    </motion.button>
  );
}
