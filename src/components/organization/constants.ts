import type { VerificationRelationship, DocumentType } from "./types";

export const RELATIONSHIP_LABELS: Record<VerificationRelationship, string> = {
  colleague: "Ex-Colleague",
  customer: "Ex-Customer",
  supplier: "Ex-Supplier",
  partner: "Ex-Partner",
  investor: "Ex-Investor",
  other: "Other",
};

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  registration: "Registration Certificate",
  extract: "Registry Extract",
  charter: "Company Charter",
  shareholder_list: "Shareholder List",
  other: "Other Document",
};

// Roman marble frame styles for CenotaphAvatar
export const marbleFrameStyles = `
  relative
  aspect-[3/4]
  rounded-sm
  bg-gradient-to-b from-marble-100 via-marble-200 to-marble-300
  p-[3px]
  shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.5)]
  before:absolute before:inset-[3px] before:rounded-sm
  before:border before:border-marble-400/30
  before:shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]
`;

export const marbleFrameEmptyStyles = `
  relative
  aspect-[3/4]
  rounded-sm
  bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900
  p-[3px]
  shadow-[0_4px_20px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1)]
  border border-dashed border-slate-600
`;
