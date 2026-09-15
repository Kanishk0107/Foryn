# 🏛️ Foryn — Enterprise Cloud Interior Design & Architecture Workstation

> **Unified Next-Gen Interior Architecture Platform**: Integrated 2D/3D CAD Studio, Automated BOQ Costing Engine, Pre-Sales CRM, 31-Stage Site Execution Engine, Vendor Work Orders, and 18% GST Finance Ledger.

---

## ✨ Key Features & Disciplines

1. **Executive Command Center**:
   - Real-time MNC executive overview, active site KPIs, pipeline metrics, and project velocity.
2. **Master BOQ & Costing Studio**:
   - Automated Bill of Quantities engine with area breakdown, material specifications, and 18% GST liability calculations.
3. **Lead CRM & Pre-Sales Pipeline**:
   - Pre-sales customer acquisition funnel, PID auto-generation (`PID-1001`), and 1-click site conversion.
4. **31-Stage Site Execution Engine**:
   - Comprehensive stage-by-stage site progress tracking from civil masonry to handover.
5. **Procurement & Vendor Work Orders**:
   - Vendor milestone contracts, PM approval workflows, and automated email notifications.
6. **Finance & 18% GST Ledger**:
   - Bank RTGS payout disbursements, GST input tax credits, and payment tracking.
7. **Cloud Authentication & Profiles**:
   - Google OAuth (`signInWithOAuth`), 6-Digit Email OTP verification, Studio Role assignment, and automated Main Admin (Owner) vs. Employee hierarchy.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Vite 6, Tailwind CSS v4, Motion (Framer Motion)
- **Data & Visualizations**: D3.js, Lucide Icons, Hugeicons
- **Backend & Database**: Supabase (PostgreSQL), Row Level Security (RLS), Database Triggers
- **Hosting & Deployment**: Vercel (Optimized SPA routing & caching)

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Kanishk0107/Foryn.git
cd Foryn
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL="https://ulwvsmjzaaqdfmdoluac.supabase.co"
VITE_SUPABASE_ANON_KEY="your-anon-key-here"
```

### 3. Launch Development Server
```bash
npm run dev
```
Open `http://localhost:3000` or `http://localhost:5173` in your browser.

---

## 🌐 Deploy to Vercel

1. Push this repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set the Environment Variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Click **Deploy**.

---

## 📜 Database Schema

The complete PostgreSQL database schema and automatic admin triggers are available in `supabase_schema.sql`. Run the SQL script in your Supabase SQL Editor to initialize all tables and security policies.

---

## 📄 License
© 2026 Foryn Living Pvt. Ltd. / Pentagram Living. All rights reserved.