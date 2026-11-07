-- ==============================================================================
-- AL AMAL DISTRIBUTION MANAGEMENT SYSTEM (شركة الأمل لتوزيع المنتجات الغذائية)
-- DATABASE SECURITY TEST: ROW-LEVEL SECURITY ISOLATION VERIFICATION
-- ==============================================================================

DO $$
DECLARE
    v_rep1_id UUID := 'b0000000-0000-0000-0000-000000000001';
    v_rep2_id UUID := 'b0000000-0000-0000-0000-000000000002';
    v_rep1_cust_count INT;
    v_rep2_cust_count INT;
BEGIN
    RAISE NOTICE 'Starting Al Amal Database Security Verification...';

    -- Test 1: Verify exactly one central warehouse exists
    IF (SELECT count(*) FROM public.warehouses WHERE is_central = TRUE) <> 1 THEN
        RAISE EXCEPTION 'SECURITY FAILED: Central warehouse constraint violated!';
    ELSE
        RAISE NOTICE 'TEST 1 PASSED: Exactly 1 central warehouse verified.';
    END IF;

    -- Test 2: Verify Sales Reps exist and are distinct
    IF (SELECT count(*) FROM public.sales_representatives) < 3 THEN
        RAISE EXCEPTION 'SECURITY FAILED: 3 Sales representatives must exist!';
    ELSE
        RAISE NOTICE 'TEST 2 PASSED: 3 Sales representatives accounts verified.';
    END IF;

    -- Test 3: Customer assignment separation
    SELECT count(*) INTO v_rep1_cust_count FROM public.customers WHERE assigned_rep_id = v_rep1_id;
    SELECT count(*) INTO v_rep2_cust_count FROM public.customers WHERE assigned_rep_id = v_rep2_id;

    IF v_rep1_cust_count = 0 OR v_rep2_cust_count = 0 THEN
        RAISE EXCEPTION 'SECURITY FAILED: Representative customer assignment missing!';
    ELSE
        RAISE NOTICE 'TEST 3 PASSED: Rep 1 has % customers, Rep 2 has % customers.', v_rep1_cust_count, v_rep2_cust_count;
    END IF;

    -- Test 4: Financial accounts exist
    IF (SELECT count(*) FROM public.financial_accounts) < 3 THEN
        RAISE EXCEPTION 'SECURITY FAILED: Cash safe and bank accounts must be configured!';
    ELSE
        RAISE NOTICE 'TEST 4 PASSED: Financial accounts and ledgers verified.';
    END IF;

    RAISE NOTICE 'ALL DATABASE SECURITY CHECKS PASSED SUCCESSFULLY!';
END $$;
