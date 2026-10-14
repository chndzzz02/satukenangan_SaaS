"use client";

import React, { useEffect } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onClose: (id: string) => void;
}

export default function ToastNotification({ toasts, onClose }: ToastProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`pointer-events-auto flex items-center justify-between gap-3 p-4 rounded-2xl border shadow-2xl backdrop-blur-md transition-all transform animate-in slide-in-from-bottom-5 duration-300 ${
            toast.type === "success"
              ? "bg-emerald-950/90 text-emerald-100 border-emerald-500/40"
              : toast.type === "error"
              ? "bg-red-950/90 text-red-100 border-red-500/40"
              : "bg-stone-900/90 text-amber-100 border-amber-500/40"
          }`}
        >
          <div className="flex items-center gap-3">
            {toast.type === "success" && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
            {toast.type === "error" && <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />}
            {toast.type === "info" && <Info className="w-5 h-5 text-amber-400 shrink-0" />}
            <span className="text-xs font-semibold leading-snug">{toast.message}</span>
          </div>
          <button
            onClick={() => onClose(toast.id)}
            className="text-stone-400 hover:text-white p-1 rounded-lg transition"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
