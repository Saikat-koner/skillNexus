const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const outputPath = path.join('D:', 'e drive everything', 'ClaudeWorkspace', 'projects', 'skillnexus', 'SkillNexus_Architecture_Manual.pdf');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 40, bottom: 40, left: 40, right: 40 },
  info: {
    Title: 'SkillNexus: Comprehensive Architectural & Technical Documentation',
    Author: 'SkillNexus Core Team',
    Subject: 'Creator Marketplace & Barter Network Technical Blueprint',
    Keywords: 'SkillNexus, React, Vite, Groq AI, Creator Economy, Barter Network, Escrow, Web Audio API, TypeScript'
  }
});

const writeStream = fs.createWriteStream(outputPath);
doc.pipe(writeStream);

// Helpers
function addHeader(title, subtitle) {
  doc.rect(0, 0, doc.page.width, 100).fill('#0f172a');
  doc.fillColor('#ffffff').fontSize(22).font('Helvetica-Bold').text(title, 40, 30);
  doc.fillColor('#94a3b8').fontSize(11).font('Helvetica').text(subtitle, 40, 62);
  doc.moveDown(4);
}

function addSectionTitle(title) {
  doc.moveDown(0.8);
  doc.fillColor('#4338ca').fontSize(14).font('Helvetica-Bold').text(title);
  doc.rect(40, doc.y + 2, doc.page.width - 80, 1.5).fill('#6366f1');
  doc.moveDown(0.6);
}

function addSubsectionTitle(title) {
  doc.moveDown(0.5);
  doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(title);
  doc.moveDown(0.2);
}

function addParagraph(text) {
  doc.fillColor('#334155').fontSize(9.5).font('Helvetica').text(text, { lineGap: 3, align: 'justify' });
  doc.moveDown(0.4);
}

function addBullet(bulletText) {
  doc.fillColor('#1e293b').fontSize(9).font('Helvetica').text(`•  ${bulletText}`, { indent: 10, lineGap: 2 });
  doc.moveDown(0.2);
}

// PAGE 1: Title & Overview
addHeader('SkillNexus Architecture & Manual', 'Complete Technical Blueprint, Source Code Breakdown & Ecosystem Specs');

addSectionTitle('1. Executive Overview & Mission');
addParagraph('SkillNexus (https://skillnexus-2.ai.studio) is a dual-engine decentralized economic engine built with React 19, Vite 8, TypeScript, and Tailwind CSS v4. The platform addresses fundamental bottlenecks in the modern digital workforce: predatory freelance platform commissions (10-20%), monopolized creator discovery algorithms, arbitrary ghosting upon project rejection, and the inability to exchange high-value skills without fiat cash.');
addParagraph('SkillNexus pioneers two symbiotic economic modes:');
addBullet('Mode 1: Creator Marketplace — Empowering student and Gen-Z creative professionals (video editors, brand identity designers, beat producers, full-stack coders, copywriters) to post modular service packages with 0% platform commission and $0 upfront escrow guarantees.');
addBullet('Mode 2: P2P Barter Network — A multi-party circular skill-swapping engine utilizing autonomous time-banking, 2D/3D force-directed knowledge graphs, and verifiable Soulbound Knowledge Passports.');

addSectionTitle('2. Dual-Engine Architecture & Core Tenets');
addSubsectionTitle('2.1 Zero-Barrier Monetization & Fair Economics');
addParagraph('Traditional freelance platforms charge high fees on both creator earnings and client deposits. SkillNexus eliminates intermediary fees, providing a transparent breakdown of project milestones, time allocations, and real-time multi-currency conversions across USD ($), EUR (€), GBP (£), INR (₹), CAD ($), and USDC.');

addSubsectionTitle('2.2 20 PTS Decision Points Suite');
addParagraph('SkillNexus implements three mission-critical algorithmic decision points:');
addBullet('DP1 (Polite Rejection & Client Re-routing): Standardized polite decline taxonomy that prevents ghosting, instantly releases authorization holds ($0 charged), and routes the client to high-affinity alternative creators in 1 click.');
addBullet('DP2 (Concurrency & Double-Booking Policy): Dynamic state machine providing two operating modes: Flexible Queue Mode (up to 3 concurrent pending inquiries with warning badges) and Strict Lockout Mode (pausing new bookings during pending reviews).');
addBullet('DP3 (Anti-Monopoly Fair Rotation Ranker): Mathematical discovery scoring engine: Discovery Score = (Recency * 0.35) + (Rotation Factor * 0.35) + (Completion Rate * 0.30), preventing top-creator monopolization.');

// PAGE 2: 5 Core Marketplace Features & Source Code
doc.addPage();
addSectionTitle('3. Core Marketplace Features & Component Breakdown');

addSubsectionTitle('Feature 1: Post a Gig Modal (src/components/marketplace/PostGigModal.tsx)');
addParagraph('Allows creators to list structured creative services with customizable pricing models (Fixed-Rate vs. Hourly), turnaround timelines (1 to 7 days), categorized tags, and deliverable checklists. Features simulated zero-friction onboarding with bio, avatar selection, and dynamic rate preloading.');

addSubsectionTitle('Feature 2: Browse & Search Marketplace (src/components/marketplace/BrowseGigsSection.tsx)');
addParagraph('Real-time keyword search across titles, creator names, tags, and categories. Includes filter chips for all 6 creative categories: Video & Animation, Design & Branding, Social Media & Growth, Music & Audio, Web & Coding, and Writing & Content. Integrates live audio pitch players, DP2 inquiry badges, and DP3 fair rotation boost indicators.');

addSubsectionTitle('Feature 3: Frictionless Gig Booking Modal (src/components/marketplace/BookGigModal.tsx)');
addParagraph('Client project intake with milestone scoping, deadline picker, deliverable requirements, and real-time escrow calculations. Features the $0 Upfront Charge Guarantee, where funds remain securely authorized without transfer until the creator explicitly accepts.');

addSubsectionTitle('Feature 4: Creator Operations Dashboard (src/components/marketplace/CreatorDashboardView.tsx)');
addParagraph('Triage center for incoming booking requests. Provides 1-click Accept & Decline workflows, real-time earnings analytics, 0% platform commission indicators, response rate tracking, and instant gig management.');

addSubsectionTitle('Feature 5: Client Bookings Tracker (src/components/marketplace/MyBookingsView.tsx)');
addParagraph('Complete tracking interface categorized by status (Pending, Accepted / In Progress, Declined, Completed). Displays live turnaround countdowns and provides 1-Click Alternative Creator Search when a booking is declined.');

addSectionTitle('4. 8 Advanced Ecosystem Enhancements');
addBullet('1. Groq AI Brief Copilot (BriefAiCopilotModal.tsx): Scopes unformatted client briefs into milestones, budgets, and gig recommendations at 500 tokens/sec simulation.');
addBullet('2. Dynamic Rate Calculator (FreelanceRateCalculatorModal.tsx): Market percentile pricing benchmarks across 6 creative domains and 3 experience tiers.');
addBullet('3. 30-Second Web Audio API Pitch Synthesizer (AudioPitchPlayer.tsx): Dual-oscillator browser audio synthesis with synchronized canvas waveform visualizers.');
addBullet('4. Live Interactive Collaboration Studio (LiveStudioWorkspaceModal.tsx): HTML5 Canvas whiteboard, collaborative code editor, and milestone sign-off.');
addBullet('5. AI Escrow Dispute Arbitrator (EscrowDisputeArbitratorModal.tsx): Impartial mathematical dispute resolution engine with zero legal fees.');
addBullet('6. Global Multi-Currency Switcher (currency.ts): Real-time conversion across 6 major global currencies.');
addBullet('7. Multi-Party Circular Barter Loop Visualizer (CircularBarterLoopVisualizer.tsx): Graph-theoretic circular trade solver.');
addBullet('8. Glassmorphic Knowledge Passport (CreatorPassportCardModal.tsx): Soulbound DID credential card with on-chain attestations.');

// PAGE 3: Mobile & Tablet Responsiveness, Dark Mode & Security
doc.addPage();
addSectionTitle('5. Responsive UX, Dark Mode & Cross-Platform Ergonomics');
addSubsectionTitle('5.1 Tailwind CSS v4 OLED Dark & Light Theming Engine');
addParagraph('SkillNexus features a resilient theming engine configured in src/index.css using @custom-variant dark (&:where(.dark, .dark *)) and CSS tokens. Themes are synced across localStorage and documentElement, delivering instant, flicker-free switching between crisp daylight mode and OLED deep dark mode.');

addSubsectionTitle('5.2 Mobile & Tablet Safe-Area Ergonomics');
addParagraph('Built for iOS Safari, Android Chrome, iPadOS, macOS, and Windows. Uses relative viewport units, pb-safe padding for home-indicator bars, horizontal touch-scrolling carousels, and responsive 1-column to 4-column fluid grids.');

addSectionTitle('6. Security, Local Data & Verification Standards');
addParagraph('SkillNexus adheres to strict local storage and privacy isolation guidelines. Offline documentation PDFs are stored strictly in the local D: drive (D:\\e drive everything\\ClaudeWorkspace\\projects\\skillnexus) and excluded from git commits via .gitignore. All production builds are compiled with zero linting warnings and zero bundle errors.');

doc.end();

writeStream.on('finish', () => {
  console.log('PDF successfully compiled to: ' + outputPath);
});
