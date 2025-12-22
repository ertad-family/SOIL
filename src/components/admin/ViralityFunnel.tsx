"use client";

import { cn } from "@/lib/utils";

interface ViralityFunnelProps {
  shares: number;
  clicks: number;
  signups: number;
  conversions: number;
}

export function ViralityFunnel({ shares, clicks, signups, conversions }: ViralityFunnelProps) {
  const maxValue = Math.max(shares, clicks, signups, conversions, 1);

  const stages = [
    { label: "Shares", value: shares, color: "bg-gold-500" },
    { label: "Clicks", value: clicks, color: "bg-gold-400" },
    { label: "Signups", value: signups, color: "bg-emerald-500" },
    { label: "Cenotaphs", value: conversions, color: "bg-emerald-400" },
  ];

  // Calculate conversion rates between stages
  const clickRate = shares > 0 ? ((clicks / shares) * 100).toFixed(1) : "0";
  const signupRate = clicks > 0 ? ((signups / clicks) * 100).toFixed(1) : "0";
  const conversionRate = signups > 0 ? ((conversions / signups) * 100).toFixed(1) : "0";

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-marble-100 mb-6">Virality Funnel</h2>

      <div className="flex items-end gap-2 h-40 mb-4">
        {stages.map((stage) => (
          <div key={stage.label} className="flex-1 flex flex-col items-center">
            <div className="text-sm text-marble-100 mb-2">{stage.value.toLocaleString()}</div>
            <div
              className={cn("w-full rounded-t transition-all duration-500", stage.color)}
              style={{
                height: `${(stage.value / maxValue) * 100}%`,
                minHeight: stage.value > 0 ? "4px" : "0",
              }}
            />
            <div className="text-xs text-slate-400 mt-2">{stage.label}</div>
          </div>
        ))}
      </div>

      {/* Conversion rates between stages */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-800">
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Shares &rarr; Clicks</div>
          <div className="text-sm text-marble-100">{clickRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Clicks &rarr; Signups</div>
          <div className="text-sm text-marble-100">{signupRate}%</div>
        </div>
        <div className="text-center">
          <div className="text-xs text-slate-500 mb-1">Signups &rarr; Cenotaphs</div>
          <div className="text-sm text-marble-100">{conversionRate}%</div>
        </div>
      </div>
    </div>
  );
}
