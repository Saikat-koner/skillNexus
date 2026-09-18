# 🚀 SKILLNEXUS MASTER PROMPT FOR GOOGLE AI STUDIO (`skillnexus-2.ai.studio`)

Copy and paste the entire prompt below directly into **AI Studio** to overhaul, finish, and connect SkillNexus to **Firebase** (Authentication, Cloud Firestore, Firebase Storage & Real-Time Listeners):

---

```markdown
# ⚡ SKILLNEXUS — PRODUCTION CREATOR MARKETPLACE & GIG BOOKING PLATFORM (FIREBASE BACKEND)

Transform and complete the SkillNexus web application (`https://skillnexus-2.ai.studio`) into a live, world-class, multi-featured Creator Marketplace and 1-on-1 Mentorship platform powered by **Firebase** (Firebase Authentication, Cloud Firestore NoSQL Database, Firebase Storage, and Real-Time Listeners). The application must feature high-converting modern aesthetics (Glassmorphism, dark/light mode, cyber-indigo accents, smooth micro-interactions), complete Firebase backend integration, real-time messaging, and multi-tier gig escrow workflows.

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
- Client approval button releases payment to creator balance in Firestore and prompts a 5-star review modal.

### C. 📅 1-on-1 Mentorship & Live Video Consultation Scheduler
- Dedicated booking tab on creator profiles:
  - Interactive calendar picker for available dates and time slots (15, 30, 45, or 60 minutes).
  - Topic description input with file attachment support.
  - Auto-generated Google Meet / Zoom meeting link upon booking confirmation.
  - Client & Creator calendar countdown ticker.

### D. 💬 Real-Time Direct Messaging & File Sharing (Cloud Firestore Real-Time Listeners)
- Persistent floating chat window and full-page Inbox:
  - Real-time conversation stream using Firestore `onSnapshot` on `conversations/{id}/messages`.
  - Send custom project proposals / quotes directly inside chat with an `[Accept Offer]` button.
  - Instant image and document attachment uploads to Firebase Storage (`chat-attachments/`).
  - Online presence indicators and message read receipts.

### E. 📊 Dual Role Portals (Creator Command Center vs. Client Dashboard)
- **Creator Command Center**:
  - Live revenue metrics card: *Total Earnings, Escrow In-Progress, Available for Withdrawal*.
  - 1-Click Payout Request modal (Stripe Connect, PayPal, Bank Wire, USDC).
  - Active Orders Kanban pipeline with delivery deadlines.
  - Gig manager (Create, Edit, Pause, Publish new gigs with 3-tier pricing).
- **Client / Buyer Portal**:
  - Active gig orders tracking with live deadline countdowns.
  - Saved wishlist / bookmarked creators in Firestore.
  - Scheduled 1-on-1 consultation calendar.

### F. 🏆 Creator Tier & Trust Gamification
- Automatic tier progression based on verified order volume and rating:
  - 🌟 **Rising Star** $\rightarrow$ 🥉 **Level 1 Pro** ($5+$ orders) $\rightarrow$ 🥈 **Level 2 Elite** ($20+$ orders) $\rightarrow$ 💎 **Top Rated Legend** ($50+$ orders, 4.9+ rating).
- Glowing tier badges rendered on creator cards, gig listings, and search results.

---

## 🗄️ 3. FIREBASE BACKEND INTEGRATION ARCHITECTURE

Ensure the client connects seamlessly to Firebase using:
1. **Firebase Authentication**: Email/Password login, Google Sign-In, and automatic `profiles/{uid}` document initialization.
2. **Cloud Firestore Collections**:
   - `profiles`: User information, creator tiers, balances (`escrowBalance`, `withdrawableBalance`), ratings.
   - `gig_categories`: Category taxonomies and metadata.
   - `gigs`: Active gig listings with 3-tier pricing models (`starter`, `standard`, `pro`), turnaround days, deliverables, and search tags.
   - `orders`: Escrow orders with lifecycle status (`in_progress`, `delivered`, `completed`, `cancelled`), delivery due dates, requirement notes.
   - `consultations`: 1-on-1 mentorship appointments with Google Meet links.
   - `conversations` & subcollection `messages`: Real-time chat messages with attachment URLs and proposal quotes.
   - `reviews`: Verified buyer ratings and reviews.
   - `payout_requests`: Creator withdrawal requests.
3. **Firebase Storage Buckets & Paths**:
   - `avatars/{userId}/`: Creator and buyer profile photos.
   - `gig-covers/{userId}/`: Gig thumbnail and portfolio imagery.
   - `order-deliverables/{orderId}/`: High-res files and deliverables submitted by creators.
   - `chat-attachments/{conversationId}/`: Direct message documents and media attachments.
4. **Environment Variables**:
   - `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

---

## 🧪 4. CODE QUALITY & COMPATIBILITY
- 100% Web-Safe (use in-memory `Uint8List` / `Blob` buffers for file uploads).
- Zero compilation errors and zero linter warnings.
- Responsive layout supporting Desktop (1440px+), Tablet (768px), and Mobile (375px+).
```
