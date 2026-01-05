-- Create researchers table for Research Atlas
-- Part of issue #259: Epic: Research Atlas & Outreach (Phase 3)

-- ============================================================================
-- RESEARCHERS TABLE: Academic researchers in organizational mortality field
-- ============================================================================

-- Enum for consent status
CREATE TYPE researcher_consent_status AS ENUM ('pending', 'opted_in', 'declined');

-- Enum for disciplines (the 12 Lenses framework)
CREATE TYPE research_discipline AS ENUM (
  'biology',
  'ecology',
  'economics',
  'sociology',
  'psychology',
  'political_science',
  'anthropology',
  'cybernetics',
  'systems_theory',
  'information_theory',
  'evolutionary_theory',
  'medicine'
);

CREATE TABLE researchers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  institution TEXT NOT NULL,
  discipline research_discipline NOT NULL,
  tier INTEGER NOT NULL DEFAULT 2 CHECK (tier >= 1 AND tier <= 3),

  -- Profile content
  bio TEXT,
  key_works TEXT[], -- array of notable publications/books
  soil_relevance TEXT, -- how their work connects to SOIL

  -- Contact info (internal use)
  email TEXT,
  website_url TEXT,

  -- Consent tracking
  consent_status researcher_consent_status NOT NULL DEFAULT 'pending',
  consent_date TIMESTAMPTZ,

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_researchers_discipline ON researchers(discipline);
CREATE INDEX idx_researchers_tier ON researchers(tier);
CREATE INDEX idx_researchers_consent ON researchers(consent_status);
CREATE INDEX idx_researchers_name ON researchers(name);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_researchers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER researchers_updated_at_trigger
  BEFORE UPDATE ON researchers
  FOR EACH ROW
  EXECUTE FUNCTION update_researchers_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================
ALTER TABLE researchers ENABLE ROW LEVEL SECURITY;

-- Anyone can view researchers (public page)
CREATE POLICY "Anyone can view researchers"
  ON researchers FOR SELECT
  USING (true);

-- Admins can manage researchers
CREATE POLICY "Admins can manage researchers"
  ON researchers FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access"
  ON researchers FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- SEED DATA: Initial researchers from Academic Outreach Strategy
-- ============================================================================
INSERT INTO researchers (name, institution, discipline, tier, bio, key_works, soil_relevance, email, website_url) VALUES
-- Systems Theory / Company Mortality
(
  'Geoffrey West',
  'Santa Fe Institute',
  'systems_theory',
  1,
  'Distinguished Professor, former SFI President. Studies scaling laws in biological and social systems. Author of "Scale: The Universal Laws of Growth, Innovation, Sustainability, and the Pace of Life in Organisms, Cities, Economies, and Companies".',
  ARRAY['The Mortality of Companies (2015)', 'Scale (2017)'],
  'His team published "The Mortality of Companies" showing ~10-year half-life for public companies. His quantitative work is the complement to SOIL''s qualitative autopsy approach.',
  NULL,
  'https://www.santafe.edu/people/profile/geoffrey-west'
),
-- Psychology / Entrepreneurial Grief
(
  'Dean Shepherd',
  'University of Notre Dame',
  'psychology',
  1,
  '2025 Global Award for Entrepreneurship Research. Studies grief from business failure using oscillation model: loss-oriented vs. restoration-oriented coping.',
  ARRAY['Learning from Business Failure (2003)', 'Entrepreneurial Failure: A Review and Integration'],
  'His grief framework is embedded in SOIL''s interview design. The single most relevant researcher for SOIL''s therapeutic component.',
  NULL,
  'https://mendoza.nd.edu/faculty/dean-shepherd/'
),
-- Organizational Ecology
(
  'Glenn Carroll',
  'Stanford Graduate School of Business',
  'ecology',
  1,
  'Co-creator of organizational ecology with Michael Hannan. Studies population-level dynamics including density dependence and liability of newness/aging.',
  ARRAY['The Demography of Corporations and Industries (1992)', 'Organizational Ecology papers'],
  'Population-level analysis requires exactly the kind of systematic mortality data SOIL collects. His work provides theoretical foundation for organizational mortality.',
  NULL,
  'https://www.gsb.stanford.edu/faculty-research/faculty/glenn-r-carroll'
),
-- Psychology / Failure Typology
(
  'Amy Edmondson',
  'Harvard Business School',
  'psychology',
  1,
  'Novartis Professor of Leadership and Management. Studies psychological safety, learning from failure. Created failure typology: preventable, complexity-related, intelligent.',
  ARRAY['Strategies for Learning from Failure (2011)', 'The Fearless Organization (2018)'],
  'Her failure typology provides framework for categorizing failure types in SOIL data.',
  NULL,
  'https://www.hbs.edu/faculty/Pages/profile.aspx?facId=6451'
),
-- Systems Theory / MIT System Dynamics
(
  'John Sterman',
  'MIT Sloan School of Management',
  'systems_theory',
  2,
  'Jay W. Forrester Professor of Management, Director of MIT System Dynamics Group. Specializes in organizational dynamics and feedback loops.',
  ARRAY['Business Dynamics: Systems Thinking and Modeling for a Complex World', 'System dynamics papers'],
  'Understanding how organizational decline cascades through feedback mechanisms.',
  NULL,
  'https://mitsloan.mit.edu/faculty/directory/john-d-sterman'
),
-- Psychology (European)
(
  'Holger Patzelt',
  'Technical University of Munich',
  'psychology',
  2,
  'Frequent Dean Shepherd co-author. Studies entrepreneurial failure and stigma with focus on cultural context.',
  ARRAY['Entrepreneurial Failure and Stigma papers', 'Psychology of Entrepreneurship research'],
  'European perspective on grief and failure, methodological rigor, extends Shepherd''s work.',
  NULL,
  'https://www.mgt.tum.de/faculty/holger-patzelt'
),
-- Medicine / History of Medicine
(
  'Jeremy Greene',
  'Johns Hopkins University',
  'medicine',
  1,
  'William H. Welch Professor of Medicine and History of Medicine. Director, Institute of the History of Medicine and Center for Medical Humanities.',
  ARRAY['Generic: The Unbranding of Modern Medicine', 'History of medicine papers'],
  'Understands how autopsies created medical knowledge and epistemology of diagnosis. Key for building "Organizational Medicine".',
  NULL,
  'https://www.hopkinsmedicine.org/profiles/details/jeremy-greene'
),
-- Ecology
(
  'Howard Aldrich',
  'University of North Carolina Chapel Hill',
  'ecology',
  2,
  'Emeritus professor. Evolutionary perspective on organizations. More accessible approach than Hannan/Carroll.',
  ARRAY['Organizations Evolving (1999)', 'Entrepreneurship research'],
  'Evolutionary view aligns with SOIL''s biological metaphor. Interested in applied work.',
  NULL,
  'https://sociology.unc.edu/people-page/howard-aldrich/'
),
-- Sociology
(
  'Ezra Zuckerman Sivan',
  'MIT Sloan School of Management',
  'sociology',
  2,
  'Alvin J. Siteman Professor of Strategy and Entrepreneurship. Studies economic sociology, legitimacy, and categorical boundaries.',
  ARRAY['Economic Sociology papers', 'Organization theory research'],
  'Understanding how organizations gain and lose legitimacy.',
  NULL,
  'https://mitsloan.mit.edu/faculty/directory/ezra-zuckerman-sivan'
),
-- Psychology / Entrepreneurial Identity
(
  'Melissa Cardon',
  'University of Tennessee',
  'psychology',
  2,
  'Studies entrepreneurial passion and identity. Explains why failure is traumatic - identity loss, not just business loss.',
  ARRAY['The Nature and Experience of Entrepreneurial Passion (2009)', 'Entrepreneurial identity papers'],
  'Understanding emotional stakes of organizational death beyond financial loss.',
  NULL,
  NULL
),
-- Systems Theory (MIT)
(
  'Hazhir Rahmandad',
  'MIT Sloan School of Management',
  'systems_theory',
  2,
  'Schussel Family Professor of Management Science. Research on complex organizational dynamics.',
  ARRAY['System dynamics modeling papers', 'Organizational dynamics research'],
  'Modeling organizational heterogeneity and decline patterns.',
  NULL,
  'https://mitsloan.mit.edu/faculty/directory/hazhir-rahmandad'
),
-- Ecology
(
  'Martin Ruef',
  'Duke University',
  'ecology',
  2,
  'Studies organizational emergence and entrepreneurship with quantitative analysis.',
  ARRAY['Organizational emergence papers', 'Entrepreneurship research'],
  'Interested in both birth and death of organizations, methodologically rigorous.',
  NULL,
  'https://scholars.duke.edu/person/martin.ruef'
),
-- Systems Theory (European)
(
  'Stefan Thurner',
  'Complexity Science Hub Vienna',
  'systems_theory',
  3,
  'Author of "Introduction to the Theory of Complex Systems" (2018). European academic base.',
  ARRAY['Introduction to the Theory of Complex Systems (2018)'],
  'Theoretical foundation for complexity analysis of organizational systems.',
  NULL,
  'https://www.csh.ac.at/researcher/stefan-thurner/'
),
-- Medicine / History
(
  'Allan Brandt',
  'Harvard University',
  'medicine',
  2,
  'Amalie Moses Kass Professor of the History of Medicine. Studies how medicine evolves from social context.',
  ARRAY['History of medicine research', 'Social history of health'],
  'Parallel between medical history and organizational medicine emergence.',
  NULL,
  'https://history.fas.harvard.edu/people/allan-brandt'
);
