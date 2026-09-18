import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Clock,
  DollarSign,
  AlertTriangle,
  FileText,
  Calendar,
  User,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { BookingItem, GigItem, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';

interface CreatorDashboardViewProps {
  bookings: BookingItem[];
  myGigs: GigItem[];
  onAcceptBooking: (bookingId: string) => void;
  onDeclineBooking: (bookingId: string, reason: string, note: string) => void;
  onOpenPostModal: () => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
  currency?: CurrencyCode;
}

export const CreatorDashboardView: React.FC<CreatorDashboardViewProps> = ({
  bookings,
  myGigs,
  onAcceptBooking,
  onDeclineBooking,
  onOpenPostModal,
  onAddToast,
  currency = 'USD',
}) => {
  // Decline modal state (Direct DP1 integration)
  const [decliningBooking, setDecliningBooking] = useState<BookingItem | null>(null);
  const [declineReason, setDeclineReason] = useState('Schedule Conflict');
  const [declineNote, setDeclineNote] = useState('');

  // Dashboard metrics
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;
  const acceptedBookings = bookings.filter((b) => b.status === 'Accepted');
  const totalEarned = acceptedBookings.reduce((sum, b) => sum + b.rate, 0);
  const totalDecided = bookings.filter((b) => b.status !== 'Pending').length;
  const acceptanceRate = totalDecided > 0 ? ((acceptedBookings.length / totalDecided) * 100).toFixed(0) : '100';

  const handleOpenDecline = (b: BookingItem) => {
    setDecliningBooking(b);
    setDeclineReason('Schedule Conflict');
    setDeclineNote(`Hi ${b.clientName}, thanks for reaching out! My project schedule is currently at full capacity for this week.`);
  };

  const handleConfirmDecline = (e: React.FormEvent) => {
    e.preventDefault();
    if (!decliningBooking) return;

    onDeclineBooking(decliningBooking.id, declineReason, declineNote);
    onAddToast(
      'Booking Inquiry Declined',
      `Polite rejection notification sent to ${decliningBooking.clientName}. $0 charged to client.`,
      'info'
    );
    setDecliningBooking(null);
  };

  return (
    <div className="space-y-8">
      {/* Top Metrics Banner */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Pending Inquiries</span>
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-amber-50 text-amber-600 font-bold">
              {pendingCount}
            </span>
          </div>
          <div className="mt-2 text-2xl font-black text-amber-700">{pendingCount}</div>
          <p className="mt-1 text-[11px] text-slate-500">Action needed from creator</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Accepted Bookings</span>
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-emerald-700">{acceptedBookings.length}</div>
          <p className="mt-1 text-[11px] text-slate-500">In production or delivered</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Total Earnings</span>
            <DollarSign className="h-4 w-4 text-indigo-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-indigo-700">{formatPrice(totalEarned, currency)}</div>
          <p className="mt-1 text-[11px] text-slate-500">0% platform commission retained</p>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Acceptance Rate</span>
            <TrendingUp className="h-4 w-4 text-cyan-600" />
          </div>
          <div className="mt-2 text-2xl font-black text-slate-900">{acceptanceRate}%</div>
          <p className="mt-1 text-[11px] text-emerald-600 font-medium">Healthy creator response</p>
        </div>
      </div>

      {/* Section 1: Incoming Bookings (Pending Actions) */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Incoming Client Inquiries</h3>
              {pendingCount > 0 && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                  {pendingCount} Awaiting Decision
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Review project briefs and decide to Accept or Decline each request.
            </p>
          </div>

          <div className="text-xs text-slate-500">
            Simulated Creator Account: <span className="font-bold text-slate-800">Leo Chen (@leocuts)</span>
          </div>
        </div>

        {pendingCount === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500">
            <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500 mb-2" />
            <p className="font-semibold text-slate-800">All inquiries resolved!</p>
            <p className="mt-1">No pending client requests waiting for review.</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            {bookings
              .filter((b) => b.status === 'Pending')
              .map((b) => (
                <div
                  key={b.id}
                  className="rounded-xl border border-amber-200/90 bg-amber-50/20 p-4 sm:p-5 transition-all hover:bg-amber-50/40"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded">
                          {b.id}
                        </span>
                        <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700">
                          {b.gigCategory}
                        </span>
                        <span className="text-xs text-slate-400">• Submitted {b.submittedAt}</span>
                      </div>

                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{b.gigTitle}</h4>

                      {/* Client Brief */}
                      <div className="rounded-lg bg-white border border-slate-200 p-3 text-xs text-slate-700">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5 mb-1">
                          <User className="h-3.5 w-3.5 text-indigo-600" />
                          <span>Client: {b.clientName}</span>
                          <span className="text-slate-400 font-normal">({b.clientEmail})</span>
                        </div>
                        <p className="leading-relaxed text-slate-600">{b.projectBrief}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-slate-400" />
                          <span>Requested Deadline: <strong className="text-slate-800">{b.proposedDeadline}</strong></span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
                          <span>Payout: <strong className="text-emerald-700 font-bold">{formatPrice(b.rate, currency)}</strong></span>
                        </div>
                      </div>
                    </div>

                    {/* Creator Accept / Decline Actions */}
                    <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 pt-2 sm:pt-0">
                      <button
                        id={`accept-booking-btn-${b.id}`}
                        onClick={() => {
                          onAcceptBooking(b.id);
                          onAddToast(
                            'Booking Accepted!',
                            `You accepted ${b.clientName}'s booking. Revenue locked in escrow.`,
                            'success'
                          );
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98] w-full justify-center"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Accept Booking</span>
                      </button>

                      <button
                        id={`decline-booking-btn-${b.id}`}
                        onClick={() => handleOpenDecline(b)}
                        className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700 transition-all active:scale-[0.98] w-full justify-center"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        <span>Decline Inquiry</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Section 2: Active & Resolved Bookings History */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-bold text-slate-900 mb-4">Bookings Activity History</h3>

        <div className="divide-y divide-slate-100">
          {bookings.map((b) => (
            <div key={b.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-700">{b.id}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                      b.status === 'Accepted'
                        ? 'bg-emerald-100 text-emerald-800'
                        : b.status === 'Declined'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {b.status}
                  </span>
                  <span className="text-xs font-bold text-slate-800">{b.clientName}</span>
                </div>
                <p className="text-xs text-slate-500 truncate max-w-lg mt-0.5">{b.gigTitle}</p>
                {b.declineReason && (
                  <p className="text-[11px] text-rose-600 mt-1">
                    Declined reason: <span className="font-semibold">{b.declineReason}</span>
                  </p>
                )}
              </div>

              <div className="text-right text-xs">
                <span className="font-bold text-slate-900">{formatPrice(b.rate, currency)}</span>
                <span className="text-[11px] text-slate-400 block">{b.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Decline Reason Modal (DP1 Integration) */}
      {decliningBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <XCircle className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">Decline Client Inquiry</h4>
                <p className="text-xs text-slate-500">
                  Providing a polite explanation preserves client trust and enables DP1 resolution.
                </p>
              </div>
            </div>

            <form onSubmit={handleConfirmDecline} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reason for Declining
                </label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 bg-white"
                >
                  <option value="Schedule Conflict">Schedule Conflict / Fully Booked</option>
                  <option value="Turnaround Time Conflict">Turnaround Deadline Unfeasible</option>
                  <option value="Scope Outside Expertise">Scope Outside Technical / Creative Expertise</option>
                  <option value="Asset Specifications Missing">Incomplete Asset Specs or Unclear Requirements</option>
                  <option value="Other Scope Discrepancy">Other Scope Discrepancy</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Personal Note to Client
                </label>
                <textarea
                  rows={3}
                  value={declineNote}
                  onChange={(e) => setDeclineNote(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3 py-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">DP1 Marketplace Guarantee:</span>
                <p>
                  • Client will see your reason and personal note with zero penalty.
                </p>
                <p>
                  • Client will automatically receive 1-click recommendations for similar available creators.
                </p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDecliningBooking(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-rose-600 hover:bg-rose-700 px-4 py-2 text-xs font-bold text-white shadow-sm"
                >
                  Confirm Decline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
