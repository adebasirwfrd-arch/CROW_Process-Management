-- ============================================================================
-- CROW PROCESS MANAGEMENT - ISO 9001 MANUFACTURING DATABASE SCHEMA
-- ============================================================================
-- Version: 1.0.0
-- Based on ISO 9001:2015 Quality Management Standard
-- For Motorcycle Parts Manufacturing
-- ============================================================================

-- ============================================================================
-- 1. PARTS & MATERIALS MASTER DATA
-- ============================================================================

-- Parts Master (Finished goods catalog)
CREATE TABLE IF NOT EXISTS parts_master (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    part_number VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100), -- e.g., 'Engine', 'Body', 'Electrical', 'Suspension'
    sub_category VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'PCS',
    specifications JSONB DEFAULT '{}',
    drawing_number VARCHAR(100),
    revision VARCHAR(10) DEFAULT 'A',
    standard_cost DECIMAL(15,2),
    lead_time_days INTEGER DEFAULT 0,
    min_order_qty INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Raw Materials Master
CREATE TABLE IF NOT EXISTS materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    material_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    material_type VARCHAR(50), -- 'Raw Material', 'Component', 'Consumable', 'Packaging'
    category VARCHAR(100),
    unit VARCHAR(20) DEFAULT 'PCS',
    specifications JSONB DEFAULT '{}',
    reorder_level INTEGER DEFAULT 0,
    safety_stock INTEGER DEFAULT 0,
    unit_cost DECIMAL(15,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bill of Materials (BOM)
CREATE TABLE IF NOT EXISTS bom (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finished_part_id UUID NOT NULL REFERENCES parts_master(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    quantity DECIMAL(15,4) NOT NULL,
    unit VARCHAR(20) DEFAULT 'PCS',
    scrap_factor DECIMAL(5,2) DEFAULT 0, -- percentage
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(finished_part_id, material_id)
);

-- ============================================================================
-- 2. SUPPLIER MANAGEMENT (ISO 8.4 External Providers)
-- ============================================================================

CREATE TABLE IF NOT EXISTS suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Indonesia',
    category VARCHAR(50), -- 'Raw Material', 'Component', 'Service', 'Packaging'
    payment_terms VARCHAR(100),
    lead_time_days INTEGER DEFAULT 0,
    is_iso_certified BOOLEAN DEFAULT false,
    iso_cert_number VARCHAR(100),
    iso_cert_expiry DATE,
    status VARCHAR(20) DEFAULT 'Active', -- Active, Inactive, Blacklisted, Probation
    rating DECIMAL(3,2) DEFAULT 0, -- 0-5 scale
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier Evaluations (Periodic assessments)
CREATE TABLE IF NOT EXISTS supplier_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    evaluation_date DATE NOT NULL,
    evaluator_id UUID,
    period VARCHAR(20), -- 'Monthly', 'Quarterly', 'Annual'
    quality_score DECIMAL(5,2), -- 0-100
    delivery_score DECIMAL(5,2), -- 0-100
    price_score DECIMAL(5,2), -- 0-100
    service_score DECIMAL(5,2), -- 0-100
    overall_score DECIMAL(5,2), -- 0-100
    criteria_details JSONB DEFAULT '{}',
    recommendation VARCHAR(50), -- 'Maintain', 'Improve', 'Replace', 'Probation'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Supplier-Material Link
CREATE TABLE IF NOT EXISTS supplier_materials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID NOT NULL REFERENCES suppliers(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    is_primary BOOLEAN DEFAULT false,
    unit_price DECIMAL(15,4),
    min_order_qty INTEGER DEFAULT 1,
    lead_time_days INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(supplier_id, material_id)
);

-- ============================================================================
-- 3. PURCHASE & RECEIVING (Supply Chain)
-- ============================================================================

-- Purchase Orders
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) NOT NULL UNIQUE,
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    order_date DATE NOT NULL,
    expected_date DATE,
    status VARCHAR(30) DEFAULT 'Draft', -- Draft, Sent, Partial, Received, Closed, Cancelled
    total_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'IDR',
    payment_terms VARCHAR(100),
    shipping_method VARCHAR(100),
    notes TEXT,
    created_by UUID,
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Purchase Order Items
CREATE TABLE IF NOT EXISTS po_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES materials(id),
    quantity DECIMAL(15,4) NOT NULL,
    unit VARCHAR(20) DEFAULT 'PCS',
    unit_price DECIMAL(15,4) NOT NULL,
    total_price DECIMAL(15,2),
    qty_received DECIMAL(15,4) DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Receiving Records (Incoming Inspection - ISO 8.4.2)
CREATE TABLE IF NOT EXISTS receiving_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receiving_number VARCHAR(50) NOT NULL UNIQUE,
    po_id UUID REFERENCES purchase_orders(id),
    supplier_id UUID NOT NULL REFERENCES suppliers(id),
    received_date DATE NOT NULL,
    delivery_note_number VARCHAR(100),
    inspector_id UUID,
    inspection_status VARCHAR(30) DEFAULT 'Pending', -- Pending, Passed, Failed, Partial
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Receiving Items with Inspection Results
CREATE TABLE IF NOT EXISTS receiving_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    receiving_id UUID NOT NULL REFERENCES receiving_records(id) ON DELETE CASCADE,
    po_item_id UUID REFERENCES po_items(id),
    material_id UUID NOT NULL REFERENCES materials(id),
    lot_number VARCHAR(100),
    qty_ordered DECIMAL(15,4),
    qty_received DECIMAL(15,4) NOT NULL,
    qty_accepted DECIMAL(15,4) DEFAULT 0,
    qty_rejected DECIMAL(15,4) DEFAULT 0,
    inspection_result VARCHAR(30) DEFAULT 'Pending', -- Pending, Accepted, Rejected, Conditional
    defect_details JSONB DEFAULT '[]',
    storage_location VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 4. PRODUCTION MANAGEMENT (ISO 8.5)
-- ============================================================================

-- Production Lines
CREATE TABLE IF NOT EXISTS production_lines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    location VARCHAR(100),
    capacity_per_hour INTEGER,
    status VARCHAR(30) DEFAULT 'Active', -- Active, Maintenance, Inactive
    operators_required INTEGER DEFAULT 1,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Orders (Master Production Schedule)
CREATE TABLE IF NOT EXISTS production_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number VARCHAR(50) NOT NULL UNIQUE,
    part_id UUID NOT NULL REFERENCES parts_master(id),
    customer_order_ref VARCHAR(100),
    quantity INTEGER NOT NULL,
    qty_completed INTEGER DEFAULT 0,
    qty_rejected INTEGER DEFAULT 0,
    start_date DATE,
    due_date DATE NOT NULL,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    priority VARCHAR(20) DEFAULT 'Normal', -- Low, Normal, High, Urgent
    status VARCHAR(30) DEFAULT 'Planned', -- Planned, In Progress, Completed, On Hold, Cancelled
    notes TEXT,
    created_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Work Orders (Per process step)
CREATE TABLE IF NOT EXISTS work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    wo_number VARCHAR(50) NOT NULL UNIQUE,
    production_order_id UUID NOT NULL REFERENCES production_orders(id) ON DELETE CASCADE,
    line_id UUID REFERENCES production_lines(id),
    process_step INTEGER NOT NULL DEFAULT 1,
    process_name VARCHAR(255) NOT NULL,
    planned_start TIMESTAMPTZ,
    planned_end TIMESTAMPTZ,
    actual_start TIMESTAMPTZ,
    actual_end TIMESTAMPTZ,
    qty_input INTEGER,
    qty_output INTEGER DEFAULT 0,
    qty_rejected INTEGER DEFAULT 0,
    status VARCHAR(30) DEFAULT 'Pending', -- Pending, In Progress, Completed, On Hold
    operator_id UUID,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Production Logs (Hourly/Shift tracking)
CREATE TABLE IF NOT EXISTS production_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    line_id UUID REFERENCES production_lines(id),
    operator_id UUID,
    shift VARCHAR(20), -- 'Day', 'Night', 'Shift 1', 'Shift 2', etc.
    log_date DATE NOT NULL,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ,
    qty_produced INTEGER DEFAULT 0,
    qty_rejected INTEGER DEFAULT 0,
    downtime_minutes INTEGER DEFAULT 0,
    downtime_reason VARCHAR(255),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 5. QUALITY CONTROL (ISO 8.5.1, 8.6)
-- ============================================================================

-- QC Checkpoints (Inspection stations)
CREATE TABLE IF NOT EXISTS qc_checkpoints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checkpoint_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    process_step VARCHAR(100), -- 'Incoming', 'In-Process', 'Final'
    inspection_type VARCHAR(50), -- 'Visual', 'Dimensional', 'Functional', 'Combined'
    department VARCHAR(100),
    sampling_plan VARCHAR(100), -- e.g., 'AQL 2.5, Level II'
    criteria JSONB DEFAULT '[]', -- Array of inspection criteria
    work_instructions TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- QC Inspections (Inspection records)
CREATE TABLE IF NOT EXISTS qc_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_number VARCHAR(50) NOT NULL UNIQUE,
    checkpoint_id UUID NOT NULL REFERENCES qc_checkpoints(id),
    work_order_id UUID REFERENCES work_orders(id),
    receiving_id UUID REFERENCES receiving_records(id),
    part_id UUID REFERENCES parts_master(id),
    lot_number VARCHAR(100),
    inspector_id UUID,
    inspection_date DATE NOT NULL,
    sample_size INTEGER,
    qty_inspected INTEGER NOT NULL,
    qty_passed INTEGER DEFAULT 0,
    qty_failed INTEGER DEFAULT 0,
    result VARCHAR(30) DEFAULT 'Pending', -- Pending, Passed, Failed, Conditional
    measurements JSONB DEFAULT '[]', -- Detailed measurement data
    defects_found JSONB DEFAULT '[]', -- Array of defect records
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Defect Types Master
CREATE TABLE IF NOT EXISTS defect_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    defect_code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(50), -- 'Dimensional', 'Visual', 'Functional', 'Material'
    severity VARCHAR(20) DEFAULT 'Minor', -- Minor, Major, Critical
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 6. NCR & CAPA (ISO 10.2 Nonconformity & Corrective Action)
-- ============================================================================

-- Non-Conformance Reports
CREATE TABLE IF NOT EXISTS ncr_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ncr_number VARCHAR(50) NOT NULL UNIQUE,
    source VARCHAR(50) NOT NULL, -- 'Incoming', 'In-Process', 'Final', 'Customer', 'Audit'
    part_id UUID REFERENCES parts_master(id),
    material_id UUID REFERENCES materials(id),
    work_order_id UUID REFERENCES work_orders(id),
    receiving_id UUID REFERENCES receiving_records(id),
    lot_number VARCHAR(100),
    defect_type_id UUID REFERENCES defect_types(id),
    defect_description TEXT NOT NULL,
    quantity_affected INTEGER,
    detection_date DATE NOT NULL,
    detected_by UUID,
    department VARCHAR(100),
    root_cause TEXT,
    root_cause_category VARCHAR(50), -- 'Man', 'Machine', 'Material', 'Method', 'Environment'
    immediate_action TEXT,
    disposition VARCHAR(50), -- 'Use As Is', 'Rework', 'Scrap', 'Return to Supplier', 'Pending'
    disposition_by UUID,
    disposition_date DATE,
    status VARCHAR(30) DEFAULT 'Open', -- Open, Under Investigation, Closed
    cost_impact DECIMAL(15,2),
    evidence_urls JSONB DEFAULT '[]', -- Photo/document links
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    closed_at TIMESTAMPTZ
);

-- Corrective & Preventive Actions (CAPA)
CREATE TABLE IF NOT EXISTS capa_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    capa_number VARCHAR(50) NOT NULL UNIQUE,
    ncr_id UUID REFERENCES ncr_reports(id),
    capa_type VARCHAR(20) NOT NULL, -- 'Corrective', 'Preventive'
    source VARCHAR(50), -- 'NCR', 'Audit', 'Customer Complaint', 'Management Review'
    problem_description TEXT NOT NULL,
    root_cause_analysis TEXT,
    action_required TEXT NOT NULL,
    action_taken TEXT,
    responsible_person UUID,
    department VARCHAR(100),
    target_date DATE NOT NULL,
    completion_date DATE,
    verification_date DATE,
    verified_by UUID,
    verification_result TEXT,
    effectiveness_check VARCHAR(50), -- 'Effective', 'Not Effective', 'Pending'
    status VARCHAR(30) DEFAULT 'Open', -- Open, In Progress, Completed, Verified, Closed
    priority VARCHAR(20) DEFAULT 'Normal', -- Low, Normal, High, Critical
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 7. PACKING & SHIPPING (ISO 8.5.4 Preservation)
-- ============================================================================

-- Packing Records
CREATE TABLE IF NOT EXISTS packing_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    packing_number VARCHAR(50) NOT NULL UNIQUE,
    production_order_id UUID REFERENCES production_orders(id),
    part_id UUID NOT NULL REFERENCES parts_master(id),
    lot_number VARCHAR(100),
    quantity INTEGER NOT NULL,
    pack_date DATE NOT NULL,
    packer_id UUID,
    packaging_type VARCHAR(100),
    label_verified BOOLEAN DEFAULT false,
    weight_kg DECIMAL(10,3),
    dimensions_cm VARCHAR(100), -- 'LxWxH'
    pallet_number VARCHAR(50),
    storage_location VARCHAR(100),
    qc_release_status VARCHAR(30) DEFAULT 'Pending', -- Pending, Released, Hold
    released_by UUID,
    released_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipping Orders
CREATE TABLE IF NOT EXISTS shipping_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_number VARCHAR(50) NOT NULL UNIQUE,
    customer_name VARCHAR(255) NOT NULL,
    customer_po VARCHAR(100),
    ship_date DATE NOT NULL,
    delivery_address TEXT,
    shipping_method VARCHAR(100),
    carrier_name VARCHAR(100),
    tracking_number VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Pending', -- Pending, Shipped, In Transit, Delivered
    total_packages INTEGER DEFAULT 0,
    total_weight_kg DECIMAL(10,3),
    notes TEXT,
    shipped_by UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shipping Items
CREATE TABLE IF NOT EXISTS shipping_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    shipping_id UUID NOT NULL REFERENCES shipping_orders(id) ON DELETE CASCADE,
    packing_id UUID REFERENCES packing_records(id),
    part_id UUID NOT NULL REFERENCES parts_master(id),
    quantity INTEGER NOT NULL,
    lot_number VARCHAR(100),
    certificate_of_conformance BOOLEAN DEFAULT false,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================================
-- 8. QUALITY METRICS & OEE
-- ============================================================================

-- Quality Metrics (Monthly/Weekly aggregated data)
CREATE TABLE IF NOT EXISTS quality_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    metric_type VARCHAR(50) NOT NULL, -- 'FPY', 'PPM', 'OTD', 'Supplier Rating', etc.
    period_type VARCHAR(20) NOT NULL, -- 'Daily', 'Weekly', 'Monthly', 'Yearly'
    period_date DATE NOT NULL,
    department VARCHAR(100),
    line_id UUID REFERENCES production_lines(id),
    target_value DECIMAL(15,4),
    actual_value DECIMAL(15,4),
    unit VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(metric_type, period_type, period_date, department, line_id)
);

-- OEE Records (Overall Equipment Effectiveness)
CREATE TABLE IF NOT EXISTS oee_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    line_id UUID NOT NULL REFERENCES production_lines(id),
    record_date DATE NOT NULL,
    shift VARCHAR(20),
    planned_production_time INTEGER, -- minutes
    actual_production_time INTEGER, -- minutes
    downtime_minutes INTEGER DEFAULT 0,
    ideal_cycle_time DECIMAL(10,4), -- seconds per unit
    total_count INTEGER DEFAULT 0,
    good_count INTEGER DEFAULT 0,
    reject_count INTEGER DEFAULT 0,
    availability DECIMAL(5,4), -- percentage as decimal
    performance DECIMAL(5,4), -- percentage as decimal
    quality DECIMAL(5,4), -- percentage as decimal
    oee_score DECIMAL(5,4), -- percentage as decimal
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(line_id, record_date, shift)
);

-- ============================================================================
-- 9. INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_parts_master_category ON parts_master(category);
CREATE INDEX IF NOT EXISTS idx_parts_master_part_number ON parts_master(part_number);
CREATE INDEX IF NOT EXISTS idx_materials_code ON materials(material_code);
CREATE INDEX IF NOT EXISTS idx_suppliers_status ON suppliers(status);
CREATE INDEX IF NOT EXISTS idx_po_status ON purchase_orders(status);
CREATE INDEX IF NOT EXISTS idx_po_supplier ON purchase_orders(supplier_id);
CREATE INDEX IF NOT EXISTS idx_receiving_date ON receiving_records(received_date);
CREATE INDEX IF NOT EXISTS idx_production_orders_status ON production_orders(status);
CREATE INDEX IF NOT EXISTS idx_production_orders_due ON production_orders(due_date);
CREATE INDEX IF NOT EXISTS idx_work_orders_status ON work_orders(status);
CREATE INDEX IF NOT EXISTS idx_qc_inspections_date ON qc_inspections(inspection_date);
CREATE INDEX IF NOT EXISTS idx_ncr_status ON ncr_reports(status);
CREATE INDEX IF NOT EXISTS idx_ncr_date ON ncr_reports(detection_date);
CREATE INDEX IF NOT EXISTS idx_capa_status ON capa_records(status);
CREATE INDEX IF NOT EXISTS idx_packing_date ON packing_records(pack_date);
CREATE INDEX IF NOT EXISTS idx_shipping_date ON shipping_orders(ship_date);
CREATE INDEX IF NOT EXISTS idx_oee_date ON oee_records(record_date);

-- ============================================================================
-- 10. ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE parts_master ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE bom ENABLE ROW LEVEL SECURITY;
ALTER TABLE suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplier_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE po_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE receiving_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE receiving_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE production_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE qc_checkpoints ENABLE ROW LEVEL SECURITY;
ALTER TABLE qc_inspections ENABLE ROW LEVEL SECURITY;
ALTER TABLE defect_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE ncr_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE capa_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE packing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE quality_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE oee_records ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust based on auth requirements)
DO $$
DECLARE
    t TEXT;
BEGIN
    FOR t IN 
        SELECT unnest(ARRAY[
            'parts_master', 'materials', 'bom', 'suppliers', 'supplier_evaluations',
            'supplier_materials', 'purchase_orders', 'po_items', 'receiving_records',
            'receiving_items', 'production_lines', 'production_orders', 'work_orders',
            'production_logs', 'qc_checkpoints', 'qc_inspections', 'defect_types',
            'ncr_reports', 'capa_records', 'packing_records', 'shipping_orders',
            'shipping_items', 'quality_metrics', 'oee_records'
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
-- 11. AUDIT TRIGGERS (Reuse existing audit infrastructure)
-- ============================================================================

-- Note: If audit_logs table and log_audit function exist from HSE system,
-- we can create triggers for manufacturing tables

-- Example trigger creation (if audit infrastructure exists):
/*
CREATE TRIGGER audit_parts_master
    AFTER INSERT OR UPDATE OR DELETE ON parts_master
    FOR EACH ROW EXECUTE FUNCTION log_table_changes();
*/

-- ============================================================================
-- End of Migration
-- ============================================================================
