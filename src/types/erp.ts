export type UserRole = 'manager' | 'sales_rep';

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  representativeId?: string;
  phone?: string;
  avatarUrl?: string;
}

export interface SalesRepresentative {
  id: string;
  code: string;
  fullNameAr: string;
  fullNameEn: string;
  phone: string;
  salesTargetMonthly: number;
  commissionRate: number;
  status: 'active' | 'inactive' | 'suspended';
}

export interface Customer {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  customerType: 'supermarket' | 'grocery' | 'hypermarket' | 'wholesaler';
  phone: string;
  address: string;
  governorate: string;
  assignedRepId: string;
  assignedRepName?: string;
  creditLimit: number;
  paymentTermsDays: number;
  openingBalance: number;
  currentBalance: number;
  status: 'active' | 'inactive' | 'blocked';
  notes?: string;
}

export interface Supplier {
  id: string;
  code: string;
  nameAr: string;
  nameEn?: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address: string;
  openingBalance: number;
  currentBalance: number;
  paymentTermsDays: number;
  status: 'active' | 'inactive';
}

export interface ProductCategory {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  description?: string;
}

export interface Product {
  id: string;
  sku: string;
  barcode?: string;
  nameAr: string;
  nameEn?: string;
  categoryId: string;
  categoryName?: string;
  brand?: string;
  unit: string;
  purchaseCost: number;
  sellingPrice: number;
  minStockLevel: number;
  reorderPoint: number;
  primarySupplierId?: string;
  supplierName?: string;
  status: 'active' | 'discontinued';
  stockQuantity: number;
}

export interface InventoryBatch {
  id: string;
  productId: string;
  productName?: string;
  batchNumber: string;
  manufacturingDate?: string;
  expirationDate: string;
  initialQuantity: number;
  remainingQuantity: number;
  unitCost: number;
  status: 'saleable' | 'quarantine' | 'expired' | 'damaged';
}

export interface InventoryBalance {
  warehouseId: string;
  productId: string;
  productNameAr: string;
  productSku: string;
  categoryName: string;
  quantitySaleable: number;
  quantityReserved: number;
  quantityDamaged: number;
  quantityExpired: number;
  averageCost: number;
  reorderPoint: number;
}

export interface InventoryMovement {
  id: string;
  movementNumber: string;
  warehouseId: string;
  productId: string;
  productName: string;
  movementType: 'purchase_receipt' | 'sales_deduction' | 'customer_return' | 'supplier_return' | 'stock_adjustment' | 'damage_writeoff' | 'expired_writeoff';
  quantity: number;
  unitCost: number;
  totalCost: number;
  referenceType: string;
  referenceId?: string;
  notes?: string;
  createdAt: string;
}

export interface SalesInvoiceItem {
  id: string;
  productId: string;
  productName: string;
  sku: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  unitCost: number;
  discountPercent: number;
  discountAmount: number;
  totalPrice: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  representativeId: string;
  representativeName: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: number;
  discountAmount: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  outstandingBalance: number;
  paymentStatus: 'unpaid' | 'partially_paid' | 'paid';
  invoiceStatus: 'draft' | 'posted' | 'partially_returned' | 'fully_returned' | 'cancelled';
  paymentTerms: string;
  notes?: string;
  items: SalesInvoiceItem[];
  postedAt?: string;
}

export interface CustomerPayment {
  id: string;
  receiptNumber: string;
  customerId: string;
  customerName: string;
  representativeId: string;
  representativeName: string;
  accountId: string;
  accountName: string;
  amount: number;
  paymentDate: string;
  paymentMethod: 'cash' | 'bank_transfer' | 'cheque' | 'pos_fawry';
  referenceNumber?: string;
  notes?: string;
  status: 'posted' | 'cancelled';
  allocatedAmount: number;
}

export interface PaymentAllocation {
  id: string;
  paymentId: string;
  invoiceId: string;
  invoiceNumber: string;
  allocatedAmount: number;
}

export interface FinancialAccount {
  id: string;
  code: string;
  nameAr: string;
  nameEn: string;
  accountType: 'cash_safe' | 'bank_cib' | 'bank_nbe' | 'pos_fawry';
  currency: string;
  currentBalance: number;
  isActive: boolean;
}

export interface Expense {
  id: string;
  expenseNumber: string;
  category: 'transportation' | 'fuel' | 'vehicle_maintenance' | 'salaries' | 'warehouse' | 'packaging' | 'administration' | 'other';
  amount: number;
  accountId: string;
  accountName: string;
  expenseDate: string;
  description: string;
  receiptRef?: string;
  status: 'pending_approval' | 'approved' | 'rejected';
  approvedBy?: string;
  createdBy: string;
}

export interface SalesReturn {
  id: string;
  returnNumber: string;
  invoiceId: string;
  invoiceNumber: string;
  customerId: string;
  customerName: string;
  representativeId: string;
  representativeName: string;
  returnDate: string;
  totalAmount: number;
  disposition: 'restock_saleable' | 'quarantine_inspection' | 'writeoff_damaged';
  status: 'pending_approval' | 'approved' | 'rejected';
  reason: string;
  items: {
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
  }[];
}

export interface SalesTarget {
  id: string;
  representativeId: string;
  representativeName: string;
  year: number;
  month: number;
  targetAmount: number;
  achievedAmount: number;
  achievementPercentage: number;
}

export interface AuditLog {
  id: string;
  userId?: string;
  userEmail: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: any;
  createdAt: string;
}
