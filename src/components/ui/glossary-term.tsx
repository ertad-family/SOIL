"use client";

import { useState } from "react";
import { useGlossary } from "@/contexts/GlossaryContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// ============================================================================
// GLOSSARY TERM COMPONENT
// Displays a term with tooltip showing its definition from glossary
// ============================================================================

interface GlossaryTermProps {
  term: string;
  children?: React.ReactNode;
  className?: string;
}

export function GlossaryTerm({ term, children, className = "" }: GlossaryTermProps) {
  const { getTermDefinition } = useGlossary();
  const definition = getTermDefinition(term);
  const [open, setOpen] = useState(false);

  // If no definition found, render plain text
  if (!definition) {
    return <span className={className}>{children || term}</span>;
  }

  return (
    <Tooltip open={open} onOpenChange={setOpen}>
      <TooltipTrigger asChild>
        <span
          className={`
            border-b border-dotted border-gold-400/50
            cursor-help
            transition-colors
            hover:border-gold-400
            hover:text-gold-300
            ${className}
          `}
          onClick={() => setOpen(!open)}
          onTouchStart={(e) => {
            e.preventDefault();
            setOpen(!open);
          }}
        >
          {children || term}
        </span>
      </TooltipTrigger>
      <TooltipContent variant="dark" side="top" className="max-w-sm p-4">
        <div className="space-y-2">
          <div className="text-base font-semibold text-gold-400">{term}</div>
          <div className="text-sm text-slate-300 leading-relaxed">{definition}</div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
