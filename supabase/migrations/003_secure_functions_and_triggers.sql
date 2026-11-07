-- ==============================================================================
-- AL AMAL DISTRIBUTION MANAGEMENT SYSTEM (شركة الأمل لتوزيع المنتجات الغذائية)
-- MIGRATION 003: SECURE DATABASE FUNCTIONS, TRANSACTIONS, AND TRIGGERS
-- ==============================================================================

-- 1. ATOMIC INVOICE POSTING FUNCTION
CREATE OR REPLACE FUNCTION public.post_sales_invoice(p_invoice_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_inv RECORD;
    v_item RECORD;
    v_avail NUMERIC;
    v_warehouse_id UUID;
    v_mov_num VARCHAR(50);
BEGIN
    -- Fetch invoice
    SELECT * INTO v_inv FROM public.sales_invoices WHERE id = p_invoice_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invoice not found');
    END IF;

    IF v_inv.invoice_status = 'posted' THEN
        RETURN jsonb_build_object('success', false, 'error', 'Invoice is already posted');
    END IF;

    -- Get central warehouse ID
    SELECT id INTO v_warehouse_id FROM public.warehouses WHERE is_central = TRUE LIMIT 1;
    IF v_warehouse_id IS NULL THEN
        RETURN jsonb_build_object('success', false, 'error', 'Central warehouse configuration missing');
    END IF;

    -- Validate stock availability for each item
    FOR v_item IN SELECT * FROM public.sales_invoice_items WHERE invoice_id = p_invoice_id LOOP
        SELECT quantity_saleable INTO v_avail 
        FROM public.inventory_balances 
        WHERE warehouse_id = v_warehouse_id AND product_id = v_item.product_id;

        IF v_avail IS NULL OR v_avail < v_item.quantity THEN
            RETURN jsonb_build_object(
                'success', false, 
                'error', format('Insufficient saleable stock for product ID: %s. Available: %s, Requested: %s', 
                                v_item.product_id, COALESCE(v_avail, 0), v_item.quantity)
            );
        END IF;
    END LOOP;

    -- Deduct stock and record movements
    FOR v_item IN SELECT * FROM public.sales_invoice_items WHERE invoice_id = p_invoice_id LOOP
        -- Deduct from balances
        UPDATE public.inventory_balances
        SET quantity_saleable = quantity_saleable - v_item.quantity,
            updated_at = NOW()
        WHERE warehouse_id = v_warehouse_id AND product_id = v_item.product_id;

        -- Record movement in ledger
        v_mov_num := 'MOV-' || to_char(NOW(), 'YYYYMMDD') || '-' || substr(md5(random()::text), 1, 6);
        INSERT INTO public.inventory_movements (
            movement_number, warehouse_id, product_id, batch_id,
            movement_type, quantity, unit_cost, total_cost,
            reference_type, reference_id, notes, created_by
        ) VALUES (
            v_mov_num, v_warehouse_id, v_item.product_id, v_item.batch_id,
            'sales_deduction', v_item.quantity, v_item.unit_cost, (v_item.quantity * v_item.unit_cost),
            'sales_invoice', p_invoice_id, 'Sales invoice delivery', v_inv.created_by
        );
    END LOOP;

    -- Update customer outstanding balance
    UPDATE public.customers
    SET current_balance = current_balance + v_inv.total_amount,
        updated_at = NOW()
    WHERE id = v_inv.customer_id;

    -- Mark invoice as posted
    UPDATE public.sales_invoices
    SET invoice_status = 'posted',
        posted_at = NOW()
    WHERE id = p_invoice_id;

    -- Audit log
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
        v_inv.created_by,
        'POST_SALES_INVOICE',
        'sales_invoices',
        p_invoice_id::text,
        jsonb_build_object('invoice_number', v_inv.invoice_number, 'total_amount', v_inv.total_amount)
    );

    RETURN jsonb_build_object('success', true, 'invoice_id', p_invoice_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. ATOMIC CUSTOMER PAYMENT ALLOCATION FUNCTION
CREATE OR REPLACE FUNCTION public.process_customer_payment(
    p_payment_id UUID,
    p_allocations JSONB -- Array of objects: [{ "invoice_id": "...", "amount": 100.00 }]
)
RETURNS JSONB AS $$
DECLARE
    v_pay RECORD;
    v_alloc RECORD;
    v_total_alloc NUMERIC := 0;
    v_item JSONB;
    v_inv_id UUID;
    v_alloc_amt NUMERIC;
    v_inv_total NUMERIC;
    v_inv_paid NUMERIC;
BEGIN
    SELECT * INTO v_pay FROM public.customer_payments WHERE id = p_payment_id;
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Payment receipt not found');
    END IF;

    -- Calculate total allocation from JSONB array
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_allocations) LOOP
        v_total_alloc := v_total_alloc + (v_item->>'amount')::NUMERIC;
    END LOOP;

    IF v_total_alloc > v_pay.amount THEN
        RETURN jsonb_build_object('success', false, 'error', 'Total allocation exceeds payment receipt amount');
    END IF;

    -- Process each allocation
    FOR v_item IN SELECT * FROM jsonb_array_elements(p_allocations) LOOP
        v_inv_id := (v_item->>'invoice_id')::UUID;
        v_alloc_amt := (v_item->>'amount')::NUMERIC;

        SELECT total_amount, paid_amount INTO v_inv_total, v_inv_paid
        FROM public.sales_invoices WHERE id = v_inv_id;

        IF (v_inv_paid + v_alloc_amt) > v_inv_total THEN
            RETURN jsonb_build_object('success', false, 'error', 'Allocation exceeds invoice balance for invoice: ' || v_inv_id);
        END IF;

        -- Record allocation
        INSERT INTO public.payment_allocations (payment_id, invoice_id, allocated_amount)
        VALUES (p_payment_id, v_inv_id, v_alloc_amt)
        ON CONFLICT (payment_id, invoice_id) DO UPDATE
        SET allocated_amount = payment_allocations.allocated_amount + v_alloc_amt;

        -- Update invoice paid amount and payment status
        UPDATE public.sales_invoices
        SET paid_amount = paid_amount + v_alloc_amt,
            payment_status = CASE 
                WHEN (paid_amount + v_alloc_amt) >= total_amount THEN 'paid'
                ELSE 'partially_paid'
            END
        WHERE id = v_inv_id;
    END LOOP;

    -- Reduce customer overall balance
    UPDATE public.customers
    SET current_balance = current_balance - v_pay.amount,
        updated_at = NOW()
    WHERE id = v_pay.customer_id;

    -- Increase receiving financial account balance
    UPDATE public.financial_accounts
    SET current_balance = current_balance + v_pay.amount
    WHERE id = v_pay.account_id;

    -- Audit log
    INSERT INTO public.audit_logs (user_id, action, entity_type, entity_id, details)
    VALUES (
        v_pay.created_by,
        'PROCESS_CUSTOMER_PAYMENT',
        'customer_payments',
        p_payment_id::text,
        jsonb_build_object('amount', v_pay.amount, 'allocated_amount', v_total_alloc)
    );

    RETURN jsonb_build_object('success', true, 'payment_id', p_payment_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. AUTOMATIC AUDIT LOG TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.audit_log_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        action,
        entity_type,
        entity_id,
        details
    ) VALUES (
        auth.uid(),
        TG_OP || '_' || TG_TABLE_NAME,
        TG_TABLE_NAME,
        COALESCE(NEW.id::text, OLD.id::text),
        jsonb_build_object('operation', TG_OP, 'timestamp', NOW())
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit trigger to sensitive financial tables
DROP TRIGGER IF EXISTS trg_audit_sales_invoices ON public.sales_invoices;
CREATE TRIGGER trg_audit_sales_invoices
    AFTER INSERT OR UPDATE OR DELETE ON public.sales_invoices
    FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_customer_payments ON public.customer_payments;
CREATE TRIGGER trg_audit_customer_payments
    AFTER INSERT OR UPDATE OR DELETE ON public.customer_payments
    FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();

DROP TRIGGER IF EXISTS trg_audit_expenses ON public.expenses;
CREATE TRIGGER trg_audit_expenses
    AFTER INSERT OR UPDATE OR DELETE ON public.expenses
    FOR EACH ROW EXECUTE FUNCTION public.audit_log_trigger();
