import { create } from "zustand";
import { Toast } from "@/components/ui/toast";

interface ToastStore {
  toasts: Toast[];
  showToast: (message: string, type?: Toast["type"], duration?: number) => void;
  removeToast: (id: string) => void;
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
}

const generateId = () => `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],

  showToast: (message, type = "info", duration = 5000) => {
    const toast: Toast = {
      id: generateId(),
      message,
      type,
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  success: (message, duration) => {
    const toast: Toast = {
      id: generateId(),
      message,
      type: "success",
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  error: (message, duration) => {
    const toast: Toast = {
      id: generateId(),
      message,
      type: "error",
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  info: (message, duration) => {
    const toast: Toast = {
      id: generateId(),
      message,
      type: "info",
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },

  warning: (message, duration) => {
    const toast: Toast = {
      id: generateId(),
      message,
      type: "warning",
      duration,
    };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));
  },
}));


