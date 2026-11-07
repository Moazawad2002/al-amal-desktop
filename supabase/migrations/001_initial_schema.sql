-- ==============================================================================
-- AL AMAL DISTRIBUTION MANAGEMENT SYSTEM (شركة الأمل لتوزيع المنتجات الغذائية)
-- MIGRATION 001: INITIAL NORMALIZED SCHEMA
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SALES REPRESENTATIVES
CREATE TABLE IF NOT EXISTS public.sales_representatives (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    full_name_ar VARCHAR(150) NOT NULL,
    full_name_en VARCHAR(150),
    phone VARCHAR(50),
    sales_target_monthly NUMERIC(15, 2) DEFAULT 0.00,
    commission_rate NUMERIC(5, 2) DEFAULT 2.50,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES (Links Supabase Auth with System Roles)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role VARCHAR(30) NOT NULL CHECK (role IN ('manager', 'sales_rep')),
    representative_id UUID REFERENCES public.sales_representatives(id) ON DELETE SET NULL,
    phone VARCHAR(50),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. CENTRAL WAREHOUSE (Strictly ONE Central Warehouse as per requirements)
CREATE TABLE IF NOT EXISTS public.warehouses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL DEFAULT 'MAIN',
    name_ar VARCHAR(150) NOT NULL DEFAULT 'المستودع الرئيسي - شركة الأمل',
    name_en VARCHAR(150) NOT NULL DEFAULT 'Al Amal Central Warehouse',
    location VARCHAR(255) DEFAULT 'القاهرة - المنطقة الصناعية',
    is_central BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. PRODUCT CATEGORIES
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    name_en VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. UNITS OF MEASURE
CREATE TABLE IF NOT EXISTS public.units_of_measure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    name_ar VARCHAR(50) NOT NULL,
    name_en VARCHAR(50) NOT NULL
);

-- 6. SUPPLIERS
CREATE TABLE IF NOT EXISTS public.suppliers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    contact_person VARCHAR(100),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(100),
    address TEXT,
    opening_balance NUMERIC(15, 2) DEFAULT 0.00,
    current_balance NUMERIC(15, 2) DEFAULT 0.00,
    payment_terms_days INT DEFAULT 30,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    customer_type VARCHAR(30) DEFAULT 'supermarket' CHECK (customer_type IN ('supermarket', 'grocery', 'hypermarket', 'wholesaler')),
    phone VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    governorate VARCHAR(50) DEFAULT 'القاهرة',
    assigned_rep_id UUID REFERENCES public.sales_representatives(id) ON DELETE SET NULL,
    credit_limit NUMERIC(15, 2) DEFAULT 25000.00,
    payment_terms_days INT DEFAULT 15,
    opening_balance NUMERIC(15, 2) DEFAULT 0.00,
    current_balance NUMERIC(15, 2) DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'blocked')),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sku VARCHAR(50) UNIQUE NOT NULL,
    barcode VARCHAR(100) UNIQUE,
    name_ar VARCHAR(200) NOT NULL,
    name_en VARCHAR(200),
    category_id UUID REFERENCES public.product_categories(id) ON DELETE RESTRICT,
    brand VARCHAR(100),
    unit_id UUID REFERENCES public.units_of_measure(id) ON DELETE RESTRICT,
    purchase_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    selling_price NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    min_stock_level INT DEFAULT 20,
    reorder_point INT DEFAULT 50,
    primary_supplier_id UUID REFERENCES public.suppliers(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'discontinued')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. INVENTORY BATCHES & EXPIRATION TRACKING
CREATE TABLE IF NOT EXISTS public.inventory_batches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    batch_number VARCHAR(100) NOT NULL,
    manufacturing_date DATE,
    expiration_date DATE NOT NULL,
    initial_quantity NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    remaining_quantity NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    unit_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(20) DEFAULT 'saleable' CHECK (status IN ('saleable', 'quarantine', 'expired', 'damaged')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. INVENTORY BALANCES (Reconciled with Central Warehouse)
CREATE TABLE IF NOT EXISTS public.inventory_balances (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    quantity_saleable NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    quantity_reserved NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    quantity_damaged NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    quantity_expired NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    average_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(warehouse_id, product_id)
);

-- 11. INVENTORY MOVEMENTS (Strict Ledger)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    movement_number VARCHAR(50) UNIQUE NOT NULL,
    warehouse_id UUID NOT NULL REFERENCES public.warehouses(id),
    product_id UUID NOT NULL REFERENCES public.products(id),
    batch_id UUID REFERENCES public.inventory_batches(id),
    movement_type VARCHAR(30) NOT NULL CHECK (movement_type IN (
        'purchase_receipt', 'sales_deduction', 'customer_return', 
        'supplier_return', 'stock_adjustment', 'damage_writeoff', 'expired_writeoff'
    )),
    quantity NUMERIC(15, 2) NOT NULL,
    unit_cost NUMERIC(15, 2) NOT NULL,
    total_cost NUMERIC(15, 2) NOT NULL,
    reference_type VARCHAR(50),
    reference_id UUID,
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. FINANCIAL ACCOUNTS (Safe, Cash in Hand, Bank Accounts)
CREATE TABLE IF NOT EXISTS public.financial_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(30) UNIQUE NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    name_en VARCHAR(150),
    account_type VARCHAR(30) NOT NULL CHECK (account_type IN ('cash_safe', 'bank_cib', 'bank_nbe', 'pos_fawry')),
    currency VARCHAR(10) DEFAULT 'EGP',
    current_balance NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. PURCHASES AND SUPPLIER INVOICES
CREATE TABLE IF NOT EXISTS public.purchase_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) DEFAULT 0.00,
    discount_amount NUMERIC(15, 2) DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(15, 2) DEFAULT 0.00,
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid')),
    receipt_status VARCHAR(20) DEFAULT 'received' CHECK (receipt_status IN ('pending', 'received')),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.purchase_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES public.purchase_invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id),
    quantity NUMERIC(15, 2) NOT NULL,
    unit_price NUMERIC(15, 2) NOT NULL,
    total_price NUMERIC(15, 2) NOT NULL,
    batch_number VARCHAR(100),
    expiration_date DATE
);

-- 14. SALES INVOICES
CREATE TABLE IF NOT EXISTS public.sales_invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    representative_id UUID NOT NULL REFERENCES public.sales_representatives(id) ON DELETE RESTRICT,
    invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
    due_date DATE NOT NULL,
    subtotal NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(15, 2) DEFAULT 0.00,
    tax_amount NUMERIC(15, 2) DEFAULT 0.00,
    total_amount NUMERIC(15, 2) NOT NULL DEFAULT 0.00,
    paid_amount NUMERIC(15, 2) DEFAULT 0.00,
    payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'partially_paid', 'paid')),
    invoice_status VARCHAR(20) DEFAULT 'posted' CHECK (invoice_status IN ('draft', 'posted', 'partially_returned', 'fully_returned', 'cancelled')),
    payment_terms VARCHAR(50) DEFAULT 'credit',
    notes TEXT,
    posted_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sales_invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES public.sales_invoices(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    batch_id UUID REFERENCES public.inventory_batches(id),
    quantity NUMERIC(15, 2) NOT NULL,
    unit_price NUMERIC(15, 2) NOT NULL,
    discount_percent NUMERIC(5, 2) DEFAULT 0.00,
    discount_amount NUMERIC(15, 2) DEFAULT 0.00,
    total_price NUMERIC(15, 2) NOT NULL,
    unit_cost NUMERIC(15, 2) NOT NULL DEFAULT 0.00 -- Cost of Goods Sold tracking
);

-- 15. CUSTOMER COLLECTIONS AND RECEIPTS
CREATE TABLE IF NOT EXISTS public.customer_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    receipt_number VARCHAR(50) UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    representative_id UUID NOT NULL REFERENCES public.sales_representatives(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES public.financial_accounts(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(30) DEFAULT 'cash' CHECK (payment_method IN ('cash', 'bank_transfer', 'cheque', 'pos_fawry')),
    reference_number VARCHAR(100),
    notes TEXT,
    status VARCHAR(20) DEFAULT 'posted' CHECK (status IN ('posted', 'cancelled')),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.payment_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id UUID NOT NULL REFERENCES public.customer_payments(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES public.sales_invoices(id) ON DELETE RESTRICT,
    allocated_amount NUMERIC(15, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(payment_id, invoice_id)
);

-- 16. SALES RETURNS AND CREDIT NOTES
CREATE TABLE IF NOT EXISTS public.sales_returns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_number VARCHAR(50) UNIQUE NOT NULL,
    invoice_id UUID NOT NULL REFERENCES public.sales_invoices(id) ON DELETE RESTRICT,
    customer_id UUID NOT NULL REFERENCES public.customers(id) ON DELETE RESTRICT,
    representative_id UUID NOT NULL REFERENCES public.sales_representatives(id) ON DELETE RESTRICT,
    return_date DATE NOT NULL DEFAULT CURRENT_DATE,
    total_amount NUMERIC(15, 2) NOT NULL,
    disposition VARCHAR(30) NOT NULL CHECK (disposition IN ('restock_saleable', 'quarantine_inspection', 'writeoff_damaged')),
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending_approval', 'approved', 'rejected')),
    reason TEXT NOT NULL,
    approved_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.sales_return_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    return_id UUID NOT NULL REFERENCES public.sales_returns(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    quantity NUMERIC(15, 2) NOT NULL,
    unit_price NUMERIC(15, 2) NOT NULL,
    total_price NUMERIC(15, 2) NOT NULL
);

-- 17. SUPPLIER PAYMENTS
CREATE TABLE IF NOT EXISTS public.supplier_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    supplier_id UUID NOT NULL REFERENCES public.suppliers(id) ON DELETE RESTRICT,
    account_id UUID NOT NULL REFERENCES public.financial_accounts(id) ON DELETE RESTRICT,
    amount NUMERIC(15, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(30) DEFAULT 'bank_transfer',
    reference_number VARCHAR(100),
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. EXPENSES MANAGEMENT
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'transportation', 'fuel', 'vehicle_maintenance', 'salaries', 
        'warehouse', 'packaging', 'administration', 'other'
    )),
    amount NUMERIC(15, 2) NOT NULL,
    account_id UUID NOT NULL REFERENCES public.financial_accounts(id),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    description TEXT NOT NULL,
    receipt_ref VARCHAR(100),
    status VARCHAR(20) DEFAULT 'approved' CHECK (status IN ('pending_approval', 'approved', 'rejected')),
    approved_by UUID REFERENCES auth.users(id),
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. SALES TARGETS
CREATE TABLE IF NOT EXISTS public.sales_targets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    representative_id UUID NOT NULL REFERENCES public.sales_representatives(id) ON DELETE CASCADE,
    year INT NOT NULL,
    month INT NOT NULL CHECK (month BETWEEN 1 AND 12),
    target_amount NUMERIC(15, 2) NOT NULL,
    achieved_amount NUMERIC(15, 2) DEFAULT 0.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(representative_id, year, month)
);

-- 20. AUDIT LOGS (Immutable transaction audit trail)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(100),
    details JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Indexes for High Performance
CREATE INDEX IF NOT EXISTS idx_customers_rep ON public.customers(assigned_rep_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_rep ON public.sales_invoices(representative_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_cust ON public.sales_invoices(customer_id);
CREATE INDEX IF NOT EXISTS idx_sales_invoices_date ON public.sales_invoices(invoice_date);
CREATE INDEX IF NOT EXISTS idx_customer_payments_rep ON public.customer_payments(representative_id);
CREATE INDEX IF NOT EXISTS idx_customer_payments_cust ON public.customer_payments(customer_id);
CREATE INDEX IF NOT EXISTS idx_inventory_movements_prod ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_batches_exp ON public.inventory_batches(expiration_date);
