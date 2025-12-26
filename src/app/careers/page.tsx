import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { CareersContent } from "./careers-content";

export const metadata: Metadata = {
  title: "Careers | SOIL",
  description:
    "Join the team building the infrastructure for organizational medicine. View open positions at SOIL.",
  openGraph: {
    title: "Careers at SOIL",
    description:
      "Join the team building the infrastructure for organizational medicine. View open positions.",
    type: "website",
  },
};

export interface JobListing {
  id: string;
  title: string;
  description: string;
  requirements: string | null;
  location: string;
  employment_type: string;
  department: string | null;
  salary_range: string | null;
  application_email: string;
  created_at: string;
}

async function getJobListings(): Promise<JobListing[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("job_listings")
    .select(
      "id, title, description, requirements, location, employment_type, department, salary_range, application_email, created_at"
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching job listings:", error);
    return [];
  }

  return data || [];
}

export default async function CareersPage() {
  const jobs = await getJobListings();

  return <CareersContent jobs={jobs} />;
}
