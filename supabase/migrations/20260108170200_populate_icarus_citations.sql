-- Populate primary source citation fields for Icarus Paradox pathologies
-- Source: Miller, D. (1992). The Icarus Paradox. Harper Business.

UPDATE pathology_classification
SET
  primary_source_title = 'The Icarus Paradox: How Exceptional Companies Bring About Their Own Downfall',
  primary_source_authors = 'Danny Miller',
  primary_source_year = 1992,
  primary_source_journal = 'Harper Business'
WHERE code IN ('SP-003', 'SP-004', 'SP-005', 'SP-006');
