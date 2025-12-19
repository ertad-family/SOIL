import type { CenotapheryMarker } from "@/types/cenotaphery";

/**
 * Mock data for 5 country-level cenotaphery markers
 * Coordinates are approximate country centers
 */
export const mockCenotapheries: CenotapheryMarker[] = [
  {
    id: "usa",
    name: "United States Memorial",
    level: "country",
    coordinates: {
      lat: 39.8283,
      lng: -98.5795, // Geographic center of USA
    },
    statistics: {
      cenotaphCount: 847,
      capacity: 1024,
      fillPercentage: 83,
    },
    status: "active",
    style: "modern",
    recentActivity: {
      newCenotaphsThisWeek: 12,
      totalVisitsThisWeek: 2340,
    },
    location: {
      country: "United States",
    },
  },
  {
    id: "germany",
    name: "Germany Memorial",
    level: "country",
    coordinates: {
      lat: 51.1657,
      lng: 10.4515, // Center of Germany
    },
    statistics: {
      cenotaphCount: 1024,
      capacity: 1024,
      fillPercentage: 100,
    },
    status: "full",
    honorificName: "In the name of Wirecard",
    style: "nordic",
    recentActivity: {
      newCenotaphsThisWeek: 0,
      totalVisitsThisWeek: 1856,
    },
    location: {
      country: "Germany",
    },
  },
  {
    id: "uk",
    name: "United Kingdom Memorial",
    level: "country",
    coordinates: {
      lat: 55.3781,
      lng: -3.436, // Center of UK
    },
    statistics: {
      cenotaphCount: 461,
      capacity: 1024,
      fillPercentage: 45,
    },
    status: "active",
    style: "modern",
    recentActivity: {
      newCenotaphsThisWeek: 8,
      totalVisitsThisWeek: 1542,
    },
    location: {
      country: "United Kingdom",
    },
  },
  {
    id: "japan",
    name: "Japan Memorial",
    level: "country",
    coordinates: {
      lat: 36.2048,
      lng: 138.2529, // Center of Japan
    },
    statistics: {
      cenotaphCount: 686,
      capacity: 1024,
      fillPercentage: 67,
    },
    status: "active",
    style: "asian",
    recentActivity: {
      newCenotaphsThisWeek: 5,
      totalVisitsThisWeek: 987,
    },
    location: {
      country: "Japan",
    },
  },
  {
    id: "brazil",
    name: "Brazil Memorial",
    level: "country",
    coordinates: {
      lat: -14.235,
      lng: -51.9253, // Center of Brazil
    },
    statistics: {
      cenotaphCount: 256,
      capacity: 1024,
      fillPercentage: 25,
    },
    status: "active",
    style: "mediterranean",
    recentActivity: {
      newCenotaphsThisWeek: 3,
      totalVisitsThisWeek: 654,
    },
    location: {
      country: "Brazil",
    },
  },
];

/**
 * Global statistics for hero section
 */
export const globalStats = {
  countries: 5,
  cities: 147,
  founders: 892,
  organizations: 3274,
};

/**
 * Statistics for side panel (calculated from markers)
 */
export const sidePanelStats = {
  totalStories: mockCenotapheries.reduce((sum, m) => sum + m.statistics.cenotaphCount, 0),
  totalCountries: new Set(mockCenotapheries.map((m) => m.location.country)).size,
  totalIndustries: 12,
};

/**
 * Featured stories mock data for the FeaturedStoriesSection
 */
export const featuredStories = [
  {
    id: "story-1",
    quote: "We learned that product-market fit can disappear as fast as it appeared.",
    companyName: "TechCorp Inc.",
    years: "2019 — 2023",
    location: "San Francisco",
    industry: "Tech",
    industryColor: "#5B7C99", // info-500
    respects: 234,
  },
  {
    id: "story-2",
    quote:
      "Scaling too fast without unit economics was our downfall. Every startup should read this.",
    companyName: "QuickDeliver",
    years: "2018 — 2022",
    location: "London",
    industry: "E-commerce",
    industryColor: "#B85450", // error-500
    respects: 189,
  },
  {
    id: "story-3",
    quote: "We built for investors, not users. The pivot came too late.",
    companyName: "SocialWave",
    years: "2020 — 2024",
    location: "Berlin",
    industry: "Media",
    industryColor: "#C9943D", // gold-500
    respects: 156,
  },
];
