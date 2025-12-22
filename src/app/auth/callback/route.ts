import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { type NextRequest } from "next/server";

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
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (exchangeError) {
      const errorMessage = encodeURIComponent(exchangeError.message);
      return NextResponse.redirect(new URL(`/login?error=${errorMessage}`, request.url));
    }

    // Successfully authenticated - redirect to account
    return NextResponse.redirect(new URL("/account", request.url));
  }

  // No code provided - redirect to login
  return NextResponse.redirect(new URL("/login", request.url));
}
