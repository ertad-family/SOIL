-- Add 5 pathologies extracted from Eisenmann "Why Start-ups Fail" (2021)
-- Part of issue #258: Epic: Research Knowledge Base (Phase 2)

-- LP-004: Passion Blindness
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references
) VALUES (
  'LP-004',
  'passion-blindness',
  'Passion Blindness',
  ARRAY['Founder Overconfidence', 'Vision Attachment Disorder'],
  'A leadership pathology where emotional attachment to a vision impairs the organization''s ability to perceive market reality, customer feedback, and product-market fit signals. The organization becomes cognitively compromised by its own enthusiasm.',
  'LP',
  'ETI-F',
  'CHR',
  'PER',
  ARRAY[
    'Founder demonstrates strong emotional attachment to original vision',
    'Negative customer feedback is systematically dismissed or reframed',
    'Market research findings are ignored when contradicting the vision',
    'Product development continues despite clear product-market fit problems'
  ],
  ARRAY[
    'Dismissal of negative customer feedback',
    'Overconfidence in product-market fit',
    'Selective attention to confirming signals',
    'Resistance to market research findings',
    'Attribution of failures to external factors'
  ],
  ARRAY[
    'First-time founders with deep personal investment in idea',
    'Founders who quit stable careers for the venture',
    'Strong early validation from friends/family',
    'Previous success leading to overconfidence'
  ],
  ARRAY['Tom Eisenmann'],
  ARRAY['Eisenmann, T. (2021). Why Startups Fail: A New Roadmap for Entrepreneurial Success. Currency.']
);

-- LP-005: Decision Authority Diffusion
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references, known_cases
) VALUES (
  'LP-005',
  'decision-authority-diffusion',
  'Decision Authority Diffusion',
  ARRAY['Co-founder Paralysis', 'Shared Authority Syndrome'],
  'A leadership pathology where shared or unclear decision-making authority prevents timely organizational response. The organization cannot execute decisions because authority is distributed without clear resolution mechanisms.',
  'LP',
  'ETI-F',
  'ACU',
  'EXE',
  ARRAY[
    'Multiple founders share equal decision-making authority',
    'No clear tie-breaking mechanism exists for disagreements',
    'Decision delays are observable during critical moments',
    'Personal relationships interfere with professional disagreement'
  ],
  ARRAY[
    'Delayed responses to market signals',
    'Prolonged debates without resolution',
    'Avoidance of contentious decisions',
    'Consensus-seeking paralysis',
    'Decision fatigue across leadership'
  ],
  ARRAY[
    'Co-founders who are close friends or family',
    'Equal equity splits without governance structure',
    'Conflict-avoidant leadership personalities',
    'Lack of board or advisory oversight'
  ],
  ARRAY['Tom Eisenmann'],
  ARRAY['Eisenmann, T. (2021). Why Startups Fail: A New Roadmap for Entrepreneurial Success. Currency.'],
  ARRAY['Quincy Apparel - co-founders Wallace and Nelson shared equal authority, slowing critical decisions']
);

-- OP-002: Discovery Deficit Syndrome
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references, known_cases
) VALUES (
  'OP-002',
  'discovery-deficit-syndrome',
  'Discovery Deficit Syndrome',
  ARRAY['False Start Pattern', 'Premature Build Syndrome'],
  'An operational pathology where the organization fails to conduct adequate environmental sensing before committing resources. The organization acts before it can perceive, leading to systematic misallocation of effort.',
  'OP',
  'ETI-F',
  'ACU',
  'SEN',
  ARRAY[
    'Product development begins without customer discovery research',
    'MVP launches occur before validating core assumptions',
    'Multiple pivots happen in rapid succession',
    'Engineering-led roadmap without customer input'
  ],
  ARRAY[
    'Product development without customer research',
    'Premature MVP launches',
    'Engineering-led rather than customer-led roadmaps',
    'Multiple pivots in short succession',
    'Resource depletion from repeated false starts'
  ],
  ARRAY[
    'Technical founders eager to build',
    'Lean startup misinterpretation (fail fast without learning)',
    'Pressure from investors to show progress',
    'Fear of idea being stolen'
  ],
  ARRAY['Tom Eisenmann', 'Steve Blank'],
  ARRAY[
    'Eisenmann, T. (2021). Why Startups Fail: A New Roadmap for Entrepreneurial Success. Currency.',
    'Blank, S. (2013). Why the Lean Start-up Changes Everything. Harvard Business Review.'
  ],
  ARRAY['Triangulate/Wings/DateBuzz - three major pivots in two years due to skipping customer discovery']
);

-- LP-006: Pivot Resistance
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references
) VALUES (
  'LP-006',
  'pivot-resistance',
  'Pivot Resistance',
  ARRAY['Strategic Stubbornness', 'Sunk Cost Syndrome'],
  'A leadership pathology where persistence becomes pathological stubbornness, preventing the organization from recognizing and responding to clear signals that strategic change is required.',
  'LP',
  'ETI-F',
  'CHR',
  'VOL',
  ARRAY[
    'Leadership continues investment in failing strategies despite clear signals',
    'Sunk cost arguments dominate strategic discussions',
    'Board or advisor feedback is consistently rejected',
    'Capital runway depletes without strategic adjustment'
  ],
  ARRAY[
    'Continued investment in failing strategies',
    'Reframing failures as temporary setbacks',
    'Resistance to board/advisor feedback',
    'Sunk cost rationalization',
    'Capital depletion without strategic adjustment'
  ],
  ARRAY[
    'Founders with high personal investment in original idea',
    'Previous success reinforcing stubbornness',
    'Lack of experienced advisors or board',
    'Echo chamber of supportive team members'
  ],
  ARRAY['Tom Eisenmann'],
  ARRAY['Eisenmann, T. (2021). Why Startups Fail: A New Roadmap for Entrepreneurial Success. Currency.']
);

-- OP-003: Competence-Complexity Mismatch
INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, risk_factors, key_authors, literature_references, known_cases
) VALUES (
  'OP-003',
  'competence-complexity-mismatch',
  'Competence-Complexity Mismatch',
  ARRAY['Domain Expertise Gap', 'Industry Knowledge Deficit'],
  'An operational pathology where the organization''s knowledge and expertise are insufficient for the complexity of its chosen domain, leading to systematic errors in execution.',
  'OP',
  'ETI-F',
  'CHR',
  'COG',
  ARRAY[
    'Founders lack industry experience in chosen domain',
    'Repeated operational errors from domain ignorance',
    'Inability to anticipate industry-specific challenges',
    'Learning curve outpaces available runway'
  ],
  ARRAY[
    'Repeated operational errors',
    'Underestimation of domain complexity',
    'Inability to anticipate industry-specific challenges',
    'Difficulty recruiting domain experts',
    'Learning curve outpaces runway'
  ],
  ARRAY[
    'Founders entering unfamiliar industries',
    'Industries with high regulatory or operational complexity',
    'Ventures requiring specialized supply chains',
    'Domains with established incumbent relationships'
  ],
  ARRAY['Tom Eisenmann'],
  ARRAY['Eisenmann, T. (2021). Why Startups Fail: A New Roadmap for Entrepreneurial Success. Currency.'],
  ARRAY['Quincy Apparel - founders lacked fashion industry experience, leading to production problems and poor vendor relationships']
);

-- Verify inserts
-- SELECT code, name, localization, primary_etiology, functional_impairment FROM pathology_classification WHERE code LIKE 'LP-00%' OR code LIKE 'OP-00%' ORDER BY code;
