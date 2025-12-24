"use client";

import { useState, useCallback } from "react";
import { XCircle, Upload, File, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { DocumentType } from "../types";

interface DocumentUploadModalProps {
  organizationId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function DocumentUploadModal({
  organizationId,
  onClose,
  onSuccess,
}: DocumentUploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState<DocumentType>("registration");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useCallback((node: HTMLInputElement | null) => {
    if (node) {
      node.value = "";
    }
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    // Validate file size (10MB)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedFile.type)) {
      setError("File must be PDF, JPEG, PNG, or WebP");
      return;
    }

    setFile(selectedFile);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!file) {
      setError("Please select a file");
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("organizationId", organizationId);
      formData.append("documentType", documentType);
      if (description.trim()) {
        formData.append("description", description.trim());
      }

      const res = await fetch("/api/verification/documents", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to upload document");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload document");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-slate-900 border border-slate-700 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-display text-marble-100">Upload Document</h2>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              <XCircle className="w-5 h-5" />
            </button>
          </div>

          <p className="text-sm text-slate-400 mb-4">
            Upload a document that proves your ownership of this organization. Accepted formats:
            PDF, JPEG, PNG, WebP (max 10MB).
          </p>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded p-3 mb-4 text-sm text-red-400 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* File Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document File *
              </label>
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  file
                    ? "border-gold-500/50 bg-gold-500/5"
                    : "border-slate-700 hover:border-slate-600"
                }`}
              >
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <File className="w-6 h-6 text-gold-400" />
                    <span className="text-marble-200 text-sm">{file.name}</span>
                    <button
                      type="button"
                      onClick={() => setFile(null)}
                      className="text-slate-400 hover:text-red-400"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <Upload className="w-8 h-8 text-slate-500 mx-auto mb-2" />
                    <p className="text-sm text-slate-400 mb-2">Click to select or drag and drop</p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png,.webp"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </>
                )}
              </div>
            </div>

            {/* Document Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Document Type *
              </label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value as DocumentType)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 focus:outline-none focus:border-gold-500"
              >
                <option value="registration">Registration Certificate</option>
                <option value="extract">Registry Extract (EGRUL, etc.)</option>
                <option value="charter">Company Charter</option>
                <option value="shareholder_list">Shareholder List</option>
                <option value="other">Other Document</option>
              </select>
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Any additional notes about this document..."
                rows={2}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-sm text-marble-100 placeholder-slate-500 focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-700">
              <Button
                type="button"
                variant="dark-ghost"
                size="sm"
                onClick={onClose}
                disabled={isUploading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="dark-primary"
                size="sm"
                disabled={isUploading || !file}
                leftIcon={
                  isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )
                }
              >
                {isUploading ? "Uploading..." : "Upload"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
