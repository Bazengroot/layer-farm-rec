-- Migration: Phase 10 - Mobile Farm Operations, Offline Sync, & Notifications Engine
-- File: database/migrations/030_phase10_mobile_offline_notifications.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Farm Configurable Notification Thresholds
CREATE TABLE IF NOT EXISTS farm_notification_thresholds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id UUID NOT NULL UNIQUE,
    abnormal_mortality_daily_count INT DEFAULT 5,
    abnormal_production_hdp_drop_pct NUMERIC(5, 2) DEFAULT 5.00,
    low_feed_stock_days_threshold INT DEFAULT 3,
    medication_withdrawal_buffer_days INT DEFAULT 7,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. User Notifications Inbox
CREATE TABLE IF NOT EXISTS user_notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    category TEXT NOT NULL, -- 'pending_approval', 'overdue_recording', 'low_feed_stock', 'medication_withdrawal', 'vaccination_due', 'maintenance_due', 'abnormal_mortality', 'abnormal_production', 'stock_expiry'
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 3. Offline Sync Queue Table (Client Transaction Queue & Conflict Resolution)
CREATE TABLE IF NOT EXISTS offline_sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    client_tx_id TEXT NOT NULL UNIQUE, -- UUID generated on mobile device for idempotency
    entity_type TEXT NOT NULL, -- 'daily_health', 'egg_production', 'feed_consumption', 'task_completion'
    payload_json JSONB NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending sync', -- 'Local draft', 'Pending sync', 'Synced', 'Sync failed', 'Conflict'
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    synced_at TIMESTAMP WITH TIME ZONE
);
