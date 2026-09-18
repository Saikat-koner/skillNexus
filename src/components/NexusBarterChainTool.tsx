import React, { useState } from 'react';
import {
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
  Clock,
  CheckCircle2,
  Send,
  Zap,
  ChevronRight,
  TrendingUp,
  UserCheck,
  Layers,
  HelpCircle,
  SlidersHorizontal
} from 'lucide-react';
import { BarterChain, SkillNode } from '../types';

interface NexusBarterChainToolProps {
  chains: BarterChain[];
  availableSkills: SkillNode[];
  onProposeChain: (chain: BarterChain) => void;
  onSelectSkill: (skillName: string) => void;
}

export const NexusBarterChainTool: React.FC<NexusBarterChainToolProps> = ({
  chains,
  availableSkills,
  onProposeChain,
  onSelectSkill,
}) => {
  const [selectedChainId, setSelectedChainId] = useState<string>(chains[0]?.id || 'chain-german-react');
  const [filterMode, setFilterMode] = useState<'all' | 'languages' | 'tech' | 'music'>('all');

  // Custom simulator state
  const [simTeachSkill, setSimTeachSkill] = useState<string>('React Basics');
  const [simLearnSkill, setSimLearnSkill] = useState<string>('German Lessons');
  const [isSimulating, setIsSimulating] = useState(false);
  const [generatedChains, setGeneratedChains] = useState<BarterChain[]>(chains);

  const activeChain = generatedChains.find((c) => c.id === selectedChainId) || generatedChains[0];

  // Algorithmic dynamic barter loop synthesizer
  const handleSynthesizeCustomChain = () => {
    setIsSimulating(true);

    setTimeout(() => {
      const teachNode = availableSkills.find(
        (s) => s.name.toLowerCase() === simTeachSkill.toLowerCase()
      ) || availableSkills[0];

      const learnNode = availableSkills.find(
        (s) => s.name.toLowerCase() === simLearnSkill.toLowerCase()
      ) || availableSkills[1];

      // Intermediate facilitator
      const facilitatorSkill = availableSkills.find(
        (s) => s.name !== teachNode.name && s.name !== learnNode.name
      ) || availableSkills[4];

      const newCustomChain: BarterChain = {
        id: `chain-custom-${Date.now()}`,
        title: `${teachNode.name} ➔ ${facilitatorSkill.name} ➔ ${learnNode.name} Circular Loop`,
        sourceSkill: teachNode.name,
        targetSkill: learnNode.name,
        hopsCount: 2,
        confidenceScore: Math.floor(92 + Math.random() * 7),
        timeBalanceHours: 3.5,
        savingsDays: parseFloat((3.2 + Math.random() * 3).toFixed(1)),
        status: 'recommended',
        category: learnNode.category,
        verifiedAnchorsInvolved: 2,
        description: `To unlock "${learnNode.name}" from Anchor Alex, you teach "${teachNode.name}" to Dev Jordan, who provides "${facilitatorSkill.name}" to Alex.`,
        steps: [
          {
            stepNumber: 1,
            fromUser: {
              id: 'you',
              name: 'You (Explorer)',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              isCurrentUser: true,
            },
            toUser: {
              id: 'sim-user-b',
              name: 'Jordan Rivera',
              avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
              badge: 'Quick Responder',
            },
            teachesSkill: teachNode.name,
            skillCategory: teachNode.category,
            hours: 3.5,
            format: '1-on-1 Interactive Lab',
          },
          {
            stepNumber: 2,
            fromUser: {
              id: 'sim-user-b',
              name: 'Jordan Rivera',
              avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
              badge: 'Quick Responder',
            },
            toUser: {
              id: 'sim-user-a',
              name: 'Alexandre Meyer',
              avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
              badge: 'Master Instructor',
            },
            teachesSkill: facilitatorSkill.name,
            skillCategory: facilitatorSkill.category,
            hours: 3.5,
            format: 'Hands-on Mentorship & Review',
          },
          {
            stepNumber: 3,
            fromUser: {
              id: 'sim-user-a',
              name: 'Alexandre Meyer',
              avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
              badge: 'Master Instructor',
            },
            toUser: {
              id: 'you',
              name: 'You (Explorer)',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
              isCurrentUser: true,
            },
            teachesSkill: learnNode.name,
            skillCategory: learnNode.category,
            hours: 3.5,
            format: 'Conversational Mastery & Coaching',
          },
        ],
      };

      setGeneratedChains([newCustomChain, ...generatedChains]);
      setSelectedChainId(newCustomChain.id);
      setIsSimulating(false);
    }, 600);
  };

  const filteredChains = generatedChains.filter((c) => {
    if (filterMode === 'all') return true;
    return c.category === filterMode;
  });

  return (
    <section id="barter-chains-section" className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40">
      {/* Section Title */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Dynamic Nexus Barter Chain Tool
            </h2>
            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700">
              Circular Barter Engine
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Overcoming the double coincidence of wants. When User A teaches what you want but needs something you don't possess, SkillNexus constructs an autonomous 3-party swap loop.
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto">
          {(['all', 'languages', 'tech', 'music'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors ${
                filterMode === mode
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Suggested Chain Highlights Ribbon */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {filteredChains.slice(0, 3).map((chain) => {
          const isSelected = chain.id === selectedChainId;
          return (
            <button
              key={chain.id}
              onClick={() => setSelectedChainId(chain.id)}
              className={`flex flex-col justify-between rounded-xl border p-3.5 text-left transition-all ${
                isSelected
                  ? 'border-indigo-400 bg-gradient-to-br from-indigo-50/90 to-white shadow-md shadow-indigo-500/10'
                  : 'border-slate-200 bg-slate-50/80 hover:border-slate-300 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="rounded bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 uppercase tracking-wider">
                  {chain.hopsCount + 1}-Party Loop
                </span>
                <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                  <Zap className="h-3 w-3" />
                  {chain.confidenceScore}% Match
                </span>
              </div>

              <div className="my-2">
                <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{chain.title}</h4>
                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-slate-500">
                  <span className="text-cyan-700 font-medium">{chain.sourceSkill}</span>
                  <span className="text-slate-400">➔</span>
                  <span className="text-indigo-700 font-medium">{chain.targetSkill}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200">
                <span>{chain.timeBalanceHours}h Time Balance</span>
                <span className="text-emerald-600 font-semibold">-{chain.savingsDays}d Saved</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Detailed Active Chain Visualizer */}
      {activeChain && (
        <div className="rounded-xl border border-indigo-200/80 bg-gradient-to-b from-indigo-50/40 to-white p-4 sm:p-6 shadow-xs">
          {/* Header & Metrics */}
          <div className="flex flex-col gap-3 pb-5 border-b border-slate-200 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  {activeChain.title}
                </h3>
              </div>
              <p className="mt-1 text-xs sm:text-sm text-slate-600 max-w-2xl">
                {activeChain.description}
              </p>
            </div>

            {/* Quick stats pills */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                <span>1:1 Escrow Parity ({activeChain.timeBalanceHours}h)</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-medium text-cyan-800">
                <Clock className="h-3.5 w-3.5 text-cyan-600" />
                <span>-{activeChain.savingsDays} Days Search Time</span>
              </div>
            </div>
          </div>

          {/* Step-by-step Flow Visualizer */}
          <div className="my-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-4 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-indigo-600" />
              Circular Exchange Steps ({activeChain.steps.length} transfers)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative">
              {activeChain.steps.map((step, idx) => (
                <div
                  key={step.stepNumber}
                  className="relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-xs transition-all hover:border-indigo-300 hover:shadow-md"
                >
                  {/* Step number badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-100 border border-indigo-200 text-xs font-bold text-indigo-700">
                      {step.stepNumber}
                    </span>
                    <span className="text-[11px] font-semibold text-emerald-600">
                      {step.hours} Hours Credit
                    </span>
                  </div>

                  {/* Transfer participant flow */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      {/* From User */}
                      <div className="flex items-center gap-2">
                        <img
                          src={step.fromUser.avatar}
                          alt={step.fromUser.name}
                          className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1">
                            {step.fromUser.name}
                          </div>
                          <span className="text-[10px] text-slate-500">Provider</span>
                        </div>
                      </div>

                      {/* Animated Arrow */}
                      <ChevronRight className="h-4 w-4 text-indigo-500 animate-pulse" />

                      {/* To User */}
                      <div className="flex items-center gap-2 text-right">
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {step.toUser.name}
                          </div>
                          <span className="text-[10px] text-slate-500">Recipient</span>
                        </div>
                        <img
                          src={step.toUser.avatar}
                          alt={step.toUser.name}
                          className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                        />
                      </div>
                    </div>

                    {/* Skill being taught */}
                    <div className="rounded-lg border border-slate-200/80 bg-slate-50 p-2.5">
                      <div className="text-[10px] text-slate-500 uppercase font-semibold">
                        Knowledge Being Transferred
                      </div>
                      <div className="text-xs font-bold text-cyan-800 mt-0.5">
                        {step.teachesSkill}
                      </div>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-500">
                        <span>Format: {step.format}</span>
                        <span className="capitalize text-indigo-600 font-medium">{step.skillCategory}</span>
                      </div>
                    </div>
                  </div>

                  {/* Badges / Trust seal */}
                  <div className="mt-3 pt-2 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-700 font-medium">
                      <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                      Smart Escrow Verified
                    </span>
                    {step.toUser.badge && (
                      <span className="text-amber-700 font-semibold">
                        {step.toUser.badge}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Bar with "Propose Chain" Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200">
            <div className="text-xs text-slate-600 flex items-center gap-2 text-center sm:text-left">
              <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>
                All 3 participants are verified on SkillNexus. Zero currency required; guaranteed time parity release upon mutual review.
              </span>
            </div>

            <button
              id="propose-chain-btn"
              onClick={() => onProposeChain(activeChain)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-cyan-700 active:scale-[0.98] transition-all"
            >
              <Send className="h-4 w-4" />
              <span>Propose Chain to Participants</span>
            </button>
          </div>
        </div>
      )}

      {/* Interactive Custom Chain Generator Simulator */}
      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/80 p-4 sm:p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-cyan-600" />
          <h4 className="text-xs sm:text-sm font-bold text-slate-900">
            Custom Barter Chain Pathfinder Simulator
          </h4>
          <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
            Dijkstra Multi-Hop Knowledge Matcher
          </span>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Test any two arbitrary skills. Our graph pathfinder resolves circular swaps across the entire network in under 200ms.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
          <div className="sm:col-span-4">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Skill You Can Teach:
            </label>
            <select
              value={simTeachSkill}
              onChange={(e) => setSimTeachSkill(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            >
              {availableSkills.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-1 flex items-center justify-center pb-2 text-slate-400">
            <ArrowRightLeft className="h-4 w-4" />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Skill You Want to Unlock:
            </label>
            <select
              value={simLearnSkill}
              onChange={(e) => setSimLearnSkill(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
            >
              {availableSkills.map((s) => (
                <option key={s.id} value={s.name}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              id="simulate-chain-btn"
              onClick={handleSynthesizeCustomChain}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 disabled:opacity-50 transition-all"
            >
              {isSimulating ? (
                <>
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                  <span>Pathfinding...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5 text-cyan-200" />
                  <span>Synthesize Chain</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
