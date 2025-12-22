"use client";

import { cn } from "@/lib/utils";

interface KFactorCardProps {
  value: number;
  invitesPerUser: number;
  conversionRate: number;
}

export function KFactorCard({ value, invitesPerUser, conversionRate }: KFactorCardProps) {
  // Determine color based on K-factor value
  const getStatusColor = (k: number) => {
    if (k >= 1) return "text-emerald-400";
    if (k >= 0.5) return "text-gold-400";
    return "text-slate-400";
  };

  const getStatusLabel = (k: number) => {
    if (k >= 1) return "Viral Growth";
    if (k >= 0.5) return "Good Growth";
    if (k > 0) return "Slow Growth";
    return "No Data";
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="text-sm text-slate-400 uppercase tracking-wider">K-Factor</div>
        <span
          className={cn(
            "text-xs px-2 py-1 rounded-full",
            value >= 1
              ? "bg-emerald-900/50 text-emerald-400"
              : value >= 0.5
                ? "bg-gold-900/50 text-gold-400"
                : "bg-slate-800 text-slate-400"
          )}
        >
          {getStatusLabel(value)}
        </span>
      </div>

      <div className={cn("text-4xl font-bold mb-4", getStatusColor(value))}>{value.toFixed(2)}</div>

      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-500">Invites/User (i)</span>
          <span className="text-marble-100">{invitesPerUser.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500">Conversion (c)</span>
          <span className="text-marble-100">{(conversionRate * 100).toFixed(1)}%</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
        K = i &times; c
      </div>
    </div>
  );
}
