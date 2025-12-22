"use client";

import { cn } from "@/lib/utils";

interface PeriodSelectorProps {
  value: number;
  onChange: (days: number) => void;
}

const PERIODS = [
  { label: "7d", value: 7 },
  { label: "30d", value: 30 },
  { label: "90d", value: 90 },
  { label: "All", value: 365 },
];

export function PeriodSelector({ value, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-slate-800/50 rounded-lg">
      {PERIODS.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={cn(
            "px-3 py-1.5 text-sm rounded-md transition-colors",
            value === period.value
              ? "bg-slate-700 text-marble-100"
              : "text-slate-400 hover:text-marble-100"
          )}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
