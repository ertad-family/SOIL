"use client";

import Link from "next/link";
import { Landmark } from "lucide-react";

interface CenotapheryStats {
  slug: string;
  name: string;
  visits: number;
}

interface TopCenotapheriesProps {
  cenotapheries: CenotapheryStats[];
  totalVisits: number;
  period: number;
}

export function TopCenotapheries({ cenotapheries, totalVisits, period }: TopCenotapheriesProps) {
  if (cenotapheries.length === 0) {
    return (
      <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
        <h2 className="text-lg font-semibold text-marble-100 mb-4">Top Cenotapheries</h2>
        <div className="text-center text-slate-500 py-8">
          No cenotaphery visits recorded in the last {period} days
        </div>
      </div>
    );
  }

  const maxVisits = Math.max(...cenotapheries.map((c) => c.visits), 1);

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-marble-100">Top Cenotapheries</h2>
        <div className="text-sm text-slate-500">{totalVisits.toLocaleString()} total visits</div>
      </div>

      <div className="space-y-3">
        {cenotapheries.map((cenotaphery, index) => (
          <Link
            key={cenotaphery.slug}
            href={`/cenotaphery/${cenotaphery.slug}`}
            className="block group"
          >
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 w-6">{index + 1}.</span>
              <div className="w-8 h-8 rounded-lg bg-gold-500/20 flex items-center justify-center group-hover:bg-gold-500/30 transition-colors">
                <Landmark className="w-4 h-4 text-gold-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-marble-100 group-hover:text-gold-400 transition-colors">
                    {cenotaphery.name}
                  </span>
                  <span className="text-sm text-slate-400">
                    {cenotaphery.visits.toLocaleString()}
                  </span>
                </div>
                <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold-500/50 rounded-full transition-all duration-500"
                    style={{ width: `${(cenotaphery.visits / maxVisits) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-500">
        Last {period} days
      </div>
    </div>
  );
}
