"use client";

import { useState, useEffect } from "react";
import { Settings, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import type { ProjectSetting } from "@/lib/settings";

// =============================================================================
// TYPES
// =============================================================================

interface SettingsData {
  settings: ProjectSetting[];
  byCategory: Record<string, ProjectSetting[]>;
}

type SaveStatus = "idle" | "saving" | "saved" | "error";

// =============================================================================
// CATEGORY LABELS
// =============================================================================

const CATEGORY_LABELS: Record<string, string> = {
  features: "Feature Flags",
  cenotapheries: "Cenotapheries",
  system: "System",
  general: "General",
};

const CATEGORY_ORDER = ["features", "cenotapheries", "system", "general"];

// =============================================================================
// SETTING EDITOR COMPONENT
// =============================================================================

interface SettingEditorProps {
  setting: ProjectSetting;
  onSave: (key: string, value: unknown) => Promise<void>;
}

function SettingEditor({ setting, onSave }: SettingEditorProps) {
  const [value, setValue] = useState(setting.value);
  const [status, setStatus] = useState<SaveStatus>("idle");

  // Determine value type
  const valueType = typeof setting.value;
  const isBoolean =
    valueType === "boolean" || setting.value === "true" || setting.value === "false";
  const isNumber = valueType === "number" || (!isBoolean && !isNaN(Number(setting.value)));

  // Parse initial value for booleans stored as strings
  const boolValue = isBoolean ? setting.value === true || setting.value === "true" : false;

  const handleToggle = async () => {
    const newValue = !boolValue;
    setStatus("saving");
    try {
      await onSave(setting.key, newValue);
      setValue(newValue);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  const handleNumberSave = async () => {
    const numValue = Number(value);
    if (isNaN(numValue)) return;

    setStatus("saving");
    try {
      await onSave(setting.key, numValue);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2000);
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="flex items-center justify-between py-4 border-b border-slate-800 last:border-0">
      <div className="flex-1 pr-4">
        <h4 className="text-sm font-medium text-marble-100">
          {setting.key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
        </h4>
        {setting.description && (
          <p className="text-xs text-slate-500 mt-1">{setting.description}</p>
        )}
        {setting.updated_at && (
          <p className="text-xs text-slate-600 mt-1">
            Updated: {new Date(setting.updated_at).toLocaleString()}
          </p>
        )}
      </div>

      <div className="flex items-center gap-3">
        {/* Status indicator */}
        {status === "saving" && <Loader2 className="w-4 h-4 text-gold-500 animate-spin" />}
        {status === "saved" && <CheckCircle className="w-4 h-4 text-green-500" />}
        {status === "error" && <AlertCircle className="w-4 h-4 text-red-500" />}

        {/* Boolean toggle */}
        {isBoolean && (
          <button
            onClick={handleToggle}
            disabled={status === "saving"}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              boolValue ? "bg-gold-500" : "bg-slate-700"
            } ${status === "saving" ? "opacity-50" : ""}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                boolValue ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        )}

        {/* Number input */}
        {isNumber && !isBoolean && (
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={value as number}
              onChange={(e) => setValue(Number(e.target.value))}
              className="w-24 px-3 py-1.5 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
            />
            <button
              onClick={handleNumberSave}
              disabled={status === "saving" || value === setting.value}
              className="p-1.5 bg-gold-500 hover:bg-gold-600 disabled:bg-slate-700 disabled:text-slate-500 text-slate-900 rounded transition-colors"
            >
              <Save className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN PAGE
// =============================================================================

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const result = await response.json();

      if (result.success) {
        setData(result.data);
      } else {
        setError(result.error || "Failed to load settings");
      }
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (key: string, value: unknown) => {
    const response = await fetch("/api/admin/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key, value }),
    });

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.error);
    }

    // Refresh settings
    await fetchSettings();
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Settings className="w-6 h-6 text-gold-500" />
          <h1 className="text-2xl font-display text-marble-100">Project Settings</h1>
        </div>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse"
            >
              <div className="h-5 w-32 bg-slate-700 rounded mb-4" />
              <div className="space-y-4">
                {[1, 2].map((j) => (
                  <div key={j} className="flex justify-between">
                    <div className="h-4 w-48 bg-slate-800 rounded" />
                    <div className="h-6 w-11 bg-slate-800 rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 text-center">
          <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchSettings();
            }}
            className="mt-4 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Sort categories
  const sortedCategories = CATEGORY_ORDER.filter((cat) => data?.byCategory[cat]?.length);

  return (
    <div className="container mx-auto px-6 py-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Settings className="w-6 h-6 text-gold-500" />
        <h1 className="text-2xl font-display text-marble-100">Project Settings</h1>
      </div>

      <p className="text-slate-400 mb-8">
        Configure project-wide settings. Changes take effect immediately.
      </p>

      {/* Settings by category */}
      <div className="space-y-6">
        {sortedCategories.map((category) => (
          <div
            key={category}
            className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden"
          >
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/80">
              <h2 className="text-lg font-medium text-marble-100">
                {CATEGORY_LABELS[category] || category}
              </h2>
            </div>
            <div className="px-6">
              {data?.byCategory[category]?.map((setting) => (
                <SettingEditor key={setting.key} setting={setting} onSave={handleSave} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
