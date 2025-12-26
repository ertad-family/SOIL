"use client";

import { useState, useEffect } from "react";
import { Check, X, Star, StarOff, Trash2, MessageSquare } from "lucide-react";

interface Testimonial {
  id: string;
  content: string;
  rating: number | null;
  type: string;
  display_name: string | null;
  is_public: boolean;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  user_id: string | null;
}

type FilterType = "all" | "pending" | "approved" | "featured";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [filter, setFilter] = useState<FilterType>("pending");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/admin/testimonials?filter=${filter}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch testimonials");
      }

      if (data.success) {
        setTestimonials(data.testimonials);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [filter]);

  const handleApprove = async (id: string, approve: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approve }),
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error("Failed to update testimonial:", err);
    }
  };

  const handleFeature = async (id: string, feature: boolean) => {
    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isFeatured: feature }),
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error("Failed to update testimonial:", err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/testimonials/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (err) {
      console.error("Failed to delete testimonial:", err);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      general: "General",
      story_contribution: "Story",
      chapter_completion: "Chapter",
      cenotaph_design: "Cenotaph",
      community: "Community",
      organization: "Organization",
    };
    return labels[type] || type;
  };

  const getTypeBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      general: "bg-blue-500/20 text-blue-400",
      story_contribution: "bg-gold-500/20 text-gold-400",
      chapter_completion: "bg-purple-500/20 text-purple-400",
      cenotaph_design: "bg-emerald-500/20 text-emerald-400",
      community: "bg-pink-500/20 text-pink-400",
      organization: "bg-orange-500/20 text-orange-400",
    };
    return colors[type] || "bg-slate-500/20 text-slate-400";
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <MessageSquare className="w-8 h-8 text-gold-400" />
          <h1 className="text-2xl font-semibold text-marble-100">Testimonials</h1>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6">
        {(["pending", "all", "approved", "featured"] as FilterType[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f
                ? "bg-gold-500/20 text-gold-400 border border-gold-500/50"
                : "bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700"
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Loading */}
      {isLoading ? (
        <div className="text-center py-12 text-slate-400">Loading testimonials...</div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-12 text-slate-400">
          No testimonials found for this filter.
        </div>
      ) : (
        /* Testimonials List */
        <div className="space-y-4">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-slate-800/50 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getTypeBadgeColor(testimonial.type)}`}
                    >
                      {getTypeLabel(testimonial.type)}
                    </span>
                    {testimonial.is_approved && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-emerald-500/20 text-emerald-400">
                        Approved
                      </span>
                    )}
                    {testimonial.is_featured && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-gold-500/20 text-gold-400">
                        Featured
                      </span>
                    )}
                    {testimonial.is_public && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-slate-500/20 text-slate-400">
                        Public
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <p className="text-marble-100 leading-relaxed mb-3">{testimonial.content}</p>

                  {/* Meta */}
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    {testimonial.display_name && <span>By: {testimonial.display_name}</span>}
                    {testimonial.rating && (
                      <span className="flex items-center gap-1">
                        Rating: {testimonial.rating}/5
                      </span>
                    )}
                    <span>{new Date(testimonial.created_at).toLocaleDateString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {!testimonial.is_approved ? (
                    <button
                      onClick={() => handleApprove(testimonial.id, true)}
                      className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 transition-colors"
                      title="Approve"
                    >
                      <Check className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleApprove(testimonial.id, false)}
                      className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-slate-600 transition-colors"
                      title="Unapprove"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}

                  {!testimonial.is_featured ? (
                    <button
                      onClick={() => handleFeature(testimonial.id, true)}
                      className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-gold-500/20 hover:text-gold-400 transition-colors"
                      title="Feature"
                    >
                      <Star className="w-5 h-5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleFeature(testimonial.id, false)}
                      className="p-2 rounded-lg bg-gold-500/20 text-gold-400 hover:bg-slate-700 hover:text-slate-400 transition-colors"
                      title="Unfeature"
                    >
                      <StarOff className="w-5 h-5" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(testimonial.id)}
                    className="p-2 rounded-lg bg-slate-700 text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
