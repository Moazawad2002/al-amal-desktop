import { describe, it, expect, beforeEach } from 'vitest';
import { mockDb } from '../src/services/mockDatabase';
import { UserProfile } from '../src/types/erp';

describe('Sales & Inventory Transactional Integrity Tests', () => {
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

  it('Draft invoices DO NOT deduct inventory from the central warehouse', () => {
    const productsBefore = mockDb.getProducts();
    const product = productsBefore[0];
    const initialStock = product.stockQuantity;

    const myCustomers = mockDb.getCustomers(rep1);
    const invoice = mockDb.createInvoice(
      {
        customerId: myCustomers[0].id,
        items: [
          {
            id: 'item-1',
            productId: product.id,
            productName: product.nameAr,
            sku: product.sku,
            unit: product.unit,
            quantity: 10,
            unitPrice: product.sellingPrice,
            unitCost: product.purchaseCost,
            discountPercent: 0,
            discountAmount: 0,
            totalPrice: product.sellingPrice * 10,
          },
        ],
      },
      rep1
    );

    expect(invoice.invoiceStatus).toBe('draft');
    const productsAfter = mockDb.getProducts();
    const productAfter = productsAfter.find(p => p.id === product.id)!;
    expect(productAfter.stockQuantity).toBe(initialStock);
  });

  it('Posting an invoice atomically deducts stock exactly once', () => {
    const productsBefore = mockDb.getProducts();
    const product = productsBefore[0];
    const initialStock = product.stockQuantity;
    const myCustomers = mockDb.getCustomers(rep1);

    const invoice = mockDb.createInvoice(
      {
        customerId: myCustomers[0].id,
        items: [
          {
            id: 'item-2',
            productId: product.id,
            productName: product.nameAr,
            sku: product.sku,
            unit: product.unit,
            quantity: 15,
            unitPrice: product.sellingPrice,
            unitCost: product.purchaseCost,
            discountPercent: 0,
            discountAmount: 0,
            totalPrice: product.sellingPrice * 15,
          },
        ],
      },
      rep1
    );

    mockDb.postSalesInvoice(invoice.id, rep1);

    const productsAfter = mockDb.getProducts();
    const productAfter = productsAfter.find(p => p.id === product.id)!;
    expect(productAfter.stockQuantity).toBe(initialStock - 15);
  });

  it('Posting prevents overselling and throws error if stock is insufficient', () => {
    const productsBefore = mockDb.getProducts();
    const product = productsBefore[0];
    const excessiveQuantity = product.stockQuantity + 9999;
    const myCustomers = mockDb.getCustomers(rep1);

    const invoice = mockDb.createInvoice(
      {
        customerId: myCustomers[0].id,
        items: [
          {
            id: 'item-oversell',
            productId: product.id,
            productName: product.nameAr,
            sku: product.sku,
            unit: product.unit,
            quantity: excessiveQuantity,
            unitPrice: product.sellingPrice,
            unitCost: product.purchaseCost,
            discountPercent: 0,
            discountAmount: 0,
            totalPrice: product.sellingPrice * excessiveQuantity,
          },
        ],
      },
      rep1
    );

    expect(() => {
      mockDb.postSalesInvoice(invoice.id, rep1);
    }).toThrowError(/عجز في مخزون المستودع المركزي/);
  });
});
