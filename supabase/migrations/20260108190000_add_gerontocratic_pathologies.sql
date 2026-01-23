-- Migration: Add 4 pathologies from "The Gerontocratic Sclerosis" paper
-- Source: SSRN paper on German corporate leadership failure
-- Key authors: Edward Lazear, Laurence J. Peter, William Niskanen, Shleifer & Vishny

-- 1. Gerontocratic Sclerosis (SP-007) - Structural Pathology
INSERT INTO pathology_classification (
  code,
  slug,
  name,
  alternative_names,
  definition,
  localization,
  primary_etiology,
  typical_course,
  functional_impairment,
  diagnostic_criteria,
  symptoms,
  stages,
  course_description,
  etiology_explanation,
  risk_factors,
  differential_diagnosis,
  prognosis,
  known_cases,
  literature_references,
  key_authors,
  related_lexicon_terms,
  primary_source_title,
  primary_source_authors,
  primary_source_year,
  primary_source_doi,
  primary_source_url
) VALUES (
  'SP-007',
  'gerontocratic-sclerosis',
  'Gerontocratic Sclerosis',
  ARRAY['Seniority Trap', 'Leadership Ossification', 'Hierarchical Calcification', 'Corporate Gerontocracy'],
  'A chronic structural pathology characterized by the progressive ossification of corporate leadership through seniority-based systems that create "golden handcuffs," lock incompetent managers into positions of power, and systematically filter out high-variance outcomes and disruptive innovation. The organization becomes a bureaucracy indistinguishable from state apparatus, prioritizing stability over dynamism.',
  'SP',
  'ETI-I',
  'CHR',
  'EXE',
  ARRAY[
    'Steep wage profiles with early underpayment and late overpayment (deferred compensation)',
    'Leadership turnover velocity significantly below industry benchmarks',
    'Promotion decisions primarily based on tenure rather than performance',
    'High cost of dismissing long-tenured managers (severance, legal protection)',
    'Systematic filtering out of "super-competent" individuals who threaten hierarchy'
  ],
  ARRAY[
    'Risk-averse decision making at all leadership levels',
    'Resistance to technological shifts that would devalue incumbent skills',
    'Low velocity of leadership turnover ("up or stay" rather than "up or out")',
    'Accumulation of managers at "Peters Plateau" (level of incompetence)',
    'Preference for incremental improvement over radical innovation',
    'Focus on "process compliance" rather than results',
    'Internal promotion of "safe pairs of hands" over dynamic leaders',
    'Widening gap between senior manager wages and actual productivity'
  ],
  ARRAY[
    'Stage 1 - Implicit Contract Formation: Organization establishes seniority-based compensation and protection systems',
    'Stage 2 - Talent Lock-in: High performers accept lower early pay expecting future rewards, creating psychological commitment',
    'Stage 3 - Competency Depreciation: Market/technology shifts devalue incumbent skills while they remain locked in',
    'Stage 4 - Active Resistance: Entrenched leaders block changes that would expose skill obsolescence',
    'Stage 5 - Structural Paralysis: Organization becomes incapable of strategic adaptation'
  ],
  'Progressive and self-reinforcing. The seniority system creates economic incentives for incumbents to remain and resist change. As technology shifts, the gap between compensation and productivity widens, making leaders increasingly desperate to preserve status quo. Without external shock (acquisition, bankruptcy, regulatory intervention), the condition is terminal.',
  'Rooted in deferred compensation theory (Lazear 1979): workers accept below-productivity wages early in exchange for above-productivity wages late in career. This creates "golden handcuffs" that lock managers into positions. When technology disrupts, firm-specific human capital depreciates to zero, but implicit contract prevents adjustment. Managers become intensely risk-averse as their external market value falls below internal wage.',
  ARRAY[
    'Strong labor protection laws and high dismissal costs',
    'Collective bargaining agreements with seniority entitlements',
    'Internal labor markets with limited lateral entry',
    'Homogeneous leadership pipeline (single-track careers)',
    'Stakeholder capitalism model prioritizing stability',
    'Co-determination systems creating management-labor risk-aversion alliance',
    'Culture valuing Ordnung (order) and Konsens (consensus)',
    'Compensation weighted toward fixed salary over equity'
  ],
  ARRAY[
    'Structural Inertia (broader organizational rigidity)',
    'Founders Syndrome (individual rather than systemic)',
    'Organizational Obesity (headcount focus rather than seniority)',
    'Market Denial (external focus rather than internal structure)'
  ],
  'Poor without radical intervention. The system is self-reinforcing: seniority creates gerontocracy, gerontocracy blocks reform of seniority. Requires "corporate Zeitenwende" - dismantling seniority cult, shifting to at-risk equity compensation, and de-bureaucratization. Most organizations choose "slow death" over painful transformation.',
  ARRAY[
    'German automotive industry (VW, BMW, Daimler)',
    'German chemical industry (BASF)',
    'DAX companies broadly (vs S&P 500 performance gap)',
    'Traditional Japanese corporations (lifetime employment model)',
    'Large European industrial conglomerates'
  ],
  ARRAY[
    'Lazear (1979) - Why Is There Mandatory Retirement? Journal of Political Economy',
    'Peter & Hull (1969) - The Peter Principle',
    'Niskanen (1971) - Bureaucracy and Representative Government',
    'Eurofound (2022) - Seniority entitlements: A policy of the past?',
    'Malmendier (2025) - Making Germany Grow Again, IMF'
  ],
  ARRAY['Edward Lazear', 'Laurence J. Peter', 'William Niskanen', 'Ulrike Malmendier'],
  ARRAY['deferred compensation', 'seniority principle', 'golden handcuffs', 'implicit contract', 'Peters Plateau', 'lehmige Schicht'],
  'The Gerontocratic Sclerosis: An Economic and Organizational Autopsy of Leadership Failure in German Corporate Capitalism',
  'Anonymous (SSRN)',
  2025,
  NULL,
  'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5945554'
);

-- 2. Negative Selection Cascade (LP-007) - Leadership Pathology
INSERT INTO pathology_classification (
  code,
  slug,
  name,
  alternative_names,
  definition,
  localization,
  primary_etiology,
  typical_course,
  functional_impairment,
  diagnostic_criteria,
  symptoms,
  stages,
  course_description,
  etiology_explanation,
  risk_factors,
  differential_diagnosis,
  prognosis,
  known_cases,
  literature_references,
  key_authors,
  related_lexicon_terms,
  primary_source_title,
  primary_source_authors,
  primary_source_year,
  primary_source_doi,
  primary_source_url
) VALUES (
  'LP-007',
  'negative-selection-cascade',
  'Negative Selection Cascade',
  ARRAY['Mediocrity Cascade', 'B-Player Syndrome', 'Talent Degradation Spiral', 'Hiring-Down Pathology'],
  'A progressive leadership pathology where insecure managers, particularly those who have reached their level of incompetence (Peters Plateau), systematically hire subordinates less competent than themselves to avoid being threatened or outshone. This creates a recursive decline in organizational intelligence: A-players hire A-players, but B-players hire C-players, and C-players hire D-players.',
  'LP',
  'ETI-I',
  'CHR',
  'COG',
  ARRAY[
    'Pattern of hiring candidates described as "manageable" or "good culture fit" over higher-qualified candidates',
    'Rejection of candidates with superior qualifications citing "overqualified" or "would not fit"',
    'Measurable decline in credential/capability quality down organizational hierarchy',
    'High performers leaving citing frustration with leadership quality',
    'Homosocial reproduction in hiring (same background, university, specialization)'
  ],
  ARRAY[
    'Hiring for subservience and deference to authority rather than capability',
    'Filtering out candidates perceived as "threats" (superior skills, disruptive ideas)',
    'Preference for "safe" subordinates who will not challenge status quo',
    'Declining average quality of new hires over successive cohorts',
    'High-performer attrition ("A-players" leaving for competitors)',
    'Groupthink intensification as diverse perspectives are filtered out',
    'Innovation proposals systematically blocked or deprioritized',
    '"Tall Poppy Syndrome" - penalizing outstanding performance'
  ],
  ARRAY[
    'Stage 1 - Initial Insecurity: Manager reaches competence limit, becomes aware of limitations',
    'Stage 2 - Threat Perception: Talented candidates/subordinates perceived as rivals, not assets',
    'Stage 3 - Selective Hiring: Conscious or unconscious preference for less threatening candidates',
    'Stage 4 - Cascade Effect: Hired B/C-players repeat pattern with their own hiring',
    'Stage 5 - Organizational Graying: Entire layers filled with mediocre talent, A-players flee'
  ],
  'Exponentially degenerative. Each generation of hiring compounds the problem. Unlike single-point failures, this pathology is distributed across all hiring decisions. Rate of decline accelerates as the ratio of insecure managers increases. Can hollow out an organization within 2-3 leadership generations.',
  'Rooted in self-esteem threat response and competitive psychology. Managers at Peters Plateau are acutely aware of their limitations. In competitive internal tournaments where status depends on relative performance, a highly talented subordinate represents an existential threat. The rational (if organizationally destructive) response is to hire downward. Research links this to neuroticism and insecurity.',
  ARRAY[
    'High internal competition for limited promotion slots',
    'Status-conscious culture (titles, hierarchy emphasis)',
    'Managers evaluated on subordinate loyalty rather than subordinate quality',
    'Fear-based management culture',
    'Limited external benchmarking of talent quality',
    'Decentralized hiring without independent assessment',
    'Weak HR function without hiring oversight',
    'High neuroticism in leadership population'
  ],
  ARRAY[
    'Corporate Psychopathy (intentional harm vs. self-protective hiring)',
    'Leadership Vacuum (absence of leaders vs. presence of weak ones)',
    'Cultural Toxicity (broader dysfunction vs. specific hiring pattern)',
    'Founders Syndrome (one person vs. distributed pattern)'
  ],
  'Reversible only through radical intervention: independent assessment centers, depersonalized hiring processes, external talent infusion at multiple levels, and cultural shift rewarding managers for subordinate excellence. Left untreated, leads to complete organizational capability collapse as competitors with better talent win.',
  ARRAY[
    'Large bureaucratic corporations generally',
    'Organizations with "management by terror" cultures',
    'Companies with homogeneous leadership pipelines',
    'Industries with limited talent mobility'
  ],
  ARRAY[
    'Cassar & Rigdon (2021) - Symptoms and Consequences to Selection Errors in Recruitment Decisions',
    'Peter & Hull (1969) - The Peter Principle',
    'Kanter (1977) - Men and Women of the Corporation'
  ],
  ARRAY['Alessandra Cassar', 'Mary Rigdon', 'Laurence J. Peter', 'Rosabeth Moss Kanter'],
  ARRAY['negative selection', 'hiring bias', 'similar-to-me effect', 'tall poppy syndrome', 'homosocial reproduction'],
  'The Gerontocratic Sclerosis: An Economic and Organizational Autopsy of Leadership Failure in German Corporate Capitalism',
  'Anonymous (SSRN)',
  2025,
  NULL,
  'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5945554'
);

-- 3. Managerial Entrenchment (LP-008) - Leadership Pathology
INSERT INTO pathology_classification (
  code,
  slug,
  name,
  alternative_names,
  definition,
  localization,
  primary_etiology,
  typical_course,
  functional_impairment,
  diagnostic_criteria,
  symptoms,
  stages,
  course_description,
  etiology_explanation,
  risk_factors,
  differential_diagnosis,
  prognosis,
  known_cases,
  literature_references,
  key_authors,
  related_lexicon_terms,
  primary_source_title,
  primary_source_authors,
  primary_source_year,
  primary_source_doi,
  primary_source_url
) VALUES (
  'LP-008',
  'managerial-entrenchment',
  'Managerial Entrenchment',
  ARRAY['Executive Capture', 'Management Fortress Syndrome', 'Self-Preservation Pathology', 'Corporate Incumbent Protection'],
  'A leadership pathology where executives systematically take actions to increase their leverage over the board and shareholders, prioritizing their own job security over firm value. The entrenched manager effectively captures the firm, making themselves too costly or difficult to replace through specific investments, empire building, information asymmetry, and strategic obstruction.',
  'LP',
  'ETI-I',
  'CHR',
  'VOL',
  ARRAY[
    'Executive compensation decoupled from firm performance',
    'Pattern of blocking M&A deals, spinoffs, or leadership changes that threaten incumbent control',
    'Investment in projects requiring executives specific (often obsolete) skills',
    'Persistent budget/headcount growth despite declining returns',
    'Board captured through information asymmetry and network ties'
  ],
  ARRAY[
    'Specific investments in complexity requiring incumbent knowledge',
    'Empire building - pursuing size over efficiency (budget maximization)',
    'Strategic obstruction of changes threatening incumbent control',
    'Information hoarding and asymmetry exploitation',
    'Network capture of board members and supervisory functions',
    'Resistance to succession planning or leadership development',
    'Framing all strategic alternatives as "too risky"',
    'Over-engineering to justify large budgets and teams',
    'Lobbying and rent-seeking over market innovation'
  ],
  ARRAY[
    'Stage 1 - Position Securing: Executive builds information advantages and board relationships',
    'Stage 2 - Complexity Investment: Resources directed to projects requiring incumbent expertise',
    'Stage 3 - Empire Expansion: Budget and headcount grown to increase perceived indispensability',
    'Stage 4 - Alternative Blocking: M&A, spinoffs, restructuring systematically obstructed',
    'Stage 5 - Full Capture: Organization optimized for executive retention, not value creation'
  ],
  'Self-reinforcing and progressive. Each entrenchment action increases the cost of replacement, which justifies further entrenchment. Information asymmetry grows over time. Only external shocks (activist investors, hostile takeover, bankruptcy, regulatory action) typically break the cycle.',
  'Agency theory explains entrenchment as rational self-interest when monitoring is imperfect. Managers maximize their own utility (job security, compensation, status) rather than shareholder value. In stakeholder capitalism systems with co-determination, risk-averse labor representatives often ally with risk-averse management, creating mutual protection. The "conservative" framing of preserving the firm provides moral cover.',
  ARRAY[
    'Weak corporate governance and dispersed ownership',
    'Dual-board systems with captured supervisory boards',
    'Co-determination creating management-labor risk-aversion alliance',
    'Stakeholder capitalism framing (firm as social institution)',
    'Low equity component in executive compensation',
    'Limited activist investor presence',
    'Complex organizational structures obscuring performance',
    'Industries with high barriers to entry (limited competitive pressure)'
  ],
  ARRAY[
    'Founders Syndrome (founder vs. professional manager entrenchment)',
    'Organizational Obesity (headcount focus vs. comprehensive self-protection)',
    'Corporate Psychopathy (malicious intent vs. self-interested rationality)',
    'Structural Inertia (organizational vs. individual-driven rigidity)'
  ],
  'Requires external intervention for resolution. Internal reform nearly impossible as entrenched managers control information and decision processes. Activist investors, hostile takeovers, or bankruptcy can break entrenchment. In protected systems (strong labor laws, state ownership), entrenchment can persist indefinitely until competitive extinction.',
  ARRAY[
    'German automotive executives and diesel technology commitment',
    'VW leadership pre-Dieselgate',
    'Many DAX company executive suites',
    'Large conglomerates resisting breakup (value-destroying diversification)',
    'State-influenced enterprises broadly'
  ],
  ARRAY[
    'Shleifer & Vishny (1989) - Management Entrenchment: The Case of Managerial-Specific Investments',
    'Jensen (1986) - Agency Costs of Free Cash Flow',
    'Faleye (2007) - Classified Boards, Firm Value, and Managerial Entrenchment',
    'Atanassov (2013) - Do Hostile Takeovers Stifle Innovation?'
  ],
  ARRAY['Andrei Shleifer', 'Robert Vishny', 'Michael Jensen', 'Olubunmi Faleye'],
  ARRAY['managerial entrenchment', 'empire building', 'agency costs', 'specific investments', 'budget maximization'],
  'The Gerontocratic Sclerosis: An Economic and Organizational Autopsy of Leadership Failure in German Corporate Capitalism',
  'Anonymous (SSRN)',
  2025,
  NULL,
  'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5945554'
);

-- 4. Competency Trap (OP-004) - Operational Pathology
INSERT INTO pathology_classification (
  code,
  slug,
  name,
  alternative_names,
  definition,
  localization,
  primary_etiology,
  typical_course,
  functional_impairment,
  diagnostic_criteria,
  symptoms,
  stages,
  course_description,
  etiology_explanation,
  risk_factors,
  differential_diagnosis,
  prognosis,
  known_cases,
  literature_references,
  key_authors,
  related_lexicon_terms,
  primary_source_title,
  primary_source_authors,
  primary_source_year,
  primary_source_doi,
  primary_source_url
) VALUES (
  'OP-004',
  'competency-trap',
  'Competency Trap',
  ARRAY['Excellence Paradox', 'Mastery Blindness', 'Capability Lock-in', 'Optimization Trap'],
  'An operational pathology where an organization becomes increasingly excellent at capabilities that are becoming obsolete. The organization refines and optimizes legacy competencies even as market demand shifts elsewhere. Leaders selected and rewarded for mastery of the old paradigm are cognitively and economically incapable of leading transition to the new one.',
  'OP',
  'ETI-I',
  'LAT',
  'PER',
  ARRAY[
    'Continued heavy investment in declining technology/capability area',
    'World-class performance metrics in shrinking market segment',
    'Leadership dominated by experts in legacy competency',
    'R&D budget disproportionately allocated to optimizing existing capabilities',
    'New competency initiatives consistently deprioritized or underfunded'
  ],
  ARRAY[
    'Organizational pride in legacy excellence ("we are the best at X")',
    'Dismissal of emerging alternatives as inferior or niche',
    'Continuous improvement programs focused on obsolete capabilities',
    'Promotion of leaders with deep legacy expertise',
    'Marginalization of employees advocating for new competencies',
    'Customer base increasingly concentrated in declining segments',
    'Competitors gaining share with "inferior" but market-aligned offerings',
    'Internal metrics showing improvement while market position deteriorates'
  ],
  ARRAY[
    'Stage 1 - Excellence Achievement: Organization achieves mastery in core competency',
    'Stage 2 - Optimization Focus: Resources directed to refining existing excellence',
    'Stage 3 - Market Shift: External environment begins valuing different capabilities',
    'Stage 4 - Denial and Doubling Down: Organization intensifies legacy investment',
    'Stage 5 - Capability Obsolescence: Excellence becomes irrelevant as market transforms'
  ],
  'Latent until market discontinuity, then rapidly terminal. The organization may show strong performance metrics (efficiency, quality) even as strategic position collapses. The trap is self-reinforcing: excellence creates identity, identity demands preservation, preservation blocks adaptation. Crisis often arrives suddenly when market tips.',
  'Organizational learning theory explains competency traps as exploitation crowding out exploration. Success in current competency generates returns that justify further investment. Learning curves make legacy skills cheaper. Identity and culture form around excellence. Leaders careers are built on legacy competency. All incentives align toward optimization of the known rather than exploration of the unknown.',
  ARRAY[
    'Long history of success in legacy competency',
    'Strong organizational identity tied to specific capability',
    'Leaders promoted from legacy competency track',
    'Compensation tied to efficiency/quality metrics in legacy area',
    'Customer relationships built on legacy excellence',
    'Sunk costs in legacy infrastructure and training',
    'Industry awards and recognition for legacy excellence',
    'Limited exposure to adjacent markets or technologies'
  ],
  ARRAY[
    'Market Denial (refusing to see change vs. excelling at wrong thing)',
    'Pivot Resistance (general change resistance vs. specific capability lock-in)',
    'Structural Inertia (organizational rigidity vs. capability focus)',
    'Gerontocratic Sclerosis (leadership ossification vs. capability ossification)'
  ],
  'Terminal without leadership change and strategic redirection. The very excellence that defines the organization must be deliberately devalued. Requires leaders willing to "cannibalize" legacy business - psychologically difficult when careers were built on that excellence. Often requires external CEO or existential crisis.',
  ARRAY[
    'German automotive industry (diesel engineering excellence)',
    'Kodak (film chemistry excellence while digital emerged)',
    'Nokia (hardware engineering excellence while software became key)',
    'Blockbuster (retail operations excellence while streaming emerged)',
    'Swiss watch industry pre-quartz crisis',
    'Encyclopædia Britannica (editorial excellence while Wikipedia emerged)'
  ],
  ARRAY[
    'Levitt & March (1988) - Organizational Learning',
    'Leonard-Barton (1992) - Core Capabilities and Core Rigidities',
    'Christensen (1997) - The Innovators Dilemma',
    'Tripsas & Gavetti (2000) - Capabilities, Cognition, and Inertia'
  ],
  ARRAY['James March', 'Dorothy Leonard-Barton', 'Clayton Christensen', 'Giovanni Gavetti'],
  ARRAY['competency trap', 'core rigidity', 'exploitation vs exploration', 'capability lock-in', 'success trap'],
  'The Gerontocratic Sclerosis: An Economic and Organizational Autopsy of Leadership Failure in German Corporate Capitalism',
  'Anonymous (SSRN)',
  2025,
  NULL,
  'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=5945554'
);
