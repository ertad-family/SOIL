"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MODULES } from "@/types/interview";
import type { StoryData } from "./types";

interface StoryCardProps {
  story: StoryData;
  isOwn: boolean;
  authorName: string;
}

export function StoryCard({ story, isOwn, authorName }: StoryCardProps) {
  const progress = Math.round((story.completed_modules.length / MODULES.length) * 100);
  const isCoined = story.status === "coined";

  return (
    <div className="p-4 rounded-lg border border-slate-700 bg-slate-800/50">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-marble-200">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-marble-100 font-medium">
              {authorName}
              {isOwn && <span className="text-slate-500 ml-2">(you)</span>}
            </p>
            <div className="flex items-center gap-2">
              {isCoined ? (
                <Badge variant="dark-success" size="sm">
                  Coined
                </Badge>
              ) : (
                <Badge variant="dark-outline" size="sm">
                  {progress}% complete
                </Badge>
              )}
              {story.coined_at && (
                <span className="text-sm text-slate-500">
                  {new Date(story.coined_at).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {isOwn && (
          <a href={`/interview/${story.id}`}>
            <Button variant="dark-ghost" size="sm" rightIcon={<ChevronRight className="w-4 h-4" />}>
              {isCoined ? "View" : "Continue"}
            </Button>
          </a>
        )}
      </div>
    </div>
  );
}
