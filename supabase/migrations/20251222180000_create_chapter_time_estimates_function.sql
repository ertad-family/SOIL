-- Create function to calculate chapter completion time estimates
-- Part of issue #131: Dynamic chapter time estimates

-- Function to calculate median completion time per chapter
-- Groups by organization type for segmented estimates
-- Returns NULL for chapters with insufficient data (< min_samples)
CREATE OR REPLACE FUNCTION get_chapter_time_estimates(
  org_type TEXT DEFAULT NULL,
  min_samples INTEGER DEFAULT 10
)
RETURNS TABLE (
  chapter_id TEXT,
  median_minutes NUMERIC,
  p25_minutes NUMERIC,
  p75_minutes NUMERIC,
  sample_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  WITH chapter_sessions AS (
    -- Find chapter start events and their corresponding end events
    SELECT
      start_evt.properties->>'chapterId' as chapter_id,
      start_evt.properties->>'organizationType' as org_type,
      start_evt.created_at as start_time,
      -- Find the next pause or complete event for this chapter/story
      (
        SELECT MIN(end_evt.created_at)
        FROM analytics_events end_evt
        WHERE end_evt.event_name IN ('chapter_paused', 'chapter_completed')
          AND end_evt.properties->>'storyId' = start_evt.properties->>'storyId'
          AND end_evt.properties->>'chapterId' = start_evt.properties->>'chapterId'
          AND end_evt.created_at > start_evt.created_at
          AND end_evt.created_at < start_evt.created_at + INTERVAL '4 hours' -- Cap at 4 hours to exclude abandoned sessions
      ) as end_time
    FROM analytics_events start_evt
    WHERE start_evt.event_name IN ('chapter_started', 'chapter_resumed')
      AND start_evt.properties->>'chapterId' IS NOT NULL
      -- Filter by org type if specified
      AND (org_type IS NULL OR start_evt.properties->>'organizationType' = org_type)
  ),
  session_durations AS (
    -- Calculate duration in minutes for each session
    SELECT
      chapter_id,
      EXTRACT(EPOCH FROM (end_time - start_time)) / 60.0 as duration_minutes
    FROM chapter_sessions
    WHERE end_time IS NOT NULL
      AND EXTRACT(EPOCH FROM (end_time - start_time)) > 30 -- At least 30 seconds
      AND EXTRACT(EPOCH FROM (end_time - start_time)) < 14400 -- Less than 4 hours
  ),
  chapter_stats AS (
    -- Calculate percentiles per chapter
    SELECT
      sd.chapter_id,
      PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY sd.duration_minutes) as median,
      PERCENTILE_CONT(0.25) WITHIN GROUP (ORDER BY sd.duration_minutes) as p25,
      PERCENTILE_CONT(0.75) WITHIN GROUP (ORDER BY sd.duration_minutes) as p75,
      COUNT(*) as samples
    FROM session_durations sd
    GROUP BY sd.chapter_id
  )
  SELECT
    cs.chapter_id,
    CASE WHEN cs.samples >= min_samples THEN ROUND(cs.median::numeric, 0) ELSE NULL END as median_minutes,
    CASE WHEN cs.samples >= min_samples THEN ROUND(cs.p25::numeric, 0) ELSE NULL END as p25_minutes,
    CASE WHEN cs.samples >= min_samples THEN ROUND(cs.p75::numeric, 0) ELSE NULL END as p75_minutes,
    cs.samples as sample_count
  FROM chapter_stats cs;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_chapter_time_estimates(TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION get_chapter_time_estimates(TEXT, INTEGER) TO anon;
