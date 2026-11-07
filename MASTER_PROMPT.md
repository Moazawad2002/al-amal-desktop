# MASTER PROMPT — AL AMAL DISTRIBUTION MANAGEMENT SYSTEM
## Antigravity AI — Windows Desktop Application

## 1. YOUR ROLE

Act as a Senior Desktop Software Engineer, Full-Stack Developer, Database Architect, Security Engineer, Senior Data Analyst, UI/UX Designer, QA Engineer, and Business Intelligence Consultant.

Your mission is to build a complete, professional, functional desktop application for **Al Amal Distribution Company (شركة الأمل للتوزيع)**, an Egyptian food distribution business serving grocery stores and supermarkets.

**This is a WINDOWS DESKTOP APPLICATION, NOT A WEB APPLICATION.**

Use Antigravity's agentic coding capabilities to create the actual project files, implement the database integration, run the application, execute tests, diagnose errors, and build a distributable Windows installer.

Do not stop after generating a plan, design, mockup, prototype, or static dashboard. Implement the application and verify its core workflows.

Make reasonable business assumptions where necessary, document them, and prioritize functional correctness, security, and data integrity over decorative features.

---

## 2. MANDATORY DESKTOP REQUIREMENTS

Build a standalone Windows desktop application named:

**Al Amal Distribution Management System**

The deliverable must be an installable desktop program, not a website that users must open in a browser.

### Desktop technology stack

Use the following architecture:

- Desktop runtime: Electron.
- Frontend: React + TypeScript.
- UI styling: Tailwind CSS.
- Component library: shadcn/ui or an equivalent professional desktop-friendly component library.
- Desktop build tooling: Vite and Electron tooling compatible with the selected Electron version.
- Charts: Recharts.
- Icons: Lucide.
- Form validation: React Hook Form with Zod, or equivalent.
- Backend: Supabase.
- Database: PostgreSQL managed through Supabase.
- Authentication: Supabase Auth.
- Authorization: PostgreSQL Row-Level Security (RLS) and secure server-side authorization.
- Data handling: Supabase client and authorized database functions.
- Excel import/export: XLSX-compatible library.
- CSV import/export: a reliable CSV library.
- PDF and printing: a suitable PDF-generation and Electron printing solution.
- Windows packaging: electron-builder or an equivalent maintained packaging tool.
- Testing: unit, integration, database-security, and desktop workflow tests.

Use compatible, maintained dependency versions. Pin dependencies and include a lockfile.

### Mandatory desktop behavior

Implement:

- A native desktop application window.
- A custom professional application shell.
- A native application icon and company branding.
- A desktop-appropriate sidebar and title bar.
- Window resizing and maximize/minimize behavior.
- Keyboard shortcuts where appropriate.
- Native file dialogs for importing Excel/CSV files and saving exports.
- A desktop printing workflow.
- Proper application startup and shutdown behavior.
- An offline/error screen when the remote backend cannot be reached.
- A packaged Windows installer, preferably an `.exe` installer.
- An application icon, version information, and installation metadata.
- A clean production build that does not require the developer to run a development server.

The application should run on supported Windows 10/11 64-bit systems, subject to the selected Electron runtime's compatibility requirements.

Do not deliver a browser-based web dashboard as the final product.

Do not use a browser-only HTML file as a substitute for the requested Electron desktop application.

### Desktop security

Configure Electron securely:

- `contextIsolation: true`.
- `nodeIntegration: false`.
- Use a carefully designed preload script.
- Expose only narrowly scoped, validated APIs through `contextBridge`.
- Validate IPC messages and their arguments.
- Deny unexpected navigation and new-window creation.
- Apply a restrictive Content Security Policy.
- Never expose arbitrary filesystem, shell, or process execution capabilities to the renderer.
- Never expose Supabase service-role keys, database passwords, private API keys, or other privileged credentials in frontend bundles or preload APIs.
- Keep privileged operations in a trusted backend or appropriately protected process.
- Do not execute downloaded code or untrusted scripts.

Electron is the desktop runtime. The renderer must not be treated as a trusted security boundary.

---

## 3. COMPANY PROFILE

Company name: Al Amal Distribution Company.

Arabic name: شركة الأمل للتوزيع.

Business type: Food products distribution.

Country: Egypt.

Default currency: Egyptian Pound (EGP / ج.م.).

Default language: Arabic, with complete right-to-left support.

Secondary language: English, with left-to-right support.

Users:
- One Company Manager / CEO.
- Three Sales Representatives.

Inventory:
- One central warehouse only.

Customers:
- Grocery stores and supermarkets.

Initial data:
- Realistic generated demonstration data.
- Excel/CSV import capability for future real company data.

Business operations:

The company purchases products from suppliers, receives goods into one central warehouse, sells products through three sales representatives, delivers goods to customers, receives customer payments, pays suppliers and expenses, and monitors financial and operational performance.

Do not create a separate inventory warehouse for each representative. Sales representatives are users of the system, not independent stock-owning warehouses.

Keep physical delivery and goods handover distinct from invoice creation when delivery tracking is implemented.

---

## 4. SYSTEM ARCHITECTURE

Implement a desktop application connected to a centralized backend.

### Architecture

Windows Desktop Application:
- Electron main process.
- Electron preload layer.
- React + TypeScript renderer.

Central backend:
- Supabase Auth.
- PostgreSQL.
- Database migrations.
- PostgreSQL functions and triggers.
- RLS policies.
- Secure database operations.
- Auditing and business transaction controls.

Use a shared central database so authorized company users can access the same up-to-date business records from different computers.

### Important distinction

The Electron desktop application is the user interface and desktop runtime. It is not the database server.

The application must not assume that storing information on one computer makes it available to all company users.

Use Supabase as the centralized source of truth.

If a feature requires server-side logic, implement it using secured PostgreSQL functions or an appropriately secured backend service.

Do not place a Supabase service-role key in Electron's renderer, preload script, packaged application, or any other client-distributed file.

Use database migrations or an equivalent reproducible schema setup.

Create a `.env.example` file containing placeholders only. Do not commit real credentials.

Document the configuration required to connect the application to the Supabase project.

If credentials are missing, show a clear setup/configuration screen and report the missing configuration. Never fake a successful database connection.

---

## 5. AUTHENTICATION AND USER ROLES

Create four authorized application accounts:

1. Company Manager / CEO.
2. Sales Representative 1.
3. Sales Representative 2.
4. Sales Representative 3.

Use Supabase Auth for authentication.

Associate each representative with a unique representative ID stored in a protected database profile.

### Manager permissions

The manager can access authorized company-wide records, including:

- All representatives and their performance.
- All sales invoices and invoice details.
- All customers and suppliers.
- All products and inventory.
- All purchases and supplier transactions.
- All returns and discounts.
- All collections and customer balances.
- Cash and bank transactions.
- Expenses and approvals.
- Inventory movements and expiration alerts.
- All authorized reports and analytics.
- Audit logs.
- User administration.
- Business settings.

### Representative permissions

Each representative can:

- View their own sales dashboard.
- Create sales invoices assigned to their own representative account.
- View their own invoices and invoice details.
- View their assigned customers.
- Record permitted customer collections.
- View their own collection history.
- View outstanding balances for assigned customers.
- View authorized product availability and selling prices.
- View their own sales targets and reports.

Representatives must not:

- Access another representative's invoices.
- Access another representative's customers or private customer activity.
- Read another representative's collections or financial records.
- Change their own representative ID to gain additional permissions.
- Modify their role or grant themselves manager access.
- Access company-wide financial analytics or administrative settings.
- Alter posted transactions without an authorized correction or reversal workflow.

### Account provisioning

Do not create public manager registration or public sign-up for privileged accounts.

Provide a documented administrative setup process for creating the four accounts through Supabase Auth and associating their profiles with the correct roles.

Do not hardcode production usernames or passwords.

For development only, optionally provide a documented seed/setup script that creates demonstration users using temporary credentials supplied through environment variables or a trusted administrative setup process.

Require temporary credentials to be changed before real use.

Do not store passwords in the application's business tables, sample data, audit logs, or configuration files.

### Password and recovery workflow

Implement:

- Login.
- Password visibility toggle.
- Session persistence using supported Supabase authentication mechanisms.
- Logout.
- Password recovery.
- Clear authentication error messages.
- Session-expiration handling.

Explain the setup required for Supabase Auth email recovery.

A desktop remember-session option must never bypass authentication or database authorization.

---

## 6. MANDATORY DATABASE SECURITY

Implement genuine PostgreSQL RLS policies for every sensitive table.

Use the authenticated Supabase identity to determine the user's permissions.

Never trust a role, user ID, representative ID, or permission supplied by the renderer without independent verification.

Implement appropriate SELECT, INSERT, UPDATE, and DELETE policies.

Restrict each representative to authorized records associated with their authenticated identity.

Restrict manager-only operations to explicitly authorized manager accounts.

Protect at least:

- Profiles and roles.
- Customers and customer assignments.
- Sales invoices and invoice items.
- Customer payments and payment allocations.
- Sales returns and credit notes.
- Expenses.
- Suppliers and purchases.
- Inventory records.
- Financial accounts.
- Sales targets.
- Audit logs.

Implement database constraints and secure transaction functions for sensitive operations.

Prevent unauthorized deletion or alteration of posted financial transactions.

Use atomic database transactions for:

- Posting sales invoices.
- Deducting inventory.
- Receiving purchased goods.
- Processing returns.
- Recording and allocating payments.
- Posting expenses and financial transactions.
- Performing authorized reversals.

Create automated database-security tests demonstrating that Representative 1 cannot access Representative 2's records, including through direct API requests and manipulated record IDs.

Test both read and write access.

Do not claim security tests passed unless they have actually been executed and their results recorded.

---

## 7. ENTERPRISE DESKTOP DESIGN SYSTEM

Create an eye-catching, polished desktop interface suitable for demonstrating to the company CEO.

### Visual direction

- Deep navy primary color.
- Teal and emerald accents.
- Warm orange warnings.
- Red critical alerts.
- White and light-gray surfaces.
- Professional typography.
- Clear spacing and visual hierarchy.
- Attractive icons and data visualizations.
- Restrained shadows and subtle gradients.
- Smooth, unobtrusive transitions.
- High-quality tables, forms, dialogs, and cards.
- Responsive layouts within a resizable desktop window.

The result should feel like a premium enterprise desktop ERP application, not a generic website embedded in a window.

Avoid overcrowded layouts, unnecessary animation, and excessive decorative effects.

### Branding

Display:
- Al Amal Distribution.
- شركة الأمل للتوزيع.

Create a professional text-based logo or a simple distribution-themed logo using package, warehouse, or logistics imagery.

Use the same branding throughout the application, login screen, reports, and printable invoices.

### Arabic and English

Provide a persistent language selector.

Arabic must use RTL direction throughout:
- Navigation.
- Forms.
- Tables.
- Dialogs.
- Search.
- Pagination.
- Charts and legends where supported.
- Notifications.
- Login and configuration screens.

English must use LTR direction.

Use appropriate Arabic fonts and ensure Arabic text renders correctly in PDF and printed reports.

Persist the language preference using an appropriate user preference mechanism.

---

## 8. DESKTOP NAVIGATION

Implement a desktop sidebar with:

1. Executive Dashboard.
2. Sales Management.
3. Sales Representatives.
4. Customers.
5. Products.
6. Central Warehouse.
7. Purchases & Suppliers.
8. Sales Returns & Discounts.
9. Collections & Receivables.
10. Cash Management & Expenses.
11. Expiration & Damaged Goods.
12. Reports & Analytics.
13. User Management.
14. Audit Log.
15. Settings.

Show only the modules authorized for the logged-in role.

Provide:
- Collapsible sidebar.
- Desktop title bar.
- Breadcrumbs.
- Page titles.
- Search where appropriate.
- Notifications.
- Contextual actions.
- Confirmation dialogs.
- Keyboard navigation.
- A suitable layout for smaller desktop windows.

Do not implement fake navigation items. Each displayed module must have working functionality or be clearly identified as not yet implemented during development.

---

## 9. EXECUTIVE DASHBOARD

Create a premium executive dashboard for the manager.

### KPI cards

- Total Sales.
- Net Sales.
- Gross Profit.
- Gross Profit Margin.
- Total Collections.
- Outstanding Customer Receivables.
- Total Inventory Value.
- Low-Stock Products.
- Products Near Expiration.
- Total Operating Expenses.

Use consistent financial definitions and explanatory tooltips.

Net sales must reflect posted sales less applicable discounts and sales returns, excluding cancelled transactions.

Gross profit must use recorded cost of goods sold.

Outstanding receivables must reconcile posted invoices, credit notes, and allocated customer payments.

Inventory value must use the configured costing method, not selling prices.

### Analytics

Build interactive charts for:

- Daily sales.
- Weekly sales.
- Monthly sales.
- Previous-period comparisons.
- Sales by representative.
- Sales by customer.
- Sales by product.
- Sales by product category.
- Sales by payment status.
- Sales target versus actual performance.

Provide appropriate filters for dates, representatives, products, and customers.

### Representative leaderboard

Compare representatives using:

- Net sales.
- Number of posted invoices.
- Average invoice value.
- Gross profit.
- Collection amount.
- Collection rate.
- Target achievement.
- Active customers.

Allow the manager to open each representative's detailed report.

Do not rank representatives using revenue alone when profitability and collection information is available.

### Management alerts

Show actionable alerts for:

- Low stock.
- Products nearing expiration.
- Expired products.
- Overdue invoices.
- Customers approaching credit limits.
- Significant sales declines.
- Pending approvals.
- Unposted transactions.

Each alert should open the relevant record or module.

### Date filters

Support:
- Today.
- Last 7 days.
- This month.
- Last month.
- This quarter.
- This year.
- Custom date range.

Recalculate all relevant metrics from actual authorized database records.

---

## 10. REPRESENTATIVE DASHBOARD

Create a personalized dashboard for each representative.

Display only authorized records.

KPIs:
- My Net Sales.
- My Number of Invoices.
- My Average Invoice Value.
- My Collections.
- My Outstanding Receivables.
- My Target Achievement.
- My Active Customers.

Charts:
- Daily and monthly sales.
- Sales by product.
- Top customers.
- Target versus actual.
- Collection performance.
- Recent invoices.
- Pending collection tasks.

Quick actions:
- Create Sales Invoice.
- View My Customers.
- Record Collection.
- View My Sales Report.

All dashboard metrics must derive from authorized database queries or secure database functions.

---

## 11. SALES MANAGEMENT

Implement a complete sales workflow.

### Invoice creation

Fields:
- Customer.
- Invoice date.
- Authorized sales representative.
- Product.
- Quantity.
- Unit.
- Unit price.
- Approved discount.
- Payment terms.
- Payment method where relevant.
- Notes.

Calculate:
- Line totals.
- Subtotal.
- Discounts.
- Configured taxes.
- Invoice total.
- Amount paid.
- Outstanding balance.

Load default selling prices from authorized product pricing records.

Allow price or discount overrides only within the user's permissions.

Validate quantities, stock availability, pricing rules, discounts, and customer credit policies before posting.

### Invoice lifecycle

Support:
- Draft.
- Posted.
- Partially Paid.
- Paid.
- Partially Returned.
- Fully Returned.
- Cancelled, where permitted.

Draft and cancelled invoices must not count as completed sales.

Posting an invoice must atomically validate stock and create the appropriate inventory movements.

### Invoice features

- Unique invoice numbers.
- Search and filters.
- Invoice detail pages.
- Printable invoices.
- PDF export.
- Sales reports.
- Authorized corrections and reversals.
- Full audit trail.

Posted invoices must never be silently edited or deleted.

Use controlled reversal or credit-note workflows.

---

## 12. CUSTOMER MANAGEMENT

Support:
- Customer code.
- Customer name.
- Customer type.
- Phone.
- Address.
- Assigned representative.
- Credit limit.
- Payment terms.
- Opening balance.
- Status.
- Notes.

Features:
- Customer profile.
- Sales history.
- Invoice history.
- Payment history.
- Outstanding balance.
- Overdue invoices.
- Returns history.
- Purchase trends.
- Customer statement.

Representatives must only access assigned customers.

Enforce customer access through RLS and backend authorization, not frontend filtering alone.

---

## 13. PRODUCT MANAGEMENT

Product fields:
- Product ID.
- SKU or barcode.
- Arabic and English names.
- Category.
- Brand.
- Unit of measure.
- Purchase cost.
- Selling price.
- Minimum stock.
- Reorder level.
- Supplier.
- Status.
- Optional tax category.

Support pieces, cartons, packs, and kilograms.

Where purchase and sales units differ, require explicitly configured conversion factors.

Never assume carton-to-piece conversion rates.

Restrict sensitive purchase cost and margin information to authorized users.

---

## 14. CENTRAL WAREHOUSE AND INVENTORY

Implement exactly ONE central warehouse.

Inventory functionality:
- Purchase receipts.
- Sales deductions.
- Customer returns.
- Damaged and expired goods.
- Authorized stock adjustments.
- Physical counts.
- Stock balances.
- Movement history.
- Batch and lot tracking.
- Low-stock alerts.
- Expiration alerts.

Separate saleable, reserved, damaged, expired, and quarantined quantities where relevant.

Every inventory movement must reference its source transaction.

Prevent negative available stock by default.

Use atomic database transactions to prevent overselling.

For batch-tracked products, store:
- Lot number.
- Manufacturing date, when applicable.
- Expiration date.
- Received quantity.
- Remaining quantity.

Implement configurable expiration alerts and FEFO picking where appropriate.

Expired and damaged products must not be available for sale.

Use a consistent weighted-average costing method unless another documented costing method is deliberately configured.

Ensure inventory balances and cost of goods sold reconcile with the movement ledger.

---

## 15. PURCHASES AND SUPPLIERS

Supplier records:
- Supplier code.
- Name.
- Contact information.
- Address.
- Opening balance.
- Payment terms.
- Status.
- Notes.

Support:
- Purchase orders.
- Supplier invoices.
- Partial deliveries.
- Goods receipts.
- Purchase costs.
- Supplier payments.
- Outstanding balances.
- Purchase returns.
- Purchase history.

A purchase order must not increase inventory.

Increase inventory only when goods are received and accepted.

Prevent duplicate receipts.

Reconcile supplier payments with supplier invoices.

Use controlled workflows for supplier returns and inventory adjustments.

---

## 16. RETURNS, DISCOUNTS, AND DAMAGED PRODUCTS

Implement controlled workflows for:
- Partial and full customer returns.
- Supplier purchase returns.
- Approved discounts.
- Damaged products.
- Expired products.

Record:
- Return number.
- Original invoice.
- Product.
- Quantity.
- Reason.
- Financial impact.
- Inventory disposition.
- Approving user.
- Transaction date.

Returned stock must not automatically become saleable until its condition is assessed.

Require manager approval for discounts exceeding configured thresholds.

Prevent double-counting returns and discounts in analytics.

---

## 17. COLLECTIONS AND RECEIVABLES

Support:
- Cash payments.
- Bank transfers.
- Electronic payments.
- Partial payments.
- Payment allocation to individual invoices.
- Allocation across multiple invoices.
- Customer advance payments.

Record:
- Receipt number.
- Customer.
- Amount.
- Date.
- Payment method.
- Receiving account.
- Reference number.
- Recorded by.
- Allocated invoices.

Display:
- Total receivables.
- Current balances.
- Overdue balances.
- Aging buckets: 0–30, 31–60, 61–90, and over 90 days.
- Credit limits.
- Unallocated payments.

Prevent duplicate receipts and over-allocation.

Do not count the same payment more than once.

Implement customer statements and invoice-level outstanding balances.

---

## 18. CASH MANAGEMENT AND EXPENSES

Support configurable cash and bank accounts.

Transactions:
- Customer receipts.
- Supplier payments.
- Operating expenses.
- Transfers between company accounts.
- Authorized cash adjustments.

Expense categories:
- Transportation.
- Fuel.
- Vehicle maintenance.
- Salaries and wages.
- Warehouse expenses.
- Packaging.
- Administration.
- Other configurable categories.

Each expense includes:
- Expense number.
- Date.
- Category.
- Amount.
- Payment account.
- Description.
- Optional attachment.
- Created by.
- Approval status.

Require approval for configured expense thresholds.

Maintain a transaction ledger.

Prevent silent deletion of posted transactions.

Reconcile opening balances, receipts, payments, transfers, and closing balances.

Do not treat credit sales as cash receipts.

---

## 19. SALES TARGETS AND PERFORMANCE

Allow managers to configure monthly, quarterly, and annual targets by representative.

Optionally support product and category targets.

Calculate:

Target Achievement % = Actual Net Sales / Sales Target × 100

Report:
- Gross profit by representative.
- Sales growth.
- Average invoice value.
- Active customers.
- Collection rate.
- Overdue receivables.
- Product sales mix.
- Customer sales mix.

Clearly distinguish revenue, collections, gross profit, receivables, and cash balance.

---

## 20. REPORTS AND EXPORTS

Create a reporting center with:

- Sales Summary.
- Sales by Representative.
- Sales by Product.
- Sales by Customer.
- Sales Invoice Register.
- Sales Returns.
- Collections.
- Customer Aging.
- Inventory Balance.
- Inventory Movements.
- Expiration Report.
- Purchases.
- Supplier Balances.
- Cash and Bank Ledger.
- Expenses.
- Gross Profit.
- Audit Log.

Provide filters, search, sorting, pagination, and appropriate permissions.

Use native desktop file dialogs to save Excel/CSV/PDF reports.

Exports must respect the current user's permissions and active filters.

Use appropriate EGP formatting, dates, and Arabic text rendering.

Do not export unauthorized data just because the user has access to the desktop computer.

---

## 21. EXCEL IMPORT AND EXPORT

Implement a dedicated desktop import wizard.

Workflow:
1. Open a native file picker.
2. Select an XLSX or CSV file.
3. Preview rows and columns.
4. Map spreadsheet columns to system fields.
5. Validate data types and required fields.
6. Detect duplicates.
7. Display row-level validation errors.
8. Confirm import.
9. Import through a safe staged process.
10. Display a summary and downloadable error report.

Support sample templates for:
- Customers.
- Products.
- Suppliers.
- Opening inventory.

Do not assume a fixed spreadsheet format.

Prevent partial imports from corrupting financial or inventory data.

Historical invoice and opening-balance imports must not accidentally duplicate revenue, inventory, or cash movements.

---

## 22. REALISTIC DEMONSTRATION DATA

Generate consistent sample data containing:
- Three representatives.
- 20–30 Egyptian grocery and supermarket customers.
- 30–50 food products.
- 5–10 suppliers.
- Purchase orders and invoices.
- Goods receipts.
- Sales invoices across multiple dates.
- Invoice line items.
- Partial and full payments.
- Outstanding invoices.
- A limited number of returns.
- Expenses.
- Inventory movements.
- Product batches and expiration dates.
- Sales targets for each representative.

Use realistic Egyptian business examples and EGP.

Ensure relationships and transaction totals reconcile.

Include realistic low-stock, near-expiration, overdue invoice, and performance examples.

Clearly identify all demonstration records as sample data.

Do not generate dashboard figures unrelated to the underlying transactions.

Provide a safe development-only reset/reseed procedure. Never expose a production reset operation to ordinary users.

---

## 23. DATABASE DESIGN

Create a normalized PostgreSQL schema with suitable constraints, indexes, relationships, and timestamps.

Include, as required:
- profiles
- roles and permissions
- sales_representatives
- customers
- customer_assignments
- suppliers
- products
- product_categories
- units_of_measure
- product_unit_conversions
- warehouses
- inventory_batches
- inventory_balances
- inventory_movements
- purchase_orders
- purchase_order_items
- purchase_invoices
- purchase_invoice_items
- supplier_payments
- sales_invoices
- sales_invoice_items
- sales_returns
- sales_return_items
- customer_payments
- payment_allocations
- customer_credit_notes
- expenses
- financial_accounts
- cash_transactions
- sales_targets
- audit_logs
- notifications
- import_jobs

Add other tables required by the actual implementation.

Database requirements:
- Stable primary keys.
- Foreign keys.
- Unique invoice and receipt numbers.
- Appropriate indexes.
- Numeric/decimal monetary types.
- Consistent timestamps.
- Database constraints.
- Transaction-safe posting operations.
- Immutable or protected financial history.
- Separation of transaction headers and line items.
- Separate payment receipts and payment allocations.
- Secure audit history.

Configure one central warehouse and prevent ordinary users from creating additional warehouses.

Avoid unnecessary duplication of calculated totals.

---

## 24. AUDIT LOG AND OPERATIONAL SAFETY

Audit important actions:
- Invoice creation and posting.
- Reversals and cancellations.
- Customer and product changes.
- Price and discount changes.
- Purchase receipts.
- Stock adjustments.
- Returns.
- Payments and allocations.
- Expense approvals.
- Permission changes.
- User administration.

Record:
- Authenticated user.
- Action.
- Affected record.
- Timestamp.
- Relevant before/after values.

Never log passwords, tokens, or unnecessary secrets.

Protect audit logs against unauthorized changes.

Use confirmation dialogs for sensitive operations.

Implement helpful loading, empty, error, and success states.

---

## 25. SETTINGS

Provide administrator settings for:
- Company branding.
- Language.
- Currency.
- Timezone.
- Invoice numbering.
- Tax configuration.
- Payment terms.
- Credit limits.
- Approval thresholds.
- Low-stock levels.
- Expiration warning periods.
- Sales targets.
- Discount limits.
- Financial accounts.
- Product categories.
- Expense categories.
- User roles and assignments.

Use sensible defaults for an Egyptian distribution company.

Do not assume statutory tax rates or accounting treatments without explicit configuration.

Distinguish operational reports from statutory financial statements.

---

## 26. DESKTOP USER EXPERIENCE

Every major screen must contain working interactions.

Implement:
- Search.
- Filters.
- Sorting.
- Pagination.
- Detail views.
- Authorized create/edit forms.
- Validation.
- Confirmation dialogs.
- Loading states.
- Empty states.
- Error and success notifications.
- Responsive desktop tables.
- Keyboard-accessible controls.
- Clear date and currency formatting.

Use native desktop dialogs for opening and saving files.

Use secure IPC where desktop capabilities are required.

Do not provide placeholder buttons, fake login flows, or hardcoded analytics.

If an integration is not configured, explain the setup required.

---

## 27. TESTING AND ACCEPTANCE CRITERIA

Run tests and record actual results.

### Authentication and authorization
- Manager login works.
- Each representative has a separate authorized account.
- Representatives cannot access each other's records.
- Direct API requests cannot bypass RLS.
- Users cannot grant themselves manager access.
- Posted financial records cannot be silently altered or deleted.

### Sales and inventory
- Draft invoices do not deduct stock.
- Valid invoice posting deducts stock exactly once.
- Concurrent invoice posting cannot oversell stock.
- Cancelled invoices are excluded from completed sales.
- Returns follow the configured stock disposition.
- Expired and damaged goods cannot be sold.
- Purchase receipts update stock exactly once.

### Financial integrity
- Partial payments reduce outstanding balances correctly.
- Full payment closes an invoice balance.
- Payment allocations cannot exceed the receipt amount.
- Duplicate receipts are prevented.
- Discounts and returns do not distort net sales.
- Gross profit uses recorded cost of goods sold.
- Financial account balances reconcile to posted transactions.

### Analytics
- Executive KPIs reconcile with database records.
- Representative dashboards show only authorized information.
- Date filters recalculate metrics.
- Exports respect permissions and filters.
- Empty datasets do not crash the application.

### Desktop application
- Development application starts successfully.
- Production application builds successfully.
- Windows installer is generated.
- Packaged application launches without a development server.
- File dialogs and exports work.
- Authentication errors and backend outages are handled correctly.
- Arabic RTL and English LTR layouts work.
- Desktop resizing and smaller windows remain usable.
- No major visible navigation item is merely decorative.

### Testing discipline

Do not claim a test passed unless it was actually executed.

If a test requires Supabase credentials or an external configuration that is not available, mark it as BLOCKED and explain what is needed.

---

## 28. IMPLEMENTATION WORKFLOW FOR ANTIGRAVITY

Work directly in the project workspace.

### Phase 1 — Project foundation
- Inspect the current workspace.
- Create or configure the Electron + React + TypeScript project.
- Set up Tailwind CSS and the component library.
- Configure secure Electron main/preload/renderer architecture.
- Create branding, typography, themes, and localization.
- Add environment configuration and `.env.example`.
- Configure build scripts and Windows packaging.

### Phase 2 — Database and security
- Create Supabase schema migrations.
- Implement relationships, indexes, constraints, and triggers.
- Configure Supabase Auth.
- Implement RLS policies.
- Implement secure database functions.
- Create account provisioning documentation.
- Create sample data and reproducible seed scripts.
- Add database security tests.

### Phase 3 — Core distribution operations
- Customers.
- Products.
- Central warehouse.
- Suppliers and purchases.
- Sales invoices.
- Inventory movements.
- Returns and expiration management.

### Phase 4 — Financial workflows
- Customer collections.
- Receivables and aging.
- Supplier payments.
- Cash and bank accounts.
- Expenses and approvals.
- Credit policies.

### Phase 5 — Dashboards and administration
- Executive dashboard.
- Representative dashboards.
- Sales targets.
- Reports and exports.
- User administration.
- Audit logs.
- Notifications.
- Settings.

### Phase 6 — Import, testing, and packaging
- Excel/CSV import wizard.
- Export templates.
- Financial reconciliation tests.
- Inventory integrity tests.
- RLS security tests.
- UI and desktop workflow tests.
- Production build.
- Windows installer.
- Installation and setup documentation.

Do not stop after creating the frontend.

Do not stop after generating the database schema.

Do not stop after creating a development-only preview.

Continue implementing, running, debugging, and testing until the requested deliverables are produced or a genuine external blocker is reached.

If an external service requires credentials, build the relevant integration, provide clear setup instructions, and identify the exact tests that cannot be completed without those credentials.

---

## 29. REQUIRED PROJECT DELIVERABLES

Create the following in the project workspace:

1. Complete Electron desktop application source code.
2. React + TypeScript user interface.
3. Secure Electron main and preload architecture.
4. Supabase database migrations.
5. RLS policies and secured database functions.
6. Sample-data seed scripts.
7. Automated tests.
8. `.env.example` without real secrets.
9. Supabase setup and account provisioning guide.
10. README with installation, development, testing, and troubleshooting instructions.
11. Production build scripts.
12. Windows installer configuration.
13. A generated Windows installer, when the environment supports the build.
14. A final implementation report listing completed, incomplete, blocked, and tested functionality.

### Final report

Before declaring the application complete, report:
- Modules fully implemented.
- Modules partially implemented.
- External integrations requiring configuration.
- Database migrations created.
- Security policies implemented.
- Tests actually executed and their results.
- Known bugs and limitations.
- Exact build commands.
- Exact installer output path.
- Required Supabase configuration.
- Any remaining production-hardening tasks.

Never claim production readiness until the backend, authorization, transaction integrity, deployment configuration, and acceptance tests have been verified.

---

## 30. FINAL EXECUTION INSTRUCTION

Start by inspecting the available project workspace and identifying the current development environment.

Then implement the application in the phases described above.

Make reasonable technical decisions independently when requirements are clear.

Ask questions only when a missing decision genuinely blocks implementation.

Prioritize a functioning, secure desktop ERP application with consistent sales, purchasing, inventory, financial, and reporting workflows.

The final result must be **Al Amal Distribution Management System — a Windows desktop application built with Electron, React, TypeScript, and Supabase**, not a web-only application or a static dashboard.

Build it, run it, test it, fix the errors you encounter, and produce the Windows installer and setup documentation wherever the environment permits.

this is the logo of the company and make the color palette for the system like company logo colors and add the logo in the system