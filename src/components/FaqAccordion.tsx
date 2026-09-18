import React, { useState } from 'react';
import {
  ChevronDown,
  HelpCircle,
  ShieldCheck,
  Zap,
  Flame,
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

export const FaqAccordion: React.FC = () => {
  const [openId, setOpenId] = useState<string | null>('faq-1');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const faqs: FaqItem[] = [
    {
      id: 'faq-1',
      category: 'Escrow & Payments',
      question: 'How does milestone escrow protect both clients and creators?',
      answer:
        'When a client books a gig, funds are locked in our secure escrow smart contract. The funds are only released to the creator once the client reviews and approves the deliverable files. If a dispute occurs, milestone mediation ensures fair resolution or full refund.',
    },
    {
      id: 'faq-2',
      category: 'Skill Barter',
      question: 'What is the P2P Skill Barter Network and how does it work?',
      answer:
        'Skill Barter enables 1-to-1 or multi-party circular skill exchanges without cash. For example, a React Developer can build a landing page for a Video Editor, while the Video Editor creates promotional TikToks in return. Our graph algorithm also detects 3-way circular match chains.',
    },
    {
      id: 'faq-3',
      category: 'Firebase & Realtime',
      question: 'How is data synchronized across devices in real time?',
      answer:
        'SkillNexus is powered by Google Cloud Firestore with real-time onSnapshot listeners. Gig updates, new reviews, direct chat messages, and order status changes reflect instantaneously on all connected client browsers with zero manual page refreshing.',
    },
    {
      id: 'faq-4',
      category: 'Creator Verification',
      question: 'What are the Creator Badges (Rising Star, Top Rated, Nexus Pro)?',
      answer:
        'Creators earn verified badges through platform milestones: Rising Star (first 3 completed gigs with 4.8+ rating), Top Rated (10+ orders with 4.9+ rating and 98% on-time delivery), and Nexus Pro (portfolio vetted by industry engineering leads).',
    },
    {
      id: 'faq-5',
      category: 'Escrow & Payments',
      question: 'What fees does SkillNexus charge creators?',
      answer:
        'SkillNexus charges an industry-low 5% platform fee on cash gig payouts, compared to 20% on legacy freelance platforms. P2P Skill Barter exchanges are 100% free with zero fees.',
    },
    {
      id: 'faq-6',
      category: 'Developer Roadmap',
      question: 'How can I use the Full Stack Developer Roadmap?',
      answer:
        'The interactive 7-node roadmap lets you track your knowledge across Frontend, Backend, Databases, APIs, Auth, DevOps, and Testing. You can mark learned skills, copy syllabi, find creator mentors, and book 1-on-1 video coaching sessions.',
    },
  ];

  const categories = ['All', 'Escrow & Payments', 'Skill Barter', 'Firebase & Realtime', 'Creator Verification', 'Developer Roadmap'];

  const filteredFaqs =
    selectedCategory === 'All'
      ? faqs
      : faqs.filter((f) => f.category === selectedCategory);

  return (
    <section id="faq-section" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/40">
      {/* Header */}
      <div className="max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-3">
          <HelpCircle className="h-3.5 w-3.5 text-indigo-600" />
          <span>Frequently Asked Questions</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Everything You Need To Know About{' '}
          <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
            SkillNexus
          </span>
        </h2>
        <p className="mt-2 text-sm text-slate-600">
          Got questions about escrow protection, P2P skill exchanges, Firebase real-time data sync, or creator monetization? Find fast answers below.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              selectedCategory === cat
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = openId === faq.id;
          return (
            <div
              key={faq.id}
              className={`overflow-hidden rounded-2xl border transition-all ${
                isOpen
                  ? 'border-indigo-200 bg-indigo-50/20 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <button
                onClick={() => setOpenId(isOpen ? null : faq.id)}
                className="flex w-full items-center justify-between p-4 sm:p-5 text-left text-sm sm:text-base font-bold text-slate-900"
              >
                <span className="pr-4">{faq.question}</span>
                <div
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 ${
                    isOpen
                      ? 'rotate-180 bg-indigo-600 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <ChevronDown className="h-4 w-4" />
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-5 sm:px-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-indigo-100/60 pt-3">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
