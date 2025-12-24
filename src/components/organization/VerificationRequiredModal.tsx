"use client";

import { Shield, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export type VerificationModalVariant = "cenotaph" | "public-profile";

interface VerificationRequiredModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  variant: VerificationModalVariant;
}

const MODAL_CONTENT: Record<
  VerificationModalVariant,
  {
    title: string;
    description: string;
    explanation: string;
    hint: string;
  }
> = {
  cenotaph: {
    title: "Verify Your Organization First",
    description: "Organization verification is required before creating a cenotaph memorial.",
    explanation:
      "Verify your organization to unlock cenotaph design. Verification ensures the authenticity of the memorial and allows it to be displayed publicly.",
    hint: "Use the Verification section on this page to request verification from colleagues or upload verification documents.",
  },
  "public-profile": {
    title: "Verify Your Organization First",
    description: "Organization verification is required before making your profile public.",
    explanation:
      "Verify your organization to unlock public visibility. Verification ensures the authenticity of your organization's story and builds trust with the community.",
    hint: "Use the Verification section on this page to request verification from colleagues or upload verification documents.",
  },
};

export function VerificationRequiredModal({
  open,
  onOpenChange,
  variant,
}: VerificationRequiredModalProps) {
  const content = MODAL_CONTENT[variant];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="dark" size="md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gold-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-gold-400" />
            </div>
            <DialogTitle variant="dark">{content.title}</DialogTitle>
          </div>
          <DialogDescription variant="dark">{content.description}</DialogDescription>
        </DialogHeader>

        <div className="mt-4 p-4 rounded-lg border border-gold-500/30 bg-gold-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-gold-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <h4 className="font-medium text-marble-100 mb-1">Verification Required</h4>
              <p className="text-sm text-slate-400">{content.explanation}</p>
              <p className="text-sm text-slate-500 mt-2">{content.hint}</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="dark-ghost" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
