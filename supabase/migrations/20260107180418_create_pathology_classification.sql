-- Create pathology_classification table for SOIL-PC (Pathology Classification)
-- Part of issue #258: Epic: Research Knowledge Base (Phase 2)
-- ICD-analog for organizational diseases

-- ============================================================================
-- ENUMS
-- ============================================================================

-- Pathology localization enum (where it manifests)
CREATE TYPE pathology_localization AS ENUM (
  'LP',  -- Leadership Pathologies
  'SP',  -- Structural Pathologies
  'FP',  -- Financial Pathologies
  'CP',  -- Cultural Pathologies
  'MP',  -- Market/External Pathologies
  'OP'   -- Operational Pathologies
);

-- Pathology etiology enum (cause)
CREATE TYPE pathology_etiology AS ENUM (
  'ETI-F',  -- Founder-induced
  'ETI-M',  -- Market-induced
  'ETI-C',  -- Competition-induced
  'ETI-R',  -- Regulatory-induced
  'ETI-T',  -- Technology-induced
  'ETI-S'   -- Stochastic (bad luck)
);

-- Pathology course enum (how it develops)
CREATE TYPE pathology_course AS ENUM (
  'ACU',  -- Acute (sudden death)
  'CHR',  -- Chronic (slow decline)
  'REL',  -- Relapsing (crisis -> remission -> crisis)
  'LAT'   -- Latent (hidden, manifests later)
);

-- ============================================================================
-- PATHOLOGY_CLASSIFICATION TABLE
-- ============================================================================

CREATE TABLE pathology_classification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Classification identifiers
  code TEXT NOT NULL UNIQUE,           -- e.g., "SOIL-LP-001"
  slug TEXT NOT NULL UNIQUE,           -- URL-friendly: "founders-syndrome"

  -- Basic info
  name TEXT NOT NULL,                  -- e.g., "Founder's Syndrome"
  alternative_names TEXT[] DEFAULT '{}', -- Array of alternative names
  definition TEXT NOT NULL,            -- Comprehensive definition

  -- Classification
  localization pathology_localization NOT NULL,
  primary_etiology pathology_etiology NOT NULL,
  typical_course pathology_course NOT NULL,

  -- Clinical details
  diagnostic_criteria TEXT[] DEFAULT '{}',  -- Array of diagnostic criteria
  symptoms TEXT[] DEFAULT '{}',              -- Array of symptoms
  stages TEXT[] DEFAULT '{}',                -- Array of disease stages
  course_description TEXT,                   -- Narrative of typical course

  -- Etiology and risk
  etiology_explanation TEXT,           -- Why this pathology occurs
  risk_factors TEXT[] DEFAULT '{}',    -- Array of risk factors

  -- Differential and prognosis
  differential_diagnosis TEXT[] DEFAULT '{}', -- Array of similar conditions
  prognosis TEXT,                             -- Typical outcome description

  -- Evidence and references
  known_cases TEXT[] DEFAULT '{}',           -- Array of org names/examples
  literature_references TEXT[] DEFAULT '{}', -- Array of academic references
  key_authors TEXT[] DEFAULT '{}',           -- Primary researchers

  -- Cross-linking (for future lexicon integration)
  related_lexicon_terms TEXT[] DEFAULT '{}', -- Array of slugs

  -- Metadata
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for common queries
CREATE INDEX idx_pathology_localization ON pathology_classification(localization);
CREATE INDEX idx_pathology_etiology ON pathology_classification(primary_etiology);
CREATE INDEX idx_pathology_course ON pathology_classification(typical_course);
CREATE INDEX idx_pathology_slug ON pathology_classification(slug);
CREATE INDEX idx_pathology_code ON pathology_classification(code);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_pathology_classification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER pathology_classification_updated_at_trigger
  BEFORE UPDATE ON pathology_classification
  FOR EACH ROW
  EXECUTE FUNCTION update_pathology_classification_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================
ALTER TABLE pathology_classification ENABLE ROW LEVEL SECURITY;

-- Anyone can view pathologies (public page)
CREATE POLICY "Anyone can view pathology classifications"
  ON pathology_classification FOR SELECT
  USING (true);

-- Admins can manage pathologies
CREATE POLICY "Admins can manage pathology classifications"
  ON pathology_classification FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Service role has full access
CREATE POLICY "Service role full access to pathology classifications"
  ON pathology_classification FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- SEED DATA: Initial 10 pathologies from issue #258
-- ============================================================================
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition,
  localization, primary_etiology, typical_course,
  diagnostic_criteria, symptoms, stages, course_description,
  etiology_explanation, risk_factors,
  differential_diagnosis, prognosis,
  known_cases, literature_references, key_authors,
  related_lexicon_terms
) VALUES

-- 1. SOIL-LP-001: Founder's Syndrome
(
  'LP-001',
  'founders-syndrome',
  'Founder''s Syndrome',
  ARRAY['Founderitis', 'Founder Dependency', 'Founder Lock-in'],
  'A pathological condition where an organization becomes overly dependent on its founder(s), impeding growth, succession planning, and institutional development. Characterized by the concentration of knowledge, relationships, and decision-making authority in the founder, creating organizational fragility and limiting scalability.',
  'LP', 'ETI-F', 'CHR',
  ARRAY[
    'Founder maintains disproportionate control despite organizational growth',
    'Key organizational knowledge resides primarily with founder',
    'Board and management deference patterns persist beyond startup phase',
    'Succession planning is absent or repeatedly postponed',
    'Organizational identity is inseparable from founder identity'
  ],
  ARRAY[
    'Decision bottlenecks at founder level',
    'High turnover among senior leadership',
    'Resistance to delegation and process formalization',
    'Stakeholder relationships exclusively founder-mediated',
    'Organizational paralysis during founder absence'
  ],
  ARRAY[
    'Stage 1: Healthy founder dependence (startup phase - normal)',
    'Stage 2: Emerging over-dependence (growth phase - warning signs)',
    'Stage 3: Pathological entrenchment (maturity phase - dysfunction)',
    'Stage 4: Crisis or forced founder departure'
  ],
  'Typically develops gradually over 5-10 years. Often undiagnosed until crisis (health event, founder burnout, or scaling failure). Can be chronic if left untreated, potentially terminal if founder departure is sudden and unplanned.',
  'Arises from founder''s emotional attachment to their creation, reinforced by early success patterns, board composition favoring founders, and organizational culture that mythologizes the founder. Often exacerbated by founder''s inability to distinguish personal identity from organizational role.',
  ARRAY[
    'Solo founder or dominant co-founder structure',
    'Rapid early success attributed to founder''s vision',
    'Weak or founder-controlled board of directors',
    'Mission-driven organizations (nonprofits especially vulnerable)',
    'Technical founders who built core IP personally',
    'Family businesses with unclear succession'
  ],
  ARRAY[
    'Leadership Vacuum (post-departure consequence)',
    'Corporate Psychopathy (if founder exhibits dark triad traits)',
    'Structural Inertia (often co-occurs)'
  ],
  'Variable. Treatable if diagnosed early with committed founder participation. Poor prognosis if founder resists intervention. Organization may survive founder departure if succession planning begins 3-5 years in advance.',
  ARRAY['Apple (early Jobs era)', 'Various nonprofit organizations', 'Family businesses globally'],
  ARRAY[
    'Block, S. R. (1998). Perfect Nonprofit Boards: Myths, Paradoxes, and Inner Conflicts',
    'Rosenberg, D. (2008). Founder''s Syndrome: Who is Really in Charge?',
    'Samuel, Y. (2010). Organizational Pathology: Life and Death of Organizations'
  ],
  ARRAY['Block', 'Rosenberg', 'Samuel'],
  ARRAY['structural-inertia', 'succession']
),

-- 2. SOIL-LP-002: Corporate Psychopathy
(
  'LP-002',
  'corporate-psychopathy',
  'Corporate Psychopathy',
  ARRAY['Executive Psychopathy', 'Organizational Dark Triad', 'Snakes in Suits'],
  'A leadership pathology characterized by the presence of individuals with psychopathic traits (lack of empathy, manipulativeness, superficial charm, grandiosity) in executive positions. These individuals manipulate organizational systems for personal gain, often causing significant harm to employees, stakeholders, and long-term organizational health.',
  'LP', 'ETI-F', 'CHR',
  ARRAY[
    'Pattern of executive decisions prioritizing personal gain over organizational welfare',
    'Documented instances of manipulation, deception, or exploitation',
    'High turnover in executive''s direct reports (''churn and burn'')',
    'Significant gap between public persona and internal behavior patterns',
    'History of organizational conflicts following the executive across roles'
  ],
  ARRAY[
    'Employee psychological distress and fear',
    'Unexplained resource misallocation',
    'Ethical boundary violations normalized',
    'Information hoarding and manipulation',
    'Scapegoating and blame-shifting patterns',
    'Retaliation against whistleblowers'
  ],
  ARRAY[
    'Stage 1: Infiltration (charm offensive, rapid advancement)',
    'Stage 2: Consolidation (building loyalist network, removing threats)',
    'Stage 3: Exploitation (resource extraction, empire building)',
    'Stage 4: Departure or discovery (scandal, investigation, or move to next target)'
  ],
  'Can persist for years if protected by results or powerful allies. Often ends abruptly with scandal or organizational crisis. Damage may take years to fully manifest and longer to remediate.',
  'Psychopathic individuals are drawn to positions of power. Modern corporate structures with weak governance, emphasis on short-term results, and tolerance for ''difficult'' high performers create favorable conditions for their advancement.',
  ARRAY[
    'Weak board oversight and governance',
    'Performance-at-all-costs culture',
    'Rapid growth environments with loose controls',
    'Industries with high executive autonomy',
    'Organizations recovering from crisis (seeking ''strong'' leadership)'
  ],
  ARRAY[
    'Founder''s Syndrome (if founder has dark triad traits)',
    'Cultural Toxicity (often co-occurs or results from)',
    'Leadership Vacuum (may follow departure)'
  ],
  'Poor for organization while individual remains in power. Recovery possible after departure but requires deliberate cultural remediation. Psychopathic individuals rarely change; they simply move to new organizations.',
  ARRAY['Enron', 'Theranos', 'Various financial institutions (2008 crisis)'],
  ARRAY[
    'Boddy, C. R. (2011). Corporate Psychopaths: Organisational Destroyers',
    'Babiak, P. & Hare, R. D. (2006). Snakes in Suits: When Psychopaths Go to Work',
    'Boddy, C. R. (2017). Psychopathic Leadership: A Case Study of a Corporate Psychopath CEO'
  ],
  ARRAY['Boddy', 'Babiak', 'Hare'],
  ARRAY['psychological-safety', 'governance']
),

-- 3. SOIL-LP-003: Leadership Vacuum
(
  'LP-003',
  'leadership-vacuum',
  'Leadership Vacuum',
  ARRAY['Leadership Void', 'Executive Absence Syndrome', 'Acephalous Organization'],
  'An organizational condition characterized by the absence of effective leadership at critical levels, resulting in strategic drift, decision paralysis, and organizational dysfunction. May arise from departure, incapacity, or presence of ineffective leaders who fail to provide direction.',
  'LP', 'ETI-S', 'ACU',
  ARRAY[
    'Strategic decisions systematically deferred or unmade',
    'Key leadership positions vacant or filled by ineffective incumbents',
    'Absence of clear organizational direction or vision',
    'Proliferation of informal power centers and fiefdoms',
    'Stakeholder confusion about organizational leadership and direction'
  ],
  ARRAY[
    'Decision paralysis across the organization',
    'Departmental silos deepening',
    'Talent flight (high performers leave first)',
    'Strategic drift and mission creep',
    'Stakeholder confidence erosion'
  ],
  ARRAY[
    'Stage 1: Trigger event (departure, illness, removal, or ineffective appointment)',
    'Stage 2: Initial coping (temporary measures, acting roles)',
    'Stage 3: Vacuum effects manifest (dysfunction becomes visible)',
    'Stage 4: Crisis or resolution (new leadership or organizational failure)'
  ],
  'Acute onset following trigger event. If unresolved within 6-12 months, becomes chronic with compounding dysfunction. Resolution requires definitive leadership appointment with genuine authority.',
  'Can result from sudden departure, poor succession planning, board dysfunction, or failed internal promotion. Sometimes masked by collective leadership arrangements that lack real decision-making authority.',
  ARRAY[
    'Poor or nonexistent succession planning',
    'Unexpected leadership departure (death, illness, scandal)',
    'Board-management conflict or paralysis',
    'Leadership-dependent organization (post-Founder''s Syndrome)',
    'Industry disruption requiring new leadership profile'
  ],
  ARRAY[
    'Founder''s Syndrome (often precedes or follows)',
    'Structural Inertia (can accelerate during vacuum)',
    'Cultural Toxicity (can emerge during extended vacuum)'
  ],
  'Good if resolved quickly with appropriate leadership appointment. Extended vacuum (>12 months) causes permanent organizational damage. Some organizations never recover from prolonged leadership absence.',
  ARRAY['Various organizations post-CEO departure', 'Nonprofits after founder retirement'],
  ARRAY[
    'Samuel, Y. (2010). Organizational Pathology: Life and Death of Organizations',
    'Khurana, R. (2002). Searching for a Corporate Savior: The Irrational Quest for Charismatic CEOs'
  ],
  ARRAY['Samuel', 'Khurana'],
  ARRAY['succession', 'governance']
),

-- 4. SOIL-SP-001: Structural Inertia
(
  'SP-001',
  'structural-inertia',
  'Structural Inertia',
  ARRAY['Organizational Rigidity', 'Adaptive Failure', 'Core Rigidities'],
  'A structural pathology where organizational structures, processes, and routines become resistant to change, even when environmental conditions clearly demand adaptation. The organization''s architecture becomes a liability rather than an asset, preventing necessary evolution.',
  'SP', 'ETI-T', 'CHR',
  ARRAY[
    'Documented failure to adapt to known environmental changes',
    'Processes and structures unchanged despite performance decline',
    'Change initiatives repeatedly failing or abandoned',
    'Significant gap between espoused and actual organizational flexibility',
    'Competitors adapting successfully while organization remains static'
  ],
  ARRAY[
    'Strategic response delays measured in years',
    'Internal resistance to change initiatives (active and passive)',
    'Bureaucratic accumulation and process complexity',
    'Loss of market position to more agile competitors',
    'Talent frustrated by inability to innovate'
  ],
  ARRAY[
    'Stage 1: Successful structure establishment (fitness to environment)',
    'Stage 2: Structure institutionalization (routines become rigid)',
    'Stage 3: Environmental shift (fitness decreases)',
    'Stage 4: Adaptive failure and decline (or rare transformation)'
  ],
  'Develops over extended periods of environmental stability. Often invisible until crisis. Chronic and progressive without significant intervention. Can be terminal if industry disruption is rapid.',
  'Organizations develop structures optimized for historical environments. Success reinforces these structures through positive feedback. Change creates uncertainty and threatens vested interests. Selection pressures in stable environments favor reproducibility over adaptability.',
  ARRAY[
    'Long periods of environmental stability',
    'Strong organizational culture and identity',
    'Successful historical performance (success trap)',
    'Mature industry position with established practices',
    'Bureaucratic governance structures',
    'Large organizational size'
  ],
  ARRAY[
    'Organizational Obesity (related structural pathology)',
    'Market Denial (cognitive dimension of same problem)',
    'Cultural Toxicity (resistance culture)'
  ],
  'Poor without significant intervention. Requires fundamental structural transformation, often involving leadership change. Many established organizations succumb when facing disruptive environmental change.',
  ARRAY['Kodak', 'Blockbuster', 'Traditional retailers vs. e-commerce', 'Newspapers vs. digital media'],
  ARRAY[
    'Hannan, M. T. & Freeman, J. (1984). Structural Inertia and Organizational Change',
    'Tushman, M. L. & O''Reilly, C. A. (1996). Ambidextrous Organizations',
    'Leonard-Barton, D. (1992). Core Capabilities and Core Rigidities'
  ],
  ARRAY['Hannan', 'Freeman'],
  ARRAY['adaptation', 'organizational-ecology']
),

-- 5. SOIL-SP-002: Organizational Obesity
(
  'SP-002',
  'organizational-obesity',
  'Organizational Obesity',
  ARRAY['Bureaucratic Bloat', 'Administrative Accumulation', 'Corporate Bloat'],
  'A structural pathology characterized by excessive organizational mass relative to productive capacity. Manifests as overstaffing, redundant processes, unnecessary management layers, and resource inefficiency that impedes organizational agility and threatens long-term health.',
  'SP', 'ETI-S', 'CHR',
  ARRAY[
    'Revenue per employee significantly below industry benchmarks',
    'Management layers exceeding functional necessity (>7 levels)',
    'Redundant functions and processes documented across units',
    'Administrative costs disproportionate to operational costs',
    'Decision-making pathways unnecessarily complex'
  ],
  ARRAY[
    'Slow decision-making (weeks for routine decisions)',
    'Coordination overhead consuming significant resources',
    'Innovation suppression (too many approval layers)',
    'Cost structure inflexibility',
    'Internal competition for resources rather than external competition'
  ],
  ARRAY[
    'Stage 1: Healthy growth accumulation (proportional to revenue)',
    'Stage 2: Early obesity (headcount grows faster than revenue)',
    'Stage 3: Entrenched obesity (bureaucratic complexity self-reinforcing)',
    'Stage 4: Morbid obesity (existential threat to competitiveness)'
  ],
  'Develops gradually during growth phases. Often masked by revenue growth. Becomes acute during market downturns or competitive pressure when costs cannot flex. Chronic without disciplined intervention.',
  'Results from empire-building incentives, defensive hiring, failure to prune during growth, and metric systems that reward headcount and budget size. Growth adds organizational mass without removing obsolete elements.',
  ARRAY[
    'Rapid revenue growth periods',
    'Empire-building management incentives',
    'Weak cost discipline culture',
    'Complex organizational matrix structures',
    'Success masking underlying inefficiency',
    'Difficulty firing or restructuring'
  ],
  ARRAY[
    'Structural Inertia (often co-occurs)',
    'Cash Flow Starvation (can result from cost burden)',
    'Zombie Organization (advanced stage of obesity)'
  ],
  'Treatable with committed leadership and clear metrics. Restructuring painful but effective if comprehensive. Untreated, leads to competitive failure or acquisition by leaner competitors.',
  ARRAY['Many post-growth tech companies', 'Large conglomerates', 'Government agencies'],
  ARRAY[
    'Samuel, Y. (2010). Organizational Pathology: Life and Death of Organizations',
    'Parkinson, C. N. (1957). Parkinson''s Law',
    'Gary Hamel on bureaucracy research'
  ],
  ARRAY['Samuel', 'Parkinson'],
  ARRAY['efficiency', 'scaling']
),

-- 6. SOIL-FP-001: Cash Flow Starvation
(
  'FP-001',
  'cash-flow-starvation',
  'Cash Flow Starvation',
  ARRAY['Liquidity Crisis', 'Working Capital Deficit', 'Cash Crunch'],
  'A financial pathology where an organization lacks sufficient cash flow to sustain operations, regardless of underlying profitability or asset value. The organization dies of ''financial asphyxiation'' - inability to convert value to liquid resources when needed.',
  'FP', 'ETI-M', 'ACU',
  ARRAY[
    'Cash reserves below 3-month operating expenses (runway under 90 days)',
    'Consistent negative operating cash flow',
    'Payment delays to suppliers, employees, or creditors',
    'Inability to fund committed expenditures',
    'Emergency financing sought at unfavorable terms'
  ],
  ARRAY[
    'Payroll anxiety and delayed payments',
    'Supplier relationship deterioration',
    'Deferred maintenance and investment',
    'Management distraction (fundraising over operations)',
    'Employee morale decline and talent flight'
  ],
  ARRAY[
    'Stage 1: Cash pressure (runway under 6 months)',
    'Stage 2: Cash crisis (runway under 3 months)',
    'Stage 3: Cash emergency (survival mode, under 30 days)',
    'Stage 4: Terminal (unable to meet payroll or critical obligations)'
  ],
  'Can develop gradually from structural issues or rapidly from external shocks. Typically acute and rapidly progressive. Death occurs within weeks to months without intervention. The most common proximate cause of organizational death.',
  'Results from revenue disruption, customer concentration risk, poor receivables management, over-investment, or external shocks (pandemic, market crash). Often the proximate cause of death even when underlying causes are different pathologies.',
  ARRAY[
    'Customer concentration (>30% from single customer)',
    'Long receivables cycles (>60 days)',
    'Capital-intensive operations without reserves',
    'Rapid growth without adequate financing',
    'Seasonal or cyclical business without cash management'
  ],
  ARRAY[
    'Zombie Organization (distinct - has cash but no vitality)',
    'Market Denial (may be underlying cause of revenue loss)',
    'Technical Debt Collapse (can trigger through operational failure)'
  ],
  'Depends on underlying cause. If structural (bad unit economics), requires business model changes. If acute/external, may recover with bridge financing. Terminal if underlying business is fundamentally unviable.',
  ARRAY['Most startup failures', 'Construction companies during downturns', 'Seasonal businesses'],
  ARRAY[
    'CB Insights Startup Failure Post-Mortems',
    'Various business failure research',
    'Altman, E. I. - Z-Score bankruptcy prediction research'
  ],
  ARRAY['Various'],
  ARRAY['runway', 'finance']
),

-- 7. SOIL-FP-002: Zombie Organization
(
  'FP-002',
  'zombie-organization',
  'Zombie Organization',
  ARRAY['Walking Dead Company', 'Undead Firm', 'Zombie Firm'],
  'A financial pathology where an organization continues to exist despite lacking the vitality to grow, innovate, or generate returns above cost of capital. Neither alive (growing, creating value) nor dead (dissolved), these organizations consume resources while producing minimal economic value.',
  'FP', 'ETI-R', 'LAT',
  ARRAY[
    'Persistent inability to earn cost of capital (ROIC < WACC)',
    'Survival dependent on continued debt refinancing or forbearance',
    'No organic growth or meaningful innovation',
    'Value creation below opportunity cost of invested capital',
    'Continued existence primarily serves interests other than economic value'
  ],
  ARRAY[
    'Strategic paralysis (no meaningful strategic choices)',
    'Talent stagnation (best people leave)',
    'Innovation absence (nothing new for years)',
    'Declining competitive position',
    'Management focused on debt covenant compliance'
  ],
  ARRAY[
    'Stage 1: Initial vitality loss (growth stops)',
    'Stage 2: Zombie threshold crossing (returns fall below cost of capital)',
    'Stage 3: Chronic zombie state (years of marginal existence)',
    'Stage 4: Final dissolution or rare transformation'
  ],
  'Latent and persistent. Can continue indefinitely if external support (cheap debt, regulatory protection) continues. Natural end comes from external shock, creditor action, or acqui-hire. Rarely self-correcting.',
  'Created by low interest rate environments enabling endless debt refinancing, creditor reluctance to realize losses, stakeholder attachment (employees, communities), and policy interventions preventing natural market clearing.',
  ARRAY[
    'High debt loads from leveraged buyouts',
    'Low interest rate environment enabling refinancing',
    'Bank relationship lending (reluctance to call loans)',
    'Social/political importance preventing failure',
    'Complex stakeholder arrangements (unions, pensions)'
  ],
  ARRAY[
    'Cash Flow Starvation (distinct - active crisis vs. chronic undeath)',
    'Structural Inertia (often co-occurs)',
    'Market Denial (may be underlying cause)'
  ],
  'Poor for economic value creation. May persist for extended periods (decades in some cases). Best outcome is acquisition, transformation, or orderly wind-down. Resource misallocation harms broader economy.',
  ARRAY['Post-bubble companies', 'Leveraged buyout failures', 'Some state-supported enterprises', 'Japanese ''zombie firms'' post-1990s'],
  ARRAY[
    'Caballero, R. J., Hoshi, T., & Kashyap, A. K. (2008). Zombie Lending and Depressed Restructuring in Japan',
    'McGowan, M. A., Andrews, D., & Millot, V. (2017). The Walking Dead? Zombie Firms and Productivity Performance in OECD Countries'
  ],
  ARRAY['Caballero', 'Hoshi', 'Kashyap'],
  ARRAY['capital-efficiency', 'restructuring']
),

-- 8. SOIL-CP-001: Cultural Toxicity
(
  'CP-001',
  'cultural-toxicity',
  'Cultural Toxicity',
  ARRAY['Toxic Workplace', 'Organizational Poisoning', 'Toxic Culture'],
  'A cultural pathology where organizational norms, values, and behaviors systematically harm member wellbeing, suppress performance, and ultimately threaten organizational survival. The culture becomes a corrosive force destroying organizational tissue from within.',
  'CP', 'ETI-F', 'CHR',
  ARRAY[
    'Employee wellbeing metrics significantly below industry benchmarks',
    'High voluntary turnover, especially among high performers',
    'Pattern of harassment, bullying, or discrimination incidents',
    'Psychological safety assessments showing significant dysfunction',
    'Large gap between espoused values and observed behaviors'
  ],
  ARRAY[
    'Fear-based compliance (decisions driven by avoiding punishment)',
    'Information hoarding and political behavior',
    'Blame culture (errors punished, not learned from)',
    'In-group/out-group dynamics and exclusion',
    'Burnout epidemic across the organization'
  ],
  ARRAY[
    'Stage 1: Toxin introduction (leadership behavior, crisis response, bad hire)',
    'Stage 2: Toxin spread (normalization, ''this is how things are done here'')',
    'Stage 3: Systemic toxicity (culture becomes self-reinforcing)',
    'Stage 4: Terminal toxicity or intervention'
  ],
  'Often develops gradually from leadership behaviors or crisis responses. Becomes self-reinforcing through selection effects (toxic people thrive, healthy people leave). Can be chronic for extended periods if business results mask dysfunction.',
  'Typically originates from leadership behavior, especially under pressure. Reinforced by hiring patterns (hiring people like existing toxic leaders), reward systems (rewarding toxic behaviors), and crisis responses. Competitive pressure can accelerate toxicity.',
  ARRAY[
    'High-pressure, high-stakes environments',
    'Weak HR/people functions without real power',
    'Leadership with dark triad traits (see Corporate Psychopathy)',
    'Homogeneous workforce (reduces challenge to norms)',
    'Results-at-all-costs mentality from board/investors'
  ],
  ARRAY[
    'Corporate Psychopathy (often causal relationship)',
    'Founder''s Syndrome (can create toxic conditions)',
    'Structural Inertia (resistance to cultural change efforts)'
  ],
  'Treatable but difficult. Requires leadership change or genuine, sustained commitment to transformation. Cultural change takes 3-5 years minimum. Untreated, leads to talent drain, reputation damage, and competitive failure.',
  ARRAY['Uber (pre-2017 transformation)', 'Various ''bro culture'' startups', 'Wells Fargo (fake accounts scandal)'],
  ARRAY[
    'Edmondson, A. C. (2019). The Fearless Organization',
    'Sutton, R. I. (2007). The No Asshole Rule',
    'Groysberg, B. et al. (2018). The Leader''s Guide to Corporate Culture (HBR)'
  ],
  ARRAY['Multiple'],
  ARRAY['psychological-safety', 'culture']
),

-- 9. SOIL-MP-001: Market Denial
(
  'MP-001',
  'market-denial',
  'Market Denial',
  ARRAY['Disruption Blindness', 'Market Reality Rejection', 'Strategic Myopia'],
  'A market pathology characterized by systematic failure to recognize or respond to fundamental market shifts. The organization maintains strategic commitments to markets, technologies, or business models that are being disrupted or rendered obsolete.',
  'MP', 'ETI-T', 'CHR',
  ARRAY[
    'Strategic plans assume market continuity despite contrary evidence',
    'Dismissal of disruptive competitors as ''niche'' or ''not real competition''',
    'Investment patterns favoring legacy business over emerging opportunities',
    'Leadership communications denying or minimizing market shifts',
    'Customer feedback indicating changing needs systematically ignored'
  ],
  ARRAY[
    'Strategic planning disconnected from market reality',
    'Competitive response delays (years behind)',
    'Customer defection to alternatives',
    'Margin compression denial (''temporary'' price pressure)',
    'Innovation theater (activity without adaptation)'
  ],
  ARRAY[
    'Stage 1: Early signals (dismissed as noise)',
    'Stage 2: Mounting evidence (rationalized away)',
    'Stage 3: Crisis (denial finally breaks)',
    'Stage 4: Too-late response or organizational failure'
  ],
  'Chronic pattern, often spanning years or even a decade. Punctuated by periodic ''wake-up calls'' that are insufficiently processed. Terminal when market shifts become irreversible and organization lacks resources to transform.',
  'Cognitive biases (confirmation bias, sunk cost fallacy), organizational identity attachment to legacy business, incentive structures favoring status quo defense, and misplaced optimism about core business recovery combine to create systematic blindness.',
  ARRAY[
    'Dominant market position (success trap)',
    'Significant sunk costs in legacy business',
    'Strong organizational identity tied to legacy',
    'Executive compensation tied to legacy business metrics',
    'Key customer relationships in declining segments'
  ],
  ARRAY[
    'Structural Inertia (often co-occurs - denial + inability to change)',
    'Leadership Vacuum (can enable denial through lack of strategic direction)',
    'Founder''s Syndrome (if founder attached to original vision)'
  ],
  'Poor without leadership change or external shock forcing recognition. Disruption windows are finite. Early recognition and pivot essential. Many incumbents fail to navigate major market transitions.',
  ARRAY['Kodak (digital photography)', 'Blockbuster (streaming)', 'Nokia (smartphones)', 'Traditional taxi companies (ridesharing)'],
  ARRAY[
    'Christensen, C. M. (1997). The Innovator''s Dilemma',
    'Tripsas, M. & Gavetti, G. (2000). Capabilities, Cognition, and Inertia: Evidence from Digital Imaging',
    'Day, G. S. & Schoemaker, P. J. H. (2006). Peripheral Vision'
  ],
  ARRAY['Christensen'],
  ARRAY['disruption', 'strategic-management']
),

-- 10. SOIL-OP-001: Technical Debt Collapse
(
  'OP-001',
  'technical-debt-collapse',
  'Technical Debt Collapse',
  ARRAY['Software Rot', 'Infrastructure Decay', 'Code Bankruptcy'],
  'An operational pathology where accumulated technical shortcuts, deferred maintenance, and architectural compromises reach a critical mass that prevents normal system function. The organization becomes unable to maintain, modify, or scale its technical infrastructure, paralyzing operations.',
  'OP', 'ETI-T', 'ACU',
  ARRAY[
    'System modification time/cost exceeding equivalent new development',
    'Critical knowledge concentrated in few individuals (key person risk)',
    'Incident frequency exceeding team capacity to respond',
    'Customer-impacting outages increasing in frequency and severity',
    'Engineering team unable to deliver planned roadmap'
  ],
  ARRAY[
    'Deployment fear (any change might break everything)',
    'Feature velocity collapse (simple features take months)',
    'Engineering burnout and turnover',
    'System fragility (minor changes cause major failures)',
    'Customer experience degradation'
  ],
  ARRAY[
    'Stage 1: Debt accumulation (velocity maintained, corners cut)',
    'Stage 2: Debt drag (velocity declining, more time on fixes)',
    'Stage 3: Debt crisis (system instability, firefighting mode)',
    'Stage 4: Collapse (major outage, rewrite required, or business failure)'
  ],
  'Accumulates gradually over years of feature pressure over quality. Crisis onset can be rapid, triggered by key person departure, security incident, or scale requirements. Recovery requires significant investment (6-24 months typically).',
  'Results from speed-over-quality tradeoffs during growth, inadequate testing and documentation investment, knowledge silos from turnover, and management pressure for features over infrastructure. Often invisible to non-technical leadership until crisis.',
  ARRAY[
    'Rapid growth periods without infrastructure investment',
    'Engineering leadership gaps',
    'Non-technical executive teams',
    'Acquisition without technical integration',
    'Cost-cutting on infrastructure and testing',
    'High engineering turnover without knowledge transfer'
  ],
  ARRAY[
    'Cash Flow Starvation (can co-occur as symptoms manifest)',
    'Structural Inertia (organizational resistance to addressing debt)',
    'Leadership Vacuum (technical leadership gap specifically)'
  ],
  'Treatable with dedicated investment, typically 6-24 months depending on severity. Requires leadership commitment, engineering capacity, and acceptance of slowed feature development. Some systems require full rewrite (expensive, risky). Untreated, becomes terminal.',
  ARRAY['Various high-growth startups', 'Legacy enterprise systems', 'Companies post-acquisition'],
  ARRAY[
    'Cunningham, W. (1992). The WyCash Portfolio Management System (origin of ''technical debt'' metaphor)',
    'Fowler, M. - Technical Debt writings',
    'Various software engineering research'
  ],
  ARRAY['Cunningham'],
  ARRAY['technical-debt', 'software-engineering']
);
