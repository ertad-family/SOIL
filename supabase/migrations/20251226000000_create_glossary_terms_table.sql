-- ============================================================================
-- GLOSSARY TERMS TABLE
-- Stores project-specific terminology for the SOIL glossary page
-- ============================================================================

-- Create glossary_terms table
CREATE TABLE IF NOT EXISTS public.glossary_terms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  term TEXT NOT NULL UNIQUE,
  definition TEXT NOT NULL,
  category TEXT NOT NULL,
  link_text TEXT,
  link_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add comment to table
COMMENT ON TABLE public.glossary_terms IS 'Stores SOIL project-specific terminology for the glossary page';

-- Add comments to columns
COMMENT ON COLUMN public.glossary_terms.term IS 'The glossary term (unique)';
COMMENT ON COLUMN public.glossary_terms.definition IS 'Definition of the term';
COMMENT ON COLUMN public.glossary_terms.category IS 'Category grouping (e.g., "Core Concepts", "Places & Objects")';
COMMENT ON COLUMN public.glossary_terms.link_text IS 'Optional link text (e.g., "Learn more")';
COMMENT ON COLUMN public.glossary_terms.link_url IS 'Optional link URL (e.g., "/about/verification")';
COMMENT ON COLUMN public.glossary_terms.sort_order IS 'Order within category for display';

-- Create indexes
CREATE INDEX idx_glossary_terms_category ON public.glossary_terms(category);
CREATE INDEX idx_glossary_terms_sort_order ON public.glossary_terms(sort_order);

-- Enable Row Level Security
ALTER TABLE public.glossary_terms ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read glossary terms
CREATE POLICY "Anyone can read glossary terms"
  ON public.glossary_terms
  FOR SELECT
  USING (true);

-- Policy: Only admins can insert/update/delete glossary terms
CREATE POLICY "Admins can manage glossary terms"
  ON public.glossary_terms
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- Trigger function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_glossary_terms_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER glossary_terms_updated
  BEFORE UPDATE ON public.glossary_terms
  FOR EACH ROW
  EXECUTE FUNCTION update_glossary_terms_timestamp();
