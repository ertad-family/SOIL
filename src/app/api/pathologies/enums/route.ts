import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

interface EnumValue {
  enum_type: string;
  value: string;
  label: string;
  description: string | null;
  icon_name: string | null;
  sort_order: number;
}

interface EnumResponse {
  localizations: {
    value: string;
    label: string;
    description: string | null;
    icon_name: string | null;
  }[];
  etiologies: { value: string; label: string; description: string | null }[];
  courses: { value: string; label: string; description: string | null; icon_name: string | null }[];
  functionalImpairments: { value: string; label: string; description: string | null }[];
}

export async function GET() {
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    const { data, error } = await supabase
      .from("pathology_enum_values")
      .select("*")
      .order("sort_order");

    if (error) {
      throw new Error(`Failed to fetch enum values: ${error.message}`);
    }

    // Group by enum_type
    const grouped: EnumResponse = {
      localizations: [],
      etiologies: [],
      courses: [],
      functionalImpairments: [],
    };

    for (const item of data as EnumValue[]) {
      const mapped = {
        value: item.value,
        label: item.label,
        description: item.description,
        icon_name: item.icon_name,
      };

      switch (item.enum_type) {
        case "localization":
          grouped.localizations.push(mapped);
          break;
        case "etiology":
          grouped.etiologies.push(mapped);
          break;
        case "course":
          grouped.courses.push(mapped);
          break;
        case "functional_impairment":
          grouped.functionalImpairments.push(mapped);
          break;
      }
    }

    return NextResponse.json(grouped);
  } catch (error) {
    console.error("Error fetching enum values:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch enum values" },
      { status: 500 }
    );
  }
}
