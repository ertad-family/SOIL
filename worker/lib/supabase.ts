import { createClient } from "@supabase/supabase-js";

// Supabase client with service role key for server-side operations
// This bypasses RLS policies, so use carefully
export function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables");
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

// Types for verification requests
export interface VerificationRequest {
  id: string;
  organization_id: string;
  requester_id: string;
  verifier_email: string;
  verifier_name: string | null;
  relationship: string;
  relationship_details: string | null;
  status: string;
  token: string;
  created_at: string;
  expires_at: string;
  responded_at: string | null;
  response_message: string | null;
  requester_name: string | null;
  claimed_role: string | null;
  // Email tracking columns
  email_sent_at: string | null;
  email_error: string | null;
  email_error_type: "resend_error" | "recipient_error" | null;
  retry_count: number;
  next_retry_at: string | null;
}

export interface Organization {
  id: string;
  name: string;
  location: string | null;
  started_at: string | null;
  closed_at: string | null;
}

// Query result type for pending emails
export interface PendingEmailRequest extends VerificationRequest {
  organization: Organization;
}
