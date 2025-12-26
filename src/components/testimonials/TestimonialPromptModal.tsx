"use client";

import { useState, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckboxWithLabel } from "@/components/ui/checkbox";
import { StarRating } from "./StarRating";
import { useToast } from "@/components/ui/use-toast";

// Testimonial types matching the database schema
export type TestimonialType =
  | "story_contribution"
  | "chapter_completion"
  | "cenotaph_design"
  | "general"
  | "community"
  | "organization";

interface TestimonialPromptModalProps {
  /** Whether the modal is open */
  open: boolean;
  /** Callback when the modal should close */
  onOpenChange: (open: boolean) => void;
  /** Type of testimonial being collected */
  type: TestimonialType;
  /** Optional context ID (story_id, memorial_id, etc.) */
  contextId?: string;
  /** Optional context metadata */
  contextMetadata?: Record<string, unknown>;
  /** Custom title for the modal */
  title?: string;
  /** Custom description/prompt for the modal */
  description?: string;
  /** Callback after successful submission */
  onSuccess?: () => void;
}

// Default messaging based on testimonial type
const defaultMessages: Record<
  TestimonialType,
  { title: string; description: string; placeholder: string }
> = {
  story_contribution: {
    title: "Your feedback matters",
    description: "How was your experience contributing your startup's story?",
    placeholder: "Share your thoughts about the interview process...",
  },
  chapter_completion: {
    title: "Your feedback is crucial",
    description: "You're one of the first 100 founders to use SOIL. How was this chapter?",
    placeholder: "Tell us about your experience with this section...",
  },
  cenotaph_design: {
    title: "Your feedback matters",
    description: "How was your cenotaph creation experience?",
    placeholder: "Share your thoughts about the design process...",
  },
  general: {
    title: "We value your opinion",
    description: "You're one of the first 1000 visitors. Your feedback helps us improve.",
    placeholder: "What do you think about SOIL?",
  },
  community: {
    title: "Share your experience",
    description: "Tell us about your experience with the SOIL community.",
    placeholder: "What does the SOIL community mean to you?",
  },
  organization: {
    title: "Share your thoughts",
    description: "What do you think of this memorial?",
    placeholder: "Share your impressions...",
  },
};

export function TestimonialPromptModal({
  open,
  onOpenChange,
  type,
  contextId,
  contextMetadata,
  title,
  description,
  onSuccess,
}: TestimonialPromptModalProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const messages = defaultMessages[type];
  const modalTitle = title || messages.title;
  const modalDescription = description || messages.description;

  const resetForm = useCallback(() => {
    setRating(0);
    setContent("");
    setIsPublic(false);
    setDisplayName("");
  }, []);

  const handleSkip = useCallback(() => {
    resetForm();
    onOpenChange(false);
  }, [onOpenChange, resetForm]);

  const handleSubmit = useCallback(async () => {
    if (!content.trim()) {
      toast({
        title: "Please share your thoughts",
        description: "Your feedback helps us improve SOIL.",
        variant: "dark-warning",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/testimonials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content.trim(),
          rating: rating > 0 ? rating : undefined,
          type,
          contextId,
          contextMetadata,
          isPublic,
          displayName: isPublic ? displayName.trim() || undefined : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Failed to submit feedback");
      }

      toast({
        title: "Thank you for your feedback!",
        description: "Your insights help us build a better experience.",
        variant: "dark",
      });

      resetForm();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Failed to submit testimonial:", error);
      toast({
        title: "Something went wrong",
        description: "Please try again later.",
        variant: "dark-warning",
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [
    content,
    rating,
    type,
    contextId,
    contextMetadata,
    isPublic,
    displayName,
    toast,
    resetForm,
    onOpenChange,
    onSuccess,
  ]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent variant="dark" size="md">
        <DialogHeader>
          <DialogTitle variant="dark">{modalTitle}</DialogTitle>
          <DialogDescription variant="dark">{modalDescription}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="flex flex-col items-center gap-2">
            <Label variant="dark" className="text-sm text-slate-400">
              Rate your experience
            </Label>
            <StarRating value={rating} onChange={setRating} size="lg" />
          </div>

          {/* Feedback Text */}
          <div className="space-y-2">
            <Label variant="dark" htmlFor="testimonial-content">
              Your feedback
            </Label>
            <Textarea
              id="testimonial-content"
              variant="dark"
              placeholder={messages.placeholder}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
            />
          </div>

          {/* Public Display Option */}
          <div className="space-y-3">
            <CheckboxWithLabel
              variant="dark"
              label="Allow public display"
              description="Your feedback may be featured on our website"
              checked={isPublic}
              onCheckedChange={(checked) => setIsPublic(checked === true)}
            />

            {/* Display Name (only shown if public) */}
            {isPublic && (
              <div className="space-y-2 pl-8">
                <Label variant="dark" htmlFor="display-name" className="text-sm">
                  Display name (optional)
                </Label>
                <Input
                  id="display-name"
                  variant="dark"
                  placeholder="How should we identify you?"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  maxLength={50}
                />
                <p className="text-xs text-slate-500">Leave empty for anonymous display</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="dark-ghost" onClick={handleSkip} disabled={isSubmitting}>
            Skip
          </Button>
          <Button variant="dark-primary" onClick={handleSubmit} isLoading={isSubmitting}>
            Submit Feedback
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
