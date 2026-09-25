-- ============================================================================
-- Layer Farm Recording & Management System (LFRMS)
-- Migration: 005_audit_triggers.sql
-- Description: Automated Audit Trail Triggers for Core Entities and Master Data
-- ============================================================================

CREATE OR REPLACE FUNCTION process_audit_log() RETURNS TRIGGER AS $$
DECLARE
  v_org_id UUID;
  v_user_id UUID;
  v_entity_id UUID;
  v_old_data JSONB := NULL;
  v_new_data JSONB := NULL;
BEGIN
  -- Determine user_id from Supabase auth session
  SELECT id INTO v_user_id FROM profiles WHERE auth_uid = auth.uid() LIMIT 1;

  -- Determine action and JSON values
  IF (TG_OP = 'DELETE') THEN
    v_old_data := to_jsonb(OLD);
    v_entity_id := OLD.id;
    -- Determine organization_id
    IF v_old_data ? 'organization_id' THEN
      v_org_id := (v_old_data->>'organization_id')::UUID;
    END IF;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_old_data := to_jsonb(OLD);
    v_new_data := to_jsonb(NEW);
    v_entity_id := NEW.id;
    IF v_new_data ? 'organization_id' THEN
      v_org_id := (v_new_data->>'organization_id')::UUID;
    END IF;
  ELSIF (TG_OP = 'INSERT') THEN
    v_new_data := to_jsonb(NEW);
    v_entity_id := NEW.id;
    IF v_new_data ? 'organization_id' THEN
      v_org_id := (v_new_data->>'organization_id')::UUID;
    END IF;
  END IF;

  -- Fallback organization_id if table doesn't have organization_id directly (e.g. sites, houses)
  IF v_org_id IS NULL AND v_user_id IS NOT NULL THEN
    SELECT organization_id INTO v_org_id FROM profiles WHERE id = v_user_id;
  END IF;

  -- If still null, try finding from default org
  IF v_org_id IS NULL THEN
    SELECT id INTO v_org_id FROM organizations LIMIT 1;
  END IF;

  INSERT INTO audit_logs (
    organization_id,
    user_id,
    action,
    entity_type,
    entity_id,
    old_values,
    new_values,
    created_at
  ) VALUES (
    v_org_id,
    v_user_id,
    TG_OP,
    TG_TABLE_NAME,
    v_entity_id,
    v_old_data,
    v_new_data,
    now()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit triggers to core tables
DROP TRIGGER IF EXISTS trg_audit_farms ON farms;
CREATE TRIGGER trg_audit_farms
AFTER INSERT OR UPDATE OR DELETE ON farms
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

DROP TRIGGER IF EXISTS trg_audit_sites ON sites;
CREATE TRIGGER trg_audit_sites
AFTER INSERT OR UPDATE OR DELETE ON sites
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

DROP TRIGGER IF EXISTS trg_audit_houses ON houses;
CREATE TRIGGER trg_audit_houses
AFTER INSERT OR UPDATE OR DELETE ON houses
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

DROP TRIGGER IF EXISTS trg_audit_flocks ON flocks;
CREATE TRIGGER trg_audit_flocks
AFTER INSERT OR UPDATE OR DELETE ON flocks
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

DROP TRIGGER IF EXISTS trg_audit_placements ON flock_placements;
CREATE TRIGGER trg_audit_placements
AFTER INSERT OR UPDATE OR DELETE ON flock_placements
FOR EACH ROW EXECUTE FUNCTION process_audit_log();

DROP TRIGGER IF EXISTS trg_audit_pop_tx ON flock_population_transactions;
CREATE TRIGGER trg_audit_pop_tx
AFTER INSERT ON flock_population_transactions
FOR EACH ROW EXECUTE FUNCTION process_audit_log();
