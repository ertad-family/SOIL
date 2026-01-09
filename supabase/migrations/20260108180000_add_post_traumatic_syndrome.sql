-- Add CP-002: Organizational Post-Traumatic Syndrome
-- Based on: Winter, R. (2019). Organizational Trauma: A Phenomenological Study of Leaders in Organizations
-- Experiencing Ongoing Traumatic Events. Cranfield University School of Management.
-- Also informed by: Camilo, J. (2020). A logic of care and Organizational Trauma in times of COVID-19 in Brazil.

-- First, add ETI-E (External shock) to the etiology enum
ALTER TYPE pathology_etiology ADD VALUE IF NOT EXISTS 'ETI-E' AFTER 'ETI-I';

COMMENT ON TYPE pathology_etiology IS
  'Pathology etiology (cause). ETI-F=Founder, ETI-M=Market, ETI-C=Competition,
   ETI-R=Regulatory, ETI-T=Technology, ETI-S=Stochastic, ETI-I=Iatrogenic (success-induced),
   ETI-E=External (shock/trauma from external events)';

INSERT INTO pathology_classification (
  code, slug, name, alternative_names, definition, localization, primary_etiology, typical_course, functional_impairment,
  diagnostic_criteria, symptoms, stages, course_description, etiology_explanation, risk_factors,
  differential_diagnosis, prognosis, key_authors, literature_references, known_cases
) VALUES (
  'CP-002',
  'organizational-post-traumatic-syndrome',
  'Organizational Post-Traumatic Syndrome',
  ARRAY['Corporate PTSD', 'Institutional PTSD', 'Organizational Trauma Legacy', 'Collective Trauma Response'],
  'A chronic cultural pathology characterized by persistent organizational dysfunction following exposure to severe organizational trauma. Unlike the acute trauma event itself, this syndrome manifests as lasting changes to organizational culture, trust systems, collective memory, and adaptive capacity that persist long after the triggering event has resolved. The organization exhibits patterns analogous to individual PTSD: avoidance, hypervigilance, intrusive memories, and impaired functioning.',
  'CP',
  'ETI-E',
  'CHR',
  'AFF',
  ARRAY[
    'History of severe organizational trauma (collapse, scandal, mass layoffs, hostile takeover, natural disaster)',
    'Persistent trust deficit among members lasting >12 months post-event',
    'Collective avoidance of trauma-related topics, decisions, or organizational areas',
    'Re-traumatization responses when encountering triggers reminiscent of the original event',
    'Impaired organizational learning - inability to discuss or learn from the traumatic period',
    'Significant portion of workforce exhibits trauma-related symptoms (burnout, disengagement, anxiety)'
  ],
  ARRAY[
    'Collective denial and avoidance behaviors around trauma-related topics',
    'Persistent distrust of leadership, institutions, or change initiatives',
    'Survivor guilt among remaining members who outlasted layoffs or crisis',
    'Learned helplessness in decision-making ("nothing we do matters")',
    'Hypervigilance to perceived threats - overreaction to minor setbacks',
    'Difficulty forming new trust relationships with leaders or partners',
    'Organizational "flashbacks" - panic responses when facing similar situations',
    'Difficulty recruiting/retaining talent due to traumatic reputation',
    'Collective resignation and apathy ("organizational burnout")',
    'Fragmented organizational memory - conflicting narratives about what happened',
    'Chronic low morale unresponsive to typical interventions',
    'Risk aversion that impedes necessary adaptation'
  ],
  ARRAY[
    'Stage 1 - Acute Crisis: Immediate response to traumatic event (shock, chaos, survival mode)',
    'Stage 2 - False Recovery: Apparent stabilization while trauma is suppressed ("let''s move on")',
    'Stage 3 - Chronic Dysfunction: Persistent symptoms emerge as unprocessed trauma manifests',
    'Stage 4 - Institutionalization: Trauma responses become embedded in culture and processes',
    'Stage 5 - Intergenerational Transfer: New members absorb trauma culture without direct experience'
  ],
  'The syndrome follows a predictable trajectory from acute crisis through false recovery to chronic dysfunction. Organizations often attempt to "move on" without processing the trauma, leading to suppression rather than healing. Symptoms may appear manageable initially but become deeply embedded in organizational culture over time. Without intervention, the syndrome can persist for decades, transmitted to new employees through cultural osmosis. Recovery requires deliberate acknowledgment and processing of the traumatic events.',
  'Organizational trauma typically results from external shocks (ETI-E) such as economic crises, natural disasters, hostile takeovers, public scandals, or sudden leadership betrayal. The pathology develops not from the trauma itself but from inadequate organizational processing of the experience. Organizations that attempt to suppress or deny the trauma, or that lack psychological safety to discuss it, are most likely to develop chronic post-traumatic syndrome. The severity correlates with: (1) intensity of the original trauma, (2) degree of trust violation involved, (3) extent of unacknowledged losses, and (4) absence of collective meaning-making.',
  ARRAY[
    'Severe organizational crisis (bankruptcy, scandal, regulatory action)',
    'Mass layoffs affecting >20% of workforce',
    'Sudden leadership loss, betrayal, or public disgrace',
    'Hostile merger/acquisition with cultural destruction',
    'Public humiliation or reputation damage',
    'Repeated smaller traumas without adequate recovery time',
    'Organizational culture that discourages emotional expression',
    'Leadership that demands "moving on" without processing',
    'High-trust organizations where betrayal feels more acute',
    'Organizations with strong identity that was threatened'
  ],
  ARRAY[
    'Cultural Toxicity (CP-001): May co-occur but OPTS has specific trauma origin and flashback patterns',
    'Structural Inertia (SP-001): OPTS involves active avoidance rather than passive resistance',
    'Leadership Vacuum (LP-003): OPTS can cause leadership dysfunction but has broader cultural symptoms',
    'Normal post-crisis adjustment: Distinguished by duration (>12 months) and severity of symptoms'
  ],
  'Prognosis varies significantly based on intervention timing and approach. Early acknowledgment and processing of trauma can prevent chronic syndrome development. Once institutionalized, recovery requires sustained effort over 3-5 years including: (1) leadership acknowledgment of what happened, (2) safe spaces for collective memory processing, (3) ritual/symbolic acts of closure, (4) rebuilding trust through consistent behavior. Organizations that attempt cosmetic fixes without addressing underlying trauma typically experience recurring symptoms. Full recovery is possible but rare without deliberate trauma-informed intervention.',
  ARRAY['Robert Winter', 'Juliana Camilo', 'Yiannis Gabriel', 'Peter Frost'],
  ARRAY[
    'Winter, R. (2019). Organizational Trauma: A Phenomenological Study of Leaders in Organizations Experiencing Ongoing Traumatic Events. Cranfield University.',
    'Camilo, J. (2020). A logic of care and Organizational Trauma in times of COVID-19 in Brazil. RAE-Revista de Administração de Empresas.',
    'Gabriel, Y. (2012). Organizations in a State of Darkness: Towards a Theory of Organizational Miasma. Organization Studies.',
    'Frost, P. (2003). Toxic Emotions at Work: How Compassionate Managers Handle Pain and Conflict. Harvard Business School Press.'
  ],
  ARRAY[
    'Austrian regional bank (Winter 2019 case study) - collapse led to years of collective trauma symptoms',
    'Enron survivors at successor companies - persistent trust issues and hypervigilance',
    'Nokia after smartphone collapse - organizational grief and identity loss',
    'Boeing after 737 MAX crisis - cultural trauma affecting decision-making',
    'Many organizations post-COVID - unprocessed collective trauma from crisis period'
  ]
);

-- Summary: Added CP-002 Organizational Post-Traumatic Syndrome
-- Also added ETI-E (External shock) to pathology_etiology enum
-- Localization: CP (Cultural Pathology)
-- Etiology: ETI-E (External shock)
-- Course: CHR (Chronic)
-- Functional Impairment: AFF (Affective - trust, emotional, relational dysfunction)
