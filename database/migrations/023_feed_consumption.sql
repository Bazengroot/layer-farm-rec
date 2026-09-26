-- 017_feed_consumption.sql
-- Migration for feed consumption records (integrated with daily recording)

-- Feed consumption records capture actual usage per flock and link to a feed formula
CREATE TABLE feed_consumption_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  flock_id UUID NOT NULL REFERENCES flocks(id) ON DELETE RESTRICT,
  record_date DATE NOT NULL,
  feed_formula_id UUID NOT NULL REFERENCES feed_formulas(id) ON DELETE RESTRICT,
  quantity_issued NUMERIC(12,4) NOT NULL CHECK (quantity_issued >= 0),
  quantity_consumed NUMERIC(12,4) NOT NULL CHECK (quantity_consumed >= 0),
  wastage_quantity NUMERIC(12,4) CHECK (wastage_quantity >= 0),
  remaining_quantity NUMERIC(12,4) CHECK (remaining_quantity >= 0),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Optional materialized view for computed metrics (feed per bird, per dozen eggs, FCR, etc.)
CREATE MATERIALIZED VIEW feed_consumption_metrics_mv AS
SELECT
  fcr.id,
  fcr.organization_id,
  fcr.flock_id,
  fcr.record_date,
  fcr.feed_formula_id,
  fcr.quantity_issued,
  fcr.quantity_consumed,
  fcr.wastage_quantity,
  fcr.remaining_quantity,
  -- assuming number_of_birds is stored in flocks table as bird_count
  (fcr.quantity_consumed / NULLIF(fl.bird_count,0)) AS feed_per_bird,
  -- assuming daily egg count is stored in a separate table; placeholder calculation
  (fcr.quantity_consumed / NULLIF(de.egg_count,1)) * 12 AS feed_per_dozen_eggs,
  (fcr.quantity_consumed / NULLIF(de.egg_mass_kg,0)) AS feed_per_kg_egg_mass,
  -- cost metrics require joining feed_prices (latest price for the formula's feed type)
  (fcr.quantity_consumed * fp.price_per_unit) AS feed_cost,
  (fcr.quantity_consumed * fp.price_per_unit) / NULLIF(de.egg_count,0) AS feed_cost_per_egg
FROM feed_consumption_records fcr
JOIN flocks fl ON fl.id = fcr.flock_id
LEFT JOIN (
  SELECT fr.flock_id, SUM(fr.quantity) AS egg_count, SUM(fr.quantity * fr.average_weight/1000) AS egg_mass_kg
  FROM daily_flock_records fr
  GROUP BY fr.flock_id
) de ON de.flock_id = fcr.flock_id
LEFT JOIN feed_prices fp ON fp.feed_type_id = (
  SELECT ft.id FROM feed_formulas ff
  JOIN feed_types ft ON ft.id = ff.id
  WHERE ff.id = fcr.feed_formula_id
  LIMIT 1
) AND fp.effective_date = (
  SELECT MAX(effective_date) FROM feed_prices WHERE feed_type_id = fp.feed_type_id
);

-- Enable Row Level Security for consumption records (policies added later)
ALTER TABLE feed_consumption_records ENABLE ROW LEVEL SECURITY;

-- End of 017_feed_consumption.sql
