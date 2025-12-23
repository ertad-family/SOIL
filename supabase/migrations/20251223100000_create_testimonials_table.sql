-- Create testimonials table for user feedback collection
-- Part of issue #172: Implement user testimonials collection system

-- ============================================================================
-- TESTIMONIALS: User feedback and testimonials collection
-- ============================================================================
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Content
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),

  -- Context - what prompted this testimonial
  type TEXT NOT NULL CHECK (type IN (
    'story_contribution',   -- After story is coined
    'chapter_completion',   -- After completing an interview chapter
    'cenotaph_design',      -- After cenotaph design is completed
    'general',              -- General visitor feedback
    'community',            -- Community page feedback
    'organization'          -- After visiting an organization
  )),
  context_id UUID,          -- story_id, memorial_id, chapter identifier, etc.
  context_metadata JSONB DEFAULT '{}',  -- e.g., { "chapter": "functional", "org_name": "..." }

  -- Visibility settings
  is_public BOOLEAN DEFAULT false,      -- User consent for public display
  display_name TEXT,                     -- How user wants to be identified (NULL = anonymous)

  -- Admin moderation
  is_featured BOOLEAN DEFAULT false,    -- Featured on homepage/marketing
  is_approved BOOLEAN DEFAULT false,    -- Manual review before public display

  -- Visitor tracking for anonymous feedback
  visitor_fingerprint TEXT,             -- For anonymous visitors

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_testimonials_user ON testimonials(user_id);
CREATE INDEX idx_testimonials_type ON testimonials(type);
CREATE INDEX idx_testimonials_public ON testimonials(is_public) WHERE is_public = true;
CREATE INDEX idx_testimonials_approved ON testimonials(is_approved) WHERE is_approved = true;
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;
CREATE INDEX idx_testimonials_created ON testimonials(created_at DESC);
CREATE INDEX idx_testimonials_context ON testimonials(type, context_id);
CREATE INDEX idx_testimonials_fingerprint ON testimonials(visitor_fingerprint);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_testimonials_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER testimonials_updated_at
  BEFORE UPDATE ON testimonials
  FOR EACH ROW
  EXECUTE FUNCTION update_testimonials_updated_at();

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Anyone can insert testimonials (including anonymous visitors)
CREATE POLICY "Anyone can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (true);

-- Users can read their own testimonials
CREATE POLICY "Users can read own testimonials"
  ON testimonials FOR SELECT
  USING (auth.uid() = user_id);

-- Anyone can read approved public testimonials
CREATE POLICY "Anyone can read approved public testimonials"
  ON testimonials FOR SELECT
  USING (is_public = true AND is_approved = true);

-- Users can update their own testimonials (before approval)
CREATE POLICY "Users can update own unapproved testimonials"
  ON testimonials FOR UPDATE
  USING (auth.uid() = user_id AND is_approved = false)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own testimonials
CREATE POLICY "Users can delete own testimonials"
  ON testimonials FOR DELETE
  USING (auth.uid() = user_id);

-- Service role has full access
CREATE POLICY "Service role can manage testimonials"
  ON testimonials FOR ALL
  USING (auth.role() = 'service_role');

-- Admins can read and update all testimonials
CREATE POLICY "Admins can read all testimonials"
  ON testimonials FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

CREATE POLICY "Admins can update all testimonials"
  ON testimonials FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================================
-- HELPER FUNCTION: Get testimonials for display
-- ============================================================================
CREATE OR REPLACE FUNCTION get_public_testimonials(
  testimonial_type TEXT DEFAULT NULL,
  limit_count INTEGER DEFAULT 10,
  featured_only BOOLEAN DEFAULT false
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  rating INTEGER,
  type TEXT,
  display_name TEXT,
  is_featured BOOLEAN,
  created_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    t.id,
    t.content,
    t.rating,
    t.type,
    t.display_name,
    t.is_featured,
    t.created_at
  FROM testimonials t
  WHERE t.is_public = true
    AND t.is_approved = true
    AND (testimonial_type IS NULL OR t.type = testimonial_type)
    AND (NOT featured_only OR t.is_featured = true)
  ORDER BY t.is_featured DESC, t.created_at DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
