-- Seed script: Populate reference data tables
-- Run with: psql postgresql://postgres:PASSWORD@db.PROJECT_ID.supabase.co:5432/postgres -f supabase/seeds/seed_reference_data.sql
-- Related Issue: #34

-- =============================================================================
-- CLEAR EXISTING DATA (in correct order due to FK constraints)
-- =============================================================================

TRUNCATE business_models CASCADE;
TRUNCATE lifecycle_stages CASCADE;
TRUNCATE organization_types CASCADE;

-- =============================================================================
-- ORGANIZATION TYPES
-- Source: src/data/function-matrix.ts ORG_TYPE_LABELS, ORG_TYPE_DESCRIPTIONS
-- =============================================================================

INSERT INTO organization_types (type_key, label, label_short, description, display_order) VALUES
  ('tech_product', 'Tech Product', 'Tech Product', 'SaaS, apps, platforms, digital products', 1),
  ('services', 'Services', 'Services', 'Agencies, consulting, outsourcing, professional services', 2),
  ('ecommerce', 'E-commerce / Retail', 'E-commerce', 'Online stores, D2C brands, marketplaces', 3),
  ('manufacturing', 'Manufacturing', 'Manufacturing', 'Physical goods production, hardware', 4),
  ('ngo', 'NGO / Non-profit', 'NGO', 'Foundations, social enterprises, charitable organizations', 5),
  ('media', 'Media / Content', 'Media', 'Publishers, studios, creators, content platforms', 6);

-- =============================================================================
-- LIFECYCLE STAGES
-- Source: src/data/function-matrix.ts LIFECYCLE_STAGE_LABELS, LIFECYCLE_STAGE_DESCRIPTIONS
-- =============================================================================

INSERT INTO lifecycle_stages (stage_key, label, description, display_order) VALUES
  ('formation', 'Formation', 'Registered, operations started, <10 people', 1),
  ('establishment', 'Establishment', 'Stable operations, growing team, 10-30 people', 2),
  ('growth', 'Growth', 'Scaling, formalizing processes, 30-100 people', 3),
  ('maturity', 'Maturity', 'Established structure, 100+ people', 4);

-- =============================================================================
-- BUSINESS MODELS - Tech Product
-- Source: src/data/function-matrix.ts BUSINESS_MODELS.tech_product
-- =============================================================================

INSERT INTO business_models (model_key, org_type_key, label, display_order) VALUES
  ('subscription_saas', 'tech_product', 'Subscription (SaaS)', 1),
  ('transactional', 'tech_product', 'Transactional (per use)', 2),
  ('freemium', 'tech_product', 'Freemium', 3),
  ('marketplace_platform', 'tech_product', 'Marketplace / Platform', 4),
  ('licensing', 'tech_product', 'Licensing', 5),
  ('hardware_software', 'tech_product', 'Hardware + Software', 6);

-- =============================================================================
-- BUSINESS MODELS - Services
-- Source: src/data/function-matrix.ts BUSINESS_MODELS.services
-- =============================================================================

INSERT INTO business_models (model_key, org_type_key, label, display_order) VALUES
  ('hourly_time_materials', 'services', 'Hourly / Time & Materials', 1),
  ('fixed_price', 'services', 'Fixed price projects', 2),
  ('retainer', 'services', 'Retainer', 3),
  ('performance_based', 'services', 'Performance-based', 4),
  ('productized_service', 'services', 'Productized service', 5);

-- =============================================================================
-- BUSINESS MODELS - E-commerce
-- Source: src/data/function-matrix.ts BUSINESS_MODELS.ecommerce
-- =============================================================================

INSERT INTO business_models (model_key, org_type_key, label, display_order) VALUES
  ('direct_sales', 'ecommerce', 'Direct sales (own inventory)', 1),
  ('dropshipping', 'ecommerce', 'Dropshipping', 2),
  ('marketplace', 'ecommerce', 'Marketplace', 3),
  ('subscription_box', 'ecommerce', 'Subscription box', 4),
  ('wholesale_retail', 'ecommerce', 'Wholesale + Retail', 5);

-- =============================================================================
-- BUSINESS MODELS - Manufacturing
-- Source: src/data/function-matrix.ts BUSINESS_MODELS.manufacturing
-- =============================================================================

INSERT INTO business_models (model_key, org_type_key, label, display_order) VALUES
  ('b2b_oem', 'manufacturing', 'B2B (OEM / components)', 1),
  ('b2c', 'manufacturing', 'B2C (finished goods)', 2),
  ('contract_manufacturing', 'manufacturing', 'Contract manufacturing', 3),
  ('white_label', 'manufacturing', 'White label', 4),
  ('direct_distribution', 'manufacturing', 'Direct + Distribution', 5);

-- =============================================================================
-- BUSINESS MODELS - NGO
-- Source: src/data/function-matrix.ts BUSINESS_MODELS.ngo
-- =============================================================================

INSERT INTO business_models (model_key, org_type_key, label, display_order) VALUES
  ('grant_funded', 'ngo', 'Grant-funded', 1),
  ('donation_based', 'ngo', 'Donation-based', 2),
  ('membership', 'ngo', 'Membership', 3),
  ('earned_revenue', 'ngo', 'Earned revenue hybrid', 4),
  ('government_contracts', 'ngo', 'Government contracts', 5);

-- =============================================================================
-- BUSINESS MODELS - Media
-- Source: src/data/function-matrix.ts BUSINESS_MODELS.media
-- =============================================================================

INSERT INTO business_models (model_key, org_type_key, label, display_order) VALUES
  ('advertising', 'media', 'Advertising', 1),
  ('subscription', 'media', 'Subscription', 2),
  ('sponsored_content', 'media', 'Sponsored content', 3),
  ('events', 'media', 'Events', 4),
  ('licensing_syndication', 'media', 'Licensing / Syndication', 5),
  ('hybrid', 'media', 'Hybrid', 6);

-- =============================================================================
-- VERIFY DATA
-- =============================================================================

SELECT 'Organization Types:' as info, COUNT(*) as count FROM organization_types
UNION ALL
SELECT 'Lifecycle Stages:', COUNT(*) FROM lifecycle_stages
UNION ALL
SELECT 'Business Models:', COUNT(*) FROM business_models;
