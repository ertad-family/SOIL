-- Create job_listings table for careers page
-- Jobs are managed via SQL/Supabase dashboard (no admin panel yet)

CREATE TABLE IF NOT EXISTS job_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL, -- supports markdown
  requirements TEXT, -- qualifications/skills
  location TEXT NOT NULL DEFAULT 'Remote', -- e.g., "Remote", "New York, NY"
  employment_type TEXT NOT NULL DEFAULT 'Full-time', -- e.g., "Full-time", "Part-time", "Contract"
  department TEXT, -- e.g., "Engineering", "Research", "Operations"
  salary_range TEXT, -- optional, e.g., "$80k-$120k"
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'open', 'closed')),
  application_email TEXT NOT NULL DEFAULT 'careers@soil.rip',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_job_listings_status ON job_listings(status);
CREATE INDEX idx_job_listings_department ON job_listings(department);
CREATE INDEX idx_job_listings_created_at ON job_listings(created_at DESC);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_job_listings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER job_listings_updated_at_trigger
  BEFORE UPDATE ON job_listings
  FOR EACH ROW
  EXECUTE FUNCTION update_job_listings_updated_at();

-- Row Level Security
ALTER TABLE job_listings ENABLE ROW LEVEL SECURITY;

-- Everyone can view open job listings (public page)
CREATE POLICY "Anyone can view open jobs"
  ON job_listings FOR SELECT
  USING (status = 'open');

-- Admins can view all job listings (including draft/closed)
CREATE POLICY "Admins can view all jobs"
  ON job_listings FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Admins can insert/update/delete job listings
CREATE POLICY "Admins can manage jobs"
  ON job_listings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access"
  ON job_listings FOR ALL
  USING (auth.role() = 'service_role');

-- Insert sample job listings for initial launch
INSERT INTO job_listings (title, description, requirements, location, employment_type, department, status) VALUES
(
  'Founding Engineer',
  E'## About the Role\n\nWe''re looking for a founding engineer to help build the core infrastructure for SOIL. You''ll work directly with the founding team to shape the technical direction of the platform.\n\n## What You''ll Do\n\n- Design and implement core platform features\n- Build scalable data pipelines for organizational autopsy data\n- Create beautiful, accessible user interfaces\n- Contribute to technical architecture decisions\n\n## Why Join Us\n\n- Ground-floor opportunity at a mission-driven startup\n- Direct impact on product direction\n- Work on a unique problem space (organizational mortality)',
  E'- 3+ years of experience with React, TypeScript, and Node.js\n- Experience with Next.js and Supabase/PostgreSQL\n- Strong understanding of web performance and accessibility\n- Passion for the mission of preserving organizational knowledge',
  'Remote (UTC-5 to UTC+3)',
  'Full-time',
  'Engineering',
  'open'
),
(
  'Research Lead',
  E'## About the Role\n\nLead our research efforts in organizational mortality patterns. You''ll analyze autopsy data, develop frameworks, and publish findings that advance the field of organizational medicine.\n\n## What You''ll Do\n\n- Design and execute research studies on organizational failure patterns\n- Develop analytical frameworks for autopsy data\n- Publish research papers and contribute to academic discourse\n- Collaborate with university partners\n\n## Why Join Us\n\n- Access to unique dataset of organizational autopsies\n- Shape a new field of organizational medicine\n- Academic publishing opportunities',
  E'- PhD or equivalent research experience\n- Background in organizational behavior, economics, or related field\n- Strong quantitative analysis skills\n- Track record of published research',
  'Remote',
  'Full-time',
  'Research',
  'open'
),
(
  'Community Manager',
  E'## About the Role\n\nBuild and nurture our global community of founders, researchers, and Keepers. You''ll be the voice of SOIL and help create meaningful connections between members.\n\n## What You''ll Do\n\n- Moderate community channels and forums\n- Organize virtual and local events\n- Develop community programs and initiatives\n- Support Keeper onboarding and engagement\n\n## Why Join Us\n\n- Build a community around a meaningful mission\n- Connect with founders worldwide\n- Shape community culture from the ground up',
  E'- 2+ years of community management experience\n- Excellent written and verbal communication\n- Experience with Discord, Slack, or similar platforms\n- Empathy and understanding of founder experiences',
  'Remote',
  'Part-time',
  'Operations',
  'open'
);
