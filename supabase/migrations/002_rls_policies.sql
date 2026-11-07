-- ==============================================================================
-- AL AMAL DISTRIBUTION MANAGEMENT SYSTEM (شركة الأمل لتوزيع المنتجات الغذائية)
-- MIGRATION 002: ROW-LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

-- Enable RLS on all sensitive tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_representatives ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchase_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_returns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_return_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.supplier_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sales_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper security functions
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS VARCHAR AS $$
    SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.get_auth_rep_id()
RETURNS UUID AS $$
    SELECT representative_id FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 1. PROFILES POLICIES
-- ------------------------------------------------------------------------------
-- Users can view their own profile; managers can view all profiles
CREATE POLICY "Profiles view policy" ON public.profiles
    FOR SELECT USING (auth.uid() = id OR public.get_auth_role() = 'manager');

-- Only managers can update profiles or assign roles/reps
CREATE POLICY "Profiles update policy" ON public.profiles
    FOR UPDATE USING (public.get_auth_role() = 'manager');

-- ------------------------------------------------------------------------------
-- 2. SALES REPRESENTATIVES POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Reps view policy" ON public.sales_representatives
    FOR SELECT USING (
        public.get_auth_role() = 'manager' OR 
        id = public.get_auth_rep_id()
    );

CREATE POLICY "Reps manage policy" ON public.sales_representatives
    FOR ALL USING (public.get_auth_role() = 'manager');

-- ------------------------------------------------------------------------------
-- 3. CUSTOMERS POLICIES (Rep 1 cannot view Rep 2's customers)
-- ------------------------------------------------------------------------------
CREATE POLICY "Customers select policy" ON public.customers
    FOR SELECT USING (
        public.get_auth_role() = 'manager' OR 
        assigned_rep_id = public.get_auth_rep_id()
    );

CREATE POLICY "Customers insert/update policy" ON public.customers
    FOR ALL USING (
        public.get_auth_role() = 'manager' OR 
        assigned_rep_id = public.get_auth_rep_id()
    );

-- ------------------------------------------------------------------------------
-- 4. SALES INVOICES POLICIES (Rep 1 cannot view/modify Rep 2's invoices)
-- ------------------------------------------------------------------------------
CREATE POLICY "Sales invoices select policy" ON public.sales_invoices
    FOR SELECT USING (
        public.get_auth_role() = 'manager' OR 
        representative_id = public.get_auth_rep_id()
    );

CREATE POLICY "Sales invoices insert policy" ON public.sales_invoices
    FOR INSERT WITH CHECK (
        public.get_auth_role() = 'manager' OR 
        representative_id = public.get_auth_rep_id()
    );

-- Prevent unauthorized deletion or modification of posted invoices
CREATE POLICY "Sales invoices update policy" ON public.sales_invoices
    FOR UPDATE USING (
        public.get_auth_role() = 'manager' OR 
        (representative_id = public.get_auth_rep_id() AND invoice_status = 'draft')
    );

-- ------------------------------------------------------------------------------
-- 5. SALES INVOICE ITEMS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Sales invoice items select policy" ON public.sales_invoice_items
    FOR SELECT USING (
        public.get_auth_role() = 'manager' OR 
        EXISTS (
            SELECT 1 FROM public.sales_invoices 
            WHERE id = sales_invoice_items.invoice_id 
            AND representative_id = public.get_auth_rep_id()
        )
    );

CREATE POLICY "Sales invoice items insert policy" ON public.sales_invoice_items
    FOR INSERT WITH CHECK (
        public.get_auth_role() = 'manager' OR 
        EXISTS (
            SELECT 1 FROM public.sales_invoices 
            WHERE id = sales_invoice_items.invoice_id 
            AND representative_id = public.get_auth_rep_id()
        )
    );

-- ------------------------------------------------------------------------------
-- 6. CUSTOMER PAYMENTS (COLLECTIONS) POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Customer payments select policy" ON public.customer_payments
    FOR SELECT USING (
        public.get_auth_role() = 'manager' OR 
        representative_id = public.get_auth_rep_id()
    );

CREATE POLICY "Customer payments insert policy" ON public.customer_payments
    FOR INSERT WITH CHECK (
        public.get_auth_role() = 'manager' OR 
        representative_id = public.get_auth_rep_id()
    );

-- ------------------------------------------------------------------------------
-- 7. PAYMENT ALLOCATIONS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Payment allocations select policy" ON public.payment_allocations
    FOR SELECT USING (
        public.get_auth_role() = 'manager' OR 
        EXISTS (
            SELECT 1 FROM public.customer_payments 
            WHERE id = payment_allocations.payment_id 
            AND representative_id = public.get_auth_rep_id()
        )
    );

CREATE POLICY "Payment allocations insert policy" ON public.payment_allocations
    FOR INSERT WITH CHECK (
        public.get_auth_role() = 'manager' OR 
        EXISTS (
            SELECT 1 FROM public.customer_payments 
            WHERE id = payment_allocations.payment_id 
            AND representative_id = public.get_auth_rep_id()
        )
    );

-- ------------------------------------------------------------------------------
-- 8. SALES TARGETS POLICIES
-- ------------------------------------------------------------------------------
CREATE POLICY "Sales targets select policy" ON public.sales_targets
    FOR SELECT USING (
        public.get_auth_role() = 'manager' OR 
        representative_id = public.get_auth_rep_id()
    );

CREATE POLICY "Sales targets manage policy" ON public.sales_targets
    FOR ALL USING (public.get_auth_role() = 'manager');

-- ------------------------------------------------------------------------------
-- 9. PRODUCTS & INVENTORY VISIBILITY
-- ------------------------------------------------------------------------------
-- All authenticated users can view product catalog and stock levels
CREATE POLICY "Products view policy" ON public.products
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Products manage policy" ON public.products
    FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Inventory balances view policy" ON public.inventory_balances
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Inventory batches view policy" ON public.inventory_batches
    FOR SELECT TO authenticated USING (true);

-- ------------------------------------------------------------------------------
-- 10. MANAGER-ONLY SENSITIVE MODULES
-- ------------------------------------------------------------------------------
-- Suppliers, Purchase Invoices, Expenses, Accounts, Audit Logs are restricted to Manager
CREATE POLICY "Suppliers policy" ON public.suppliers
    FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Purchase invoices policy" ON public.purchase_invoices
    FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Purchase invoice items policy" ON public.purchase_invoice_items
    FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Supplier payments policy" ON public.supplier_payments
    FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Financial accounts policy" ON public.financial_accounts
    FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Expenses policy" ON public.expenses
    FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Audit logs policy" ON public.audit_logs
    FOR SELECT USING (public.get_auth_role() = 'manager');
