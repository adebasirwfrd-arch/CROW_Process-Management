-- ============================================================================
-- CROW PROCESS MANAGEMENT - IoT & MACHINE INTEGRATION
-- ============================================================================
-- Version: 1.0.0
-- For real-time machine data collection and monitoring
-- 
-- ⚠️  IMPORTANT: Run supabase_manufacturing_schema.sql FIRST!
--     This schema depends on tables: production_lines, work_orders, parts_master
-- ============================================================================

-- ============================================================================
-- 1. MACHINE MASTER DATA
-- ============================================================================

-- Machines/Equipment Master
CREATE TABLE IF NOT EXISTS machines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    machine_type VARCHAR(100), -- 'CNC', 'Press', 'Lathe', 'Welding', 'Assembly', 'Injection'
    brand VARCHAR(100),
    model VARCHAR(100),
    serial_number VARCHAR(100),
    line_id UUID REFERENCES production_lines(id),
    department VARCHAR(100),
    location VARCHAR(100),
    installation_date DATE,
    last_maintenance_date DATE,
    next_maintenance_date DATE,
    status VARCHAR(30) DEFAULT 'Idle', -- Running, Idle, Maintenance, Breakdown, Offline
    is_iot_enabled BOOLEAN DEFAULT false,
    iot_device_id VARCHAR(100), -- IoT gateway/device identifier
    iot_protocol VARCHAR(50), -- 'MQTT', 'OPC-UA', 'Modbus', 'HTTP', 'WebSocket'
    iot_endpoint VARCHAR(255), -- Connection endpoint
    specifications JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Machine Parameters (what to monitor per machine)
CREATE TABLE IF NOT EXISTS machine_parameters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    parameter_code VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    data_type VARCHAR(20) DEFAULT 'FLOAT', -- FLOAT, INTEGER, BOOLEAN, STRING
    unit VARCHAR(20),
    min_value DECIMAL(15,4),
    max_value DECIMAL(15,4),
    warning_low DECIMAL(15,4),
    warning_high DECIMAL(15,4),
    critical_low DECIMAL(15,4),
    critical_high DECIMAL(15,4),
    is_monitored BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(machine_id, parameter_code)
);

-- ============================================================================
-- 2. REAL-TIME DATA COLLECTION
-- ============================================================================

-- Machine Data (Time-series data - consider TimescaleDB for production)
CREATE TABLE IF NOT EXISTS machine_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id),
    parameter_id UUID NOT NULL REFERENCES machine_parameters(id),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    value_numeric DECIMAL(15,4),
    value_string VARCHAR(255),
    value_boolean BOOLEAN,
    quality VARCHAR(20) DEFAULT 'Good', -- Good, Bad, Uncertain
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create hypertable if using TimescaleDB (optional)
-- SELECT create_hypertable('machine_data', 'timestamp', if_not_exists => TRUE);

-- Machine Status History
CREATE TABLE IF NOT EXISTS machine_status_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id),
    status VARCHAR(30) NOT NULL,
    previous_status VARCHAR(30),
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by UUID,
    reason VARCHAR(255),
    notes TEXT
);

-- ============================================================================
-- 3. ALARMS & ALERTS
-- ============================================================================

-- Alarm Definitions
CREATE TABLE IF NOT EXISTS alarm_definitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alarm_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    machine_id UUID REFERENCES machines(id),
    parameter_id UUID REFERENCES machine_parameters(id),
    condition_type VARCHAR(30) NOT NULL, -- 'HIGH', 'LOW', 'RANGE', 'CHANGE', 'OFFLINE'
    threshold_value DECIMAL(15,4),
    threshold_high DECIMAL(15,4),
    threshold_low DECIMAL(15,4),
    severity VARCHAR(20) DEFAULT 'Warning', -- Info, Warning, Critical, Emergency
    notification_channels JSONB DEFAULT '["email", "app"]', -- email, sms, app, webhook
    auto_acknowledge BOOLEAN DEFAULT false,
    acknowledge_timeout_minutes INTEGER DEFAULT 30,
    escalation_minutes INTEGER DEFAULT 60,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Active Alarms
CREATE TABLE IF NOT EXISTS active_alarms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alarm_definition_id UUID NOT NULL REFERENCES alarm_definitions(id),
    machine_id UUID NOT NULL REFERENCES machines(id),
    triggered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    triggered_value DECIMAL(15,4),
    message VARCHAR(500),
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(30) DEFAULT 'Active', -- Active, Acknowledged, Resolved
    acknowledged_by UUID,
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    escalated BOOLEAN DEFAULT false,
    escalated_at TIMESTAMPTZ
);

-- Alarm History
CREATE TABLE IF NOT EXISTS alarm_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    alarm_definition_id UUID REFERENCES alarm_definitions(id),
    machine_id UUID REFERENCES machines(id),
    triggered_at TIMESTAMPTZ NOT NULL,
    resolved_at TIMESTAMPTZ,
    triggered_value DECIMAL(15,4),
    severity VARCHAR(20),
    message VARCHAR(500),
    duration_minutes INTEGER,
    acknowledged_by UUID,
    resolution_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. DOWNTIME TRACKING
-- ============================================================================

-- Downtime Categories
CREATE TABLE IF NOT EXISTS downtime_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category_type VARCHAR(50), -- 'Planned', 'Unplanned', 'Setup', 'Waiting'
    is_counted_in_oee BOOLEAN DEFAULT true,
    color VARCHAR(20) DEFAULT '#FF5733', -- For dashboard visualization
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Downtime Records
CREATE TABLE IF NOT EXISTS downtime_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id),
    line_id UUID REFERENCES production_lines(id),
    work_order_id UUID REFERENCES work_orders(id),
    category_id UUID REFERENCES downtime_categories(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    duration_minutes INTEGER,
    is_planned BOOLEAN DEFAULT false,
    reason VARCHAR(255),
    action_taken TEXT,
    reported_by UUID,
    verified BOOLEAN DEFAULT false,
    verified_by UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. MAINTENANCE MANAGEMENT
-- ============================================================================

-- Maintenance Types
CREATE TABLE IF NOT EXISTS maintenance_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50), -- 'Preventive', 'Predictive', 'Corrective', 'Breakdown'
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Schedules (Preventive)
CREATE TABLE IF NOT EXISTS maintenance_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id),
    maintenance_type_id UUID NOT NULL REFERENCES maintenance_types(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    frequency_type VARCHAR(20) NOT NULL, -- 'Daily', 'Weekly', 'Monthly', 'Quarterly', 'Yearly', 'Runtime'
    frequency_value INTEGER DEFAULT 1,
    runtime_hours INTEGER, -- For runtime-based maintenance
    last_performed_at TIMESTAMPTZ,
    next_due_at TIMESTAMPTZ,
    checklist JSONB DEFAULT '[]',
    estimated_duration_minutes INTEGER,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Maintenance Work Orders
CREATE TABLE IF NOT EXISTS maintenance_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    machine_id UUID NOT NULL REFERENCES machines(id),
    schedule_id UUID REFERENCES maintenance_schedules(id),
    maintenance_type_id UUID REFERENCES maintenance_types(id),
    priority VARCHAR(20) DEFAULT 'Normal', -- Low, Normal, High, Emergency
    description TEXT NOT NULL,
    scheduled_start TIMESTAMPTZ,
    scheduled_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    assigned_to UUID,
    status VARCHAR(30) DEFAULT 'Open', -- Open, In Progress, Completed, Cancelled
    checklist_results JSONB DEFAULT '[]',
    parts_used JSONB DEFAULT '[]',
    labor_hours DECIMAL(10,2),
    cost DECIMAL(15,2),
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Spare Parts Inventory
CREATE TABLE IF NOT EXISTS spare_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'PCS',
    quantity_on_hand INTEGER DEFAULT 0,
    reorder_level INTEGER DEFAULT 0,
    unit_cost DECIMAL(15,4),
    location VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Machine-Spare Parts Link
CREATE TABLE IF NOT EXISTS machine_spare_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    spare_part_id UUID NOT NULL REFERENCES spare_parts(id) ON DELETE CASCADE,
    quantity_required INTEGER DEFAULT 1,
    notes TEXT,
    UNIQUE(machine_id, spare_part_id)
);

-- ============================================================================
-- 6. IoT DEVICE MANAGEMENT
-- ============================================================================

-- IoT Gateways
CREATE TABLE IF NOT EXISTS iot_gateways (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    gateway_id VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(100),
    ip_address VARCHAR(50),
    mac_address VARCHAR(50),
    protocol VARCHAR(50), -- 'MQTT', 'HTTP', 'WebSocket'
    broker_url VARCHAR(255),
    status VARCHAR(30) DEFAULT 'Offline', -- Online, Offline, Error
    last_heartbeat TIMESTAMPTZ,
    firmware_version VARCHAR(50),
    configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- IoT Sensors
CREATE TABLE IF NOT EXISTS iot_sensors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sensor_id VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    gateway_id UUID REFERENCES iot_gateways(id),
    machine_id UUID REFERENCES machines(id),
    sensor_type VARCHAR(50), -- 'Temperature', 'Pressure', 'Vibration', 'Counter', 'Current'
    unit VARCHAR(20),
    calibration_date DATE,
    calibration_due DATE,
    status VARCHAR(30) DEFAULT 'Inactive', -- Active, Inactive, Faulty
    configuration JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. PRODUCTION COUNTING & CYCLE TIME
-- ============================================================================

-- Production Counters (Real-time from IoT)
CREATE TABLE IF NOT EXISTS production_counters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id),
    work_order_id UUID REFERENCES work_orders(id),
    counter_type VARCHAR(30) DEFAULT 'Total', -- Total, Good, Reject
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    count_value INTEGER NOT NULL,
    cycle_time_seconds DECIMAL(10,3),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cycle Time Analysis
CREATE TABLE IF NOT EXISTS cycle_time_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    machine_id UUID NOT NULL REFERENCES machines(id),
    work_order_id UUID REFERENCES work_orders(id),
    part_id UUID REFERENCES parts_master(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    cycle_time_seconds DECIMAL(10,3) NOT NULL,
    is_within_target BOOLEAN,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_machines_status ON machines(status);
CREATE INDEX IF NOT EXISTS idx_machines_line ON machines(line_id);
CREATE INDEX IF NOT EXISTS idx_machine_data_timestamp ON machine_data(timestamp);
CREATE INDEX IF NOT EXISTS idx_machine_data_machine ON machine_data(machine_id);
CREATE INDEX IF NOT EXISTS idx_active_alarms_status ON active_alarms(status);
CREATE INDEX IF NOT EXISTS idx_downtime_machine ON downtime_records(machine_id);
CREATE INDEX IF NOT EXISTS idx_downtime_start ON downtime_records(start_time);
CREATE INDEX IF NOT EXISTS idx_maintenance_orders_status ON maintenance_orders(status);
CREATE INDEX IF NOT EXISTS idx_maintenance_orders_machine ON maintenance_orders(machine_id);
CREATE INDEX IF NOT EXISTS idx_production_counters_machine ON production_counters(machine_id);
CREATE INDEX IF NOT EXISTS idx_production_counters_timestamp ON production_counters(timestamp);

-- ============================================================================
-- 9. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE machines ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_parameters ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE active_alarms ENABLE ROW LEVEL SECURITY;
ALTER TABLE alarm_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE downtime_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE downtime_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE maintenance_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE machine_spare_parts ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_gateways ENABLE ROW LEVEL SECURITY;
ALTER TABLE iot_sensors ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_counters ENABLE ROW LEVEL SECURITY;
ALTER TABLE cycle_time_records ENABLE ROW LEVEL SECURITY;

-- Create policies for all IoT tables
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY[
            'machines', 'machine_parameters', 'machine_data', 'machine_status_history',
            'alarm_definitions', 'active_alarms', 'alarm_history',
            'downtime_categories', 'downtime_records',
            'maintenance_types', 'maintenance_schedules', 'maintenance_orders',
            'spare_parts', 'machine_spare_parts',
            'iot_gateways', 'iot_sensors',
            'production_counters', 'cycle_time_records'
        ])
    LOOP
        -- Drop existing policies first
        EXECUTE format('DROP POLICY IF EXISTS "Allow public read" ON %I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow public insert" ON %I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow public update" ON %I', t);
        EXECUTE format('DROP POLICY IF EXISTS "Allow public delete" ON %I', t);
        
        -- Create new policies
        EXECUTE format('CREATE POLICY "Allow public read" ON %I FOR SELECT USING (true)', t);
        EXECUTE format('CREATE POLICY "Allow public insert" ON %I FOR INSERT WITH CHECK (true)', t);
        EXECUTE format('CREATE POLICY "Allow public update" ON %I FOR UPDATE USING (true)', t);
        EXECUTE format('CREATE POLICY "Allow public delete" ON %I FOR DELETE USING (true)', t);
    END LOOP;
END $$;

-- ============================================================================
-- End of IoT Migration
-- ============================================================================
