-- Add 4 pathologies from Danny Miller's "The Icarus Paradox" (1990/1992)
-- The four trajectories of decline: how exceptional companies bring about their own downfall
-- Source: Miller, D. (1992). The Icarus Paradox. Business Horizons, 35(1), 24-35.

-- SP-003: Tinkerer Syndrome (CRAFTSMAN → TINKERER via Focusing trajectory)
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references, known_cases
) VALUES (
  'SP-003',
  'tinkerer-syndrome',
  'Tinkerer Syndrome',
  ARRAY['Focusing Trajectory', 'Quality Obsession Disorder', 'Engineering Monoculture'],
  'A strategic pathology where quality-driven organizations become so obsessed with technical perfection that they lose sight of customer needs. The organization''s perceptual apparatus narrows until it can only see internal technical standards, rendering it blind to market reality. Success in quality leadership creates momentum toward irrelevant perfection.',
  'SP',
  'ETI-I',
  'CHR',
  'PER',
  ARRAY[
    'Organization has history of quality/engineering excellence',
    'Engineering department dominates organizational culture and decisions',
    'Products are technically superior but losing market share',
    'Customer feedback is dismissed as "not understanding the technology"',
    'Marketing and R&D departments are marginalized'
  ],
  ARRAY[
    'Over-engineered but overpriced products',
    'Technically perfect but market-irrelevant offerings',
    'Dismissal of customer needs as unsophisticated',
    'Rigid adherence to yesterday''s excellent designs',
    'Technocratic monoculture that alienates non-engineers',
    'Bureaucratic controls that perpetuate the past',
    'Suppression of initiative outside engineering'
  ],
  ARRAY[
    'History of quality-based competitive advantage',
    'Strong engineering culture and identity',
    'Success that reinforces technical focus',
    'Dominant engineering department with political power',
    'Leaders who rose through technical ranks'
  ],
  ARRAY['Danny Miller'],
  ARRAY[
    'Miller, D. (1990). The Icarus Paradox: How Exceptional Companies Bring About Their Own Downfall. Harper Business.',
    'Miller, D. (1992). The Icarus Paradox. Business Horizons, 35(1), 24-35.'
  ],
  ARRAY[
    'Digital Equipment Corporation (DEC) - VAX excellence led to ignoring PC market needs',
    'Caterpillar Tractor - quality obsession while Komatsu won on price',
    'IBM - technical superiority while missing market shifts'
  ]
);

-- SP-004: Imperialist Syndrome (BUILDER → IMPERIALIST via Venturing trajectory)
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references, known_cases
) VALUES (
  'SP-004',
  'imperialist-syndrome',
  'Imperialist Syndrome',
  ARRAY['Venturing Trajectory', 'Expansion Addiction', 'Conglomerate Disease'],
  'A strategic pathology where growth-driven organizations become addicted to expansion and acquisition, overtaxing resources by expanding into businesses they do not understand. Success at diversification creates momentum toward empire-building that exceeds organizational capacity. The organization''s executive function becomes paralyzed by complexity.',
  'SP',
  'ETI-I',
  'CHR',
  'EXE',
  ARRAY[
    'Organization has history of successful growth through acquisition',
    'Diversification has moved far from core competencies',
    'Control systems cannot keep pace with organizational complexity',
    'Financial/accounting culture dominates over operational substance',
    'Division managers spend majority of time on head office compliance'
  ],
  ARRAY[
    'Acquisitions in unfamiliar industries',
    'Debt levels becoming unwieldy',
    'Control systems overloaded by complexity',
    'Head office meddling in divisional details',
    'Political games between controllers and divisions',
    'Neglected product lines becoming stale',
    'Corporate culture worshipping growth above all',
    'Substance of business lost in financial abstractions'
  ],
  ARRAY[
    'History of successful acquisitions',
    'Entrepreneurial CEO with empire-building ambitions',
    'Powerful financial/planning staff',
    'Sophisticated control systems creating false confidence',
    'Success that reinforces diversification strategy'
  ],
  ARRAY['Danny Miller'],
  ARRAY[
    'Miller, D. (1990). The Icarus Paradox: How Exceptional Companies Bring About Their Own Downfall. Harper Business.',
    'Miller, D. (1992). The Icarus Paradox. Business Horizons, 35(1), 24-35.'
  ],
  ARRAY[
    'ITT under Harold Geneen - 100 acquisitions in 10 years, 250 profit centers, eventual massive divestiture',
    'Litton Industries - from $3M to $1.8B in 12 years, then dramatic collapse',
    'Dome Petroleum - overexpansion leading to crisis'
  ]
);

-- SP-005: Escapist Syndrome (PIONEER → ESCAPIST via Inventing trajectory)
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references, known_cases
) VALUES (
  'SP-005',
  'escapist-syndrome',
  'Escapist Syndrome',
  ARRAY['Inventing Trajectory', 'R&D Utopia Syndrome', 'Technical Escapism'],
  'A strategic pathology where R&D-driven organizations become lost in pursuit of technological utopia, squandering resources on hopelessly futuristic inventions. Success at innovation creates a cult of invention that loses connection to market reality, production constraints, and economic viability. The organization''s cognitive function becomes detached from practical considerations.',
  'SP',
  'ETI-I',
  'CHR',
  'COG',
  ARRAY[
    'Organization has history of breakthrough innovations',
    'R&D department dominates organizational culture',
    'Development projects are increasingly futuristic and expensive',
    'Marketing and production are viewed as necessary evils',
    'Customers are seen as unsophisticated nuisances'
  ],
  ARRAY[
    'Impractical futuristic products ahead of their time',
    'Products too expensive to develop and buy',
    'Company becoming its own toughest competitor (premature obsolescence)',
    'Goals expressed in technical rather than market terms',
    'Loose structures breeding chaos in complex operations',
    'Scientists dominating with utopian culture',
    'Resources squandered on grand inventions',
    'Long delays and cost overruns in development'
  ],
  ARRAY[
    'History of breakthrough R&D success',
    'Visionary technical leadership (Ph.D.s with missionary zeal)',
    'Flexible think-tank organizational structure',
    'Strong R&D culture and identity',
    'Success that reinforces innovation-at-all-costs mentality'
  ],
  ARRAY['Danny Miller'],
  ARRAY[
    'Miller, D. (1990). The Icarus Paradox: How Exceptional Companies Bring About Their Own Downfall. Harper Business.',
    'Miller, D. (1992). The Icarus Paradox. Business Horizons, 35(1), 24-35.'
  ],
  ARRAY[
    'Control Data Corporation - Seymour Cray''s supercomputers became too futuristic and expensive',
    'Polaroid - innovation obsession while digital photography emerged',
    'Apple Computer (1980s) - technical perfectionism over market needs'
  ]
);

-- SP-006: Drifter Syndrome (SALESMAN → DRIFTER via Decoupling trajectory)
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references, known_cases
) VALUES (
  'SP-006',
  'drifter-syndrome',
  'Drifter Syndrome',
  ARRAY['Decoupling Trajectory', 'Marketing Fetish Disorder', 'Bureaucratic Drift'],
  'A strategic pathology where marketing-driven organizations substitute image for substance, producing bland copycat offerings while becoming mired in bureaucracy. Success in marketing creates belief that anything can be sold, leading to product proliferation without design excellence. The organization''s volitional capacity atrophies as bureaucratic inertia replaces strategic direction.',
  'SP',
  'ETI-I',
  'CHR',
  'VOL',
  ARRAY[
    'Organization has history of marketing excellence',
    'Product lines have proliferated without coherent strategy',
    'Design and manufacturing quality have declined',
    'Bureaucracy has grown oppressive',
    'Turf battles and factionalism impede decision-making'
  ],
  ARRAY[
    'Packaging and advertising substituting for good design',
    'Bland "me too" copycat offerings',
    'Product proliferation without strategic coherence',
    'Remote management-by-numbers',
    'Oppressive bureaucracy',
    'Turf battles between divisions',
    'Simple problems taking months to address',
    'Leader decoupled from company, company from market',
    'Insipid and political corporate culture'
  ],
  ARRAY[
    'History of marketing-based competitive advantage',
    'Strong brand names creating complacency',
    'Success reinforcing belief in selling over substance',
    'Decentralized profit center structure',
    'Leaders who rose through marketing/sales ranks'
  ],
  ARRAY['Danny Miller'],
  ARRAY[
    'Miller, D. (1990). The Icarus Paradox: How Exceptional Companies Bring About Their Own Downfall. Harper Business.',
    'Miller, D. (1992). The Icarus Paradox. Business Horizons, 35(1), 24-35.'
  ],
  ARRAY[
    'Chrysler under Lynn Townsend - image over substance, marketing over engineering',
    'Sears - bureaucratic drift while Walmart and Kmart disrupted',
    'General Motors - brand proliferation and bureaucratic paralysis',
    'A&P - marketing focus while losing operational excellence',
    'Montgomery Ward - bureaucratic inertia leading to extinction'
  ]
);

-- Summary: Added 4 Icarus Paradox pathologies (SP-003 through SP-006)
-- All are ETI-I (iatrogenic/success-induced) with CHR (chronic) course
-- Each represents a trajectory where organizational strengths become fatal weaknesses
