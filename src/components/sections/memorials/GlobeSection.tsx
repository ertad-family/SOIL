"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Minus, Plus, RotateCcw, List, MapPin, Building2 } from "lucide-react";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { CenotapheryMarker } from "@/types/cenotaphery";
import { Button } from "@/components/ui/button";

// Dynamic import for GlobeScene (no SSR for Three.js)
const GlobeScene = dynamic(
  () => import("@/components/three/globe/GlobeScene").then((mod) => mod.GlobeScene),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-slate-900/50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Loading memorials...</p>
        </div>
      </div>
    ),
  }
);

interface GlobeSectionProps {
  markers: CenotapheryMarker[];
  globalStats: {
    totalStories: number;
    totalCountries: number;
    totalIndustries: number;
  };
}

/**
 * Floating tooltip card showing marker details - positioned to the left of the globe
 * Only visible on desktop; mobile uses bottom sheet
 */
function FloatingTooltip({ marker, onClose }: { marker: CenotapheryMarker; onClose: () => void }) {
  const fillPercentage = marker.statistics.fillPercentage;
  const isFull = marker.status === "full";

  return (
    <div className="hidden lg:block absolute left-6 top-1/2 -translate-y-1/2 w-[280px] bg-slate-900/95 backdrop-blur-md border border-slate-700/50 rounded-xl shadow-2xl z-10 animate-in fade-in slide-in-from-left-4 duration-300">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-3 right-3 p-1 text-slate-500 hover:text-marble-100 transition-colors"
        aria-label="Close"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <div className="p-5">
        {/* Header */}
        <div className="mb-4">
          {isFull && (
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gold-500/20 rounded-full mb-2">
              <span className="text-gold-400 text-xs font-medium">COMPLETED</span>
            </div>
          )}

          <h3 className="text-lg font-display font-semibold text-marble-100 leading-tight pr-6">
            {marker.name}
          </h3>

          {marker.honorificName && (
            <p className="text-gold-400 italic text-sm mt-1">
              &ldquo;{marker.honorificName}&rdquo;
            </p>
          )}
        </div>

        {/* Location & Style */}
        <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-400">
          <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
            <MapPin className="w-3 h-3" />
            {marker.location.city ? `${marker.location.city}, ` : ""}
            {marker.location.country}
          </span>
          <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
            <Building2 className="w-3 h-3" />
            {marker.style.charAt(0).toUpperCase() + marker.style.slice(1)}
          </span>
        </div>

        {/* Capacity bar */}
        <div className="mb-4">
          <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isFull ? "bg-gold-400" : fillPercentage >= 90 ? "bg-gold-500" : "bg-info-500"
              }`}
              style={{ width: `${fillPercentage}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs text-slate-400">
            <span className="text-marble-100 font-medium">
              {marker.statistics.cenotaphCount.toLocaleString()}
            </span>
            {" / "}
            {marker.statistics.capacity.toLocaleString()}{" "}
            <span className="text-slate-500">({fillPercentage}%)</span>
          </p>
        </div>

        {/* Recent activity - compact */}
        <div className="mb-4 p-3 bg-slate-800/30 rounded-lg">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-lg font-mono text-gold-400">
                +{marker.recentActivity.newCenotaphsThisWeek}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">new this week</p>
            </div>
            <div>
              <p className="text-lg font-mono text-marble-100">
                {marker.recentActivity.totalVisitsThisWeek.toLocaleString()}
              </p>
              <p className="text-[10px] text-slate-500 uppercase tracking-wide">visits</p>
            </div>
          </div>
        </div>

        {/* Enter button */}
        <Link href={`/cenotaphery/${marker.id}`}>
          <Button variant="cenotaph" size="md" fullWidth>
            Enter Memorial
          </Button>
        </Link>
      </div>
    </div>
  );
}

/**
 * Mobile bottom sheet content for selected marker
 */
function MobileSheetContent({
  marker,
  onClose,
}: {
  marker: CenotapheryMarker;
  onClose: () => void;
}) {
  const fillPercentage = marker.statistics.fillPercentage;
  const isFull = marker.status === "full";

  return (
    <div className="p-5">
      {/* Header */}
      <div className="mb-4">
        {isFull && (
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-gold-500/20 rounded-full mb-2">
            <span className="text-gold-400 text-xs font-medium">COMPLETED</span>
          </div>
        )}

        <h3 className="text-xl font-display font-semibold text-marble-100">{marker.name}</h3>

        {marker.honorificName && (
          <p className="text-gold-400 italic text-sm mt-1">&ldquo;{marker.honorificName}&rdquo;</p>
        )}
      </div>

      {/* Location & Style */}
      <div className="flex flex-wrap gap-2 mb-4 text-xs text-slate-400">
        <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
          <MapPin className="w-3 h-3" />
          {marker.location.city ? `${marker.location.city}, ` : ""}
          {marker.location.country}
        </span>
        <span className="flex items-center gap-1 bg-slate-800/50 px-2 py-1 rounded">
          <Building2 className="w-3 h-3" />
          {marker.style.charAt(0).toUpperCase() + marker.style.slice(1)}
        </span>
      </div>

      {/* Capacity bar */}
      <div className="mb-4">
        <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFull ? "bg-gold-400" : fillPercentage >= 90 ? "bg-gold-500" : "bg-info-500"
            }`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
        <p className="mt-1.5 text-sm text-slate-400">
          <span className="text-marble-100 font-medium">
            {marker.statistics.cenotaphCount.toLocaleString()}
          </span>
          {" / "}
          {marker.statistics.capacity.toLocaleString()}{" "}
          <span className="text-slate-500">({fillPercentage}%)</span>
        </p>
      </div>

      {/* Recent activity */}
      <div className="mb-5 p-3 bg-slate-800/30 rounded-lg">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <p className="text-xl font-mono text-gold-400">
              +{marker.recentActivity.newCenotaphsThisWeek}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">new this week</p>
          </div>
          <div>
            <p className="text-xl font-mono text-marble-100">
              {marker.recentActivity.totalVisitsThisWeek.toLocaleString()}
            </p>
            <p className="text-xs text-slate-500 uppercase tracking-wide">visits</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link href={`/cenotaphery/${marker.id}`}>
          <Button variant="cenotaph" size="lg" fullWidth>
            Enter Memorial
          </Button>
        </Link>

        <button
          onClick={onClose}
          className="w-full text-sm text-slate-400 hover:text-marble-100 transition-colors py-2"
        >
          ← Back to globe
        </button>
      </div>
    </div>
  );
}

/**
 * Control bar with zoom, reset, and list view buttons
 */
function ControlBar({
  onZoomIn,
  onZoomOut,
  onReset,
  onToggleList,
  isListView,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onToggleList: () => void;
  isListView: boolean;
}) {
  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 p-2 bg-slate-900/90 backdrop-blur-sm rounded-full border border-slate-700/50">
      <button
        onClick={onZoomOut}
        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        aria-label="Zoom out"
      >
        <Minus className="w-5 h-5 text-slate-400" />
      </button>

      <button
        onClick={onZoomIn}
        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        aria-label="Zoom in"
      >
        <Plus className="w-5 h-5 text-slate-400" />
      </button>

      <div className="w-px h-6 bg-slate-700" />

      <button
        onClick={onReset}
        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
        aria-label="Reset view"
      >
        <RotateCcw className="w-5 h-5 text-slate-400" />
      </button>

      <div className="w-px h-6 bg-slate-700" />

      <button
        onClick={onToggleList}
        className={`p-2 rounded-full transition-colors ${
          isListView ? "bg-gold-500/20 text-gold-400" : "hover:bg-slate-800 text-slate-400"
        }`}
        aria-label={isListView ? "Show globe" : "Show list"}
      >
        <List className="w-5 h-5" />
      </button>
    </div>
  );
}

/**
 * List view fallback for accessibility
 */
function ListView({
  markers,
  selectedMarkerId,
  onSelect,
}: {
  markers: CenotapheryMarker[];
  selectedMarkerId: string | null;
  onSelect: (marker: CenotapheryMarker) => void;
}) {
  return (
    <div className="w-full h-full overflow-y-auto p-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {markers.map((marker) => {
          const isSelected = marker.id === selectedMarkerId;
          const isFull = marker.status === "full";

          return (
            <div
              key={marker.id}
              onClick={() => onSelect(marker)}
              onKeyDown={(e) => e.key === "Enter" && onSelect(marker)}
              role="button"
              tabIndex={0}
              className={`text-left p-4 rounded-lg border transition-all cursor-pointer ${
                isSelected
                  ? "bg-gold-500/10 border-gold-500/50"
                  : "bg-slate-800/50 border-slate-700/50 hover:border-slate-600"
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-marble-100">{marker.name}</h4>
                {isFull && (
                  <span className="text-xs px-2 py-0.5 bg-gold-500/20 text-gold-400 rounded-full">
                    Full
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-400 mb-3">
                {marker.location.city ? `${marker.location.city}, ` : ""}
                {marker.location.country}
              </p>
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${isFull ? "bg-gold-400" : "bg-info-500"}`}
                  style={{ width: `${marker.statistics.fillPercentage}%` }}
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                {marker.statistics.cenotaphCount} / {marker.statistics.capacity}
              </p>

              {/* Enter Memorial button - appears when card is selected */}
              {isSelected && (
                <Link
                  href={`/cenotaphery/${marker.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="block mt-4"
                >
                  <Button variant="dark-primary" size="md" fullWidth>
                    Enter Memorial
                  </Button>
                </Link>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Main Globe Section with globe, side panel, and controls
 */
// Cooldown duration after closing tooltip (ms)
const TOOLTIP_COOLDOWN_MS = 5000;

export function GlobeSection({ markers, globalStats }: GlobeSectionProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [activeMarkerId, setActiveMarkerId] = useState<string | null>(null);
  const [isListView, setIsListView] = useState(false);
  const [tooltipCooldownUntil, setTooltipCooldownUntil] = useState(0);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleMarkerSelect = useCallback((marker: CenotapheryMarker | null) => {
    setSelectedMarkerId(marker?.id ?? null);
    // Clear active marker when user selects
    if (marker) setActiveMarkerId(null);
  }, []);

  const handleMarkerHover = useCallback((marker: CenotapheryMarker | null) => {
    setHoveredMarkerId(marker?.id ?? null);
  }, []);

  const handleActiveMarkerChange = useCallback((marker: CenotapheryMarker | null) => {
    // Only update active marker if user hasn't selected or hovered
    setActiveMarkerId(marker?.id ?? null);
  }, []);

  const handleZoomIn = useCallback(() => {
    // Zoom is handled via OrbitControls wheel/pinch, buttons trigger custom event
    const event = new CustomEvent("globe-zoom", { detail: { direction: "in" } });
    window.dispatchEvent(event);
  }, []);

  const handleZoomOut = useCallback(() => {
    const event = new CustomEvent("globe-zoom", { detail: { direction: "out" } });
    window.dispatchEvent(event);
  }, []);

  const handleReset = useCallback(() => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      controlsRef.current.autoRotate = true;
    }
    setSelectedMarkerId(null);
  }, []);

  const selectedMarker = markers.find((m) => m.id === selectedMarkerId) || null;

  // FloatingTooltip only shows when marker is clicked (selected), not auto-highlighted
  const tooltipMarker = selectedMarker;

  // Lock body scroll when mobile bottom sheet is open (#225)
  useEffect(() => {
    if (tooltipMarker) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [tooltipMarker]);

  return (
    <section className="relative min-h-[600px] h-[80vh] max-h-[900px] bg-gradient-to-b from-slate-950 to-slate-900">
      {/* Globe or List View - now takes full width */}
      <div className="relative h-full">
        {isListView ? (
          <ListView
            markers={markers}
            selectedMarkerId={selectedMarkerId}
            onSelect={handleMarkerSelect}
          />
        ) : (
          <GlobeScene
            markers={markers}
            selectedMarkerId={selectedMarkerId}
            hoveredMarkerId={hoveredMarkerId}
            activeMarkerId={activeMarkerId}
            tooltipCooldownUntil={tooltipCooldownUntil}
            onMarkerSelect={handleMarkerSelect}
            onMarkerHover={handleMarkerHover}
            onActiveMarkerChange={handleActiveMarkerChange}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            controlsRef={controlsRef}
          />
        )}

        {/* Floating Tooltip - Desktop only, positioned left of globe */}
        {tooltipMarker && !isListView && (
          <FloatingTooltip
            marker={tooltipMarker}
            onClose={() => {
              setSelectedMarkerId(null);
              setActiveMarkerId(null);
              // Set cooldown to prevent immediate reappearance
              setTooltipCooldownUntil(Date.now() + TOOLTIP_COOLDOWN_MS);
            }}
          />
        )}

        {/* Control bar */}
        <ControlBar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onToggleList={() => setIsListView(!isListView)}
          isListView={isListView}
        />
      </div>

      {/* Bottom Sheet - Mobile/Tablet */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 transition-transform duration-300 ease-out ${
          tooltipMarker ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ maxHeight: "70vh" }}
      >
        {/* Drag handle */}
        <div className="flex justify-center py-3">
          <div className="w-12 h-1 bg-slate-700 rounded-full" />
        </div>

        {/* Expanded content */}
        {tooltipMarker && (
          <div className="overflow-y-auto" style={{ maxHeight: "calc(70vh - 44px)" }}>
            <MobileSheetContent
              marker={tooltipMarker}
              onClose={() => {
                setSelectedMarkerId(null);
                setActiveMarkerId(null);
                // Set cooldown to prevent immediate reappearance
                setTooltipCooldownUntil(Date.now() + TOOLTIP_COOLDOWN_MS);
              }}
            />
          </div>
        )}
      </div>
    </section>
  );
}
