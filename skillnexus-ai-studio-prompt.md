# 🚀 SKILLNEXUS MASTER PROMPT FOR GOOGLE AI STUDIO (`skillnexus-2.ai.studio`)

Copy and paste the entire prompt below directly into **AI Studio** to overhaul, finish, and connect SkillNexus to Supabase:

---

```markdown
# ⚡ SKILLNEXUS — PRODUCTION CREATOR MARKETPLACE & GIG BOOKING PLATFORM

Transform and complete the SkillNexus web application (`https://skillnexus-2.ai.studio`) into a live, world-class, multi-featured Creator Marketplace and 1-on-1 Mentorship platform. The application must feature high-converting modern aesthetics (Glassmorphism, dark/light mode, cyber-indigo accents, smooth micro-interactions), complete Supabase PostgreSQL backend integration, real-time messaging, and multi-tier gig escrow workflows.

---

## 🎨 1. DESIGN SYSTEM & VISUAL UPGRADES ("MORE ATTRACTIVE END")

1. **Color Palette & Glassmorphism Theme**:
   - **Primary Accent**: Electric Indigo (`#6366F1`) & Neon Cyan (`#06B6D4`) gradient.
   - **Secondary Accent**: Radiant Violet (`#A855F7`) & Emerald Green (`#10B981`) for pricing and verified badges.
   - **Dark Ground**: Deep Slate (`#0B0F19`) with frosted glass containers (`backdrop-filter: blur(16px)` / `surfaceContainerHighest` with 40% opacity).
   - **Light Ground**: Clean Arctic White (`#F8FAFC`) with soft lavender shadows.
   - Support seamless Material 3 dynamic Dark & Light mode toggle.

2. **Hero Section & Interactive Marketplace Feed**:
   - High-impact animated Hero banner: *"Hire Elite Tech & Creative Talent, On-Demand."*
   - Interactive search bar with instant autocomplete, category chips (AI & ML, Web/Mobile, UI/UX, Video, Web3, Audio, Growth, Writing), budget range sliders, and delivery time filters (24h, 3 days, 7 days).
   - Dynamic gig card with glowing creator avatar, Verified Pro badge, tier pricing pill (`From $49`), star rating counter (`★ 4.98 (124)`), and animated hover zoom on cover images.

---

## ⚡ 2. CORE FEATURES TO FINISH & IMPLEMENT

### A. 📦 3-Tier Interactive Gig Detail Page (`Starter | Standard | Pro`)
- Tabbed pricing card allowing buyers to compare:
  - **Starter**: Essential deliverables, 3-day turnaround, 1 revision.
  - **Standard**: Full production package, 5-day turnaround, 3 revisions.
  - **Pro / Enterprise**: Premium source code/assets, 7-day turnaround, unlimited revisions, priority 1-on-1 support.
- Feature comparison checklist with checkmark indicators.
- Interactive FAQ accordion, creator bio card, video/image media gallery carousel, and verified buyer reviews with rating breakdowns (Quality, Speed, Communication).

### B. 🛡️ Milestone-Based Escrow Order Pipeline
- Instant **"Order Gig"** checkout modal:
  - Select package tier & add-on extras (e.g., *Express 24h Delivery (+$30)*, *Source Files (+$20)*).
  - Client Requirements submission step (text description + file attachments).
- **Interactive Order Status Machine**:
  - `pending_requirements` $\rightarrow$ `in_progress` (Live SLA countdown timer) $\rightarrow$ `delivered` (Download delivery files & preview) $\rightarrow$ `revision_requested` $\rightarrow$ `completed`.
- Client approval button releases payment to creator balance and prompts a 5-star review modal.

### C. 📅 1-on-1 Mentorship & Live Video Consultation Scheduler
- Dedicated booking tab on creator profiles:
  - Interactive calendar picker for available dates and time slots (15, 30, 45, or 60 minutes).
  - Topic description input with file attachment support.
  - Auto-generated Google Meet / Zoom meeting link upon booking confirmation.
  - Client & Creator calendar countdown ticker.

### D. 💬 Real-Time Direct Messaging & File Sharing (Supabase Realtime)
- Persistent floating chat window and full-page Inbox:
  - Real-time conversation stream using `supabase.from('direct_messages').stream()`.
  - Send custom project proposals / quotes directly inside chat with an `[Accept Offer]` button.
  - Instant image and document attachment uploads.
  - Online presence indicators and message read receipts.

### E. 📊 Dual Role Portals (Creator Command Center vs. Client Dashboard)
- **Creator Command Center**:
  - Live revenue metrics card: *Total Earnings, Escrow In-Progress, Available for Withdrawal*.
  - 1-Click Payout Request modal (Stripe Connect, PayPal, Bank Wire, USDC).
  - Active Orders Kanban pipeline with delivery deadlines.
  - Gig manager (Create, Edit, Pause, Publish new gigs with 3-tier pricing).
- **Client / Buyer Portal**:
  - Active gig orders tracking with live deadline countdowns.
  - Saved wishlist / bookmarked creators.
  - Scheduled 1-on-1 consultation calendar.

### F. 🏆 Creator Tier & Trust Gamification
- Automatic tier progression based on verified order volume and rating:
  - 🌟 **Rising Star** $\rightarrow$ 🥉 **Level 1 Pro** ($5+$ orders) $\rightarrow$ 🥈 **Level 2 Elite** ($20+$ orders) $\rightarrow$ 💎 **Top Rated Legend** ($50+$ orders, 4.9+ rating).
- Glowing tier badges rendered on creator cards, gig listings, and search results.

---

## 🗄️ 3. SUPABASE BACKEND INTEGRATION ARCHITECTURE

Ensure the client connects seamlessly to Supabase using:
1. **Supabase Auth**: Email/Password login, Google OAuth, and automatic `profiles` row generation via trigger.
2. **Postgres Database Tables**:
   - `profiles`, `gig_categories`, `gigs`, `orders`, `consultations`, `conversations`, `direct_messages`, `reviews`, `payout_requests`, `gig_bookmarks`.
3. **Supabase Storage Buckets**:
   - `gig-covers` (public gig thumbnails)
   - `portfolio-media` (creator showcases)
   - `order-deliverables` (private deliverables for buyers/sellers)
   - `avatars` (user profile pictures)
4. **Real-time Subscriptions**:
   - Live chat streams (`direct_messages`), order status updates (`orders`), and unread notification badges.

---

## 🧪 4. CODE QUALITY & COMPATIBILITY
- 100% Web-Safe (use in-memory `Uint8List` byte buffers for file uploads, zero `dart:io` imports).
- Zero compilation errors and zero linter warnings.
- Responsive layout supporting Desktop (1440px+), Tablet (768px), and Mobile (375px+).
```
