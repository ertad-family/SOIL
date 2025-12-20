"use client";

import { useState, useRef, useCallback } from "react";
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
 * Side panel showing either default state or selected marker details
 */
function SidePanel({
  selectedMarker,
  globalStats,
  onClose,
}: {
  selectedMarker: CenotapheryMarker | null;
  globalStats: GlobeSectionProps["globalStats"];
  onClose: () => void;
}) {
  if (!selectedMarker) {
    // Default state - prompt to select
    return (
      <div className="h-full flex flex-col p-6">
        <div className="flex-1 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-4">
            <MapPin className="w-8 h-8 text-gold-400" />
          </div>
          <h3 className="text-xl font-display font-medium text-marble-100 mb-2">
            Select a memorial
          </h3>
          <p className="text-slate-400 mb-6">Click on a marker on the globe to explore</p>

          {/* Animated dots */}
          <div className="flex gap-2 mb-8">
            <span
              className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"
              style={{ animationDelay: "0s" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"
              style={{ animationDelay: "0.2s" }}
            />
            <span
              className="w-2 h-2 rounded-full bg-gold-500 animate-pulse"
              style={{ animationDelay: "0.4s" }}
            />
          </div>
        </div>

        {/* Quick stats */}
        <div className="border-t border-slate-800 pt-6">
          <p className="text-sm text-slate-500 uppercase tracking-widest mb-4">Quick stats</p>
          <ul className="space-y-2 text-slate-400">
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {globalStats.totalCountries} active memorials
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {globalStats.totalStories.toLocaleString()} total cenotaphs
            </li>
            <li className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
              {globalStats.totalIndustries} industries
            </li>
          </ul>
        </div>
      </div>
    );
  }

  // Selected marker state
  const fillPercentage = selectedMarker.statistics.fillPercentage;
  const isFull = selectedMarker.status === "full";

  return (
    <div className="h-full flex flex-col p-6 overflow-y-auto">
      {/* Header */}
      <div className="mb-6">
        {isFull && (
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-500/20 rounded-full mb-3">
            <span className="text-gold-400 text-sm font-medium">COMPLETED</span>
          </div>
        )}

        <h3 className="text-2xl font-display font-semibold text-marble-100 mb-1">
          {selectedMarker.name}
        </h3>

        {selectedMarker.honorificName && (
          <p className="text-gold-400 italic mb-3">&ldquo;{selectedMarker.honorificName}&rdquo;</p>
        )}

        <div className="flex flex-wrap gap-3 text-sm text-slate-400">
          <span className="flex items-center gap-1">
            <MapPin className="w-4 h-4" />
            {selectedMarker.location.city ? `${selectedMarker.location.city}, ` : ""}
            {selectedMarker.location.country}
          </span>
          <span className="flex items-center gap-1">
            <Building2 className="w-4 h-4" />
            {selectedMarker.style.charAt(0).toUpperCase() + selectedMarker.style.slice(1)} style
          </span>
        </div>
      </div>

      {/* Capacity bar */}
      <div className="mb-6">
        <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              isFull ? "bg-gold-400" : fillPercentage >= 90 ? "bg-gold-500" : "bg-info-500"
            }`}
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-slate-400">
          <span className="text-marble-100 font-medium">
            {selectedMarker.statistics.cenotaphCount.toLocaleString()}
          </span>
          {" / "}
          {selectedMarker.statistics.capacity.toLocaleString()}{" "}
          <span className="text-slate-500">({fillPercentage}%)</span>
        </p>
      </div>

      {/* Recent activity */}
      <div className="mb-6 p-4 bg-slate-800/50 rounded-lg">
        <p className="text-sm text-slate-500 uppercase tracking-widest mb-3">This week</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-2xl font-mono text-gold-400">
              +{selectedMarker.recentActivity.newCenotaphsThisWeek}
            </p>
            <p className="text-xs text-slate-400">new cenotaphs</p>
          </div>
          <div>
            <p className="text-2xl font-mono text-marble-100">
              {selectedMarker.recentActivity.totalVisitsThisWeek.toLocaleString()}
            </p>
            <p className="text-xs text-slate-400">visits</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto space-y-3">
        <Link href={`/cenotaphery/${selectedMarker.id}`}>
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
export function GlobeSection({ markers, globalStats }: GlobeSectionProps) {
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [hoveredMarkerId, setHoveredMarkerId] = useState<string | null>(null);
  const [isListView, setIsListView] = useState(false);
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const handleMarkerSelect = useCallback((marker: CenotapheryMarker | null) => {
    setSelectedMarkerId(marker?.id ?? null);
  }, []);

  const handleMarkerHover = useCallback((marker: CenotapheryMarker | null) => {
    setHoveredMarkerId(marker?.id ?? null);
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

  return (
    <section className="relative min-h-[600px] h-[80vh] max-h-[900px] bg-gradient-to-b from-slate-950 to-slate-900">
      <div className="h-full flex flex-col lg:flex-row">
        {/* Globe or List View */}
        <div className="relative flex-1 min-h-[400px] lg:min-h-0">
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
              onMarkerSelect={handleMarkerSelect}
              onMarkerHover={handleMarkerHover}
              onZoomIn={handleZoomIn}
              onZoomOut={handleZoomOut}
              onReset={handleReset}
              controlsRef={controlsRef}
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

        {/* Side Panel - Desktop */}
        <div className="hidden lg:block w-[350px] border-l border-slate-800 bg-slate-900/80 backdrop-blur-sm">
          <SidePanel
            selectedMarker={selectedMarker}
            globalStats={globalStats}
            onClose={() => setSelectedMarkerId(null)}
          />
        </div>

        {/* Bottom Sheet - Mobile/Tablet */}
        <div
          className={`lg:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 transition-transform duration-300 ease-out ${
            selectedMarker ? "translate-y-0" : "translate-y-[calc(100%-80px)]"
          }`}
          style={{ height: "70vh", maxHeight: "500px" }}
        >
          {/* Drag handle */}
          <div className="flex justify-center py-3">
            <div className="w-12 h-1 bg-slate-700 rounded-full" />
          </div>

          {/* Collapsed preview */}
          {!selectedMarker && (
            <div className="px-6 pb-4">
              <p className="text-slate-400 text-sm">
                Select a memorial on the globe to view details
              </p>
            </div>
          )}

          {/* Expanded content */}
          {selectedMarker && (
            <div className="h-[calc(100%-44px)] overflow-y-auto">
              <SidePanel
                selectedMarker={selectedMarker}
                globalStats={globalStats}
                onClose={() => setSelectedMarkerId(null)}
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
