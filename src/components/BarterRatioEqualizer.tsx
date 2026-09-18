import React, { useState, useMemo } from 'react';
import {
  Sliders,
  Sparkles,
  Scale,
  Clock,
  Globe,
  ArrowRightLeft,
  FileText,
  Copy,
  CheckCircle2,
  Calendar,
  Layers,
  Zap,
  BookOpen
} from 'lucide-react';
import { SkillNode, ProficiencyTier, SkillCategory } from '../types';

interface BarterRatioEqualizerProps {
  availableSkills: SkillNode[];
  onApplyToPostForm: (teachSkill: string, learnSkill: string) => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

export const BarterRatioEqualizer: React.FC<BarterRatioEqualizerProps> = ({
  availableSkills,
  onApplyToPostForm,
  onAddToast,
}) => {
  const [offerSkill, setOfferSkill] = useState<string>('Python');
  const [offerTier, setOfferTier] = useState<ProficiencyTier>('Expert');
  const [seekSkill, setSeekSkill] = useState<string>('German');
  const [seekTier, setSeekTier] = useState<ProficiencyTier>('Intermediate');
  const [sessionFormat, setSessionFormat] = useState<'1-on-1 Live' | 'Async Code Review' | 'Pair Jam'>('1-on-1 Live');

  // Timezone Radar state
  const [localHour, setLocalHour] = useState<number>(14); // 2:00 PM
  const [copiedContract, setCopiedContract] = useState<boolean>(false);

  // Helper tier weight
  const getTierWeight = (tier: ProficiencyTier): number => {
    switch (tier) {
      case 'Expert':
        return 1.4;
      case 'Intermediate':
        return 1.1;
      case 'Beginner':
        return 0.85;
    }
  };

  // Helper skill complexity
  const getSkillComplexity = (skillName: string): { cognitiveLoad: number; prepMinutes: number; category: string } => {
    const s = availableSkills.find((item) => item.name.toLowerCase() === skillName.toLowerCase());
    const cat = s?.category || 'tech';

    if (cat === 'tech') {
      return { cognitiveLoad: 1.35, prepMinutes: 40, category: 'Tech & Architecture' };
    } else if (cat === 'languages') {
      return { cognitiveLoad: 1.1, prepMinutes: 20, category: 'Languages & Fluency' };
    } else if (cat === 'music') {
      return { cognitiveLoad: 1.25, prepMinutes: 30, category: 'Music & Audio' };
    } else if (cat === 'design') {
      return { cognitiveLoad: 1.2, prepMinutes: 35, category: 'Design Systems' };
    } else {
      return { cognitiveLoad: 1.15, prepMinutes: 25, category: 'Craft & Business' };
    }
  };

  const offerInfo = getSkillComplexity(offerSkill);
  const seekInfo = getSkillComplexity(seekSkill);

  // Calculate Parity Ratio
  const parityStats = useMemo(() => {
    const offerScore = getTierWeight(offerTier) * offerInfo.cognitiveLoad;
    const seekScore = getTierWeight(seekTier) * seekInfo.cognitiveLoad;
    const ratio = offerScore / (seekScore || 1); // 1.0 is exact match

    let verdict = 'Equitable 1:1 Parity';
    let offsetAdvice = 'Both subjects demand equivalent mental bandwidth and prep. Standard 1-to-1 hourly barter is recommended.';
    let balancePercent = 50; // 50% means center

    if (ratio > 1.2) {
      verdict = 'High Preparation Differential';
      offsetAdvice = `Teaching ${offerSkill} at ${offerTier} tier carries heavier syllabus prep. Recommend balancing by asking partner for 1 extra async feedback review or homework review.`;
      balancePercent = Math.min(80, Math.round(50 + (ratio - 1) * 35));
    } else if (ratio < 0.8) {
      verdict = 'Reciprocal Learning Premium';
      offsetAdvice = `Receiving ${seekSkill} requires intensive immersion. Consider adding a code artifact or custom summary sheet to balance the partnership.`;
      balancePercent = Math.max(20, Math.round(50 - (1 - ratio) * 35));
    }

    return {
      ratio: parseFloat(ratio.toFixed(2)),
      verdict,
      offsetAdvice,
      balancePercent,
      offerPrep: offerInfo.prepMinutes,
      seekPrep: seekInfo.prepMinutes,
    };
  }, [offerSkill, offerTier, seekSkill, seekTier, offerInfo, seekInfo]);

  // Synthetic 4-part Curriculum
  const synthesizedCurriculum = [
    {
      session: 1,
      title: 'Diagnostic Baseline & Shared Goal Mapping',
      offerAgenda: `Review existing ${offerSkill} foundation and define target competency benchmark.`,
      seekAgenda: `Conduct conversational drill in ${seekSkill} with immediate vocabulary error correction.`,
      targetHours: '1.5 Hours Each',
    },
    {
      session: 2,
      title: 'Deep Core Mechanics & Interactive Exercise',
      offerAgenda: `Live step-by-step walkthrough of ${offerSkill} patterns and debugging common pitfalls.`,
      seekAgenda: `Grammar nuance analysis, listening comprehension exercises, and real-time response drills.`,
      targetHours: '1.5 Hours Each',
    },
    {
      session: 3,
      title: 'Real-World Scenario & Portfolio Integration',
      offerAgenda: `Collaborative pair programming / project review using production-grade standards.`,
      seekAgenda: `Simulated native-level conversational scenario or professional presentation in ${seekSkill}.`,
      targetHours: '2.0 Hours Each',
    },
    {
      session: 4,
      title: 'Reciprocal Sign-Off & Escrow Release Attestation',
      offerAgenda: `Final delivery evaluation, self-sufficiency roadmap, and mutual ledger signing.`,
      seekAgenda: `Fluency milestones sign-off, peer review submission, and escrow release confirmation.`,
      targetHours: '1.0 Hours Each',
    },
  ];

  const handleCopyAgreement = () => {
    const text = `# SkillNexus Bilateral Barter Agreement
Partnership: ${offerSkill} (${offerTier}) ⇄ ${seekSkill} (${seekTier})
Parity Ratio: ${parityStats.ratio}x (${parityStats.verdict})
Format: ${sessionFormat}
Mutual Commitment: 6.0 Hours Total in Escrow

${synthesizedCurriculum
  .map(
    (c) => `## Session ${c.session}: ${c.title} (${c.targetHours})
- Offering: ${c.offerAgenda}
- Receiving: ${c.seekAgenda}`
  )
  .join('\n\n')}
`;
    navigator.clipboard.writeText(text);
    setCopiedContract(true);
    setTimeout(() => setCopiedContract(false), 3000);
    onAddToast(
      'Syllabus Agreement Copied',
      'Bilateral barter curriculum copied to clipboard for your trade partner.',
      'success'
    );
  };

  // Timezones calculation
  const hubs = [
    { name: 'San Francisco (PT)', offset: -7, flag: '🇺🇸' },
    { name: 'London (GMT)', offset: 1, flag: '🇬🇧' },
    { name: 'Berlin (CET)', offset: 2, flag: '🇩🇪' },
    { name: 'Tokyo (JST)', offset: 9, flag: '🇯🇵' },
  ];

  return (
    <section
      id="barter-equalizer-section"
      className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40"
    >
      {/* Title */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Scale className="h-4 w-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Autonomous Barter Ratio & Equalizer Lab
            </h2>
            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-800">
              Fair Exchange Equalizer
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            While 1 hour = 1 credit on SkillNexus, cognitive preparation and difficulty vary. The Equalizer balances complex exchanges, synthesizes mutual syllabi, and discovers global synchronous trade windows.
          </p>
        </div>

        <button
          onClick={() => onApplyToPostForm(offerSkill, seekSkill)}
          className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3.5 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
        >
          <ArrowRightLeft className="h-3.5 w-3.5" />
          <span>Apply to Post Panel</span>
        </button>
      </div>

      {/* Top Controls: Equalizer Input Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 rounded-xl border border-slate-200 bg-slate-50/50">
        {/* Left: What you offer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600"></span>
              Skill You Offer (Your Supply)
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Prep: ~{parityStats.offerPrep}m / hr
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skill</label>
            <select
              value={offerSkill}
              onChange={(e) => setOfferSkill(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            >
              {availableSkills.map((s) => (
                <option key={`offer-${s.id}`} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Your Proficiency</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Expert'] as ProficiencyTier[]).map((tier) => (
                <button
                  key={`off-${tier}`}
                  onClick={() => setOfferTier(tier)}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    offerTier === tier
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: What you seek */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs font-bold text-cyan-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-600"></span>
              Skill You Seek (Your Demand)
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Prep: ~{parityStats.seekPrep}m / hr
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Skill</label>
            <select
              value={seekSkill}
              onChange={(e) => setSeekSkill(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            >
              {availableSkills.map((s) => (
                <option key={`seek-${s.id}`} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Target Proficiency</label>
            <div className="grid grid-cols-3 gap-2">
              {(['Beginner', 'Intermediate', 'Expert'] as ProficiencyTier[]).map((tier) => (
                <button
                  key={`sk-${tier}`}
                  onClick={() => setSeekTier(tier)}
                  className={`rounded-lg py-1.5 text-xs font-semibold transition-all ${
                    seekTier === tier
                      ? 'bg-cyan-600 text-white shadow-xs'
                      : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {tier}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Parity Scale Visualizer */}
      <div className="my-6 rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-indigo-700" />
            <h3 className="text-sm font-bold text-slate-900">
              Exchange Parity Index: <span className="text-indigo-800 font-black">{parityStats.ratio}x</span>
            </h3>
          </div>
          <span className="rounded-full bg-white border border-indigo-200 px-3 py-0.5 text-xs font-bold text-indigo-800 shadow-2xs">
            {parityStats.verdict}
          </span>
        </div>

        {/* Visual Balance Bar */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600">
            <span>Offer Heavier ({offerSkill})</span>
            <span className="text-slate-400">⚖️ 50/50 Balanced</span>
            <span>Seek Heavier ({seekSkill})</span>
          </div>

          <div className="relative h-3 w-full rounded-full bg-slate-200 overflow-hidden">
            {/* Center tick mark */}
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-400 z-10"></div>
            {/* Balance Indicator */}
            <div
              className="h-full bg-gradient-to-r from-emerald-500 via-indigo-600 to-cyan-500 transition-all duration-500"
              style={{ width: `${parityStats.balancePercent}%` }}
            ></div>
          </div>
        </div>

        {/* Actionable Advice */}
        <p className="mt-3 text-xs text-slate-700 leading-relaxed bg-white border border-indigo-100 p-2.5 rounded-lg shadow-2xs">
          <span className="font-bold text-indigo-900">Equalizer Recommendation: </span>
          {parityStats.offsetAdvice}
        </p>
      </div>

      {/* Bottom Grid: 1. Synthesized Syllabus & 2. Timezone Overlap Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Synthesized 4-Session Bilateral Curriculum */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider">
              <BookOpen className="h-4 w-4 text-indigo-600" />
              <span>Synthesized Bilateral Syllabus Contract</span>
            </div>
            <button
              onClick={handleCopyAgreement}
              className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 font-semibold"
            >
              {copiedContract ? <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedContract ? 'Copied!' : 'Copy Contract'}</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {synthesizedCurriculum.map((item) => (
              <div
                key={item.session}
                className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs transition-all hover:border-slate-300"
              >
                <div className="flex items-center justify-between text-xs pb-1.5 border-b border-slate-100">
                  <span className="font-bold text-slate-900">
                    Week {item.session}: {item.title}
                  </span>
                  <span className="rounded bg-indigo-50 border border-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-800">
                    {item.targetHours}
                  </span>
                </div>

                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="rounded-lg bg-emerald-50/50 p-2 border border-emerald-100">
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-0.5">
                      You Teach ({offerSkill}):
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {item.offerAgenda}
                    </p>
                  </div>
                  <div className="rounded-lg bg-cyan-50/50 p-2 border border-cyan-100">
                    <span className="text-[10px] font-bold text-cyan-800 uppercase block mb-0.5">
                      You Learn ({seekSkill}):
                    </span>
                    <p className="text-slate-700 text-[11px] leading-relaxed">
                      {item.seekAgenda}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Global Synchronous Radar */}
        <div className="lg:col-span-5 rounded-xl border border-slate-200 bg-slate-50/60 p-4 space-y-4">
          <div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-cyan-600" />
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Global Synchronous Radar
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Knowledge barter requires mutual wakefulness. Scrub your local hour to find overlapping active trade windows across mentor hubs.
            </p>
          </div>

          {/* Hour Slider */}
          <div>
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
              <span>Your Current Time:</span>
              <span className="rounded bg-indigo-100 px-2 py-0.5 text-indigo-900 font-mono">
                {localHour.toString().padStart(2, '0')}:00 Local
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={23}
              step={1}
              value={localHour}
              onChange={(e) => setLocalHour(parseInt(e.target.value))}
              className="w-full accent-indigo-600"
            />
          </div>

          {/* Hub Clocks Grid */}
          <div className="space-y-2 text-xs">
            {hubs.map((hub) => {
              const hubHour = (localHour + hub.offset + 24) % 24;
              const isAwake = hubHour >= 8 && hubHour <= 22;

              return (
                <div
                  key={hub.name}
                  className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-base">{hub.flag}</span>
                    <span className="font-semibold text-slate-800">{hub.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-600 font-medium">
                      {hubHour.toString().padStart(2, '0')}:00
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        isAwake
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {isAwake ? 'Live Window' : 'Async Only'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="rounded-lg border border-cyan-200 bg-cyan-50/60 p-2.5 text-[11px] text-cyan-900">
            <span className="font-bold">Pro Tip: </span>
            Pairs in cross-continental timezones often dedicate 1 live session on weekends and perform asynchronous artifact reviews during weekdays.
          </div>
        </div>
      </div>
    </section>
  );
};
