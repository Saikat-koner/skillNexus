import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Zap,
  ArrowRight,
  CheckCircle2,
  Clock,
  DollarSign,
  Layers,
  Search,
  X,
  ShieldCheck,
  Cpu,
  CornerDownRight,
  TrendingUp
} from 'lucide-react';
import { GigItem, GigCategory, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';

interface BriefAiCopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
  gigs: GigItem[];
  onSelectGigToBook: (gig: GigItem, prefilledBrief?: string) => void;
  currency: CurrencyCode;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

const SAMPLE_PROMPTS = [
  'Need 3 viral TikTok tech review reels with motion subtitles and fast-paced sound design in 3 days for ~$100.',
  'Want a minimalist brand logo, typography palette, and vector icon kit for a Gen-Z AI code startup.',
  'High-converting modern landing page in React, Tailwind CSS, and Next.js with dark mode and 100 Lighthouse score.',
  'Need 5-part automated email onboarding sequence for our SaaS product launch to drive trial conversions.'
];

export const BriefAiCopilotModal: React.FC<BriefAiCopilotModalProps> = ({
  isOpen,
  onClose,
  gigs,
  onSelectGigToBook,
  currency,
  onAddToast,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationDone, setGenerationDone] = useState(false);
  const [streamProgress, setStreamProgress] = useState(0);

  // Analysis state
  const [detectedCategory, setDetectedCategory] = useState<GigCategory>('Video & Animation');
  const [budgetRange, setBudgetRange] = useState<{ min: number; max: number }>({ min: 70, max: 130 });
  const [turnaroundDays, setTurnaroundDays] = useState(2);
  const [milestones, setMilestones] = useState<{ title: string; desc: string; percent: number }[]>([]);
  const [matchedGigs, setMatchedGigs] = useState<{ gig: GigItem; score: number; reason: string }[]>([]);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setGenerationDone(false);
    setStreamProgress(0);

    // Simulate Groq Cloud ultra-fast inference
    const p = prompt.toLowerCase();
    let cat: GigCategory = 'Video & Animation';
    let minB = 50;
    let maxB = 120;
    let days = 2;

    if (p.includes('logo') || p.includes('brand') || p.includes('figma') || p.includes('design')) {
      cat = 'Design & Branding';
      minB = 80;
      maxB = 160;
      days = 3;
    } else if (p.includes('react') || p.includes('code') || p.includes('web') || p.includes('next.js') || p.includes('landing')) {
      cat = 'Web & Coding';
      minB = 100;
      maxB = 250;
      days = 3;
    } else if (p.includes('music') || p.includes('beat') || p.includes('audio') || p.includes('lo-fi')) {
      cat = 'Music & Audio';
      minB = 40;
      maxB = 90;
      days = 2;
    } else if (p.includes('writing') || p.includes('email') || p.includes('copy') || p.includes('content')) {
      cat = 'Writing & Content';
      minB = 45;
      maxB = 95;
      days = 2;
    } else if (p.includes('carousel') || p.includes('growth') || p.includes('social') || p.includes('instagram')) {
      cat = 'Social Media & Growth';
      minB = 35;
      maxB = 80;
      days = 2;
    }

    setDetectedCategory(cat);
    setBudgetRange({ min: minB, max: maxB });
    setTurnaroundDays(days);

    setMilestones([
      {
        title: 'Phase 1: Concept & Scoping Brief',
        desc: 'Asset intake, tone alignment, moodboard / initial wireframes review.',
        percent: 30,
      },
      {
        title: 'Phase 2: Core Production Draft',
        desc: 'Full build draft / master rendering with all key deliverables included.',
        percent: 40,
      },
      {
        title: 'Phase 3: Revisions & Final Asset Handover',
        desc: 'Feedback polish, source files export, and milestone escrow completion.',
        percent: 30,
      },
    ]);

    // Match top 2-3 gigs in that category
    const relevant = gigs.filter((g) => g.category === cat);
    const fallbacks = gigs.filter((g) => g.category !== cat);
    const combined = [...relevant, ...fallbacks].slice(0, 3).map((g, idx) => ({
      gig: g,
      score: idx === 0 ? 98 : idx === 1 ? 93 : 87,
      reason:
        idx === 0
          ? `Direct skill alignment in ${g.category} with ${g.reviewsCount}+ verified 5-star reviews.`
          : `Fast ${g.deliveryDays}-day SLA within the estimated ${formatPrice(minB, currency)} - ${formatPrice(maxB, currency)} range.`,
    }));

    setMatchedGigs(combined);

    // Fast simulated streaming tokens (~400ms)
    let current = 0;
    const interval = window.setInterval(() => {
      current += 20;
      setStreamProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsGenerating(false);
        setGenerationDone(true);
        if (onAddToast) {
          onAddToast('Brief Deconstructed!', 'Groq LPU generated milestone scope & matched top creators.', 'success');
        }
      }
    }, 80);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 shadow-md">
                <Bot className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">Brief-to-Gig AI Copilot</h3>
                  <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-400/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                    <Zap className="h-3 w-3" /> Groq 500 tok/s
                  </span>
                </div>
                <p className="text-xs text-indigo-200">
                  Type your raw project idea. AI generates the milestone scope and finds the best creator.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-white/80 hover:bg-white/10 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Prompt Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span>What do you need built or created?</span>
              <span className="text-[11px] text-slate-400">Natural language brief</span>
            </label>
            <div className="relative">
              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Need 3 high-energy TikTok video reels with motion subtitles and sound design for our startup launch in 2 days..."
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-colors"
              />
            </div>

            {/* Sample Prompts Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
              <span className="text-slate-400 font-semibold shrink-0">Try:</span>
              {SAMPLE_PROMPTS.map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => setPrompt(sample)}
                  className="shrink-0 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-200 transition-colors"
                >
                  {sample.slice(0, 34)}...
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
            className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all ${
              !prompt.trim() || isGenerating
                ? 'bg-slate-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-95 shadow-indigo-500/20 active:scale-[0.99]'
            }`}
          >
            {isGenerating ? (
              <>
                <Cpu className="h-4 w-4 animate-spin text-cyan-200" />
                <span>Deconstructing Brief on Groq LPU ({streamProgress}%)...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 text-cyan-200" />
                <span>Deconstruct Scope & Find Creators</span>
              </>
            )}
          </button>

          {/* Results Display */}
          {generationDone && (
            <div className="space-y-4 pt-2 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
              {/* Scope KPI Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-3 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-indigo-700 block">
                    Category Match
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 mt-0.5 block truncate">
                    {detectedCategory}
                  </span>
                </div>

                <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 block">
                    Estimated Budget
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                    {formatPrice(budgetRange.min, currency)} - {formatPrice(budgetRange.max, currency)}
                  </span>
                </div>

                <div className="rounded-xl border border-purple-100 bg-purple-50/60 p-3 text-center">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-purple-700 block">
                    Turnaround SLA
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 mt-0.5 block">
                    {turnaroundDays} Business Days
                  </span>
                </div>
              </div>

              {/* 3-Phase Milestone Roadmap */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
                  <Layers className="h-4 w-4 text-indigo-600" />
                  <span>AI-Recommended Milestone Escrow Breakdown</span>
                </div>

                <div className="space-y-2 text-xs">
                  {milestones.map((m, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 rounded-xl border border-slate-200/80 bg-white p-2.5 shadow-2xs"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-indigo-100 text-[11px] font-black text-indigo-700">
                        {idx + 1}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">{m.title}</span>
                          <span className="font-mono text-[11px] font-bold text-indigo-600">
                            {m.percent}% Escrow
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matched Creators Listing */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-900">
                  <span>Top Matched Creator Gigs</span>
                  <span className="text-[11px] text-indigo-600">Ranked by Groq Semantic Vector</span>
                </div>

                <div className="space-y-2">
                  {matchedGigs.map(({ gig, score, reason }) => (
                    <div
                      key={gig.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-xs hover:border-indigo-300 transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={gig.creatorAvatar}
                          alt={gig.creatorName}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900 text-xs">{gig.creatorName}</span>
                            <span className="rounded-md bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 text-[10px] font-black text-emerald-700">
                              {score}% Match
                            </span>
                          </div>
                          <p className="text-xs font-semibold text-indigo-600 truncate max-w-sm">
                            {gig.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{reason}</p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <span className="text-xs font-extrabold text-slate-900">
                          {formatPrice(gig.rate, currency)}
                        </span>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectGigToBook(gig, prompt);
                          }}
                          className="flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs active:scale-95 transition-all"
                        >
                          <span>Book Escrow</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
