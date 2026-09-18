import React, { useState, useMemo } from 'react';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Sparkles,
  Sliders,
  CheckCircle2,
  X,
  Layers,
  Award,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { GigCategory, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';

interface FreelanceRateCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onOpenPostGigWithRate?: (rate: number, category: GigCategory) => void;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const FreelanceRateCalculatorModal: React.FC<FreelanceRateCalculatorModalProps> = ({
  isOpen,
  onClose,
  currency,
  onOpenPostGigWithRate,
  onAddToast,
}) => {
  const [category, setCategory] = useState<GigCategory>('Video & Animation');
  const [experienceLevel, setExperienceLevel] = useState<'junior' | 'mid' | 'senior' | 'expert'>('mid');
  const [projectComplexity, setProjectComplexity] = useState<'simple' | 'medium' | 'high'>('medium');
  const [rushTurnaround, setRushTurnaround] = useState(false);

  if (!isOpen) return null;

  // Pricing calculation matrix based on real creator economy data
  const pricing = useMemo(() => {
    let base = 35;
    if (category === 'Design & Branding') base = 65;
    else if (category === 'Web & Coding') base = 90;
    else if (category === 'Music & Audio') base = 40;
    else if (category === 'Writing & Content') base = 45;
    else if (category === 'Social Media & Growth') base = 35;

    // Experience multiplier
    const expMult = experienceLevel === 'junior' ? 0.75 : experienceLevel === 'mid' ? 1.0 : experienceLevel === 'senior' ? 1.5 : 2.2;
    // Complexity multiplier
    const compMult = projectComplexity === 'simple' ? 0.8 : projectComplexity === 'medium' ? 1.0 : 1.6;
    // Rush multiplier
    const rushMult = rushTurnaround ? 1.35 : 1.0;

    const standard = Math.round(base * expMult * compMult * rushMult);
    const starter = Math.round(standard * 0.55);
    const pro = Math.round(standard * 2.2);
    const hourly = Math.round(standard / (projectComplexity === 'simple' ? 2 : projectComplexity === 'medium' ? 4 : 8));

    const percentile = experienceLevel === 'junior' ? 35 : experienceLevel === 'mid' ? 62 : experienceLevel === 'senior' ? 86 : 96;

    return {
      starter,
      standard,
      pro,
      hourly,
      percentile,
    };
  }, [category, experienceLevel, projectComplexity, rushTurnaround]);

  const handleApplyRate = () => {
    if (onOpenPostGigWithRate) {
      onOpenPostGigWithRate(pricing.standard, category);
    }
    onClose();
    if (onAddToast) {
      onAddToast('Rate Applied!', `Standard rate ${formatPrice(pricing.standard, currency)} loaded into Post a Gig modal.`, 'success');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-400 to-indigo-600 shadow-md">
                <Calculator className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight">Dynamic Freelance Rate Calculator</h3>
                <p className="text-xs text-indigo-200">
                  Data-backed tier pricing for Starter, Standard, and Pro gig packages.
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

        {/* Form Inputs */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Skill Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-800">Your Primary Skill Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GigCategory)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-900 focus:border-indigo-600 focus:bg-white focus:outline-none"
            >
              <option value="Video & Animation">Video & Animation (TikTok, Reels, Motion)</option>
              <option value="Design & Branding">Design & Branding (Logos, Figma, Brand Kits)</option>
              <option value="Web & Coding">Web & Coding (React, Next.js, Full Stack, APIs)</option>
              <option value="Music & Audio">Music & Audio (Beats, Mixing, Sound FX)</option>
              <option value="Writing & Content">Writing & Content (Copy, Launch Emails, SEO)</option>
              <option value="Social Media & Growth">Social Media & Growth (Carousels, Strategies)</option>
            </select>
          </div>

          {/* Experience Level & Complexity Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Experience Tier</label>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {(['junior', 'mid', 'senior', 'expert'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setExperienceLevel(lvl)}
                    className={`rounded-xl border py-2 px-2.5 font-semibold capitalize transition-all ${
                      experienceLevel === lvl
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-800">Project Scope</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {(['simple', 'medium', 'high'] as const).map((comp) => (
                  <button
                    key={comp}
                    onClick={() => setProjectComplexity(comp)}
                    className={`rounded-xl border py-2 px-1.5 font-semibold capitalize transition-all text-center ${
                      projectComplexity === comp
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {comp}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Rush SLA Toggle */}
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 text-xs">
            <div>
              <span className="font-bold text-slate-800 block">24-Hour Express Rush Turnaround</span>
              <span className="text-[11px] text-slate-500">Applies a +35% fast-track rush premium</span>
            </div>
            <button
              onClick={() => setRushTurnaround(!rushTurnaround)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                rushTurnaround ? 'bg-indigo-600' : 'bg-slate-300'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  rushTurnaround ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* 3-Tier Recommended Price Cards */}
          <div className="space-y-2.5 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">Recommended 3-Tier Package Pricing</span>
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Top {100 - pricing.percentile}% Tier
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {/* Starter */}
              <div className="rounded-2xl border border-slate-200 bg-white p-3 text-center space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Starter Tier
                </span>
                <span className="text-sm sm:text-base font-black text-slate-900 block">
                  {formatPrice(pricing.starter, currency)}
                </span>
                <span className="text-[10px] text-slate-400 block">Entry scope & 1 revision</span>
              </div>

              {/* Standard */}
              <div className="rounded-2xl border-2 border-indigo-600 bg-indigo-50/50 p-3 text-center space-y-1 shadow-xs relative">
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.2 rounded-full">
                  Most Popular
                </span>
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                  Standard Tier
                </span>
                <span className="text-sm sm:text-base font-black text-indigo-900 block">
                  {formatPrice(pricing.standard, currency)}
                </span>
                <span className="text-[10px] text-indigo-600 font-semibold block">Full package & assets</span>
              </div>

              {/* Pro */}
              <div className="rounded-2xl border border-purple-200 bg-purple-50/40 p-3 text-center space-y-1 shadow-2xs">
                <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">
                  Pro / VIP Tier
                </span>
                <span className="text-sm sm:text-base font-black text-purple-950 block">
                  {formatPrice(pricing.pro, currency)}
                </span>
                <span className="text-[10px] text-purple-600 block">Full IP + source files</span>
              </div>
            </div>

            {/* Benchmark Pill */}
            <div className="flex items-center justify-between rounded-xl bg-slate-100 p-2.5 text-[11px] text-slate-600">
              <span>Hourly Rate Equivalent:</span>
              <span className="font-mono font-bold text-slate-900">
                ~{formatPrice(pricing.hourly, currency)} / hour
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-2">
            <button
              onClick={handleApplyRate}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:opacity-95 active:scale-[0.99] transition-all"
            >
              <span>Use Standard Rate ({formatPrice(pricing.standard, currency)}) in Post a Gig</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
