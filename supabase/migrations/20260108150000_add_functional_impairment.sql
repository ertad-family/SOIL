-- Add Functional Impairment axis to SOIL-PC taxonomy (v2.0)
-- Part of issue #258: Epic: Research Knowledge Base (Phase 2)
-- This migration adds the 4th classification axis: what organizational faculty is impaired

-- ============================================================================
-- NEW ENUM: Functional Impairment
-- ============================================================================

-- What organizational faculty is broken/impaired
CREATE TYPE pathology_functional_impairment AS ENUM (
  'SEN',  -- Sensing: inability to detect environmental signals
  'PER',  -- Perception: misinterpretation of detected signals
  'COG',  -- Cognition: impaired reasoning and analysis
  'AFF',  -- Affect: emotional/cultural dysfunction
  'EXE',  -- Executive: inability to plan/coordinate/execute
  'VOL',  -- Volition: lacks will or motivation to act
  'MEM',  -- Memory: cannot learn from experience or retain knowledge
  'IDE'   -- Identity: confused about purpose or self-understanding
);

-- Add comment for documentation
COMMENT ON TYPE pathology_functional_impairment IS
  'Functional impairment classification - what organizational faculty is broken.
   Borrowed from medical classification of functional impairments.
   SEN=Sensing, PER=Perception, COG=Cognition, AFF=Affect,
   EXE=Executive, VOL=Volition, MEM=Memory, IDE=Identity';

-- ============================================================================
-- ADD NEW ETIOLOGY VALUE: Iatrogenic (success-induced)
-- ============================================================================

-- Add iatrogenic etiology for pathologies caused by success
-- Note: ALTER TYPE ... ADD VALUE cannot be rolled back in a transaction
ALTER TYPE pathology_etiology ADD VALUE IF NOT EXISTS 'ETI-I' AFTER 'ETI-S';

COMMENT ON TYPE pathology_etiology IS
  'Pathology etiology (cause). ETI-F=Founder, ETI-M=Market, ETI-C=Competition,
   ETI-R=Regulatory, ETI-T=Technology, ETI-S=Stochastic, ETI-I=Iatrogenic (success-induced)';

-- ============================================================================
-- ADD COLUMN TO pathology_classification
-- ============================================================================

ALTER TABLE pathology_classification
ADD COLUMN IF NOT EXISTS functional_impairment pathology_functional_impairment;

-- Create index for filtering by functional impairment
CREATE INDEX IF NOT EXISTS idx_pathology_functional_impairment
ON pathology_classification(functional_impairment);

-- ============================================================================
-- UPDATE EXISTING PATHOLOGIES WITH FUNCTIONAL IMPAIRMENT
-- ============================================================================

-- LP-001: Founder's Syndrome - Identity impairment (org identity fused with founder)
UPDATE pathology_classification
SET functional_impairment = 'IDE'
WHERE code = 'LP-001';

-- LP-002: Corporate Psychopathy - Affect impairment (emotional/ethical dysfunction)
UPDATE pathology_classification
SET functional_impairment = 'AFF'
WHERE code = 'LP-002';

-- LP-003: Leadership Vacuum - Executive impairment (no one to plan/coordinate)
UPDATE pathology_classification
SET functional_impairment = 'EXE'
WHERE code = 'LP-003';

-- SP-001: Structural Inertia - Executive impairment (cannot adapt/coordinate change)
-- Note: This is iatrogenic - caused by successful optimization
UPDATE pathology_classification
SET functional_impairment = 'EXE',
    primary_etiology = 'ETI-I'
WHERE code = 'SP-001';

-- SP-002: Organizational Obesity - Executive impairment (coordination overhead)
UPDATE pathology_classification
SET functional_impairment = 'EXE'
WHERE code = 'SP-002';

-- FP-001: Cash Flow Starvation - Sensing impairment (failed to sense cash needs)
-- Could also be COG (miscalculated) or EXE (failed to execute cash management)
UPDATE pathology_classification
SET functional_impairment = 'EXE'
WHERE code = 'FP-001';

-- FP-002: Zombie Organization - Volition impairment (no will to grow/change)
UPDATE pathology_classification
SET functional_impairment = 'VOL'
WHERE code = 'FP-002';

-- CP-001: Cultural Toxicity - Affect impairment (emotional/cultural dysfunction)
UPDATE pathology_classification
SET functional_impairment = 'AFF'
WHERE code = 'CP-001';

-- MP-001: Market Denial - Perception impairment (misinterprets market signals)
UPDATE pathology_classification
SET functional_impairment = 'PER'
WHERE code = 'MP-001';

-- OP-001: Technical Debt Collapse - Memory impairment (failed to retain/document)
-- Could also be EXE (failed to coordinate maintenance)
UPDATE pathology_classification
SET functional_impairment = 'MEM'
WHERE code = 'OP-001';

-- ============================================================================
-- VERIFY UPDATES
-- ============================================================================

-- This will show all pathologies with their new functional_impairment values
-- SELECT code, name, localization, primary_etiology, typical_course, functional_impairment
-- FROM pathology_classification
-- ORDER BY code;
