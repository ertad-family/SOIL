/**
 * Types for Cenotaphery markers on the globe
 */

export type CenotapheryLevel = "country" | "region" | "city";

export type CenotapheryStatus = "active" | "full" | "coming_soon";

export type CenotapheryStyle =
  | "modern"
  | "mediterranean"
  | "nordic"
  | "asian"
  | "middle_eastern"
  | "african";

export interface CenotapheryCoordinates {
  lat: number; // -90 to 90
  lng: number; // -180 to 180
}

export interface CenotapheryStatistics {
  cenotaphCount: number;
  capacity: number; // Always 1024
  fillPercentage: number; // 0-100
}

export interface CenotapheryRecentActivity {
  newCenotaphsThisWeek: number;
  totalVisitsThisWeek: number;
}

export interface CenotapheryMarker {
  id: string;
  name: string;
  level: CenotapheryLevel;
  coordinates: CenotapheryCoordinates;
  statistics: CenotapheryStatistics;
  status: CenotapheryStatus;
  honorificName?: string; // e.g., "In the name of Wirecard"
  style: CenotapheryStyle;
  recentActivity: CenotapheryRecentActivity;
  location: {
    city?: string;
    country: string;
  };
}

/**
 * Convert lat/lng to 3D position on a sphere
 * @param lat Latitude in degrees (-90 to 90)
 * @param lng Longitude in degrees (-180 to 180)
 * @param radius Sphere radius
 * @returns [x, y, z] position
 */
export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number
): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return [x, y, z];
}

/**
 * Get marker color based on fill percentage and status
 */
export function getMarkerColor(marker: CenotapheryMarker): string {
  if (marker.status === "coming_soon") {
    return "#64748B"; // slate-500
  }

  if (marker.status === "full") {
    return "#EDCA85"; // gold-300
  }

  const fill = marker.statistics.fillPercentage;

  if (fill >= 90) {
    return "#E2B055"; // gold-400 (almost full)
  }

  if (fill >= 50) {
    return "#C9943D"; // gold-500
  }

  return "#5B7C99"; // info-500
}

/**
 * Get marker size based on fill percentage
 * Range: 0.3 to 0.6 units (small pin-like markers)
 */
export function getMarkerSize(marker: CenotapheryMarker): number {
  const baseSize = 0.3;
  const maxMultiplier = 1;
  const fillRatio = marker.statistics.cenotaphCount / marker.statistics.capacity;
  return baseSize * (1 + fillRatio * maxMultiplier);
}
