"use client";

import { useState, useEffect } from "react";
import { KFactorCard } from "@/components/admin/KFactorCard";
import { ViralityFunnel } from "@/components/admin/ViralityFunnel";
import { InfrastructureGauge } from "@/components/admin/InfrastructureGauge";
import { EventsTable } from "@/components/admin/EventsTable";
import { PeriodSelector } from "@/components/admin/PeriodSelector";
import { TopCenotapheries } from "@/components/admin/TopCenotapheries";

// =============================================================================
// TYPES
// =============================================================================

interface KFactorData {
  kFactor: number;
  invitesPerUser: number;
  conversionRate: number;
  totalShares: number;
  totalClicks: number;
  totalConversions: number;
  activeUsers: number;
}

interface UsageMetric {
  provider: "vercel" | "supabase";
  metricName: string;
  currentValue: number;
  limitValue: number;
  percentageUsed: number;
  unit: string;
}

interface EventCount {
  eventName: string;
  count: number;
}

interface CenotapheryStats {
  slug: string;
  name: string;
  visits: number;
}

// =============================================================================
// SKELETON COMPONENTS
// =============================================================================

function CardSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="h-4 w-24 bg-slate-700 rounded mb-4" />
      <div className="h-8 w-16 bg-slate-700 rounded mb-4" />
      <div className="space-y-2">
        <div className="h-3 w-full bg-slate-800 rounded" />
        <div className="h-3 w-3/4 bg-slate-800 rounded" />
      </div>
    </div>
  );
}

function FunnelSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="h-5 w-32 bg-slate-700 rounded mb-6" />
      <div className="flex items-end justify-between h-32 gap-4">
        {[100, 75, 50, 25].map((h, i) => (
          <div key={i} className="flex-1 bg-slate-800 rounded-t" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function InfrastructureSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="h-5 w-40 bg-slate-700 rounded mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-3">
            <div className="h-4 w-20 bg-slate-800 rounded" />
            <div className="h-24 w-24 mx-auto bg-slate-800 rounded-full" />
            <div className="h-3 w-16 mx-auto bg-slate-800 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
      <div className="h-5 w-32 bg-slate-700 rounded mb-6" />
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="h-4 w-6 bg-slate-800 rounded" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-1/3 bg-slate-800 rounded" />
              <div className="h-2 w-full bg-slate-800 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState(30);

  // Separate loading states for each section
  const [kFactorLoading, setKFactorLoading] = useState(true);
  const [infrastructureLoading, setInfrastructureLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [cenotapheriesLoading, setCenotapheriesLoading] = useState(true);

  // Data states
  const [kFactorData, setKFactorData] = useState<KFactorData | null>(null);
  const [infrastructure, setInfrastructure] = useState<UsageMetric[]>([]);
  const [events, setEvents] = useState<EventCount[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);
  const [cenotapheries, setCenotapheries] = useState<CenotapheryStats[]>([]);
  const [totalCenotapheryVisits, setTotalCenotapheryVisits] = useState(0);

  // Fetch K-Factor data
  useEffect(() => {
    setKFactorLoading(true);
    fetch(`/api/admin/kfactor?days=${period}`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setKFactorData(json.data);
        }
      })
      .catch((err) => console.error("Failed to fetch K-Factor:", err))
      .finally(() => setKFactorLoading(false));
  }, [period]);

  // Fetch Infrastructure data (period-independent)
  useEffect(() => {
    setInfrastructureLoading(true);
    fetch("/api/admin/infrastructure")
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.metrics) {
          setInfrastructure(json.metrics);
        }
      })
      .catch((err) => console.error("Failed to fetch infrastructure:", err))
      .finally(() => setInfrastructureLoading(false));
  }, []);

  // Fetch Events data
  useEffect(() => {
    setEventsLoading(true);
    fetch(`/api/admin/events?days=${period}&limit=10`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setEvents(json.data.events);
          setTotalEvents(json.data.totalEvents);
        }
      })
      .catch((err) => console.error("Failed to fetch events:", err))
      .finally(() => setEventsLoading(false));
  }, [period]);

  // Fetch Cenotapheries data
  useEffect(() => {
    setCenotapheriesLoading(true);
    fetch(`/api/admin/cenotapheries?days=${period}&limit=5`)
      .then((res) => res.json())
      .then((json) => {
        if (json.success && json.data) {
          setCenotapheries(json.data.cenotapheries);
          setTotalCenotapheryVisits(json.data.totalVisits);
        }
      })
      .catch((err) => console.error("Failed to fetch cenotapheries:", err))
      .finally(() => setCenotapheriesLoading(false));
  }, [period]);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-marble-100">Analytics Dashboard</h1>
          <p className="text-slate-400 mt-1">Monitor virality metrics and infrastructure usage</p>
        </div>
        <PeriodSelector value={period} onChange={setPeriod} />
      </div>

      <div className="space-y-8">
        {/* KPI Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {kFactorLoading ? (
            <>
              <CardSkeleton />
              <CardSkeleton />
              <CardSkeleton />
            </>
          ) : (
            <>
              <KFactorCard
                value={kFactorData?.kFactor || 0}
                invitesPerUser={kFactorData?.invitesPerUser || 0}
                conversionRate={kFactorData?.conversionRate || 0}
              />
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                  Active Users
                </div>
                <div className="text-3xl font-bold text-marble-100">
                  {kFactorData?.activeUsers || 0}
                </div>
                <div className="text-sm text-slate-500 mt-1">Completed wizard in {period} days</div>
              </div>
              <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <div className="text-sm text-slate-400 uppercase tracking-wider mb-2">
                  Total Events
                </div>
                <div className="text-3xl font-bold text-marble-100">
                  {totalEvents.toLocaleString()}
                </div>
                <div className="text-sm text-slate-500 mt-1">Tracked in {period} days</div>
              </div>
            </>
          )}
        </div>

        {/* Virality Funnel */}
        {kFactorLoading ? (
          <FunnelSkeleton />
        ) : (
          <ViralityFunnel
            shares={kFactorData?.totalShares || 0}
            clicks={kFactorData?.totalClicks || 0}
            signups={0}
            conversions={kFactorData?.totalConversions || 0}
          />
        )}

        {/* Two Column Layout: Events + Cenotapheries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Events Table */}
          {eventsLoading ? <TableSkeleton /> : <EventsTable events={events} period={period} />}

          {/* Top Cenotapheries */}
          {cenotapheriesLoading ? (
            <TableSkeleton />
          ) : (
            <TopCenotapheries
              cenotapheries={cenotapheries}
              totalVisits={totalCenotapheryVisits}
              period={period}
            />
          )}
        </div>

        {/* Infrastructure Usage */}
        {infrastructureLoading ? (
          <InfrastructureSkeleton />
        ) : (
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-marble-100 mb-6">Infrastructure Usage</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {infrastructure.map((metric) => (
                <InfrastructureGauge
                  key={`${metric.provider}-${metric.metricName}`}
                  provider={metric.provider}
                  metricName={metric.metricName}
                  currentValue={metric.currentValue}
                  limitValue={metric.limitValue}
                  percentageUsed={metric.percentageUsed}
                  unit={metric.unit}
                />
              ))}
              {infrastructure.length === 0 && (
                <div className="col-span-full text-center text-slate-500 py-8">
                  No infrastructure data available yet
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
