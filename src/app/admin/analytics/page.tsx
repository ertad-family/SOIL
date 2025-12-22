"use client";

import { useState, useEffect, useCallback } from "react";
import { KFactorCard } from "@/components/admin/KFactorCard";
import { ViralityFunnel } from "@/components/admin/ViralityFunnel";
import { InfrastructureGauge } from "@/components/admin/InfrastructureGauge";
import { EventsTable } from "@/components/admin/EventsTable";
import { PeriodSelector } from "@/components/admin/PeriodSelector";

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

export default function AnalyticsDashboard() {
  const [period, setPeriod] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [kFactorData, setKFactorData] = useState<KFactorData | null>(null);
  const [infrastructure, setInfrastructure] = useState<UsageMetric[]>([]);
  const [events, setEvents] = useState<EventCount[]>([]);
  const [totalEvents, setTotalEvents] = useState(0);

  const fetchData = useCallback(async () => {
    setIsLoading(true);

    try {
      // Fetch all data in parallel
      const [kfactorRes, infraRes, eventsRes] = await Promise.all([
        fetch(`/api/admin/kfactor?days=${period}`),
        fetch("/api/admin/infrastructure"),
        fetch(`/api/admin/events?days=${period}&limit=10`),
      ]);

      const [kfactorJson, infraJson, eventsJson] = await Promise.all([
        kfactorRes.json(),
        infraRes.json(),
        eventsRes.json(),
      ]);

      if (kfactorJson.success && kfactorJson.data) {
        setKFactorData(kfactorJson.data);
      }

      if (infraJson.success && infraJson.metrics) {
        setInfrastructure(infraJson.metrics);
      }

      if (eventsJson.success && eventsJson.data) {
        setEvents(eventsJson.data.events);
        setTotalEvents(eventsJson.data.totalEvents);
      }
    } catch (err) {
      console.error("Failed to fetch analytics data:", err);
    } finally {
      setIsLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gold-400" />
        </div>
      ) : (
        <div className="space-y-8">
          {/* KPI Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>

          {/* Virality Funnel */}
          <ViralityFunnel
            shares={kFactorData?.totalShares || 0}
            clicks={kFactorData?.totalClicks || 0}
            signups={0}
            conversions={kFactorData?.totalConversions || 0}
          />

          {/* Infrastructure Usage */}
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

          {/* Events Table */}
          <EventsTable events={events} period={period} />
        </div>
      )}
    </div>
  );
}
