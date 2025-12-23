import { NextResponse } from "next/server";

/**
 * GET /api/exchange/rate?from=EUR&to=USD
 *
 * Fetches exchange rate from ExchangeRate-API
 * Free tier: 1500 requests/month
 *
 * Returns: { rate: number, date: string }
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from")?.toUpperCase() || "USD";
  const to = searchParams.get("to")?.toUpperCase() || "USD";

  // Same currency = rate of 1
  if (from === to) {
    return NextResponse.json({
      rate: 1,
      date: new Date().toISOString(),
      from,
      to,
    });
  }

  const apiKey = process.env.EXCHANGERATE_API_KEY;

  if (!apiKey) {
    console.error("EXCHANGERATE_API_KEY not configured");
    return NextResponse.json({ error: "Exchange rate service not configured" }, { status: 503 });
  }

  try {
    const response = await fetch(
      `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${from}/${to}`,
      { next: { revalidate: 3600 } } // Cache for 1 hour
    );

    if (!response.ok) {
      throw new Error(`ExchangeRate-API returned ${response.status}`);
    }

    const data = await response.json();

    if (data.result !== "success") {
      throw new Error(data["error-type"] || "Unknown API error");
    }

    return NextResponse.json({
      rate: data.conversion_rate,
      date: data.time_last_update_utc,
      from: data.base_code,
      to: data.target_code,
    });
  } catch (error) {
    console.error("Exchange rate fetch failed:", error);
    return NextResponse.json({ error: "Failed to fetch exchange rate" }, { status: 502 });
  }
}
