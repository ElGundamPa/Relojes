"use client";

import { Check } from "lucide-react";
import { UserOrder } from "@/lib/user-store";

interface TrackingProgressBarProps {
  order: UserOrder;
}

const statusSteps = [
  { key: "pendiente", label: "Pendiente" },
  { key: "procesando", label: "Procesando" },
  { key: "enviado", label: "En camino" },
  { key: "entregado", label: "Entregado" },
];

export function TrackingProgressBar({ order }: TrackingProgressBarProps) {
  const currentStatusIndex = statusSteps.findIndex((step) => step.key === order.status);
  const activeIndex = currentStatusIndex >= 0 ? currentStatusIndex : 0;

  return (
    <div className="flex items-center justify-between relative py-4">
      {/* Progress Line */}
      <div className="absolute top-8 left-0 right-0 h-[2px] bg-white/10">
        <div
          className="h-full bg-white transition-all duration-500"
          style={{
            width: `${(activeIndex / (statusSteps.length - 1)) * 100}%`,
          }}
        />
      </div>

      {/* Steps */}
      {statusSteps.map((step, index) => {
        const isActive = index <= activeIndex;
        const isCurrent = index === activeIndex;

        return (
          <div key={step.key} className="relative z-10 flex flex-col items-center flex-1">
            <div
              className={`
                w-8 h-8 rounded-full flex items-center justify-center
                transition-all duration-300
                ${
                  isActive
                    ? "bg-white text-black"
                    : "bg-white/10 border-2 border-white/20 text-white/40"
                }
                ${isCurrent ? "scale-110 ring-4 ring-white/20" : ""}
              `}
            >
              {isActive ? (
                <Check className="h-4 w-4" />
              ) : (
                <div className="w-2 h-2 rounded-full bg-current" />
              )}
            </div>
            <span
              className={`
                mt-2 text-xs font-medium text-center
                transition-colors duration-300
                ${isActive ? "text-white" : "text-white/40"}
              `}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

