<div align="center">

# ⚡ SkillNexus (क्रिएटर मार्केटप्लेस)
### *The Next-Generation Creator Marketplace, Multi-Tier Gig Booking & 1-on-1 Mentorship Platform*

[![Supabase](https://img.shields.io/badge/Supabase-Realtime%20Postgres-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![Web Platform](https://img.shields.io/badge/Platform-Web%20Ready-02569B?style=for-the-badge&logo=googlechrome&logoColor=white)](https://skillnexus-2.ai.studio)
[![Database](https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://postgresql.org)
[![Security](https://img.shields.io/badge/Security-Row%20Level%20RLS-orange?style=for-the-badge&logo=securityscorecard&logoColor=white)](skillnexus-migration.sql)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

### 🌐 [**Live Web Platform Demo**](https://skillnexus-2.ai.studio)

</div>

---

## 📖 Overview

**SkillNexus** is a full-stack, real-time creator marketplace and gig booking ecosystem designed for the modern creator economy. It allows digital creators, AI developers, UI/UX designers, video editors, and technical mentors to showcase their skills, sell multi-tier service packages, manage active client milestones, and host live 1-on-1 consultation sessions.

---

## ✨ Core Features & Platform Capabilities

```
+---------------------------------------------------------------------------------------------------+
|                                  SKILLNEXUS ECOSYSTEM ARCHITECTURE                                |
+---------------------------------------------------------------------------------------------------+
|  [EXPLORE & SEARCH]        -->  AI Semantic Matcher, Category Filters, Price/Delivery Sorting     |
|  [MULTI-TIER GIGS]         -->  Starter, Standard & Pro Packages with feature comparison matrices |
|  [ESCROW ORDER PIPELINE]   -->  Requirements -> In Progress -> Delivery -> Review -> Auto-Payout  |
|  [1-ON-1 CONSULTATIONS]    -->  Time-slot calendar, video meeting links, client note attachments |
|  [REAL-TIME CHAT]          -->  Direct messaging, deliverable attachments, instant read receipts |
|  [CREATOR REPUTATION]      -->  Level 1-3 & Top Rated badges, auto-calculated trust metrics       |
|  [CREATOR COMMAND CENTER]  -->  Live revenue analytics, order pipeline, withdrawable escrow balance|
+---------------------------------------------------------------------------------------------------+
```

### 1. 🎨 Dynamic 3-Tier Gig System
- **Starter Tier**: Entry-level quick turnaround deliverables.
- **Standard Tier**: Full project build with comprehensive features.
- **Pro / Enterprise Tier**: Premium production with source files, priority delivery, and unlimited revisions.

### 2. 🛡️ Milestone & Escrow Order Pipeline
- State Machine Transitions:
  `pending_requirements` $\rightarrow$ `in_progress` $\rightarrow$ `delivered` $\rightarrow$ `revision_requested` $\rightarrow$ `completed`.
- Client approval automatically releases payout to the creator's wallet and recalculates level tiers.

### 3. 📅 1-on-1 Mentorship & Video Consultations
- Real-time time-slot scheduling (15, 30, 45, 60 mins).
- Automated Google Meet / Zoom meeting link delivery.

### 4. 💬 Real-Time Direct Messaging
- Streamed instant chat powered by **Supabase Realtime**.
- Support for inline file attachments, project quotes, and custom offers.

### 5. 🏆 Creator Gamification & Trust Score
- Progressive Creator Badges:
  - 🌟 **Rising Star**
  - 🥉 **Level 1 Pro** (5+ orders, 4.5+ rating)
  - 🥈 **Level 2 Elite** (20+ orders, 4.8+ rating)
  - 💎 **Top Rated Legend** (50+ orders, 4.9+ rating)

---

## 🗄️ Database Architecture (Supabase PostgreSQL)

The backend runs on PostgreSQL with **Row Level Security (RLS)** and automated triggers:

| Table | Purpose | Security Policy |
| :--- | :--- | :--- |
| `profiles` | Creator & client identities, bio, skills, rating, earnings, and badges | Public read; Auth user update |
| `gig_categories` | 8 primary domains (AI, Web/Mobile, UI/UX, Video, Web3, Audio, Growth, Writing) | Public read |
| `gigs` | Creator service listings with 3-tier pricing JSON and cover media | Public read (active); Creator edit |
| `orders` | Transaction ledger, requirements, delivery notes, and escrow status | Buyer & Seller read/update |
| `consultations` | 1-on-1 scheduled booking slots with meeting URLs | Client & Creator private access |
| `conversations` & `direct_messages` | Real-time chat streams with attachments | Chat participants only |
| `reviews` | Verified purchase feedback with sub-ratings (Quality, Speed, Communication) | Public read; Buyer submit |
| `payout_requests` | Creator balance withdrawals (Stripe Connect, PayPal, Bank Wire, USDC) | Creator view/submit |

---

## 🚀 Supabase Setup Instructions

1. **Create a Supabase Project**: Go to [supabase.com](https://supabase.com) and create a new project.
2. **Run Schema Migration**:
   - Open **SQL Editor** in your Supabase dashboard.
   - Copy the contents of [`skillnexus-migration.sql`](skillnexus-migration.sql) and click **Run**.
3. **Configure Storage Buckets**:
   - The migration automatically creates `gig-covers`, `portfolio-media`, `avatars`, and `order-deliverables`.
4. **Copy API Keys**:
   - Navigate to **Project Settings $\rightarrow$ API**.
   - Copy `Project URL` and `anon public key`.

---

## 📄 License
This project is open source and licensed under the [MIT License](LICENSE).
