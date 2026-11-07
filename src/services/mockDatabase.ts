import {
  UserProfile,
  SalesRepresentative,
  Customer,
  Supplier,
  Product,
  InventoryBatch,
  InventoryBalance,
  InventoryMovement,
  SalesInvoice,
  CustomerPayment,
  FinancialAccount,
  Expense,
  SalesReturn,
  SalesTarget,
  AuditLog
} from '../types/erp';

// Initial Seed Data
const initialReps: SalesRepresentative[] = [
  { id: 'rep-01', code: 'REP-01', fullNameAr: 'أحمد حسن إبراهيم', fullNameEn: 'Ahmed Hassan Ibrahim', phone: '01012345671', salesTargetMonthly: 600000, commissionRate: 2.5, status: 'active' },
  { id: 'rep-02', code: 'REP-02', fullNameAr: 'محمود علي عبد العزيز', fullNameEn: 'Mahmoud Ali Abdelaziz', phone: '01123456782', salesTargetMonthly: 750000, commissionRate: 2.75, status: 'active' },
  { id: 'rep-03', code: 'REP-03', fullNameAr: 'عمر خالد الصاوي', fullNameEn: 'Omar Khaled El-Sawy', phone: '01234567893', salesTargetMonthly: 850000, commissionRate: 3.0, status: 'active' },
];

const initialUsers: UserProfile[] = [
  { id: 'usr-mgr', email: 'manager@alamal-eg.com', fullName: 'المهندس مصطفى رضوان (المدير العام)', role: 'manager', phone: '01000000001' },
  { id: 'usr-rep1', email: 'rep1@alamal-eg.com', fullName: 'أحمد حسن (مندوب القاهرة الشمالية)', role: 'sales_rep', representativeId: 'rep-01', phone: '01012345671' },
  { id: 'usr-rep2', email: 'rep2@alamal-eg.com', fullName: 'محمود علي (مندوب الجيزة والهرم)', role: 'sales_rep', representativeId: 'rep-02', phone: '01123456782' },
  { id: 'usr-rep3', email: 'rep3@alamal-eg.com', fullName: 'عمر خالد (مندوب شرق القاهرة والتجمع)', role: 'sales_rep', representativeId: 'rep-03', phone: '01234567893' },
];

const initialAccounts: FinancialAccount[] = [
  { id: 'acc-01', code: 'SAFE-01', nameAr: 'خزينة المقر الرئيسي (كاش)', nameEn: 'HQ Main Cash Safe', accountType: 'cash_safe', currency: 'EGP', currentBalance: 485000, isActive: true },
  { id: 'acc-02', code: 'BANK-CIB', nameAr: 'البنك التجاري الدولي CIB - حساب الشركات', nameEn: 'CIB Corporate Account', accountType: 'bank_cib', currency: 'EGP', currentBalance: 1950000, isActive: true },
  { id: 'acc-03', code: 'BANK-NBE', nameAr: 'البنك الأهلي المصري NBE - حساب المشتريات', nameEn: 'NBE Operations Account', accountType: 'bank_nbe', currency: 'EGP', currentBalance: 820000, isActive: true },
  { id: 'acc-04', code: 'POS-FAWRY', nameAr: 'محصلات فوري وبوس المناديب', nameEn: 'Fawry Reps Collection POS', accountType: 'pos_fawry', currency: 'EGP', currentBalance: 145000, isActive: true },
];

const initialSuppliers: Supplier[] = [
  { id: 'sup-01', code: 'SUP-SAVOLA', nameAr: 'شركة صافولا للأغذية مصر', nameEn: 'Savola Foods Egypt', contactPerson: 'أ. عادل النجار', phone: '0224158900', email: 'orders@savola.com.eg', address: 'القاهرة - التجمع الخامس', openingBalance: 0, currentBalance: 185000, paymentTermsDays: 30, status: 'active' },
  { id: 'sup-02', code: 'SUP-JUHAYNA', nameAr: 'شركة جهينة للصناعات الغذائية', nameEn: 'Juhayna Food Industries', contactPerson: 'م. هاني سليمان', phone: '0238202020', email: 'sales@juhayna.com', address: 'أكتوبر - المنطقة الصناعية 1', openingBalance: 0, currentBalance: 240000, paymentTermsDays: 21, status: 'active' },
  { id: 'sup-03', code: 'SUP-REGINA', nameAr: 'مجموعة ريجينا للمكرونة', nameEn: 'Regina Pasta Group', contactPerson: 'أ. طارق الشاذلي', phone: '0226349911', email: 'b2b@regina.com.eg', address: 'مدينة السادات الصناعية', openingBalance: 0, currentBalance: 95000, paymentTermsDays: 30, status: 'active' },
  { id: 'sup-04', code: 'SUP-AMERICANA', nameAr: 'الشركة المصرية للمعلبات (أمريكانا)', nameEn: 'Americana Foods Egypt', contactPerson: 'أ. شريف حامد', phone: '0235391200', email: 'distribution@americana-group.com', address: 'القرية الذكية - مبنى B24', openingBalance: 0, currentBalance: 310000, paymentTermsDays: 45, status: 'active' },
  { id: 'sup-05', code: 'SUP-AROSA', nameAr: 'شركة شاي العروسة للتعبئة', nameEn: 'El Arosa Tea Co.', contactPerson: 'حاج بدوي مصطفى', phone: '0225784110', email: 'info@elarosa.com.eg', address: 'القاهرة - بولاق أبو العلا', openingBalance: 0, currentBalance: 120000, paymentTermsDays: 15, status: 'active' },
];

const initialCustomers: Customer[] = [
  // Rep 1 (Ahmed Hassan)
  { id: 'c-01', code: 'CUST-001', nameAr: 'خير زمان - فرع روض الفرج', nameEn: 'Kheir Zaman - Rod El Farag', customerType: 'supermarket', phone: '01099887711', address: 'كورنيش النيل - روض الفرج', governorate: 'القاهرة', assignedRepId: 'rep-01', assignedRepName: 'أحمد حسن', creditLimit: 50000, paymentTermsDays: 15, openingBalance: 0, currentBalance: 28400, status: 'active' },
  { id: 'c-02', code: 'CUST-002', nameAr: 'سوبر ماركت الفرجاني - شبرا', nameEn: 'El Fergany Supermarket - Shubra', customerType: 'supermarket', phone: '01188776622', address: '124 شارع شبرا الرئيسي', governorate: 'القاهرة', assignedRepId: 'rep-01', assignedRepName: 'أحمد حسن', creditLimit: 40000, paymentTermsDays: 15, openingBalance: 0, currentBalance: 14200, status: 'active' },
  { id: 'c-03', code: 'CUST-003', nameAr: 'أولاد رجب - فرع روكسي', nameEn: 'Awlad Ragab - Roxy', customerType: 'supermarket', phone: '01277665533', address: 'ميدان روكسي - مصر الجديدة', governorate: 'القاهرة', assignedRepId: 'rep-01', assignedRepName: 'أحمد حسن', creditLimit: 75000, paymentTermsDays: 21, openingBalance: 0, currentBalance: 46900, status: 'active' },
  { id: 'c-04', code: 'CUST-004', nameAr: 'ماركت القدس - الزيتون', nameEn: 'Al Quds Market - Zeitoun', customerType: 'grocery', phone: '01066554444', address: '45 شارع سليم الأول - الزيتون', governorate: 'القاهرة', assignedRepId: 'rep-01', assignedRepName: 'أحمد حسن', creditLimit: 20000, paymentTermsDays: 10, openingBalance: 0, currentBalance: 8900, status: 'active' },
  { id: 'c-05', code: 'CUST-005', nameAr: 'ميني ماركت الأمانة - عين شمس', nameEn: 'Al Amana Mini Market - Ain Shams', customerType: 'grocery', phone: '01155443355', address: 'شارع أحمد عصمت - عين شمس', governorate: 'القاهرة', assignedRepId: 'rep-01', assignedRepName: 'أحمد حسن', creditLimit: 15000, paymentTermsDays: 7, openingBalance: 0, currentBalance: 6300, status: 'active' },
  { id: 'c-06', code: 'CUST-006', nameAr: 'كازيون ماركت - فرع المطرية', nameEn: 'Kazyon - Matareya', customerType: 'supermarket', phone: '01244332266', address: 'ميدان المطرية', governorate: 'القاهرة', assignedRepId: 'rep-01', assignedRepName: 'أحمد حسن', creditLimit: 60000, paymentTermsDays: 14, openingBalance: 0, currentBalance: 31800, status: 'active' },
  { id: 'c-07', code: 'CUST-007', nameAr: 'أسواق العثيم - شبرا الخيمة', nameEn: 'Othaim Markets - Shubra El Kheima', customerType: 'supermarket', phone: '01033221177', address: 'شارع 15 مايو - شبرا الخيمة', governorate: 'القليوبية', assignedRepId: 'rep-01', assignedRepName: 'أحمد حسن', creditLimit: 55000, paymentTermsDays: 15, openingBalance: 0, currentBalance: 22100, status: 'active' },

  // Rep 2 (Mahmoud Ali)
  { id: 'c-08', code: 'CUST-008', nameAr: 'هايبر وان - فرع الشيخ زايد', nameEn: 'Hyper One - Sheikh Zayed', customerType: 'hypermarket', phone: '01122110088', address: 'مدخل 1 - مدينة الشيخ زايد', governorate: 'الجيزة', assignedRepId: 'rep-02', assignedRepName: 'محمود علي', creditLimit: 150000, paymentTermsDays: 30, openingBalance: 0, currentBalance: 94200, status: 'active' },
  { id: 'c-09', code: 'CUST-009', nameAr: 'مترو ماركت - المهندسين', nameEn: 'Metro Market - Mohandessin', customerType: 'supermarket', phone: '01211009999', address: 'شارع جامعة الدول العربية', governorate: 'الجيزة', assignedRepId: 'rep-02', assignedRepName: 'محمود علي', creditLimit: 80000, paymentTermsDays: 21, openingBalance: 0, currentBalance: 51300, status: 'active' },
  { id: 'c-10', code: 'CUST-010', nameAr: 'سعودي سوبر ماركت - الدقي', nameEn: 'Seoudi Supermarket - Dokki', customerType: 'supermarket', phone: '01099118810', address: 'ميدان المساحة - الدقي', governorate: 'الجيزة', assignedRepId: 'rep-02', assignedRepName: 'محمود علي', creditLimit: 90000, paymentTermsDays: 21, openingBalance: 0, currentBalance: 62400, status: 'active' },
  { id: 'c-11', code: 'CUST-011', nameAr: 'أسواق بدر الدين - زايد', nameEn: 'Badr El Din Markets - Zayed', customerType: 'supermarket', phone: '01188227711', address: 'الممشى السياحي - الشيخ زايد', governorate: 'الجيزة', assignedRepId: 'rep-02', assignedRepName: 'محمود علي', creditLimit: 45000, paymentTermsDays: 15, openingBalance: 0, currentBalance: 19500, status: 'active' },
  { id: 'c-12', code: 'CUST-012', nameAr: 'ماركت التقوى - فيصل', nameEn: 'Al Taqwa Market - Faisal', customerType: 'grocery', phone: '01277336612', address: 'شارع العشرين - فيصل الرئيسي', governorate: 'الجيزة', assignedRepId: 'rep-02', assignedRepName: 'محمود علي', creditLimit: 25000, paymentTermsDays: 10, openingBalance: 0, currentBalance: 11400, status: 'active' },
  { id: 'c-13', code: 'CUST-013', nameAr: 'سوبر ماركت الحرمين - الهرم', nameEn: 'Al Haramain Supermarket - Haram', customerType: 'grocery', phone: '01066445513', address: 'شارع حسن محمد - الهرم', governorate: 'الجيزة', assignedRepId: 'rep-02', assignedRepName: 'محمود علي', creditLimit: 30000, paymentTermsDays: 14, openingBalance: 0, currentBalance: 18700, status: 'active' },

  // Rep 3 (Omar Khaled)
  { id: 'c-14', code: 'CUST-014', nameAr: 'كارفور ماركت - المعادي سيتي سنتر', nameEn: 'Carrefour - Maadi City Centre', customerType: 'hypermarket', phone: '01155334414', address: 'الطريق الدائري - المعادي', governorate: 'القاهرة', assignedRepId: 'rep-03', assignedRepName: 'عمر خالد', creditLimit: 180000, paymentTermsDays: 30, openingBalance: 0, currentBalance: 118500, status: 'active' },
  { id: 'c-15', code: 'CUST-015', nameAr: 'لولو هايبر ماركت - التجمع الأول', nameEn: 'LuLu Hypermarket - First Settlement', customerType: 'hypermarket', phone: '01244223315', address: 'محور السادات - التجمع الأول', governorate: 'القاهرة', assignedRepId: 'rep-03', assignedRepName: 'عمر خالد', creditLimit: 160000, paymentTermsDays: 30, openingBalance: 0, currentBalance: 96000, status: 'active' },
  { id: 'c-16', code: 'CUST-016', nameAr: 'سوبر ماركت أوسكار - التجمع الخامس', nameEn: 'Oscar Grand Stores - 5th Settlement', customerType: 'supermarket', phone: '01033112216', address: 'شارع التسعين الجنوبي', governorate: 'القاهرة', assignedRepId: 'rep-03', assignedRepName: 'عمر خالد', creditLimit: 100000, paymentTermsDays: 21, openingBalance: 0, currentBalance: 68900, status: 'active' },
  { id: 'c-17', code: 'CUST-017', nameAr: 'فريش فود ماركت - بوينت 90', nameEn: 'Fresh Food Market - Point 90', customerType: 'supermarket', phone: '01122001117', address: 'مول بوينت 90 - أمام الجامعة الأمريكية', governorate: 'القاهرة', assignedRepId: 'rep-03', assignedRepName: 'عمر خالد', creditLimit: 90000, paymentTermsDays: 21, openingBalance: 0, currentBalance: 54200, status: 'active' },
  { id: 'c-18', code: 'CUST-018', nameAr: 'أسواق العثيم - مكرم عبيد', nameEn: 'Othaim Markets - Makram Ebeid', customerType: 'supermarket', phone: '01211990018', address: 'شارع مكرم عبيد - مدينة نصر', governorate: 'القاهرة', assignedRepId: 'rep-03', assignedRepName: 'عمر خالد', creditLimit: 70000, paymentTermsDays: 15, openingBalance: 0, currentBalance: 39600, status: 'active' },
  { id: 'c-19', code: 'CUST-019', nameAr: 'ماركت الرحاب - السوق التجاري', nameEn: 'Al Rehab Market', customerType: 'supermarket', phone: '01099882219', address: 'السوق الشرقي - مدينة الرحاب', governorate: 'القاهرة', assignedRepId: 'rep-03', assignedRepName: 'عمر خالد', creditLimit: 50000, paymentTermsDays: 15, openingBalance: 0, currentBalance: 23700, status: 'active' },
];

const initialProducts: Product[] = [
  { id: 'p-01', sku: 'OIL-CRY-001', barcode: '6221001001011', nameAr: 'زيت ذرة كريستال 1.6 لتر (كرتونة 6 زجاجات)', nameEn: 'Crystal Corn Oil 1.6L (Carton 6)', categoryId: 'cat-oils', categoryName: 'زيوت وسمن', brand: 'كريستال', unit: 'كرتونة', purchaseCost: 580, sellingPrice: 645, minStockLevel: 50, reorderPoint: 120, primarySupplierId: 'sup-01', supplierName: 'شركة صافولا للأغذية', status: 'active', stockQuantity: 340 },
  { id: 'p-02', sku: 'OIL-CRY-002', barcode: '6221001001028', nameAr: 'زيت عباد الشمس كريستال 2.2 لتر (كرتونة 4 زجاجات)', nameEn: 'Crystal Sunflower Oil 2.2L (Carton 4)', categoryId: 'cat-oils', categoryName: 'زيوت وسمن', brand: 'كريستال', unit: 'كرتونة', purchaseCost: 520, sellingPrice: 580, minStockLevel: 40, reorderPoint: 100, primarySupplierId: 'sup-01', supplierName: 'شركة صافولا للأغذية', status: 'active', stockQuantity: 260 },
  { id: 'p-03', sku: 'GHEE-RAW-001', barcode: '6221001001035', nameAr: 'سمن روابي نباتي 1.5 كجم (كرتونة 6 علب)', nameEn: 'Rawaby Vegetable Ghee 1.5kg (Carton 6)', categoryId: 'cat-oils', categoryName: 'زيوت وسمن', brand: 'روابي', unit: 'كرتونة', purchaseCost: 640, sellingPrice: 715, minStockLevel: 30, reorderPoint: 80, primarySupplierId: 'sup-01', supplierName: 'شركة صافولا للأغذية', status: 'active', stockQuantity: 190 },
  { id: 'p-04', sku: 'RICE-SAH-001', barcode: '6222002002012', nameAr: 'أرز مصري الساعة عريض الحبة 5 كجم (باكت 4 أكياس)', nameEn: 'Al Saa Egyptian Rice 5kg (Pack 4)', categoryId: 'cat-grains', categoryName: 'حبوب وبقوليات', brand: 'الساعة', unit: 'باكت', purchaseCost: 680, sellingPrice: 760, minStockLevel: 60, reorderPoint: 150, status: 'active', stockQuantity: 410 },
  { id: 'p-05', sku: 'PAS-REG-001', barcode: '6223003003013', nameAr: 'مكرونة ريجينا فرن 400 جم (كرتونة 20 كيس)', nameEn: 'Regina Penne Pasta 400g (Carton 20)', categoryId: 'cat-pasta', categoryName: 'مكرونة وصلصة', brand: 'ريجينا', unit: 'كرتونة', purchaseCost: 340, sellingPrice: 390, minStockLevel: 80, reorderPoint: 200, primarySupplierId: 'sup-03', supplierName: 'مجموعة ريجينا', status: 'active', stockQuantity: 520 },
  { id: 'p-06', sku: 'PAS-REG-002', barcode: '6223003003020', nameAr: 'مكرونة ريجينا اسباجيتي 400 جم (كرتونة 20 كيس)', nameEn: 'Regina Spaghetti 400g (Carton 20)', categoryId: 'cat-pasta', categoryName: 'مكرونة وصلصة', brand: 'ريجينا', unit: 'كرتونة', purchaseCost: 340, sellingPrice: 390, minStockLevel: 80, reorderPoint: 200, primarySupplierId: 'sup-03', supplierName: 'مجموعة ريجينا', status: 'active', stockQuantity: 480 },
  { id: 'p-07', sku: 'CAN-AME-001', barcode: '6224004004014', nameAr: 'تونة أمريكانا قطع سهلة الفتح 185 جم (كرتونة 48 علبة)', nameEn: 'Americana Chunk Tuna 185g (Carton 48)', categoryId: 'cat-canned', categoryName: 'معلبات وتونة', brand: 'أمريكانا', unit: 'كرتونة', purchaseCost: 2650, sellingPrice: 2980, minStockLevel: 20, reorderPoint: 50, primarySupplierId: 'sup-04', supplierName: 'أمريكانا للأغذية', status: 'active', stockQuantity: 110 },
  { id: 'p-08', sku: 'CAN-AME-002', barcode: '6224004004021', nameAr: 'فول مدمس أمريكانا سادة 400 جم (كرتونة 24 علبة)', nameEn: 'Americana Plain Fava Beans 400g (Carton 24)', categoryId: 'cat-canned', categoryName: 'معلبات وتونة', brand: 'أمريكانا', unit: 'كرتونة', purchaseCost: 380, sellingPrice: 440, minStockLevel: 40, reorderPoint: 100, primarySupplierId: 'sup-04', supplierName: 'أمريكانا للأغذية', status: 'active', stockQuantity: 310 },
  { id: 'p-09', sku: 'TEA-ARO-001', barcode: '6225005005015', nameAr: 'شاي العروسة أسود ناعم 250 جم (كرتونة 24 باكت)', nameEn: 'El Arosa Black Tea 250g (Carton 24)', categoryId: 'cat-bev', categoryName: 'شاي ومشروبات', brand: 'العروسة', unit: 'كرتونة', purchaseCost: 1120, sellingPrice: 1260, minStockLevel: 35, reorderPoint: 90, primarySupplierId: 'sup-05', supplierName: 'شاي العروسة', status: 'active', stockQuantity: 240 },
  { id: 'p-10', sku: 'DAI-JUH-001', barcode: '6226006006016', nameAr: 'حليب جهينة كامل الدسم 1 لتر (كرتونة 12 عبوة)', nameEn: 'Juhayna Full Cream Milk 1L (Carton 12)', categoryId: 'cat-dairy', categoryName: 'ألبان وأجبان', brand: 'جهينة', unit: 'كرتونة', purchaseCost: 440, sellingPrice: 495, minStockLevel: 45, reorderPoint: 120, primarySupplierId: 'sup-02', supplierName: 'جهينة للصناعات الغذائية', status: 'active', stockQuantity: 380 },
];

const initialBatches: InventoryBatch[] = [
  { id: 'bat-01', productId: 'p-01', productName: 'زيت ذرة كريستال 1.6 لتر', batchNumber: 'BAT-CRY-2026-08', manufacturingDate: '2026-08-01', expirationDate: '2027-08-01', initialQuantity: 400, remainingQuantity: 340, unitCost: 580, status: 'saleable' },
  { id: 'bat-02', productId: 'p-07', productName: 'تونة أمريكانا قطع 185 جم', batchNumber: 'BAT-AME-2026-05', manufacturingDate: '2026-05-15', expirationDate: '2029-05-15', initialQuantity: 150, remainingQuantity: 110, unitCost: 2650, status: 'saleable' },
  { id: 'bat-03', productId: 'p-10', productName: 'حليب جهينة كامل الدسم 1 لتر', batchNumber: 'BAT-JUH-2026-09', manufacturingDate: '2026-09-01', expirationDate: '2027-03-01', initialQuantity: 450, remainingQuantity: 380, unitCost: 440, status: 'saleable' },
  // Near-expiration demo batch (25 days left!)
  { id: 'bat-04', productId: 'p-10', productName: 'حليب جهينة كامل الدسم 1 لتر (دفعة صيفية)', batchNumber: 'BAT-JUH-2026-05', manufacturingDate: '2026-05-01', expirationDate: '2026-11-05', initialQuantity: 100, remainingQuantity: 28, unitCost: 440, status: 'saleable' },
];

const initialInvoices: SalesInvoice[] = [
  {
    id: 'inv-01',
    invoiceNumber: 'INV-2026-0101',
    customerId: 'c-01',
    customerName: 'خير زمان - فرع روض الفرج',
    representativeId: 'rep-01',
    representativeName: 'أحمد حسن إبراهيم',
    invoiceDate: '2026-10-02',
    dueDate: '2026-10-17',
    subtotal: 32250,
    discountAmount: 1000,
    taxAmount: 0,
    totalAmount: 31250,
    paidAmount: 20000,
    outstandingBalance: 11250,
    paymentStatus: 'partially_paid',
    invoiceStatus: 'posted',
    paymentTerms: 'آجل 15 يوم',
    notes: 'توريد أسبوعي أول',
    items: [
      { id: 'item-01', productId: 'p-01', productName: 'زيت ذرة كريستال 1.6 لتر', sku: 'OIL-CRY-001', unit: 'كرتونة', quantity: 20, unitPrice: 645, unitCost: 580, discountPercent: 0, discountAmount: 0, totalPrice: 12900 },
      { id: 'item-02', productId: 'p-05', productName: 'مكرونة ريجينا فرن 400 جم', sku: 'PAS-REG-001', unit: 'كرتونة', quantity: 30, unitPrice: 390, unitCost: 340, discountPercent: 0, discountAmount: 0, totalPrice: 11700 },
      { id: 'item-03', productId: 'p-08', productName: 'فول مدمس أمريكانا سادة', sku: 'CAN-AME-002', unit: 'كرتونة', quantity: 15, unitPrice: 440, unitCost: 380, discountPercent: 0, discountAmount: 0, totalPrice: 6600 },
    ],
    postedAt: '2026-10-02T10:30:00Z'
  },
  {
    id: 'inv-02',
    invoiceNumber: 'INV-2026-0102',
    customerId: 'c-08',
    customerName: 'هايبر وان - فرع الشيخ زايد',
    representativeId: 'rep-02',
    representativeName: 'محمود علي عبد العزيز',
    invoiceDate: '2026-10-04',
    dueDate: '2026-11-04',
    subtotal: 58900,
    discountAmount: 2000,
    taxAmount: 0,
    totalAmount: 56900,
    paidAmount: 56900,
    outstandingBalance: 0,
    paymentStatus: 'paid',
    invoiceStatus: 'posted',
    paymentTerms: 'آجل 30 يوم',
    notes: 'طلبية عروض شهرية',
    items: [
      { id: 'item-04', productId: 'p-07', productName: 'تونة أمريكانا قطع 185 جم', sku: 'CAN-AME-001', unit: 'كرتونة', quantity: 12, unitPrice: 2980, unitCost: 2650, discountPercent: 0, discountAmount: 0, totalPrice: 35760 },
      { id: 'item-05', productId: 'p-09', productName: 'شاي العروسة أسود ناعم 250 جم', sku: 'TEA-ARO-001', unit: 'كرتونة', quantity: 15, unitPrice: 1260, unitCost: 1120, discountPercent: 0, discountAmount: 0, totalPrice: 18900 },
    ],
    postedAt: '2026-10-04T12:00:00Z'
  },
  {
    id: 'inv-03',
    invoiceNumber: 'INV-2026-0103',
    customerId: 'c-14',
    customerName: 'كارفور ماركت - المعادي سيتي سنتر',
    representativeId: 'rep-03',
    representativeName: 'عمر خالد الصاوي',
    invoiceDate: '2026-10-08',
    dueDate: '2026-11-08',
    subtotal: 78400,
    discountAmount: 2500,
    taxAmount: 0,
    totalAmount: 75900,
    paidAmount: 0,
    outstandingBalance: 75900,
    paymentStatus: 'unpaid',
    invoiceStatus: 'posted',
    paymentTerms: 'آجل 30 يوم',
    notes: 'توريد فرع المعادي',
    items: [
      { id: 'item-06', productId: 'p-01', productName: 'زيت ذرة كريستال 1.6 لتر', sku: 'OIL-CRY-001', unit: 'كرتونة', quantity: 40, unitPrice: 645, unitCost: 580, discountPercent: 0, discountAmount: 0, totalPrice: 25800 },
      { id: 'item-07', productId: 'p-04', productName: 'أرز مصري الساعة عريض الحبة', sku: 'RICE-SAH-001', unit: 'باكت', quantity: 50, unitPrice: 760, unitCost: 680, discountPercent: 0, discountAmount: 0, totalPrice: 38000 },
      { id: 'item-08', productId: 'p-10', productName: 'حليب جهينة كامل الدسم 1 لتر', sku: 'DAI-JUH-001', unit: 'كرتونة', quantity: 30, unitPrice: 495, unitCost: 440, discountPercent: 0, discountAmount: 0, totalPrice: 14850 },
    ],
    postedAt: '2026-10-08T15:20:00Z'
  }
];

const initialPayments: CustomerPayment[] = [
  { id: 'pay-01', receiptNumber: 'REC-2026-0041', customerId: 'c-01', customerName: 'خير زمان - فرع روض الفرج', representativeId: 'rep-01', representativeName: 'أحمد حسن', accountId: 'acc-01', accountName: 'خزينة المقر الرئيسي', amount: 20000, paymentDate: '2026-10-05', paymentMethod: 'cash', referenceNumber: 'CASH-REC-101', notes: 'دفعة نقدية تحت حساب الفاتورة INV-2026-0101', status: 'posted', allocatedAmount: 20000 },
  { id: 'pay-02', receiptNumber: 'REC-2026-0042', customerId: 'c-08', customerName: 'هايبر وان - فرع الشيخ زايد', representativeId: 'rep-02', representativeName: 'محمود علي', accountId: 'acc-02', accountName: 'البنك التجاري الدولي CIB', amount: 56900, paymentDate: '2026-10-09', paymentMethod: 'bank_transfer', referenceNumber: 'CIB-TRF-98214', notes: 'سداد كامل الفاتورة INV-2026-0102 تحويل بنكي', status: 'posted', allocatedAmount: 56900 },
];

const initialExpenses: Expense[] = [
  { id: 'exp-01', expenseNumber: 'EXP-2026-011', category: 'fuel', amount: 4500, accountId: 'acc-01', accountName: 'خزينة المقر الرئيسي', expenseDate: '2026-10-03', description: 'سولار سيارات التوزيع (فانات سوزوكي وجامبو)', receiptRef: 'GAS-00912', status: 'approved', approvedBy: 'المدير العام', createdBy: 'محمود علي' },
  { id: 'exp-02', expenseNumber: 'EXP-2026-012', category: 'vehicle_maintenance', amount: 8200, accountId: 'acc-01', accountName: 'خزينة المقر الرئيسي', expenseDate: '2026-10-06', description: 'صيانة دورية وتغيير زيوت وفلاتر سيارة التوزيع ديمكس', receiptRef: 'MNT-4411', status: 'approved', approvedBy: 'المدير العام', createdBy: 'أحمد حسن' },
  { id: 'exp-03', expenseNumber: 'EXP-2026-013', category: 'warehouse', amount: 6500, accountId: 'acc-01', accountName: 'خزينة المقر الرئيسي', expenseDate: '2026-10-08', description: 'شراء بالتات خشبية ومواد تغليف ستريتش للمستودع', receiptRef: 'WRH-102', status: 'approved', approvedBy: 'المدير العام', createdBy: 'أمين المستودع' },
];

const initialTargets: SalesTarget[] = [
  { id: 'tgt-01', representativeId: 'rep-01', representativeName: 'أحمد حسن إبراهيم', year: 2026, month: 10, targetAmount: 600000, achievedAmount: 524000, achievementPercentage: 87.3 },
  { id: 'tgt-02', representativeId: 'rep-02', representativeName: 'محمود علي عبد العزيز', year: 2026, month: 10, targetAmount: 750000, achievedAmount: 698500, achievementPercentage: 93.1 },
  { id: 'tgt-03', representativeId: 'rep-03', representativeName: 'عمر خالد الصاوي', year: 2026, month: 10, targetAmount: 850000, achievedAmount: 812000, achievementPercentage: 95.5 },
];

const initialAuditLogs: AuditLog[] = [
  { id: 'log-01', userId: 'usr-mgr', userEmail: 'manager@alamal-eg.com', action: 'SYSTEM_BOOT', entityType: 'system', entityId: 'desktop-init', details: { message: 'بدء تشغيل نظام شركة الأمل لتوزيع الأغذية' }, createdAt: '2026-10-12T08:00:00Z' },
  { id: 'log-02', userId: 'usr-rep1', userEmail: 'rep1@alamal-eg.com', action: 'POST_SALES_INVOICE', entityType: 'sales_invoices', entityId: 'inv-01', details: { invoiceNumber: 'INV-2026-0101', amount: 31250 }, createdAt: '2026-10-02T10:30:00Z' },
  { id: 'log-03', userId: 'usr-rep1', userEmail: 'rep1@alamal-eg.com', action: 'RECORD_PAYMENT', entityType: 'customer_payments', entityId: 'pay-01', details: { receiptNumber: 'REC-2026-0041', amount: 20000 }, createdAt: '2026-10-05T14:10:00Z' },
];

// In-Memory / LocalStorage State Manager
class MockDatabaseService {
  private users: UserProfile[] = initialUsers;
  private reps: SalesRepresentative[] = initialReps;
  private customers: Customer[] = initialCustomers;
  private suppliers: Supplier[] = initialSuppliers;
  private products: Product[] = initialProducts;
  private batches: InventoryBatch[] = initialBatches;
  private invoices: SalesInvoice[] = initialInvoices;
  private payments: CustomerPayment[] = initialPayments;
  private accounts: FinancialAccount[] = initialAccounts;
  private expenses: Expense[] = initialExpenses;
  private targets: SalesTarget[] = initialTargets;
  private auditLogs: AuditLog[] = initialAuditLogs;

  constructor() {
    this.loadState();
  }

  private saveState() {
    try {
      if (typeof localStorage === 'undefined') return;
      const state = {
        customers: this.customers,
        products: this.products,
        invoices: this.invoices,
        payments: this.payments,
        accounts: this.accounts,
        expenses: this.expenses,
        targets: this.targets,
        auditLogs: this.auditLogs,
      };
      localStorage.setItem('alamal_dms_state', JSON.stringify(state));
    } catch {
      // Ignored in non-browser envs
    }
  }

  private loadState() {
    try {
      if (typeof localStorage === 'undefined') return;
      const saved = localStorage.getItem('alamal_dms_state');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.customers) this.customers = parsed.customers;
        if (parsed.products) this.products = parsed.products;
        if (parsed.invoices) this.invoices = parsed.invoices;
        if (parsed.payments) this.payments = parsed.payments;
        if (parsed.accounts) this.accounts = parsed.accounts;
        if (parsed.expenses) this.expenses = parsed.expenses;
        if (parsed.targets) this.targets = parsed.targets;
        if (parsed.auditLogs) this.auditLogs = parsed.auditLogs;
      }
    } catch {
      // Use defaults
    }
  }

  // Auth & Roles
  getUsers(): UserProfile[] {
    return [...this.users];
  }

  getUserById(id: string): UserProfile | undefined {
    return this.users.find(u => u.id === id);
  }

  getReps(): SalesRepresentative[] {
    return [...this.reps];
  }

  // CUSTOMERS (Protected by RLS simulation)
  getCustomers(currentUser: UserProfile): Customer[] {
    if (currentUser.role === 'manager') {
      return [...this.customers];
    }
    // Sales rep can only access assigned customers
    return this.customers.filter(c => c.assignedRepId === currentUser.representativeId);
  }

  saveCustomer(customer: Customer, currentUser: UserProfile): Customer {
    const idx = this.customers.findIndex(c => c.id === customer.id);
    if (idx >= 0) {
      // Enforce RLS on update
      if (currentUser.role !== 'manager' && this.customers[idx].assignedRepId !== currentUser.representativeId) {
        throw new Error('غير مصرح لك بتعديل بيانات عميل مسند لمندوب آخر (RLS Error)');
      }
      this.customers[idx] = { ...customer };
    } else {
      const rep = this.reps.find(r => r.id === (customer.assignedRepId || currentUser.representativeId));
      const newCust: Customer = {
        ...customer,
        id: 'c-' + Date.now(),
        code: customer.code || `CUST-${String(this.customers.length + 1).padStart(3, '0')}`,
        assignedRepId: currentUser.role === 'manager' ? (customer.assignedRepId || 'rep-01') : (currentUser.representativeId || 'rep-01'),
        assignedRepName: rep?.fullNameAr || 'أحمد حسن',
      };
      this.customers.push(newCust);
    }
    this.saveState();
    return customer;
  }

  // PRODUCTS & INVENTORY
  getProducts(): Product[] {
    return [...this.products];
  }

  getBatches(): InventoryBatch[] {
    return [...this.batches];
  }

  saveProduct(product: Product): Product {
    const idx = this.products.findIndex(p => p.id === product.id);
    if (idx >= 0) {
      this.products[idx] = { ...product };
    } else {
      const newP: Product = {
        ...product,
        id: 'p-' + Date.now(),
        sku: product.sku || `PRD-${Date.now()}`,
      };
      this.products.push(newP);
    }
    this.saveState();
    return product;
  }

  // SUPPLIERS (Manager only)
  getSuppliers(currentUser: UserProfile): Supplier[] {
    if (currentUser.role !== 'manager') {
      return []; // Hidden from reps as per security specs
    }
    return [...this.suppliers];
  }

  // SALES INVOICES (Atomic posting, stock deduction & RLS)
  getInvoices(currentUser: UserProfile): SalesInvoice[] {
    if (currentUser.role === 'manager') {
      return [...this.invoices];
    }
    // Reps see only their invoices
    return this.invoices.filter(inv => inv.representativeId === currentUser.representativeId);
  }

  createInvoice(invoiceData: Partial<SalesInvoice>, currentUser: UserProfile): SalesInvoice {
    const repId = currentUser.role === 'manager' ? (invoiceData.representativeId || 'rep-01') : (currentUser.representativeId || 'rep-01');
    const rep = this.reps.find(r => r.id === repId);
    const cust = this.customers.find(c => c.id === invoiceData.customerId);

    if (!cust) throw new Error('العميل غير موجود');

    // RLS check: Rep can only create for assigned customer
    if (currentUser.role !== 'manager' && cust.assignedRepId !== currentUser.representativeId) {
      throw new Error('غير مصرح لك بإصدار فاتورة لعميل غير مسند إليك');
    }

    const items = invoiceData.items || [];
    let subtotal = 0;
    items.forEach(item => {
      subtotal += item.totalPrice;
    });

    const discount = invoiceData.discountAmount || 0;
    const total = subtotal - discount;

    const newInvoice: SalesInvoice = {
      id: 'inv-' + Date.now(),
      invoiceNumber: `INV-${new Date().getFullYear()}-${String(this.invoices.length + 101).padStart(4, '0')}`,
      customerId: cust.id,
      customerName: cust.nameAr,
      representativeId: repId,
      representativeName: rep?.fullNameAr || 'مندوب مبيعات',
      invoiceDate: invoiceData.invoiceDate || new Date().toISOString().split('T')[0],
      dueDate: invoiceData.dueDate || new Date(Date.now() + 15 * 86400000).toISOString().split('T')[0],
      subtotal,
      discountAmount: discount,
      taxAmount: 0,
      totalAmount: total,
      paidAmount: 0,
      outstandingBalance: total,
      paymentStatus: 'unpaid',
      invoiceStatus: 'draft',
      paymentTerms: cust.paymentTermsDays ? `آجل ${cust.paymentTermsDays} يوم` : 'نقدي',
      items,
      notes: invoiceData.notes || '',
    };

    this.invoices.unshift(newInvoice);
    this.saveState();
    return newInvoice;
  }

  postSalesInvoice(invoiceId: string, currentUser: UserProfile): SalesInvoice {
    const inv = this.invoices.find(i => i.id === invoiceId);
    if (!inv) throw new Error('الفاتورة غير موجودة');

    if (currentUser.role !== 'manager' && inv.representativeId !== currentUser.representativeId) {
      throw new Error('غير مصرح لك بترحيل فاتورة خاصة بمندوب آخر');
    }

    if (inv.invoiceStatus === 'posted') {
      throw new Error('الفاتورة مرحلة بالفعل');
    }

    // Atomic Stock Validation
    for (const item of inv.items) {
      const prod = this.products.find(p => p.id === item.productId);
      if (!prod || prod.stockQuantity < item.quantity) {
        throw new Error(`عجز في مخزون المستودع المركزي للمنتج (${item.productName}). المتاح: ${prod?.stockQuantity || 0}، المطلوب: ${item.quantity}`);
      }
    }

    // Atomic Stock Deduction
    for (const item of inv.items) {
      const prod = this.products.find(p => p.id === item.productId)!;
      prod.stockQuantity -= item.quantity;
    }

    // Update Customer Balance
    const cust = this.customers.find(c => c.id === inv.customerId);
    if (cust) {
      cust.currentBalance += inv.totalAmount;
    }

    inv.invoiceStatus = 'posted';
    inv.postedAt = new Date().toISOString();

    // Audit Log
    this.auditLogs.unshift({
      id: 'log-' + Date.now(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      action: 'POST_SALES_INVOICE',
      entityType: 'sales_invoices',
      entityId: inv.id,
      details: { invoiceNumber: inv.invoiceNumber, total: inv.totalAmount },
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return inv;
  }

  // CUSTOMER PAYMENTS (COLLECTIONS)
  getPayments(currentUser: UserProfile): CustomerPayment[] {
    if (currentUser.role === 'manager') {
      return [...this.payments];
    }
    return this.payments.filter(p => p.representativeId === currentUser.representativeId);
  }

  recordCustomerPayment(
    paymentData: { customerId: string; amount: number; paymentMethod: CustomerPayment['paymentMethod']; invoiceId?: string; notes?: string },
    currentUser: UserProfile
  ): CustomerPayment {
    const cust = this.customers.find(c => c.id === paymentData.customerId);
    if (!cust) throw new Error('العميل غير موجود');

    if (currentUser.role !== 'manager' && cust.assignedRepId !== currentUser.representativeId) {
      throw new Error('غير مصرح لك بتحصيل مبالغ من عميل مسند لمندوب آخر');
    }

    const repId = currentUser.role === 'manager' ? cust.assignedRepId : currentUser.representativeId!;
    const rep = this.reps.find(r => r.id === repId);
    const account = this.accounts[0]; // Cash Safe

    const newPayment: CustomerPayment = {
      id: 'pay-' + Date.now(),
      receiptNumber: `REC-${new Date().getFullYear()}-${String(this.payments.length + 101).padStart(4, '0')}`,
      customerId: cust.id,
      customerName: cust.nameAr,
      representativeId: repId,
      representativeName: rep?.fullNameAr || 'مندوب مبيعات',
      accountId: account.id,
      accountName: account.nameAr,
      amount: paymentData.amount,
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: paymentData.paymentMethod,
      referenceNumber: `REC-${Date.now()}`,
      notes: paymentData.notes || '',
      status: 'posted',
      allocatedAmount: paymentData.amount,
    };

    // If specific invoice provided, allocate
    if (paymentData.invoiceId) {
      const inv = this.invoices.find(i => i.id === paymentData.invoiceId);
      if (inv) {
        inv.paidAmount += paymentData.amount;
        inv.outstandingBalance = Math.max(0, inv.totalAmount - inv.paidAmount);
        inv.paymentStatus = inv.paidAmount >= inv.totalAmount ? 'paid' : 'partially_paid';
      }
    }

    // Reduce customer total balance
    cust.currentBalance = Math.max(0, cust.currentBalance - paymentData.amount);

    // Increase Cash Safe Balance
    account.currentBalance += paymentData.amount;

    this.payments.unshift(newPayment);

    // Audit log
    this.auditLogs.unshift({
      id: 'log-' + Date.now(),
      userId: currentUser.id,
      userEmail: currentUser.email,
      action: 'RECORD_CUSTOMER_PAYMENT',
      entityType: 'customer_payments',
      entityId: newPayment.id,
      details: { receiptNumber: newPayment.receiptNumber, amount: paymentData.amount },
      createdAt: new Date().toISOString(),
    });

    this.saveState();
    return newPayment;
  }

  // FINANCIAL ACCOUNTS & EXPENSES (Manager only)
  getAccounts(): FinancialAccount[] {
    return [...this.accounts];
  }

  getExpenses(): Expense[] {
    return [...this.expenses];
  }

  recordExpense(expenseData: Partial<Expense>, currentUser: UserProfile): Expense {
    const acc = this.accounts.find(a => a.id === (expenseData.accountId || this.accounts[0].id)) || this.accounts[0];
    const amount = Number(expenseData.amount) || 0;

    const newExp: Expense = {
      id: 'exp-' + Date.now(),
      expenseNumber: `EXP-${new Date().getFullYear()}-${String(this.expenses.length + 101).padStart(4, '0')}`,
      category: expenseData.category || 'fuel',
      amount,
      accountId: acc.id,
      accountName: acc.nameAr,
      expenseDate: expenseData.expenseDate || new Date().toISOString().split('T')[0],
      description: expenseData.description || 'مصروف تشغيلي',
      receiptRef: expenseData.receiptRef || '',
      status: 'approved',
      approvedBy: currentUser.fullName,
      createdBy: currentUser.fullName,
    };

    acc.currentBalance -= amount;
    this.expenses.unshift(newExp);
    this.saveState();
    return newExp;
  }

  // TARGETS
  getTargets(currentUser: UserProfile): SalesTarget[] {
    if (currentUser.role === 'manager') {
      return [...this.targets];
    }
    return this.targets.filter(t => t.representativeId === currentUser.representativeId);
  }

  // AUDIT LOGS (Manager only)
  getAuditLogs(currentUser: UserProfile): AuditLog[] {
    if (currentUser.role !== 'manager') {
      return [];
    }
    return [...this.auditLogs];
  }

  // RESET TO DEFAULT DEMO STATE (For safe testing)
  resetToDemo(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('alamal_dms_state');
    }
    this.users = initialUsers;
    this.reps = initialReps;
    this.customers = initialCustomers;
    this.suppliers = initialSuppliers;
    this.products = initialProducts;
    this.batches = initialBatches;
    this.invoices = initialInvoices;
    this.payments = initialPayments;
    this.accounts = initialAccounts;
    this.expenses = initialExpenses;
    this.targets = initialTargets;
    this.auditLogs = initialAuditLogs;
  }
}

export const mockDb = new MockDatabaseService();
