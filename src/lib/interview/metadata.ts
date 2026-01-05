/**
 * Interview Module Metadata
 *
 * Metadata definitions and helper functions for interview modules.
 * Extracted from types/interview.ts for better code organization.
 */

import type { ModuleId } from "@/types/interview";

export interface ModuleMetadata {
  id: ModuleId;
  name: string;
  description: string;
  estimatedMinutes: number;
  order: number;
}

export const MODULES: ModuleMetadata[] = [
  {
    id: "basic_info",
    name: "Basic Info",
    description: "Organization basics, timeline, your role",
    estimatedMinutes: 5,
    order: 0,
  },
  {
    id: "founder",
    name: "Your Story",
    description: "Background, journey, personal impact",
    estimatedMinutes: 18,
    order: 1,
  },
  {
    id: "financial",
    name: "Financial Picture",
    description: "Metrics, dynamics, financial events",
    estimatedMinutes: 18,
    order: 2,
  },
  {
    id: "dynamic",
    name: "Dynamic Picture",
    description: "Internal events from peak to closure",
    estimatedMinutes: 25,
    order: 3,
  },
  {
    id: "environment",
    name: "Environment",
    description: "External conditions and events",
    estimatedMinutes: 18,
    order: 4,
  },
  {
    id: "functional",
    name: "Functional Mapping",
    description: "Organization structure at peak",
    estimatedMinutes: 20,
    order: 5,
  },
  {
    id: "narrative",
    name: "Meaning & Lessons",
    description: "Reflection, lessons, legacy",
    estimatedMinutes: 25,
    order: 6,
  },
];

export const getModuleById = (id: ModuleId): ModuleMetadata | undefined =>
  MODULES.find((m) => m.id === id);

export const getNextModule = (currentId: ModuleId): ModuleMetadata | undefined => {
  const current = MODULES.find((m) => m.id === currentId);
  if (!current) return undefined;
  return MODULES.find((m) => m.order === current.order + 1);
};

export const getPreviousModule = (currentId: ModuleId): ModuleMetadata | undefined => {
  const current = MODULES.find((m) => m.id === currentId);
  if (!current || current.order === 0) return undefined;
  return MODULES.find((m) => m.order === current.order - 1);
};

export const calculateProgress = (completedModules: ModuleId[]): number => {
  const storyModules = MODULES.filter((m) => m.id !== "basic_info");
  const completedStoryModules = completedModules.filter((m) => m !== "basic_info");
  return Math.round((completedStoryModules.length / storyModules.length) * 100);
};
