<div align="center">

# ⚡ SkillNexus (क्रिएटर मार्केटप्लेस)
### *The Next-Generation Creator Marketplace, Multi-Tier Gig Booking & 1-on-1 Mentorship Platform*

[![Firebase](https://img.shields.io/badge/Firebase-Firestore%20%26%20Storage-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
[![Web Platform](https://img.shields.io/badge/Platform-Web%20Ready-02569B?style=for-the-badge&logo=googlechrome&logoColor=white)](https://skillnexus-2.ai.studio)
[![Cloud Firestore](https://img.shields.io/badge/Firestore-NoSQL%20Realtime-FFA611?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/docs/firestore)
[![Security](https://img.shields.io/badge/Security-Firestore%20Rules-orange?style=for-the-badge&logo=securityscorecard&logoColor=white)](firestore.rules)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

### 🌐 [**Live Web Platform Demo**](https://skillnexus-2.ai.studio)

</div>

---

## 📖 Overview

**SkillNexus** is a full-stack, real-time creator marketplace and gig booking ecosystem designed for the modern creator economy. Powered by **Firebase** (Cloud Firestore, Firebase Authentication, Firebase Storage) and modern frontend architectures (React 19, TypeScript, Vite, Flutter Web), it empowers digital creators, AI developers, UI/UX designers, video editors, and technical mentors to showcase their skills, sell multi-tier service packages, manage active client milestones, and host live 1-on-1 consultation sessions.

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
- Streamed instant chat powered by **Cloud Firestore Real-Time Listeners (`onSnapshot`)**.
- Support for inline file attachments, project quotes, and custom offers.

### 5. 🏆 Creator Gamification & Trust Score
- Progressive Creator Badges:
  - 🌟 **Rising Star**
  - 🥉 **Level 1 Pro** (5+ orders, 4.5+ rating)
  - 🥈 **Level 2 Elite** (20+ orders, 4.8+ rating)
  - 💎 **Top Rated Legend** (50+ orders, 4.9+ rating)

---

## 🗄️ Database Architecture (Cloud Firestore & Storage)

The backend runs on Google Cloud Firestore with comprehensive **Security Rules** (`firestore.rules`) and **Storage Rules** (`storage.rules`):

| Collection | Purpose | Security Policy |
| :--- | :--- | :--- |
| `profiles/{userId}` | Creator & client identities, bio, skills, rating, earnings, and badges | Public read; Owner write |
| `gig_categories/{categoryId}` | 8 primary domains (AI, Web/Mobile, UI/UX, Video, Web3, Audio, Growth, Writing) | Public read; Admin write |
| `gigs/{gigId}` | Creator service listings with 3-tier pricing, turnaround days, and media | Public read (active); Creator edit |
| `orders/{orderId}` | Transaction ledger, requirements, delivery notes, and escrow status | Buyer & Seller read/update |
| `consultations/{consultationId}` | 1-on-1 scheduled booking slots with meeting URLs | Client & Creator private access |
| `conversations/{id}/messages` | Real-time chat streams with attachments | Chat participants only |
| `reviews/{reviewId}` | Verified purchase feedback with sub-ratings (Quality, Speed, Communication) | Public read; Buyer submit |
| `payout_requests/{requestId}` | Creator balance withdrawals (Stripe Connect, PayPal, Bank Wire, USDC) | Creator view/submit |

---

## 🚀 Firebase Setup Instructions

1. **Create a Firebase Project**: Go to [console.firebase.google.com](https://console.firebase.google.com) and create a new project.
2. **Enable Firestore & Storage**:
   - Create a Cloud Firestore database in production mode.
   - Deploy security rules: `firebase deploy --only firestore:rules,storage`.
3. **Configure Environment Variables**:
   Create a `.env` file with your web app credentials:
   ```env
   VITE_FIREBASE_API_KEY="AIzaSyYourActualApiKeyHere"
   VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
   VITE_FIREBASE_PROJECT_ID="your-app-id"
   VITE_FIREBASE_STORAGE_BUCKET="your-app-id.appspot.com"
   VITE_FIREBASE_MESSAGING_SENDER_ID="123456789012"
   VITE_FIREBASE_APP_ID="1:123456789012:web:abcdef123456"
   ```

---

## 📄 License
This project is open source and licensed under the [MIT License](LICENSE).
