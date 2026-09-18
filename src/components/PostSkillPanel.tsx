import React, { useState, useMemo } from 'react';
import {
  GraduationCap,
  BookOpen,
  ArrowRightLeft,
  Sparkles,
  Zap,
  CheckCircle2,
  Clock,
  Send,
  HelpCircle,
  Award
} from 'lucide-react';
import { ProficiencyTier, SkillCategory, PostSkillSubmission, SkillNode } from '../types';

interface PostSkillPanelProps {
  onPostSubmit: (data: PostSkillSubmission) => void;
  availableSkills: SkillNode[];
  initialTeachSkill?: string;
  initialLearnSkill?: string;
}

export const PostSkillPanel: React.FC<PostSkillPanelProps> = ({
  onPostSubmit,
  availableSkills,
  initialTeachSkill = '',
  initialLearnSkill = '',
}) => {
  const [teachSkill, setTeachSkill] = useState(initialTeachSkill || 'React Basics');
  const [teachCategory, setTeachCategory] = useState<SkillCategory>('tech');
  const [teachTier, setTeachTier] = useState<ProficiencyTier>('Expert');
  const [teachDescription, setTeachDescription] = useState(
    'Can mentor on state architectures, clean components, custom hooks, and Tailwind UI layout.'
  );

  const [learnSkill, setLearnSkill] = useState(initialLearnSkill || 'German');
  const [learnCategory, setLearnCategory] = useState<SkillCategory>('languages');
  const [learnTier, setLearnTier] = useState<ProficiencyTier>('Intermediate');
  const [sessionFormat, setSessionFormat] = useState<'1-on-1 Live' | 'Async Code/Work Review' | 'Pair Jam / Practice'>('1-on-1 Live');
  const [hoursPerWeek, setHoursPerWeek] = useState(3);

  const [isSubmitted, setIsSubmitted] = useState(false);

  // Dynamic instant match preview calculation based on active inputs
  const dynamicMatches = useMemo(() => {
    const teachMatches = availableSkills.filter(
      (s) => s.name.toLowerCase().includes(learnSkill.toLowerCase()) || s.category === learnCategory
    ).length;

    const circularChains = Math.max(1, Math.min(6, Math.floor(teachMatches * 1.5)));
    const estimatedHours = hoursPerWeek;

    return {
      potentialAnchorsCount: Math.max(2, teachMatches),
      circularChainsCount: circularChains,
      parityHours: estimatedHours,
    };
  }, [learnSkill, learnCategory, hoursPerWeek, availableSkills]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!teachSkill.trim() || !learnSkill.trim()) return;

    onPostSubmit({
      teachSkill,
      teachCategory,
      teachTier,
      teachDescription,
      learnSkill,
      learnCategory,
      learnTier,
      sessionFormat,
      hoursPerWeek,
    });

    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 4000);
  };

  const proficiencyTiers: ProficiencyTier[] = ['Beginner', 'Intermediate', 'Expert'];

  const quickTeachSuggestions = ['Python', 'React Basics', 'Guitar', 'UI/UX Design', 'Data Science'];
  const quickLearnSuggestions = ['German', 'Ableton Live', 'Spanish', 'Prompt Engineering', 'Japanese'];

  return (
    <section id="post-skill-section" className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40">
      {/* Title */}
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <GraduationCap className="h-4 w-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Structured "Post a Skill / Request" Panel
            </h2>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700">
              Bilateral Declaration
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Simultaneously declare your offering and your learning objective. The barter engine links both ends into the global liquidity graph.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5 text-indigo-600" />
          <span>No Currency • 1 Hour = 1 Credit</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dual Input Panels Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative">
          {/* Connector Badge on Desktop */}
          <div className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 h-10 w-10 items-center justify-center rounded-full border border-indigo-200 bg-white text-indigo-600 shadow-md">
            <ArrowRightLeft className="h-4 w-4 animate-pulse" />
          </div>

          {/* LEFT: I Can Teach X */}
          <div className="flex flex-col justify-between rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 sm:p-5 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-emerald-100">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold">
                    1
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-emerald-900">
                    I Can Teach... (Your Knowledge Asset)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  Supply
                </span>
              </div>

              {/* Skill Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Skill Name
                </label>
                <input
                  id="teach-skill-input"
                  type="text"
                  value={teachSkill}
                  onChange={(e) => setTeachSkill(e.target.value)}
                  placeholder="e.g. Python, React Basics, Guitar..."
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                />
                {/* Quick Pills */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-slate-500 font-medium">Suggested:</span>
                  {quickTeachSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setTeachSkill(s)}
                      className="rounded border border-slate-200 bg-white hover:bg-slate-100 px-2 py-0.5 text-slate-700 transition-colors shadow-2xs"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Category
                </label>
                <select
                  value={teachCategory}
                  onChange={(e) => setTeachCategory(e.target.value as SkillCategory)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-600 focus:outline-none capitalize"
                >
                  <option value="tech">Tech & Software</option>
                  <option value="languages">Languages</option>
                  <option value="music">Music & Audio</option>
                  <option value="design">Visual Design</option>
                  <option value="business">Business & Writing</option>
                  <option value="craft">Craft & Culinary</option>
                </select>
              </div>

              {/* Proficiency Tier */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Your Proficiency Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {proficiencyTiers.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setTeachTier(tier)}
                      className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                        teachTier === tier
                          ? 'border border-emerald-600 bg-emerald-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Teaching Description */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Teaching Focus & Scope
                </label>
                <textarea
                  value={teachDescription}
                  onChange={(e) => setTeachDescription(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-emerald-600 focus:outline-none"
                  placeholder="What topics or real-world exercises will you cover?"
                />
              </div>
            </div>
          </div>

          {/* RIGHT: I Want to Learn Y */}
          <div className="flex flex-col justify-between rounded-xl border border-cyan-200 bg-cyan-50/40 p-4 sm:p-5 shadow-xs">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-cyan-100">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-100 text-cyan-800 text-xs font-bold">
                    2
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-cyan-900">
                    I Want to Learn... (Target Need)
                  </h3>
                </div>
                <span className="text-[11px] font-semibold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded">
                  Demand
                </span>
              </div>

              {/* Learn Skill Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Desired Skill
                </label>
                <input
                  id="learn-skill-input"
                  type="text"
                  value={learnSkill}
                  onChange={(e) => setLearnSkill(e.target.value)}
                  placeholder="e.g. German, Ableton Live, Spanish..."
                  required
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-cyan-600 focus:outline-none"
                />
                {/* Quick Pills */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5 text-[10px]">
                  <span className="text-slate-500 font-medium">Suggested:</span>
                  {quickLearnSuggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setLearnSkill(s)}
                      className="rounded border border-slate-200 bg-white hover:bg-slate-100 px-2 py-0.5 text-slate-700 transition-colors shadow-2xs"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Target Category */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Category
                </label>
                <select
                  value={learnCategory}
                  onChange={(e) => setLearnCategory(e.target.value as SkillCategory)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-cyan-600 focus:outline-none capitalize"
                >
                  <option value="languages">Languages</option>
                  <option value="tech">Tech & Software</option>
                  <option value="music">Music & Audio</option>
                  <option value="design">Visual Design</option>
                  <option value="business">Business & Writing</option>
                  <option value="craft">Craft & Culinary</option>
                </select>
              </div>

              {/* Target Proficiency Tier */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Target Proficiency Tier
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {proficiencyTiers.map((tier) => (
                    <button
                      key={tier}
                      type="button"
                      onClick={() => setLearnTier(tier)}
                      className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                        learnTier === tier
                          ? 'border border-cyan-600 bg-cyan-600 text-white shadow-xs'
                          : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-900'
                      }`}
                    >
                      {tier}
                    </button>
                  ))}
                </div>
              </div>

              {/* Session Format & Weekly Commitment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Session Format
                  </label>
                  <select
                    value={sessionFormat}
                    onChange={(e) => setSessionFormat(e.target.value as any)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-2 text-xs text-slate-900 focus:border-cyan-600 focus:outline-none"
                  >
                    <option value="1-on-1 Live">1-on-1 Live Session</option>
                    <option value="Async Code/Work Review">Async Code/Work Review</option>
                    <option value="Pair Jam / Practice">Pair Jam / Practice</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Hours / Week: <span className="text-cyan-700 font-bold">{hoursPerWeek}h</span>
                  </label>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    step={1}
                    value={hoursPerWeek}
                    onChange={(e) => setHoursPerWeek(parseInt(e.target.value))}
                    className="w-full accent-cyan-600 mt-2"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Nexus Match Preview Banner */}
        <div className="rounded-xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/80 p-4 shadow-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700">
                <Sparkles className="h-5 w-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm font-bold text-slate-900">
                    Live Nexus Match Preview:
                  </span>
                  <span className="rounded bg-emerald-100 px-2 py-0.5 text-[11px] font-bold text-emerald-800">
                    {dynamicMatches.circularChainsCount} Barter Chains Found!
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Trading <span className="font-semibold text-emerald-800">{teachSkill}</span> for{' '}
                  <span className="font-semibold text-cyan-800">{learnSkill}</span> has{' '}
                  <span className="text-slate-900 font-semibold">{dynamicMatches.potentialAnchorsCount} verified Trust Anchors</span> ready to exchange.
                </p>
              </div>
            </div>

            <button
              id="publish-skill-btn"
              type="submit"
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-cyan-700 transition-all active:scale-[0.98]"
            >
              <Send className="h-4 w-4" />
              <span>Publish to Nexus</span>
            </button>
          </div>
        </div>

        {/* Success Confirmation Toast/Notice */}
        {isSubmitted && (
          <div className="rounded-xl border border-emerald-300 bg-emerald-50 p-4 text-center text-xs sm:text-sm font-semibold text-emerald-900 shadow-md flex items-center justify-center gap-2 animate-bounce">
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            <span>
              Your dual barter declaration was published to the graph! New multi-party barter chains have been unlocked below.
            </span>
          </div>
        )}
      </form>
    </section>
  );
};
