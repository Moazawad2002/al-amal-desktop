import { describe, it, expect, beforeEach } from 'vitest';
import { mockDb } from '../src/services/mockDatabase';
import { UserProfile } from '../src/types/erp';

describe('Authentication & Authorization Tests (RLS Isolation)', () => {
  beforeEach(() => {
    mockDb.resetToDemo();
  });

  const manager: UserProfile = {
    id: 'usr-mgr',
    email: 'manager@alamal-eg.com',
    fullName: 'المهندس مصطفى رضوان',
    role: 'manager',
  };

  const rep1: UserProfile = {
    id: 'usr-rep1',
    email: 'rep1@alamal-eg.com',
    fullName: 'أحمد حسن',
    role: 'sales_rep',
    representativeId: 'rep-01',
  };

  const rep2: UserProfile = {
    id: 'usr-rep2',
    email: 'rep2@alamal-eg.com',
    fullName: 'محمود علي',
    role: 'sales_rep',
    representativeId: 'rep-02',
  };

  it('Manager can view all customers across all representatives', () => {
    const allCustomers = mockDb.getCustomers(manager);
    expect(allCustomers.length).toBeGreaterThanOrEqual(19);
  });

  it('Rep 1 can ONLY view their assigned customers and CANNOT see Rep 2 customers', () => {
    const rep1Customers = mockDb.getCustomers(rep1);
    expect(rep1Customers.length).toBeGreaterThan(0);

    // Verify all returned customers belong to Rep 1
    const foreignCustomer = rep1Customers.find(c => c.assignedRepId === rep2.representativeId);
    expect(foreignCustomer).toBeUndefined();
  });

  it('Rep 1 cannot modify or create invoices for Rep 2 customers (Security violation)', () => {
    const rep2Customers = mockDb.getCustomers(rep2);
    const targetCust = rep2Customers[0];

    expect(() => {
      mockDb.createInvoice(
        {
          customerId: targetCust.id,
          items: [],
        },
        rep1
      );
    }).toThrowError(/غير مصرح لك بإصدار فاتورة لعميل غير مسند إليك/);
  });

  it('Suppliers and purchase records are completely restricted from Sales Reps', () => {
    const repSuppliers = mockDb.getSuppliers(rep1);
    expect(repSuppliers.length).toBe(0);

    const mgrSuppliers = mockDb.getSuppliers(manager);
    expect(mgrSuppliers.length).toBeGreaterThan(0);
  });
});
