-- Create analytics tables for internal tracking and K-factor calculation
-- Part of issue #168: Internal analytics dashboard

-- ============================================================================
-- ANALYTICS_EVENTS: Main event tracking table
-- ============================================================================
CREATE TABLE analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name TEXT NOT NULL,
  event_category TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  visitor_fingerprint TEXT,
  properties JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for common queries
CREATE INDEX idx_analytics_events_name ON analytics_events(event_name);
CREATE INDEX idx_analytics_events_category ON analytics_events(event_category);
CREATE INDEX idx_analytics_events_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_events_user ON analytics_events(user_id);
CREATE INDEX idx_analytics_events_fingerprint ON analytics_events(visitor_fingerprint);
CREATE INDEX idx_analytics_events_name_created ON analytics_events(event_name, created_at DESC);

-- ============================================================================
-- LINK_TOKENS: Tracking tokens for shareable links
-- ============================================================================
CREATE TABLE link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT UNIQUE NOT NULL,
  token_type TEXT NOT NULL CHECK (token_type IN ('share', 'verify', 'invite', 'email')),
  source_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  source_memorial_id UUID REFERENCES memorials(id) ON DELETE SET NULL,
  platform TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for token lookups
CREATE INDEX idx_link_tokens_type ON link_tokens(token_type);
CREATE INDEX idx_link_tokens_user ON link_tokens(source_user_id);
CREATE INDEX idx_link_tokens_memorial ON link_tokens(source_memorial_id);
CREATE INDEX idx_link_tokens_created ON link_tokens(created_at DESC);

-- ============================================================================
-- TOKEN_EVENTS: Events triggered by token usage (clicks, conversions)
-- ============================================================================
CREATE TABLE token_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  token TEXT NOT NULL REFERENCES link_tokens(token) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('click', 'signup', 'cenotaph_created')),
  visitor_fingerprint TEXT,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for token event queries
CREATE INDEX idx_token_events_token ON token_events(token);
CREATE INDEX idx_token_events_type ON token_events(event_type);
CREATE INDEX idx_token_events_created ON token_events(created_at DESC);

-- ============================================================================
-- INFRASTRUCTURE_USAGE: Snapshots of resource usage
-- ============================================================================
CREATE TABLE infrastructure_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider TEXT NOT NULL CHECK (provider IN ('vercel', 'supabase')),
  metric_name TEXT NOT NULL,
  current_value NUMERIC NOT NULL DEFAULT 0,
  limit_value NUMERIC NOT NULL DEFAULT 0,
  percentage_used NUMERIC GENERATED ALWAYS AS (
    CASE WHEN limit_value > 0 THEN ROUND((current_value / limit_value * 100)::numeric, 2) ELSE 0 END
  ) STORED,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for infrastructure queries
CREATE INDEX idx_infra_provider ON infrastructure_usage(provider);
CREATE INDEX idx_infra_metric ON infrastructure_usage(metric_name);
CREATE INDEX idx_infra_recorded ON infrastructure_usage(recorded_at DESC);
CREATE INDEX idx_infra_provider_metric_recorded ON infrastructure_usage(provider, metric_name, recorded_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================================================

-- Analytics Events
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert analytics events"
  ON analytics_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage analytics events"
  ON analytics_events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can read analytics events"
  ON analytics_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Link Tokens
ALTER TABLE link_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read link tokens"
  ON link_tokens FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create link tokens"
  ON link_tokens FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Service role can manage link tokens"
  ON link_tokens FOR ALL
  USING (auth.role() = 'service_role');

-- Token Events
ALTER TABLE token_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert token events"
  ON token_events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can manage token events"
  ON token_events FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can read token events"
  ON token_events FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- Infrastructure Usage
ALTER TABLE infrastructure_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage infrastructure usage"
  ON infrastructure_usage FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Admins can read infrastructure usage"
  ON infrastructure_usage FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- ============================================================================
-- HELPER FUNCTIONS FOR K-FACTOR CALCULATION
-- ============================================================================

-- Function to calculate K-factor for a given time period
CREATE OR REPLACE FUNCTION calculate_k_factor(days_back INTEGER DEFAULT 30)
RETURNS TABLE (
  invites_per_user NUMERIC,
  conversion_rate NUMERIC,
  k_factor NUMERIC,
  total_shares INTEGER,
  total_clicks INTEGER,
  total_conversions INTEGER,
  active_users INTEGER
) AS $$
BEGIN
  RETURN QUERY
  WITH metrics AS (
    SELECT
      COUNT(DISTINCT lt.source_user_id) FILTER (WHERE lt.token_type = 'share') as users_who_shared,
      COUNT(*) FILTER (WHERE lt.token_type = 'share') as share_count,
      COUNT(*) FILTER (WHERE te.event_type = 'click') as click_count,
      COUNT(*) FILTER (WHERE te.event_type = 'cenotaph_created') as conversion_count
    FROM link_tokens lt
    LEFT JOIN token_events te ON lt.token = te.token
    WHERE lt.created_at > NOW() - (days_back || ' days')::INTERVAL
  ),
  active AS (
    SELECT COUNT(DISTINCT user_id) as user_count
    FROM analytics_events
    WHERE event_name = 'wizard_completed'
      AND created_at > NOW() - (days_back || ' days')::INTERVAL
  )
  SELECT
    CASE WHEN active.user_count > 0
      THEN ROUND((metrics.share_count::NUMERIC / active.user_count), 4)
      ELSE 0
    END as invites_per_user,
    CASE WHEN metrics.click_count > 0
      THEN ROUND((metrics.conversion_count::NUMERIC / metrics.click_count), 4)
      ELSE 0
    END as conversion_rate,
    CASE WHEN active.user_count > 0 AND metrics.click_count > 0
      THEN ROUND(
        (metrics.share_count::NUMERIC / active.user_count) *
        (metrics.conversion_count::NUMERIC / metrics.click_count),
        4
      )
      ELSE 0
    END as k_factor,
    metrics.share_count::INTEGER as total_shares,
    metrics.click_count::INTEGER as total_clicks,
    metrics.conversion_count::INTEGER as total_conversions,
    active.user_count::INTEGER as active_users
  FROM metrics, active;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get event counts grouped by name
CREATE OR REPLACE FUNCTION get_event_counts(days_back INTEGER DEFAULT 7, max_results INTEGER DEFAULT 10)
RETURNS TABLE (
  event_name TEXT,
  event_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ae.event_name,
    COUNT(*) as event_count
  FROM analytics_events ae
  WHERE ae.created_at > NOW() - (days_back || ' days')::INTERVAL
  GROUP BY ae.event_name
  ORDER BY event_count DESC
  LIMIT max_results;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
