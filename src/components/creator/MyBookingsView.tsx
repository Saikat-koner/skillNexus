import React, { useState } from 'react';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Search,
  DollarSign,
  Calendar,
  MessageSquare,
  Sparkles,
  Info
} from 'lucide-react';
import { BookingItem, BookingStatus, GigCategory, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';

interface MyBookingsViewProps {
  bookings: BookingItem[];
  onFindSimilarCreators: (category: GigCategory) => void;
  onResubmitBooking: (booking: BookingItem) => void;
  onBrowseMarketplace: () => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
  currency?: CurrencyCode;
}

export const MyBookingsView: React.FC<MyBookingsViewProps> = ({
  bookings,
  onFindSimilarCreators,
  onResubmitBooking,
  onBrowseMarketplace,
  onAddToast,
  currency = 'USD',
}) => {
  const [filterStatus, setFilterStatus] = useState<'All' | BookingStatus>('All');
  const [activeDP1Explainer, setActiveDP1Explainer] = useState<string | null>(null);

  const filtered = bookings.filter(
    (b) => filterStatus === 'All' || b.status === filterStatus
  );

  return (
    <div className="space-y-6">
      {/* Top Header & Status Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <h3 className="text-base font-bold text-slate-900">My Client Bookings</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Track real-time status of your hired creator gigs (Pending, Accepted, or Declined).
          </p>
        </div>

        {/* Status Filter Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          {(['All', 'Pending', 'Accepted', 'Declined'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                filterStatus === status
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {status}
              <span className="ml-1.5 text-[10px] opacity-70">
                ({status === 'All' ? bookings.length : bookings.filter((b) => b.status === status).length})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Bookings List */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <Clock className="mx-auto h-8 w-8 text-slate-300 mb-2" />
          <h4 className="text-sm font-bold text-slate-900">No {filterStatus.toLowerCase()} bookings found</h4>
          <p className="text-xs text-slate-500 mt-1">
            Browse the creator marketplace to book young creators.
          </p>
          <button
            onClick={onBrowseMarketplace}
            className="mt-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
          >
            Explore Gigs
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((b) => {
            const isDeclined = b.status === 'Declined';
            const isAccepted = b.status === 'Accepted';
            const isPending = b.status === 'Pending';

            return (
              <div
                key={b.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-xs transition-all ${
                  isDeclined
                    ? 'border-rose-200'
                    : isAccepted
                    ? 'border-emerald-200'
                    : 'border-slate-200'
                }`}
              >
                {/* Booking Header */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-3">
                      <img
                        src={b.creatorAvatar}
                        alt={b.creatorName}
                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-slate-900">{b.creatorName}</h4>
                          <span className="font-mono text-[11px] text-slate-400 font-semibold">{b.id}</span>
                        </div>
                        <span className="text-xs text-slate-500">{b.gigCategory}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                          isAccepted
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isDeclined
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {isAccepted && <CheckCircle2 className="h-3.5 w-3.5" />}
                        {isDeclined && <XCircle className="h-3.5 w-3.5" />}
                        {isPending && <Clock className="h-3.5 w-3.5" />}
                        <span>Status: {b.status}</span>
                      </span>
                    </div>
                  </div>

                  {/* Title & Brief */}
                  <div className="mt-3.5">
                    <h3 className="text-sm sm:text-base font-bold text-slate-900">{b.gigTitle}</h3>
                    <p className="mt-1 text-xs text-slate-600 bg-slate-50/70 p-3 rounded-xl border border-slate-100 leading-relaxed">
                      <strong className="text-slate-700">Project Brief:</strong> {b.projectBrief}
                    </p>
                  </div>

                  {/* Booking Details Bar */}
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        Target: <strong className="text-slate-800">{b.proposedDeadline}</strong>
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                        Agreed Rate: <strong className="text-slate-800">{formatPrice(b.rate, currency)}</strong>
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">Requested: {b.submittedAt}</span>
                  </div>
                </div>

                {/* DP1 SPECIFIC WORKFLOW: WHAT CLIENT SEES & CAN DO AFTER REJECTION */}
                {isDeclined && (
                  <div className="border-t border-rose-200 bg-rose-50/40 p-4 sm:p-5 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2.5">
                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700 font-bold text-xs">
                          DP1
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-rose-900">
                              Creator Decision: {b.declineReason || 'Schedule Conflict'}
                            </span>
                            <span className="rounded bg-rose-100/80 px-2 py-0.5 text-[10px] font-bold text-rose-800">
                              $0 Charged (Guaranteed Hold Release)
                            </span>
                          </div>
                          {b.declineNote && (
                            <p className="mt-1 text-xs text-rose-800 leading-relaxed italic bg-white/60 p-2 rounded-lg border border-rose-200/50">
                              "{b.declineNote}"
                            </p>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => setActiveDP1Explainer(activeDP1Explainer === b.id ? null : b.id)}
                        className="rounded-lg p-1 text-rose-500 hover:bg-rose-100 transition-colors shrink-0"
                        title="View DP1 Architecture Rationale"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                    </div>

                    {/* DP1 Interactive Resolution Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <button
                        onClick={() => onFindSimilarCreators(b.gigCategory)}
                        className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98]"
                      >
                        <Search className="h-3.5 w-3.5" />
                        <span>Find Similar Available Creators in {b.gigCategory}</span>
                      </button>

                      <button
                        onClick={() => {
                          onResubmitBooking(b);
                          onAddToast(
                            'Resubmission Initiated',
                            'Please adjust your target deadline or brief to fit creator schedule.',
                            'info'
                          );
                        }}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-300 bg-white hover:bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-800 transition-all"
                      >
                        <RefreshCw className="h-3.5 w-3.5" />
                        <span>Resubmit with Extended Deadline</span>
                      </button>
                    </div>

                    {/* DP1 Architecture Rationale Card */}
                    {activeDP1Explainer === b.id && (
                      <div className="rounded-xl border border-rose-200 bg-white p-3.5 text-xs text-slate-700 space-y-1.5 mt-2 animate-in fade-in duration-150">
                        <span className="font-bold text-slate-900 block">
                          DP1 Decision Point Architecture: What can client see and do?
                        </span>
                        <p className="text-slate-600">
                          <strong>What they see:</strong> Transparent creator reasoning without awkward ghosting + immediate notice that zero payment was captured.
                        </p>
                        <p className="text-slate-600">
                          <strong>What they can do:</strong> Instantly pivot without friction. 1-click query to equivalent creators in the exact same domain, or adjusting scope constraints.
                        </p>
                        <p className="text-slate-600">
                          <strong>Why:</strong> Prevents young creators from feeling trapped in burnout jobs while preventing client churn. Preserves a 84% conversion retention.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* ACCEPTED BOOKING NEXT STEPS */}
                {isAccepted && (
                  <div className="border-t border-emerald-200 bg-emerald-50/40 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-emerald-900">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 shrink-0" />
                      <span>
                        Creator confirmed scope! Work in progress. Deliverable due by{' '}
                        <strong>{b.proposedDeadline}</strong>.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-[11px] font-bold text-emerald-800">
                        Protected Escrow
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
