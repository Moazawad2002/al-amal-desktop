# Al Amal Distribution Management System (Desktop ERP)
### Enterprise Windows Desktop Application (Electron • React 18 • TypeScript • Supabase RLS)

[![Platform: Windows](https://img.shields.io/badge/Platform-Windows%2010%2F11%20(64--bit)-0078D6?logo=windows&logoColor=white)](https://microsoft.com)
[![Framework: Electron](https://img.shields.io/badge/Desktop-Electron-47848F?logo=electron&logoColor=white)](https://electronjs.org/)
[![UI: React + TypeScript](https://img.shields.io/badge/Frontend-React%2018%20%7C%20TypeScript-3178C6?logo=typescript&logoColor=white)](https://reactjs.org/)
[![Database: Supabase RLS](https://img.shields.io/badge/Database-Supabase%20PostgreSQL%20RLS-3ECF8E?logo=supabase&logoColor=white)](https://supabase.com/)

<p align="center">
  <img src="docs/preview.svg" alt="Al Amal Desktop ERP Windows Application" width="100%">
</p>

---

## 🌾 Overview & Purpose

**Al Amal Distribution Management System** is a standalone, offline-ready Windows desktop ERP engineered for food distributors in Cairo and the regional Egyptian market. 

Built with the company's signature brand identity (Wheat Amber Gold `#D49B24`, Charcoal Bronze `#1E1B15`, and Warm Cream `#FAF7EE`), it provides dedicated role-based operational modules:
1. **Executive CEO Suite:** Complete company oversight, live central inventory, gross profit margins, cash treasury vs. operational expenses, and receivables aging.
2. **Field Sales Representatives (3 Territories):** Isolated route dashboards enforcing territory boundaries via **PostgreSQL Row-Level Security (RLS)** for sales invoicing, order creation, and collections.

---

## 🛡️ Role-Based Architecture & Route Scoping

| Account / Role | Email | Geographic Route / Scope | Authorized Capabilities |
|:---|:---|:---|:---|
| **CEO / General Manager** | `manager@alamal-eg.com` | Consolidated (All Routes) | Full executive suite: inventory, purchases, expenses, reps performance, audit logs. |
| **Sales Rep 1 (North Cairo)** | `rep1@alamal-eg.com` | Shubra, Zaytoun, Heliopolis | Territory-isolated invoices, customers, and payment receipts. |
| **Sales Rep 2 (Giza & Haram)** | `rep2@alamal-eg.com` | Sheikh Zayed, 6th October, Mohandessin | Territory-isolated invoices, customers, and payment receipts. |
| **Sales Rep 3 (East Cairo)** | `rep3@alamal-eg.com` | New Cairo, Maadi, Nasr City | Territory-isolated invoices, customers, and payment receipts. |

---

## ⚙️ Core System Modules

- **Executive CEO Dashboard:** Multi-dimensional KPI cards (Net Sales, Collected Cash, OPEX, Receivables), monthly target attainment, and trend charts.
- **Central Warehouse & Batch Expiration:** Real-time stock counts, shelf-life monitoring, and automatic dispatch alerts for batches with $< 30$ days remaining.
- **Sales Invoicing & Dispatch:** Atomically decrements warehouse stock, validates customer credit limits, and checks rep discount limits.
- **Collections & Receivables Aging:** Tracks cash receipts, reconciles customer ledger balances, and categorizes overdue receivables.
- **Cash Treasury & OPEX:** Real-time logging of operating expenses and daily cash balance reconciliation.
- **Excel / CSV Migration:** Native file dialogs for importing legacy catalog and financial records and exporting structured audit statements.

---

## 🧪 Automated Testing Suite

The repository includes automated test suites verifying business integrity:
```bash
# Execute automated test suite
npm test
```
Tests cover:
- `auth.test.ts`: RLS isolation ensuring representatives cannot access out-of-territory records.
- `inventory.test.ts`: Prevents negative stock dispatches and verifies atomic reservation.
- `financial.test.ts`: Mathematical validation of subtotal, VAT (14%), discounts, and cash balances.

---

## 📦 Building Production Windows Installer (.exe)

```bash
# 1. Compile web assets & Electron bridge
npm run build
npm run build:electron

# 2. Package standalone Windows executable & NSIS installer
npm run build:win
```
The compiled installer is output to the `dist-installer/` directory.

---

## 🏷️ Recommended Repository Topics
`electron`, `desktop-erp`, `react`, `typescript`, `supabase`, `row-level-security`, `accounting`, `distribution-management`, `recharts`, `windows-app`, `fmcg`

---

## 👨‍💻 Author
**Moaz Awad** — Business Systems Developer  
- Portfolio: [moazawad2002.github.io](https://moazawad2002.github.io/)  
- Email: [moaz14714@gmail.com](mailto:moaz14714@gmail.com)  
- GitHub: [@Moazawad2002](https://github.com/Moazawad2002)
