-- ============================================================================
-- POPULATE GLOSSARY TERMS
-- Initial data for SOIL glossary
-- ============================================================================

INSERT INTO public.glossary_terms (term, definition, category, link_text, link_url, sort_order) VALUES

-- Core Concepts (sort_order 1-5)
('SOIL',
 'Social Organizational Intelligence Lab - research platform for organizational autopsy data collection. A research-first nonprofit project devoted to collecting organizational autopsy data at scale to establish a new scientific field: Organizational Biology, Health, and Medicine.',
 'Core Concepts', NULL, NULL, 1),

('Organizational Autopsy',
 'Systematic analysis of why organizations die. Similar to medical autopsy, this process examines the complete lifecycle, structure, and causes of organizational closure to extract valuable lessons for future ventures.',
 'Core Concepts', NULL, NULL, 2),

('Organizational Biology/Medicine',
 'The new scientific field SOIL aims to create. Just as medical science developed through systematic autopsy of human bodies, organizational medicine seeks to understand organizational health and mortality through rigorous research and data collection.',
 'Core Concepts', NULL, NULL, 3),

('Organizational Mortality',
 'The death or closure of organizations. SOIL studies this phenomenon systematically to identify patterns, causes, and preventive measures.',
 'Core Concepts', NULL, NULL, 4),

('Framework-Agnostic Approach',
 'SOIL''s core research methodology - collecting data in neutral formats without imposing a single theoretical framework, then applying multiple analytical lenses (biology, economics, sociology, etc.) post-hoc to test which best explain organizational mortality.',
 'Core Concepts', NULL, NULL, 5),

-- Places & Objects (sort_order 10-14)
('Cenotaph',
 'Monument honoring an organization whose ''body'' is gone. A digital memorial created by founders to preserve the story, data, and lessons of their closed organization. Each cenotaph includes structured interview data, timeline, and narrative.',
 'Places & Objects', NULL, NULL, 10),

('Cenotaphery',
 'Virtual cemetery where cenotaphs stand, organized geographically. Each region has its own cenotaphery (country, state, city level) that can hold a configurable number of cenotaphs before splitting into smaller geographic units.',
 'Places & Objects', NULL, NULL, 11),

('Crypt',
 'Secure storage for documents, code, and media from the failed organization. Preserves digital artifacts associated with the organization for future reference and research.',
 'Places & Objects', NULL, NULL, 12),

('Roman Dodecahedron',
 'Ancient bronze artifact (2nd-4th century AD) that serves as SOIL''s navigation interface and central symbol. Features 12 pentagonal faces with circular holes of varying diameters and 20 vertices topped with small spheres. Its unknown purpose mirrors lost organizational knowledge that SOIL seeks to preserve.',
 'Places & Objects', 'Discover the symbolism', '/about/dodecahedron', 13),

-- People & Roles (sort_order 20-24)
('Keeper',
 'Regional moderator and community leader who operates a cenotaphery. Keepers review cenotaphs, moderate community, organize local events including Day of the Dead Venture, and earn revenue from their region''s activities.',
 'People & Roles', NULL, NULL, 20),

('Pathologist',
 'Professional who conducts founder interviews. Trained interviewers who guide founders through the structured autopsy process, extracting detailed data while providing therapeutic support during the closure process.',
 'People & Roles', NULL, NULL, 21),

('Founder',
 'Person who created or led the failed organization. Founders contribute their organizational stories through the interview process, creating cenotaphs and joining the community of those who have experienced closure.',
 'People & Roles', NULL, NULL, 22),

('Contributor',
 'Community member who contributes code, translations, or other improvements to the SOIL platform. Contributors earn recognition and may qualify for Keeper or staff positions.',
 'People & Roles', NULL, NULL, 23),

-- Interview System (sort_order 30-34)
('Wizard',
 'Interview modules for structured data collection. Six modules: Functional Mapping, Financial Picture, Dynamic Picture, Environment Analysis, Founder Context, and Narrative. Each wizard captures different aspects of the organizational story.',
 'Interview System', NULL, NULL, 30),

('Peak Operations',
 'Temporal anchor - the moment when the organization was working at its best. All functional data is collected at this point to capture maximum capabilities and minimize bias from the final crisis period.',
 'Interview System', NULL, NULL, 31),

('Verification',
 'Process ensuring authenticity of cenotaphs through social verification (3+ colleague confirmations) or documentary verification (official documents). Only verified data can be used in organizational research. Allows publishing organization name publicly.',
 'Interview System', 'Learn more about verification', '/about/verification', 32),

('Publicity Tiers',
 'Founder-controlled visibility levels: Full Anonymity (default - pattern and data only), Pseudonym + Story (industry, geography, dates without names), or Full Publicity (organization name, founder name, AI-generated summary visible).',
 'Interview System', NULL, NULL, 33),

-- Events & Awards (sort_order 40-42)
('Day of the Dead Venture',
 'Annual global celebration on October 19th honoring failed organizations. Features global virtual ceremony, local gatherings led by Keepers, founder stories, and announcement of the Cenotavr Award. Date chosen to coincide with Black Monday 1987 - the largest single-day global market crash.',
 'Events & Awards', NULL, NULL, 40),

('Cenotavr Award',
 'Annual award for most impactful cenotaph, determined by community engagement metrics during the year. Announced during Day of the Dead Venture ceremony. Purely metric-based with no applications or jury - every public, verified cenotaph is automatically eligible.',
 'Events & Awards', NULL, NULL, 41),

-- Navigation & Interface (sort_order 50-52)
('Portal',
 'Circular holes in the dodecahedron''s pentagonal faces that serve as navigation entry points. Users fly through these portals to access different sections of the SOIL platform. Hole diameters vary to indicate section importance.',
 'Navigation & Interface', NULL, NULL, 50),

('Vertex Sphere',
 'Small spheres topping the 20 vertices of the dodecahedron (matching the original Roman artifact). Serve as secondary navigation for utility functions like profile, settings, search, and notifications. Clicking a sphere takes users inside for a 360° panoramic interface.',
 'Navigation & Interface', NULL, NULL, 51);
