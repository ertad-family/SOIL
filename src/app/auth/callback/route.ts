import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";
import { cookies } from "next/headers";
import { getVisitorFingerprint } from "@/lib/visitor";
import { isValidToken } from "@/lib/tokens";

// Cookie name for referral token (must match middleware)
const REF_COOKIE_NAME = "soil_ref";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  // Handle OAuth errors (e.g., user denied access)
  if (error) {
    const errorMessage = encodeURIComponent(errorDescription || error);
    return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
  }

  if (code) {
    const supabase = await createClient();
    const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const errorMessage = encodeURIComponent(exchangeError.message);
      return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
    }

    // Track login/signup event
    if (data?.user) {
      const visitorFingerprint = await getVisitorFingerprint();
      const isNewUser = data.user.created_at === data.user.last_sign_in_at;
      const eventName = isNewUser ? "signup" : "login";

      // Insert analytics event
      await supabase.from("analytics_events").insert({
        event_name: eventName,
        event_category: "auth",
        user_id: data.user.id,
        visitor_fingerprint: visitorFingerprint,
        properties: {
          provider: data.user.app_metadata?.provider || "email",
        },
      });

      // Check for referral token and track conversion
      if (isNewUser) {
        const cookieStore = await cookies();
        const refCookie = cookieStore.get(REF_COOKIE_NAME);

        if (refCookie?.value && isValidToken(refCookie.value)) {
          // Track signup conversion from referral
          await supabase.from("token_events").insert({
            token: refCookie.value,
            event_type: "signup",
            visitor_fingerprint: visitorFingerprint,
            user_id: data.user.id,
          });
        }
      }
    }

    // Successfully authenticated - redirect to account
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}
