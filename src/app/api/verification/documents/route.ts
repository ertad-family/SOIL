import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Document types allowed
const ALLOWED_DOCUMENT_TYPES = ["registration", "extract", "charter", "shareholder_list", "other"];

// File validation
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

// POST /api/verification/documents - Upload a verification document
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const organizationId = formData.get("organizationId") as string | null;
    const documentType = formData.get("documentType") as string | null;
    const description = formData.get("description") as string | null;

    // Validate required fields
    if (!file) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    if (!documentType || !ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
      return NextResponse.json(
        { error: `documentType must be one of: ${ALLOWED_DOCUMENT_TYPES.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File size must be less than 10MB" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "File type must be PDF, JPEG, PNG, or WebP" },
        { status: 400 }
      );
    }

    // Check organization ownership
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id, created_by")
      .eq("id", organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Generate unique file path
    const fileExtension = file.name.split(".").pop()?.toLowerCase() || "pdf";
    const timestamp = Date.now();
    const filePath = `${organizationId}/${timestamp}_${Math.random().toString(36).substring(7)}.${fileExtension}`;

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("verification-documents")
      .upload(filePath, file, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      // Check if bucket doesn't exist
      if (uploadError.message.includes("Bucket not found")) {
        return NextResponse.json(
          { error: "Storage not configured. Please contact support." },
          { status: 500 }
        );
      }
      return NextResponse.json({ error: "Failed to upload file" }, { status: 500 });
    }

    // Create document record
    const { data: document, error: insertError } = await supabase
      .from("verification_documents")
      .insert({
        organization_id: organizationId,
        uploaded_by: user.id,
        file_path: uploadData.path,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
        document_type: documentType,
        description: description?.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      // Try to clean up uploaded file
      await supabase.storage.from("verification-documents").remove([filePath]);

      console.error("Database insert error:", insertError);
      return NextResponse.json({ error: "Failed to save document record" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      document,
      message: "Document uploaded successfully. It will be reviewed shortly.",
    });
  } catch (err) {
    console.error("Document upload error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/verification/documents?organizationId=xxx - Get documents for organization
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const organizationId = searchParams.get("organizationId");

    if (!organizationId) {
      return NextResponse.json({ error: "organizationId is required" }, { status: 400 });
    }

    // Check organization ownership
    const { data: organization, error: orgError } = await supabase
      .from("organizations")
      .select("id, created_by")
      .eq("id", organizationId)
      .single();

    if (orgError || !organization) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    if (organization.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Get documents
    const { data: documents, error: docsError } = await supabase
      .from("verification_documents")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false });

    if (docsError) {
      console.error("Failed to fetch documents:", docsError);
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
    }

    return NextResponse.json({ documents });
  } catch (err) {
    console.error("Documents GET error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/verification/documents?id=xxx - Delete a pending document
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Check auth
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const documentId = searchParams.get("id");

    if (!documentId) {
      return NextResponse.json({ error: "Document id is required" }, { status: 400 });
    }

    // Get document to verify ownership and get file path
    const { data: document, error: docError } = await supabase
      .from("verification_documents")
      .select(
        `
        id,
        file_path,
        status,
        organization:organizations (
          id,
          created_by
        )
      `
      )
      .eq("id", documentId)
      .single();

    if (docError || !document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    // Check ownership
    const org = document.organization as unknown as { id: string; created_by: string } | null;
    if (!org || org.created_by !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Can only delete pending documents
    if (document.status !== "pending_review") {
      return NextResponse.json(
        { error: "Cannot delete documents that have been reviewed" },
        { status: 400 }
      );
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("verification-documents")
      .remove([document.file_path]);

    if (storageError) {
      console.error("Storage delete error:", storageError);
      // Continue anyway - document record deletion is more important
    }

    // Delete record
    const { error: deleteError } = await supabase
      .from("verification_documents")
      .delete()
      .eq("id", documentId);

    if (deleteError) {
      console.error("Delete error:", deleteError);
      return NextResponse.json({ error: "Failed to delete document" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (err) {
    console.error("Document delete error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
