# دليل إعداد وربط قاعدة بيانات Supabase
## شركة الأمل لتوزيع المنتجات الغذائية (Al Amal Distribution System)

يوفر هذا الدليل الخطوات التفصيلية لربط تطبيق سطح المكتب بقاعدة بيانات **Supabase (PostgreSQL)** المركزية مع تفعيل سياسات الأمان على مستوى السطر (RLS).

---

### 1. إنشاء مشروع Supabase جديد
1. سجّل الدخول إلى [Supabase Dashboard](https://supabase.com).
2. انقر على **New Project** وحدد اسم المشروع: `al-amal-distribution`.
3. حدد كلمة سر قوية لقاعدة البيانات واختر أقرب منطقة جغرافية (مثل `Frankfurt` أو `Bahrain`).
4. بعد اكتمال الإنشاء، توجه إلى **Project Settings -> API**.
5. انسخ القيمتين التاليتين:
   - **Project URL** (مثال: `https://xyzabcdef.supabase.co`)
   - **anon / public key** (المفتاح العام المخصص للواجهة الأمامية)

> [!CAUTION]
> **تحذير أمني هام:** لا تقم أبداً بمشاركة أو وضع مفتاح `service_role` السري داخل ملفات التطبيق أو واجهة المستخدم أو الحزم الموزعة للمناديب.

---

### 2. تنفيذ ملفات التهجرة وتثبيت الجداول (SQL Migrations)
توجه إلى **SQL Editor** داخل لوحة تحكم Supabase وقم بتنفيذ الملفات التالية بالترتيب:

1. **الملف الأول:** `supabase/migrations/001_initial_schema.sql`
   - يُنشئ الجداول الأساسية: الحسابات، المستودع الرئيسي الوحيد، الأصناف، العملاء، الموردين، الفواتير، التحصيلات، والمصروفات.
2. **الملف الثاني:** `supabase/migrations/002_rls_policies.sql`
   - يفعّل سياسات الأمان RLS الصارمة: يعزل بيانات المندوب 1 عن المندوب 2 والمندوب 3، ويمنح المدير العام الصلاحيات الإدارية الكاملة.
3. **الملف الثالث:** `supabase/migrations/003_secure_functions_and_triggers.sql`
   - يثبت الدوال التبادلية الآمنة لخصم المخزون الذري وترحيل الفواتير وسندات القبض.
4. **الملف الرابع:** `supabase/seeds/004_demonstration_seed_data.sql`
   - يملأ النظام ببيانات واقعية أولية لـ 20 سوبرماركت و 35 صنفاً غذائياً وخزائن الشركة.

---

### 3. إنشاء وتجهيز الحسابات الأربعة في Supabase Auth

توجه إلى **Authentication -> Users** وأنشئ الحسابات الأربعة التالية:

| الدور الوظيفي | البريد الإلكتروني | كلمة المرور الأولية | كود المندوب |
| :--- | :--- | :--- | :--- |
| **المدير العام / CEO** | `manager@alamal-eg.com` | `AlAmal#2026!` | - |
| **مندوب مبيعات 1 (القاهرة الشمالية)** | `rep1@alamal-eg.com` | `AlAmal#2026!` | `b0000000-0000-0000-0000-000000000001` (REP-01) |
| **مندوب مبيعات 2 (الجيزة والهرم)** | `rep2@alamal-eg.com` | `AlAmal#2026!` | `b0000000-0000-0000-0000-000000000002` (REP-02) |
| **مندوب مبيعات 3 (شرق القاهرة والتجمع)** | `rep3@alamal-eg.com` | `AlAmal#2026!` | `b0000000-0000-0000-0000-000000000003` (REP-03) |

بعد إنشاء المستخدمين في Auth، اربط معرّفاتهم في جدول `public.profiles` بالأدوار:
```sql
-- للمدير العام
INSERT INTO public.profiles (id, email, full_name, role)
VALUES ('<USER_UUID_FROM_AUTH>', 'manager@alamal-eg.com', 'المهندس مصطفى رضوان (المدير العام)', 'manager');

-- لمندوب 1
INSERT INTO public.profiles (id, email, full_name, role, representative_id)
VALUES ('<USER_UUID_FROM_AUTH>', 'rep1@alamal-eg.com', 'أحمد حسن إبراهيم', 'sales_rep', 'b0000000-0000-0000-0000-000000000001');

-- لمندوب 2
INSERT INTO public.profiles (id, email, full_name, role, representative_id)
VALUES ('<USER_UUID_FROM_AUTH>', 'rep2@alamal-eg.com', 'محمود علي عبد العزيز', 'sales_rep', 'b0000000-0000-0000-0000-000000000002');

-- لمندوب 3
INSERT INTO public.profiles (id, email, full_name, role, representative_id)
VALUES ('<USER_UUID_FROM_AUTH>', 'rep3@alamal-eg.com', 'عمر خالد الصاوي', 'sales_rep', 'b0000000-0000-0000-0000-000000000003');
```

---

### 4. ربط التطبيق المكتبي
1. افتح ملف `.env` في مجلد التطبيق المكتبي:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
VITE_ENABLE_OFFLINE_DEMO=false
```
2. أو انقر على زر **تهيئة سيرفر Supabase** في الشريط العلوي لتطبيق الويندوز وأدخل المفاتيح مباشرة.
