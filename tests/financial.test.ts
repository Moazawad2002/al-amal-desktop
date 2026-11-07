import { describe, it, expect, beforeEach } from 'vitest';
import { mockDb } from '../src/services/mockDatabase';
import { UserProfile } from '../src/types/erp';

describe('Financial Integrity & Receivables Reconciliation Tests', () => {
  beforeEach(() => {
    mockDb.resetToDemo();
  });

  const rep1: UserProfile = {
    id: 'usr-rep1',
    email: 'rep1@alamal-eg.com',
    fullName: 'أحمد حسن',
    role: 'sales_rep',
    representativeId: 'rep-01',
  };

  it('Customer collection reduces customer outstanding balance and updates receiving cash account', () => {
    const customers = mockDb.getCustomers(rep1);
    const customer = customers[0];
    const initialCustomerBalance = customer.currentBalance;

    const accounts = mockDb.getAccounts();
    const safeAccount = accounts[0];
    const initialSafeBalance = safeAccount.currentBalance;

    const paymentAmount = 5000;

    const payment = mockDb.recordCustomerPayment(
      {
        customerId: customer.id,
        amount: paymentAmount,
        paymentMethod: 'cash',
        notes: 'دفعة نقدية تحت الحساب',
      },
      rep1
    );

    expect(payment.receiptNumber).toMatch(/^REC-/);

    // Customer balance should decrease
    const updatedCustomers = mockDb.getCustomers(rep1);
    const updatedCust = updatedCustomers.find(c => c.id === customer.id)!;
    expect(updatedCust.currentBalance).toBe(initialCustomerBalance - paymentAmount);

    // Safe account should increase
    const updatedAccounts = mockDb.getAccounts();
    const updatedSafe = updatedAccounts.find(a => a.id === safeAccount.id)!;
    expect(updatedSafe.currentBalance).toBe(initialSafeBalance + paymentAmount);
  });

  it('Payment allocated to invoice closes invoice balance and marks it paid', () => {
    const invoices = mockDb.getInvoices(rep1);
    // Find an invoice with outstanding balance
    const invoice = invoices.find(i => i.outstandingBalance > 0)!;
    const amountToPay = invoice.outstandingBalance;

    mockDb.recordCustomerPayment(
      {
        customerId: invoice.customerId,
        amount: amountToPay,
        paymentMethod: 'cash',
        invoiceId: invoice.id,
      },
      rep1
    );

    const updatedInvoices = mockDb.getInvoices(rep1);
    const updatedInv = updatedInvoices.find(i => i.id === invoice.id)!;
    expect(updatedInv.outstandingBalance).toBe(0);
    expect(updatedInv.paymentStatus).toBe('paid');
  });
});
