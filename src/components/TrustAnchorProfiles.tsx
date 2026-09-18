import React, { useState } from 'react';
import {
  ShieldCheck,
  Star,
  Clock,
  Award,
  Zap,
  CheckCircle,
  MessageSquare,
  ArrowRight,
  ExternalLink,
  Users,
  Flame
} from 'lucide-react';
import { TrustAnchor, TrustBadgeType } from '../types';

interface TrustAnchorProps {
  anchors: TrustAnchor[];
  onRequestSwap: (anchor: TrustAnchor) => void;
  onFilterBySkill: (skillName: string) => void;
}

export const TrustAnchorProfiles: React.FC<TrustAnchorProps> = ({
  anchors,
  onRequestSwap,
  onFilterBySkill,
}) => {
  const [selectedBadgeFilter, setSelectedBadgeFilter] = useState<string>('all');
  const [inspectedAnchor, setInspectedAnchor] = useState<TrustAnchor | null>(null);

  const getBadgeStyle = (badge: TrustBadgeType) => {
    switch (badge) {
      case 'Community Vetted':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-800',
          icon: ShieldCheck,
        };
      case 'Quick Responder':
        return {
          bg: 'bg-cyan-50 border-cyan-200 text-cyan-800',
          icon: Zap,
        };
      case 'Master Instructor':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-800',
          icon: Award,
        };
      case 'Sprint Lead':
        return {
          bg: 'bg-purple-50 border-purple-200 text-purple-800',
          icon: Flame,
        };
      default:
        return {
          bg: 'bg-indigo-50 border-indigo-200 text-indigo-800',
          icon: CheckCircle,
        };
    }
  };

  const getGlowRingClass = (color: string) => {
    switch (color) {
      case 'emerald':
        return 'ring-2 ring-emerald-500 shadow-sm';
      case 'cyan':
        return 'ring-2 ring-cyan-500 shadow-sm';
      case 'amber':
        return 'ring-2 ring-amber-500 shadow-sm';
      case 'purple':
        return 'ring-2 ring-purple-500 shadow-sm';
      default:
        return 'ring-2 ring-indigo-500 shadow-sm';
    }
  };

  const filteredAnchors = anchors.filter((a) => {
    if (selectedBadgeFilter === 'all') return true;
    return a.badges.includes(selectedBadgeFilter as TrustBadgeType);
  });

  return (
    <section id="trust-anchors-section" className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Community "Trust Anchor" Profiles
            </h2>
            <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-semibold text-amber-800">
              Proof of Knowledge
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Trust Anchors serve as liquidity providers. Their accumulated completed barter hours and peer reviews power autonomous multi-party trade routing.
          </p>
        </div>

        {/* Badge Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setSelectedBadgeFilter('all')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBadgeFilter === 'all'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            All Anchors
          </button>
          <button
            onClick={() => setSelectedBadgeFilter('Master Instructor')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBadgeFilter === 'Master Instructor'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Master Instructors
          </button>
          <button
            onClick={() => setSelectedBadgeFilter('Community Vetted')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBadgeFilter === 'Community Vetted'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Community Vetted
          </button>
          <button
            onClick={() => setSelectedBadgeFilter('Quick Responder')}
            className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-colors ${
              selectedBadgeFilter === 'Quick Responder'
                ? 'bg-cyan-600 text-white shadow-xs'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Quick Responders
          </button>
        </div>
      </div>

      {/* Grid of Anchors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredAnchors.map((anchor) => {
          return (
            <div
              key={anchor.id}
              className="group relative flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-md"
            >
              <div>
                {/* Profile Top Row with Glowing Verification Ring */}
                <div className="flex items-start gap-4">
                  {/* Avatar with Glowing Verification Ring */}
                  <div className="relative shrink-0">
                    <img
                      src={anchor.avatar}
                      alt={anchor.name}
                      className={`h-16 w-16 rounded-full object-cover transition-transform duration-300 group-hover:scale-105 ${getGlowRingClass(
                        anchor.glowColor
                      )}`}
                    />
                    <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-white border border-slate-200 shadow-xs">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    </div>
                  </div>

                  {/* Identity & Stats */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 truncate">
                        {anchor.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs font-bold text-amber-600 shrink-0">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-500" />
                        <span>{anchor.rating.toFixed(2)}</span>
                        <span className="text-[10px] text-slate-500 font-normal">
                          ({anchor.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>{anchor.handle}</span>
                      <span>•</span>
                      <span>{anchor.location}</span>
                    </div>

                    {/* Swap metrics counter */}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-emerald-700">
                        <Clock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{anchor.completedHours}h Swapped</span>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Zap className="h-3 w-3 text-cyan-600" />
                        <span>Resp: {anchor.responseTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Badges Bar */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                  {anchor.badges.map((badge) => {
                    const style = getBadgeStyle(badge);
                    const Icon = style.icon;
                    return (
                      <span
                        key={badge}
                        className={`flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${style.bg}`}
                      >
                        <Icon className="h-3 w-3" />
                        <span>{badge}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Bio */}
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {anchor.bio}
                </p>

                {/* Teach vs Want Skills */}
                <div className="mt-4 space-y-2 rounded-lg border border-slate-200/80 bg-slate-50/70 p-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                      Teaches:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {anchor.teachSkills.map((s) => (
                        <button
                          key={s.name}
                          onClick={() => onFilterBySkill(s.name)}
                          className="rounded border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
                        >
                          {s.name} • <span className="opacity-75">{s.tier}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-700">
                      Seeking in Exchange:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {anchor.wantSkills.map((s) => (
                        <button
                          key={s.name}
                          onClick={() => onFilterBySkill(s.name)}
                          className="rounded border border-cyan-200 bg-cyan-50 px-2 py-0.5 text-[11px] font-medium text-cyan-800 hover:bg-cyan-100 transition-colors shadow-2xs"
                        >
                          {s.name} • <span className="opacity-75">{s.tier}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Peer Review Quote */}
                <div className="mt-3 rounded-lg border border-slate-200 bg-white p-2.5 text-[11px] text-slate-700 shadow-2xs">
                  <div className="flex items-center gap-1 text-amber-700 font-semibold mb-1">
                    <MessageSquare className="h-3 w-3 text-amber-600" />
                    <span>Review from {anchor.recentReview.author} ({anchor.recentReview.swapSkill}):</span>
                  </div>
                  <p className="italic text-slate-500">
                    "{anchor.recentReview.text}"
                  </p>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                <button
                  id={`request-swap-${anchor.id}`}
                  onClick={() => onRequestSwap(anchor)}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                  <span>Request Direct Swap</span>
                </button>

                <button
                  onClick={() => setInspectedAnchor(anchor)}
                  className="rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors shadow-2xs"
                >
                  Reputation Ledger
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Reputation Ledger Modal */}
      {inspectedAnchor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <img
                  src={inspectedAnchor.avatar}
                  alt={inspectedAnchor.name}
                  className={`h-12 w-12 rounded-full object-cover ${getGlowRingClass(
                    inspectedAnchor.glowColor
                  )}`}
                />
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {inspectedAnchor.name}'s Reputation Ledger
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified on SkillNexus since {inspectedAnchor.verifiedSince}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setInspectedAnchor(null)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-3">
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-lg font-bold text-emerald-700">{inspectedAnchor.completedHours}h</div>
                  <div className="text-[10px] text-slate-500">Total Swapped</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-lg font-bold text-amber-600">{inspectedAnchor.rating.toFixed(2)} ★</div>
                  <div className="text-[10px] text-slate-500">Peer Score</div>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                  <div className="text-lg font-bold text-cyan-700">100%</div>
                  <div className="text-[10px] text-slate-500">Fulfillment</div>
                </div>
              </div>

              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs space-y-2">
                <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  Proof-of-Knowledge Cryptographic Hash
                </div>
                <div className="font-mono text-[10px] text-slate-600 break-all bg-white border border-slate-200 p-2 rounded">
                  0x7f8a92b4c10e3952d7bb892c90fa18392ef893a71b...
                </div>
                <p className="text-slate-500 text-[11px]">
                  All swap hours are attested by mutual multi-signature peer sign-off upon session conclusion.
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 flex justify-end">
              <button
                onClick={() => setInspectedAnchor(null)}
                className="rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-semibold text-white transition-colors"
              >
                Close Ledger
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
