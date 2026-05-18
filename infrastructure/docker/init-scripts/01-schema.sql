-- Horizon Hope Academy — Extended Schema
-- Run automatically by Docker postgres on first start

-- ── Fee payments (M-Pesa C2B) ──────────────────────────────
CREATE TABLE IF NOT EXISTS fee_payments (
    id                SERIAL PRIMARY KEY,
    trans_id          VARCHAR(20) UNIQUE NOT NULL,   -- M-Pesa TransID
    trans_amount      NUMERIC(12,2) NOT NULL CHECK (trans_amount > 0),
    msisdn            VARCHAR(15) NOT NULL,           -- Parent phone
    bill_ref_number   VARCHAR(20) NOT NULL,           -- Student admission number
    trans_time        TIMESTAMP WITH TIME ZONE NOT NULL,
    org_account_balance NUMERIC(12,2),
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    -- Prevent double-spend: same TransID cannot be inserted twice (UNIQUE above)
    CONSTRAINT positive_amount CHECK (trans_amount > 0)
);

CREATE INDEX IF NOT EXISTS idx_fee_payments_bill_ref ON fee_payments(bill_ref_number);
CREATE INDEX IF NOT EXISTS idx_fee_payments_trans_time ON fee_payments(trans_time);

-- ── Student ledger balance view ────────────────────────────
CREATE TABLE IF NOT EXISTS student_fee_ledger (
    id                SERIAL PRIMARY KEY,
    admission_number  VARCHAR(20) UNIQUE NOT NULL,
    student_name      VARCHAR(150) NOT NULL,
    grade             VARCHAR(20) NOT NULL,
    term_fee          NUMERIC(12,2) NOT NULL DEFAULT 0,
    amount_paid       NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ── Payroll ledger (KRA compliance) ───────────────────────
CREATE TABLE IF NOT EXISTS payroll_ledger (
    id              SERIAL PRIMARY KEY,
    employee_id     VARCHAR(20) NOT NULL,
    employee_name   VARCHAR(150) NOT NULL,
    kra_pin         VARCHAR(15),                     -- KRA Personal Identification Number
    nssf_number     VARCHAR(20),                     -- NSSF membership number
    shif_number     VARCHAR(20),                     -- SHIF (ex-NHIF) number
    pay_period      VARCHAR(10) NOT NULL,            -- e.g. 2025-05
    basic_salary    NUMERIC(12,2) NOT NULL,
    gross_pay       NUMERIC(12,2) NOT NULL,
    paye_deduction  NUMERIC(12,2) NOT NULL DEFAULT 0,  -- KRA PAYE
    nssf_deduction  NUMERIC(12,2) NOT NULL DEFAULT 0,  -- NSSF 12%
    shif_deduction  NUMERIC(12,2) NOT NULL DEFAULT 0,  -- SHIF 2.75%
    net_pay         NUMERIC(12,2) GENERATED ALWAYS AS (gross_pay - paye_deduction - nssf_deduction - shif_deduction) STORED,
    p9_exported     BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (employee_id, pay_period)
);

-- ── Offline sync queue (conflict resolution) ──────────────
CREATE TABLE IF NOT EXISTS offline_sync_queue (
    id              SERIAL PRIMARY KEY,
    device_id       VARCHAR(64) NOT NULL,
    payload_type    VARCHAR(50) NOT NULL,    -- 'attendance', 'grade', 'contact'
    payload         JSONB NOT NULL,
    client_ts       TIMESTAMP WITH TIME ZONE NOT NULL,  -- LWW: client timestamp
    server_ts       TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status          VARCHAR(20) DEFAULT 'pending',  -- pending|applied|conflict
    UNIQUE (device_id, payload_type, client_ts)
);

-- ── Seed demo student ──────────────────────────────────────
INSERT INTO student_fee_ledger (admission_number, student_name, grade, term_fee)
VALUES ('HHA/2025/001', 'Amani Wachira', 'Grade 3', 12500.00)
ON CONFLICT DO NOTHING;
