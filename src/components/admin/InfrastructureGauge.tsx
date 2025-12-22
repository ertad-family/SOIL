"use client";

import { cn } from "@/lib/utils";

interface InfrastructureGaugeProps {
  provider: "vercel" | "supabase";
  metricName: string;
  currentValue: number;
  limitValue: number;
  percentageUsed: number;
  unit: string;
}

const METRIC_LABELS: Record<string, string> = {
  database_size: "Database Size",
  storage: "Storage",
  auth_users: "Auth Users",
  api_requests: "API Requests",
  bandwidth: "Bandwidth",
  serverless_hours: "Serverless Hours",
  builds_minutes: "Build Minutes",
  edge_invocations: "Edge Invocations",
};

const PROVIDER_LABELS: Record<string, string> = {
  vercel: "Vercel",
  supabase: "Supabase",
};

export function InfrastructureGauge({
  provider,
  metricName,
  currentValue,
  limitValue,
  percentageUsed,
  unit,
}: InfrastructureGaugeProps) {
  // Vercel metrics are not available on Hobby plan
  const isVercelPlaceholder = provider === "vercel" && currentValue === 0 && percentageUsed === 0;

  // Determine color based on usage percentage
  const getStatusColor = (pct: number) => {
    if (pct >= 90) return "bg-red-500";
    if (pct >= 75) return "bg-amber-500";
    if (pct >= 50) return "bg-gold-500";
    return "bg-emerald-500";
  };

  const getTextColor = (pct: number) => {
    if (pct >= 90) return "text-red-400";
    if (pct >= 75) return "text-amber-400";
    return "text-slate-400";
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-marble-100">{METRIC_LABELS[metricName] || metricName}</div>
          <div className="text-xs text-slate-500">{PROVIDER_LABELS[provider] || provider}</div>
        </div>
        <div
          className={cn(
            "text-sm font-medium",
            isVercelPlaceholder ? "text-slate-500" : getTextColor(percentageUsed)
          )}
        >
          {isVercelPlaceholder ? "N/A" : `${percentageUsed.toFixed(1)}%`}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isVercelPlaceholder ? "bg-slate-700" : getStatusColor(percentageUsed)
          )}
          style={{ width: isVercelPlaceholder ? "0%" : `${Math.min(percentageUsed, 100)}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-slate-500">
        {isVercelPlaceholder ? (
          <span className="italic">Check Vercel dashboard</span>
        ) : (
          <>
            <span>
              {currentValue.toLocaleString()} {unit}
            </span>
            <span>
              of {limitValue.toLocaleString()} {unit}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
