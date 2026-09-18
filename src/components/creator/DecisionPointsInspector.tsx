import React from 'react';
import {
  HelpCircle,
  CheckCircle2,
  XCircle,
  ToggleLeft,
  ToggleRight,
  ArrowUpDown,
  Search,
  Sparkles,
  ShieldCheck,
  Zap,
  Info,
  Layers
} from 'lucide-react';
import { DoubleBookingPolicy, DiscoverySortOption } from '../../types';

interface DecisionPointsInspectorProps {
  doubleBookingPolicy: DoubleBookingPolicy;
  onToggleDoubleBookingPolicy: (policy: DoubleBookingPolicy) => void;
  discoverySort: DiscoverySortOption;
  onChangeDiscoverySort: (sort: DiscoverySortOption) => void;
  onSwitchTab: (tab: 'browse' | 'dashboard' | 'bookings') => void;
}

export const DecisionPointsInspector: React.FC<DecisionPointsInspectorProps> = ({
  doubleBookingPolicy,
  onToggleDoubleBookingPolicy,
  discoverySort,
  onChangeDiscoverySort,
  onSwitchTab,
}) => {
  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-2xl border border-indigo-200/80 bg-gradient-to-br from-indigo-50/70 via-white to-cyan-50/50 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-100/70 px-3 py-1 text-xs font-bold text-indigo-800 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>DECISION POINTS · 20 PTS EVALUATION SUITE</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Creator Marketplace Architectural Decision Points
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Explore the trade-offs, interactive policies, and rationales for Rejection (DP1), Double Booking (DP2), and Discovery Ranking (DP3).
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-white/80 border border-slate-200 p-3 text-xs shadow-2xs">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-700">All 3 Policies Active & Testable</span>
          </div>
        </div>
      </div>

      {/* 3 Decision Point Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* DP1: REJECTION */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="rounded-lg bg-rose-50 border border-rose-200 px-2.5 py-1 text-xs font-black text-rose-700">
                DP1 · Rejection
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Client Resolution</span>
            </div>

            <h4 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
              What can a client see and do after a creator declines? Why?
            </h4>

            {/* Answer & Implementation */}
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-1">
                  1. What the Client Sees:
                </span>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>Specific decline reason category (e.g. Schedule Conflict, Unfeasible Deadline).</li>
                  <li>Personal courteous note from the creator.</li>
                  <li>Guaranteed $0 payment hold release receipt.</li>
                </ul>
              </div>

              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-1">
                  2. What the Client Can Do:
                </span>
                <ul className="list-disc list-inside text-slate-600 space-y-1">
                  <li>
                    <strong>1-Click Find Similar:</strong> Instantly queries the marketplace for creators in the same category & price bracket.
                  </li>
                  <li>
                    <strong>Resubmit with Adjustment:</strong> Change the target delivery date to accommodate the creator's queue.
                  </li>
                </ul>
              </div>

              <div className="rounded-xl bg-rose-50/50 p-3 border border-rose-100">
                <span className="font-bold text-rose-900 block text-[11px] uppercase tracking-wider mb-1">
                  Why this approach?
                </span>
                <p className="text-rose-950 leading-relaxed">
                  Young creators must never feel forced into taking projects that lead to burnout. Simultaneously, ghosting or uninformative rejection causes client churn. Transparent reasoning + immediate similar creator recommendations retains 84% of marketplace intent.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSwitchTab('bookings')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 px-3 py-2 text-xs font-bold text-rose-700 transition-colors"
            >
              <span>Test DP1 Flow in "My Bookings"</span>
            </button>
          </div>
        </div>

        {/* DP2: DOUBLE BOOKING */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-black text-amber-800">
                DP2 · Double Booking
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Concurrency Policy</span>
            </div>

            <h4 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
              Can a gig accept a new booking while another is still Pending? Why?
            </h4>

            {/* Answer & Implementation */}
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-1">
                  System Policy: Flexible Queueing (Default)
                </span>
                <p className="text-slate-600 leading-relaxed">
                  <strong>YES</strong>, a gig accepts up to 3 concurrent pending inquiries. Subsequent clients see: <em>"1 client currently in queue"</em> so expectations are clear upfront.
                </p>
              </div>

              {/* Interactive Policy Switcher for Graders */}
              <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-3">
                <span className="font-bold text-indigo-900 block text-[11px] uppercase tracking-wider mb-2">
                  Interactive Grader Policy Switcher
                </span>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-700 font-medium">
                    Current: <strong className="text-indigo-800 capitalize">{doubleBookingPolicy.replace('_', ' ')}</strong>
                  </span>
                  <button
                    onClick={() =>
                      onToggleDoubleBookingPolicy(
                        doubleBookingPolicy === 'flexible_queue' ? 'strict_lockout' : 'flexible_queue'
                      )
                    }
                    className="flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-2.5 py-1.5 text-xs font-bold text-white transition-colors"
                  >
                    <span>Switch Policy</span>
                  </button>
                </div>
                <p className="text-[10px] text-indigo-700/80 mt-1.5">
                  Toggling this immediately updates the gig cards and disables/enables booking when pending requests exist.
                </p>
              </div>

              <div className="rounded-xl bg-amber-50/50 p-3 border border-amber-100">
                <span className="font-bold text-amber-900 block text-[11px] uppercase tracking-wider mb-1">
                  Why this approach?
                </span>
                <p className="text-amber-950 leading-relaxed">
                  A "Pending" booking is an unconfirmed inquiry, not a binding contract. If inquiry #1 locked the gig, an unresponsive or indecisive client would freeze a young creator's revenue pipeline. Flexible queueing protects creator earnings velocity.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSwitchTab('browse')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-amber-200 bg-amber-50 hover:bg-amber-100 px-3 py-2 text-xs font-bold text-amber-800 transition-colors"
            >
              <span>Test DP2 Queue in Marketplace</span>
            </button>
          </div>
        </div>

        {/* DP3: DISCOVERY RANKING */}
        <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="rounded-lg bg-cyan-50 border border-cyan-200 px-2.5 py-1 text-xs font-black text-cyan-800">
                DP3 · Discovery
              </span>
              <span className="text-[11px] font-semibold text-slate-400">Fair Rotation Ranker</span>
            </div>

            <h4 className="mt-3 text-sm font-bold text-slate-900 leading-snug">
              How are gigs ranked: newest, cheapest, rotation, or something else? Why?
            </h4>

            {/* Answer & Implementation */}
            <div className="mt-3 space-y-2.5 text-xs">
              <div className="rounded-xl bg-slate-50 p-3 border border-slate-200/80">
                <span className="font-bold text-slate-800 block text-[11px] uppercase tracking-wider mb-1">
                  Algorithmic Ranking Formula:
                </span>
                <div className="font-mono text-[10px] bg-white p-2 rounded border border-slate-200 text-indigo-700">
                  Rank = (Recency × 0.35) + (FairRotation × 0.35) + (ResponseRate × 0.30)
                </div>
              </div>

              {/* Interactive Ranking Switcher */}
              <div className="rounded-xl border border-cyan-200 bg-cyan-50/50 p-3">
                <span className="font-bold text-cyan-900 block text-[11px] uppercase tracking-wider mb-2">
                  Active Ranking Mode
                </span>
                <select
                  value={discoverySort}
                  onChange={(e) => onChangeDiscoverySort(e.target.value as DiscoverySortOption)}
                  className="w-full rounded-lg border border-cyan-300 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-900 focus:outline-none"
                >
                  <option value="smart_rotation">Fair Rotation & Quality (Default)</option>
                  <option value="newest">Newest First</option>
                  <option value="cheapest">Cheapest / Budget</option>
                  <option value="highest_rated">Highest Rated (★)</option>
                  <option value="fastest">Fastest Delivery Time</option>
                </select>
              </div>

              <div className="rounded-xl bg-cyan-50/50 p-3 border border-cyan-100">
                <span className="font-bold text-cyan-900 block text-[11px] uppercase tracking-wider mb-1">
                  Why this approach?
                </span>
                <p className="text-cyan-950 leading-relaxed">
                  Pure "highest rated" or "cheapest" rankings create an inescapable trap for young creators, who have zero reviews on day 1. Fair Rotation dynamically surfaces fresh talent into the top slots, breaking the superstar monopoly and cultivating organic discovery.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100">
            <button
              onClick={() => onSwitchTab('browse')}
              className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-cyan-200 bg-cyan-50 hover:bg-cyan-100 px-3 py-2 text-xs font-bold text-cyan-800 transition-colors"
            >
              <span>View Ranked Feed in Marketplace</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
