"use client";

import { ToastContainer } from "@/components/ui/toast";
import { useToastStore } from "@/lib/toast-store";

export function ToastProvider() {
  const { toasts, removeToast } = useToastStore();

  return <ToastContainer toasts={toasts} onClose={removeToast} />;
}


