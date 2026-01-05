-- Create research_datasets table for Dataset Registry
-- Part of issue #258: Epic: Research Knowledge Base (Phase 2)

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Dataset category enum
CREATE TYPE dataset_category AS ENUM (
  'government',    -- Government registries (BLS, Companies House, Eurostat)
  'academic',      -- Academic datasets (Kauffman, PSED, GEM)
  'industry',      -- Industry sources (CB Insights, PitchBook, Crunchbase)
  'qualitative'    -- Qualitative archives (HBS Cases, Failure Museum)
);

-- Dataset access type enum
CREATE TYPE dataset_access AS ENUM (
  'open',          -- Free public access
  'restricted',    -- Requires registration/application
  'paid'           -- Commercial/subscription
);

-- ============================================================================
-- RESEARCH_DATASETS TABLE
-- ============================================================================

CREATE TABLE research_datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Basic info
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,  -- URL-friendly identifier
  url TEXT NOT NULL,
  description TEXT NOT NULL,

  -- Classification
  category dataset_category NOT NULL,
  access dataset_access NOT NULL,

  -- Coverage (JSONB for flexibility)
  -- Example: {"geography": ["USA", "EU"], "time_period": "1994-present", "org_types": ["startups", "SMEs"]}
  coverage JSONB NOT NULL DEFAULT '{}',

  -- Details
  granularity TEXT,           -- "firm-level", "industry-level", "aggregated"
  limitations TEXT[],         -- Array of known limitations
  related_publications TEXT[],-- DOIs or titles of papers using this dataset
  compatible_with TEXT[],     -- Slugs of compatible datasets

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_research_datasets_category ON research_datasets(category);
CREATE INDEX idx_research_datasets_access ON research_datasets(access);
CREATE INDEX idx_research_datasets_slug ON research_datasets(slug);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_research_datasets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER research_datasets_updated_at_trigger
  BEFORE UPDATE ON research_datasets
  FOR EACH ROW
  EXECUTE FUNCTION update_research_datasets_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================
ALTER TABLE research_datasets ENABLE ROW LEVEL SECURITY;

-- Anyone can view datasets (public page)
CREATE POLICY "Anyone can view research datasets"
  ON research_datasets FOR SELECT
  USING (true);

-- Admins can manage datasets
CREATE POLICY "Admins can manage research datasets"
  ON research_datasets FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access to research datasets"
  ON research_datasets FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- SEED DATA: Initial datasets from issue #258
-- ============================================================================
INSERT INTO research_datasets (name, slug, url, description, category, access, coverage, granularity, limitations, related_publications, compatible_with) VALUES

-- Government Registries
(
  'US Bureau of Labor Statistics (BLS)',
  'us-bls',
  'https://www.bls.gov/bdm/',
  'Business Employment Dynamics (BED) program tracks establishment births, deaths, expansions, and contractions in the US economy. Quarterly data derived from Quarterly Census of Employment and Wages (QCEW).',
  'government',
  'open',
  '{"geography": ["USA"], "time_period": "1992-present", "org_types": ["all private sector establishments"]}',
  'establishment-level (aggregated)',
  ARRAY[
    'Only covers establishments with employees (excludes self-employed)',
    'Quarterly lag in data release',
    'Cannot distinguish permanent closures from relocations',
    'No information on causes of closure'
  ],
  ARRAY[
    'Haltiwanger et al. (2013) - Who Creates Jobs?',
    'Decker et al. (2014) - The Role of Entrepreneurship in US Job Creation'
  ],
  ARRAY['eurostat-business-demography', 'kauffman-firm-survey']
),

(
  'UK Companies House',
  'uk-companies-house',
  'https://www.gov.uk/government/organisations/companies-house',
  'Official register of UK companies. Contains incorporation, dissolution, and filing data for all registered companies in the United Kingdom. Over 4 million active companies.',
  'government',
  'open',
  '{"geography": ["UK"], "time_period": "1844-present", "org_types": ["limited companies", "LLPs", "partnerships"]}',
  'firm-level',
  ARRAY[
    'Limited financial data for small companies',
    'Delayed filing means some dissolved companies appear active',
    'No information on informal businesses',
    'Quality of data depends on company compliance'
  ],
  ARRAY[
    'Helmers & Rogers (2010) - Innovation and the Survival of New Firms',
    'Disney et al. (2003) - Restructuring and Productivity Growth in UK Manufacturing'
  ],
  ARRAY['eurostat-business-demography']
),

(
  'Eurostat Business Demography',
  'eurostat-business-demography',
  'https://ec.europa.eu/eurostat/web/structural-business-statistics/business-demography',
  'Harmonized statistics on business births, deaths, and survival rates across EU member states. Part of Structural Business Statistics framework.',
  'government',
  'open',
  '{"geography": ["EU member states"], "time_period": "2004-present", "org_types": ["enterprises with employees"]}',
  'aggregated (country/sector level)',
  ARRAY[
    'Aggregated data only - no firm-level access',
    'Harmonization challenges across countries',
    '2-3 year publication lag',
    'Definition variations between member states'
  ],
  ARRAY[
    'Bartelsman et al. (2005) - Comparative Analysis of Firm Demographics',
    'Bravo-Biosca (2010) - Growth Dynamics'
  ],
  ARRAY['us-bls', 'uk-companies-house']
),

-- Academic Datasets
(
  'Kauffman Firm Survey',
  'kauffman-firm-survey',
  'https://www.kauffman.org/entrepreneurship/research/kauffman-firm-survey/',
  'Longitudinal study tracking nearly 5,000 US businesses founded in 2004 through 2011. Rich data on financing, employment, innovation, and founder characteristics.',
  'academic',
  'restricted',
  '{"geography": ["USA"], "time_period": "2004-2011", "org_types": ["new employer businesses founded in 2004"]}',
  'firm-level',
  ARRAY[
    'Single cohort (2004 startups only)',
    'Attrition over survey waves',
    'Self-reported data subject to recall bias',
    'Requires data use agreement'
  ],
  ARRAY[
    'Robb & Robinson (2014) - The Capital Structure Decisions of New Firms',
    'Fairlie et al. (2019) - Using Proprietary Business Data'
  ],
  ARRAY['psed', 'us-bls']
),

(
  'Panel Study of Entrepreneurial Dynamics (PSED)',
  'psed',
  'https://www.psed.isr.umich.edu/',
  'Two-wave panel study (PSED I: 1998-2003, PSED II: 2005-2012) tracking nascent entrepreneurs through the startup process. Rich psychological and process data.',
  'academic',
  'restricted',
  '{"geography": ["USA"], "time_period": "1998-2003 (I), 2005-2012 (II)", "org_types": ["nascent ventures"]}',
  'individual/venture-level',
  ARRAY[
    'Focus on nascent stage - limited follow-up after founding',
    'Two separate panels, not continuous',
    'Survey fatigue led to attrition',
    'Complex sampling methodology'
  ],
  ARRAY[
    'Reynolds (2007) - New Firm Creation in the United States',
    'Davidsson & Gordon (2012) - Panel Studies of New Venture Creation'
  ],
  ARRAY['kauffman-firm-survey', 'gem']
),

(
  'Global Entrepreneurship Monitor (GEM)',
  'gem',
  'https://www.gemconsortium.org/',
  'Annual survey covering 100+ countries measuring entrepreneurial activity, attitudes, and aspirations. Includes Total Early-stage Entrepreneurial Activity (TEA) rates.',
  'academic',
  'open',
  '{"geography": ["100+ countries"], "time_period": "1999-present", "org_types": ["nascent and new businesses"]}',
  'individual-level (aggregated)',
  ARRAY[
    'Cross-sectional design limits causal inference',
    'Country coverage varies by year',
    'Self-reported entrepreneurial intentions',
    'Limited firm-level outcome data'
  ],
  ARRAY[
    'Bosma et al. (2020) - Global Entrepreneurship Monitor 2019/2020',
    'Acs et al. (2008) - Entrepreneurship and Economic Development'
  ],
  ARRAY['psed']
),

-- Industry Sources
(
  'CB Insights',
  'cb-insights',
  'https://www.cbinsights.com/',
  'Technology market intelligence platform tracking venture-backed companies, funding rounds, exits, and failures. Known for "Tech Company Failure Post-Mortems" series.',
  'industry',
  'paid',
  '{"geography": ["Global"], "time_period": "2008-present", "org_types": ["venture-backed startups", "tech companies"]}',
  'firm-level',
  ARRAY[
    'Focus on VC-backed companies excludes bootstrapped businesses',
    'Bias toward tech sector',
    'Subscription required for full access',
    'Company self-reporting affects data quality'
  ],
  ARRAY[
    'CB Insights (2019) - The Top 20 Reasons Startups Fail',
    'Multiple failure post-mortem analyses'
  ],
  ARRAY['pitchbook', 'crunchbase']
),

(
  'PitchBook',
  'pitchbook',
  'https://pitchbook.com/',
  'Comprehensive private capital market data covering PE, VC, and M&A transactions. Detailed company profiles, financials, and deal terms.',
  'industry',
  'paid',
  '{"geography": ["Global"], "time_period": "2000-present", "org_types": ["private companies", "PE/VC-backed firms"]}',
  'firm-level',
  ARRAY[
    'Expensive subscription ($20k+/year)',
    'Coverage gaps for non-VC-backed companies',
    'Historical data less complete',
    'Relies partly on self-reporting'
  ],
  ARRAY[
    'Gompers et al. (2020) - How Venture Capitalists Make Decisions',
    'Kaplan & Lerner (2016) - Venture Capital Data'
  ],
  ARRAY['cb-insights', 'crunchbase']
),

(
  'Crunchbase',
  'crunchbase',
  'https://www.crunchbase.com/',
  'Crowdsourced database of startups, investors, and funding rounds. Free tier available with limited access. Popular for startup ecosystem analysis.',
  'industry',
  'paid',
  '{"geography": ["Global", "US-focused"], "time_period": "2007-present", "org_types": ["startups", "tech companies"]}',
  'firm-level',
  ARRAY[
    'Crowdsourced data has quality inconsistencies',
    'US and tech-heavy bias',
    'Free tier very limited',
    'Missing data for failed companies'
  ],
  ARRAY[
    'Dalle et al. (2017) - Using Crunchbase for Economic and Managerial Research',
    'Block et al. (2019) - Trademarks and Startup Valuation'
  ],
  ARRAY['cb-insights', 'pitchbook']
),

-- Qualitative Archives
(
  'Harvard Business School Cases',
  'hbs-cases',
  'https://www.hbs.edu/faculty/pages/cases.aspx',
  'Extensive collection of business cases including numerous failure and turnaround cases. Used globally for business education. Rich qualitative data on organizational dynamics.',
  'qualitative',
  'restricted',
  '{"geography": ["Global"], "time_period": "1920s-present", "org_types": ["all sizes and industries"]}',
  'firm-level (narrative)',
  ARRAY[
    'Teaching cases may simplify complex situations',
    'Selection bias toward notable companies',
    'Per-case purchase required',
    'Anonymization in some cases limits verification'
  ],
  ARRAY[
    'Garvin (2003) - Making the Case',
    'Thousands of individual case studies'
  ],
  ARRAY['museum-of-failure']
),

(
  'Museum of Failure',
  'museum-of-failure',
  'https://museumoffailure.com/',
  'Collection of failed products and innovations from major companies. Physical exhibitions and online archive. Focus on innovation failure rather than company death.',
  'qualitative',
  'open',
  '{"geography": ["Global"], "time_period": "1950s-present", "org_types": ["product failures from large companies"]}',
  'product-level',
  ARRAY[
    'Focus on products, not companies',
    'Curated collection, not systematic',
    'Bias toward well-known consumer products',
    'Limited documentation per item'
  ],
  ARRAY[
    'West (2019) - Museum of Failure: Innovation Lessons'
  ],
  ARRAY['hbs-cases']
);
