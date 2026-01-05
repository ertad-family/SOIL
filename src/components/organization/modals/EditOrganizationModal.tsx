"use client";

import { useState } from "react";
import { XCircle, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LocationPicker } from "@/components/ui/location-picker";
import { useReferenceData } from "@/hooks/useReferenceData";
import type { OrganizationData } from "../types";
import type { OrganizationType, LifecycleStage, GeoLocation } from "@/types/interview";

interface EditOrganizationModalProps {
  organization: OrganizationData;
  onClose: () => void;
  onSuccess: (updatedOrg: OrganizationData) => void;
}

export function EditOrganizationModal({
  organization,
  onClose,
  onSuccess,
}: EditOrganizationModalProps) {
  const { orgTypes, stages, getBusinessModelsForOrgType } = useReferenceData();
  const [formData, setFormData] = useState({
    name: organization.name,
    description: organization.description || "",
    organization_type: organization.organization_type,
    organization_type_other: organization.organization_type_other || "",
    business_model: organization.business_model || "",
    business_model_other: organization.business_model_other || "",
    industry: organization.industry || "",
    location: {
      country: organization.location_country,
      region: organization.location_region,
      city: organization.location_city,
      latitude: organization.location_lat,
      longitude: organization.location_lng,
      geoId: organization.location_geo_id ?? undefined,
    } as GeoLocation,
    founded_date: organization.founded_date || "",
    closed_date: organization.closed_date || "",
    stage_at_closure: organization.stage_at_closure,
    peak_team_size: organization.peak_team_size,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get business models for selected org type
  const businessModels = formData.organization_type
    ? getBusinessModelsForOrgType(formData.organization_type)
    : [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate required fields
    if (!formData.name.trim()) {
      setError("Organization name is required");
      return;
    }
    if (formData.organization_type === "other" && !formData.organization_type_other?.trim()) {
      setError("Please specify the organization type");
      return;
    }
    if (formData.business_model === "other" && !formData.business_model_other?.trim()) {
      setError("Please specify the business model");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/organization/${organization.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          description: formData.description || null,
          organization_type: formData.organization_type,
          organization_type_other:
            formData.organization_type === "other" ? formData.organization_type_other : null,
          business_model: formData.business_model || null,
          business_model_other:
            formData.business_model === "other" ? formData.business_model_other : null,
          industry: formData.industry || null,
          location_country: formData.location.country || null,
          location_region: formData.location.region || null,
          location_city: formData.location.city || null,
          location_lat: formData.location.latitude || null,
          location_lng: formData.location.longitude || null,
          location_geo_id: formData.location.geoId || null,
          founded_date: formData.founded_date || null,
          closed_date: formData.closed_date || null,
          stage_at_closure: formData.stage_at_closure,
          peak_team_size: formData.peak_team_size,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to update organization");
      }

      const data = await res.json();
      onSuccess(data.organization);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update organization");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-marble-100">Edit Organization</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Organization Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                placeholder="Organization name"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 resize-none"
                placeholder="Brief description of the organization"
              />
            </div>

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Organization Type
              </label>
              <select
                value={formData.organization_type || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    organization_type: (e.target.value as OrganizationType) || null,
                    organization_type_other: "", // Reset custom value
                    business_model: "", // Reset business model when org type changes
                    business_model_other: "", // Reset custom business model
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
              >
                <option value="">Select type...</option>
                {orgTypes.map((orgType) => (
                  <option key={orgType.value} value={orgType.value}>
                    {orgType.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Organization Type Other - show when "other" is selected */}
            {formData.organization_type === "other" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Please specify organization type *
                </label>
                <input
                  type="text"
                  value={formData.organization_type_other}
                  onChange={(e) =>
                    setFormData({ ...formData, organization_type_other: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  placeholder="What type of organization was it?"
                />
              </div>
            )}

            {/* Business Model - only show if org type is selected */}
            {formData.organization_type && businessModels.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Business Model
                </label>
                <select
                  value={formData.business_model}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      business_model: e.target.value,
                      business_model_other: "", // Reset custom value
                    })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                >
                  <option value="">Select business model...</option>
                  {businessModels.map((model) => (
                    <option key={model.value} value={model.value}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Business Model Other - show when "other" is selected */}
            {formData.business_model === "other" && (
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Please specify business model *
                </label>
                <input
                  type="text"
                  value={formData.business_model_other}
                  onChange={(e) =>
                    setFormData({ ...formData, business_model_other: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                  placeholder="What was the business model?"
                />
              </div>
            )}

            {/* Industry */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                placeholder="e.g., Fintech, Healthcare, Education"
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Location</label>
              <p className="text-xs text-slate-400 mb-2">Start typing a city name to search</p>
              <LocationPicker
                value={formData.location}
                onValueChange={(location) => setFormData({ ...formData, location })}
                variant="dark"
                placeholder="Search for a city..."
              />
            </div>

            {/* Timeline */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">
                  Founded Date
                </label>
                <input
                  type="month"
                  value={formData.founded_date}
                  onChange={(e) => setFormData({ ...formData, founded_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-1">Closed Date</label>
                <input
                  type="month"
                  value={formData.closed_date}
                  onChange={(e) => setFormData({ ...formData, closed_date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
                />
              </div>
            </div>

            {/* Stage at Closure */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Stage at Closure
              </label>
              <select
                value={formData.stage_at_closure || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    stage_at_closure: (e.target.value as LifecycleStage) || null,
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
              >
                <option value="">Select stage...</option>
                {stages.map((stage) => (
                  <option key={stage.value} value={stage.value}>
                    {stage.label} - {stage.description}
                  </option>
                ))}
              </select>
            </div>

            {/* Peak Team Size */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">
                Peak Team Size
              </label>
              <input
                type="number"
                min={1}
                value={formData.peak_team_size || ""}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    peak_team_size: e.target.value ? parseInt(e.target.value) : null,
                  })
                }
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500"
                placeholder="e.g., 25"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                type="button"
                variant="dark-ghost"
                size="sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark-primary"
                size="sm"
                disabled={isSubmitting}
                leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
