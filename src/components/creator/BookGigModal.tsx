import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  Calendar,
  DollarSign,
  Clock,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';
import { GigItem, BookingItem, DoubleBookingPolicy } from '../../types';

interface BookGigModalProps {
  gig: GigItem | null;
  isOpen: boolean;
  onClose: () => void;
  doubleBookingPolicy: DoubleBookingPolicy;
  onConfirmBooking: (newBooking: BookingItem) => void;
  onViewMyBookings: () => void;
}

export const BookGigModal: React.FC<BookGigModalProps> = ({
  gig,
  isOpen,
  onClose,
  doubleBookingPolicy,
  onConfirmBooking,
  onViewMyBookings,
}) => {
  if (!isOpen || !gig) return null;

  // Form states
  const [clientName, setClientName] = useState('Maya Lin');
  const [clientEmail, setClientEmail] = useState('maya@digitalcreators.co');
  const [projectBrief, setProjectBrief] = useState('');
  const [proposedDeadline, setProposedDeadline] = useState(
    new Date(Date.now() + gig.deliveryDays * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [specialInstructions, setSpecialInstructions] = useState('');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<BookingItem | null>(null);

  const isStrictLocked = doubleBookingPolicy === 'strict_lockout' && gig.pendingBookingsCount > 0;

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStrictLocked) return;
    if (!clientName.trim() || !projectBrief.trim()) return;

    const newBooking: BookingItem = {
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      gigId: gig.id,
      gigTitle: gig.title,
      gigCategory: gig.category,
      creatorId: gig.creatorId,
      creatorName: gig.creatorName,
      creatorAvatar: gig.creatorAvatar,
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim(),
      projectBrief: projectBrief.trim() + (specialInstructions ? ` (Notes: ${specialInstructions})` : ''),
      proposedDeadline,
      rate: gig.rate,
      rateType: gig.rateType,
      status: 'Pending',
      submittedAt: 'Just now',
    };

    onConfirmBooking(newBooking);
    setConfirmedBooking(newBooking);
  };

  const handleDone = () => {
    setConfirmedBooking(null);
    onClose();
  };

  const handleJumpToMyBookings = () => {
    setConfirmedBooking(null);
    onClose();
    onViewMyBookings();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={gig.creatorAvatar}
              alt={gig.creatorName}
              className="h-10 w-10 rounded-full border border-indigo-200 object-cover"
            />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                {confirmedBooking ? 'Booking Confirmed!' : `Book ${gig.creatorName}`}
              </h3>
              <p className="text-xs text-slate-500 truncate max-w-xs">{gig.title}</p>
            </div>
          </div>
          <button
            onClick={handleDone}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Confirmation Screen */}
        {confirmedBooking ? (
          <div className="flex-1 overflow-y-auto px-6 py-8 text-center space-y-5 animate-in zoom-in-95 duration-200">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm">
              <CheckCircle2 className="h-8 w-8" />
            </div>

            <div>
              <span className="rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-bold text-amber-800">
                Status: Pending Creator Review
              </span>
              <h4 className="mt-3 text-lg font-extrabold text-slate-900">
                Request Dispatched to {gig.creatorName}
              </h4>
              <p className="mt-1 text-xs text-slate-500 max-w-md mx-auto">
                Your project brief has been placed into the creator's inquiry queue. You will see their decision (Accept or Decline) in your bookings tracker.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 text-left space-y-2.5 max-w-md mx-auto text-xs">
              <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                <span className="text-slate-500">Booking Reference:</span>
                <span className="font-mono font-bold text-indigo-600">{confirmedBooking.id}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Agreed Rate:</span>
                <span className="font-bold text-slate-900">
                  ${confirmedBooking.rate} {confirmedBooking.rateType === 'hourly' ? '/ hr' : 'Fixed'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Target Delivery:</span>
                <span className="font-semibold text-slate-800">{confirmedBooking.proposedDeadline}</span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-emerald-700 font-semibold">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Client Protection:
                </span>
                <span>$0 Charged until Creator Accepts</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDone}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Close & Browse More Gigs
              </button>
              <button
                onClick={handleJumpToMyBookings}
                className="flex items-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
              >
                <span>Go to My Bookings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmitBooking} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* DP2 Notice Banner if Double Booking Policy Active */}
            {gig.pendingBookingsCount > 0 && (
              <div
                className={`rounded-xl border p-3 text-xs flex items-start gap-2.5 ${
                  isStrictLocked
                    ? 'border-red-200 bg-red-50 text-red-800'
                    : 'border-amber-200 bg-amber-50 text-amber-900'
                }`}
              >
                <Info className="h-4 w-4 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold">
                    {isStrictLocked
                      ? 'Strict Lockout Active (DP2 Policy)'
                      : `Concurrent Queue Active (DP2 Policy: ${gig.pendingBookingsCount} Pending Inquiry)`}
                  </div>
                  <p className="mt-0.5 text-[11px] opacity-90">
                    {isStrictLocked
                      ? 'This creator is currently reviewing an active booking and new submissions are paused until they resolve their queue.'
                      : 'You can still submit your brief! The creator reviews requests flexibly and will accept if bandwidth permits.'}
                  </p>
                </div>
              </div>
            )}

            {/* Rate & Turnaround Summary Bar */}
            <div className="flex items-center justify-between rounded-xl bg-indigo-50/70 border border-indigo-100 p-3 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Service Fee</span>
                <div className="text-base font-extrabold text-indigo-950">
                  ${gig.rate} <span className="text-xs font-normal text-indigo-700">/{gig.rateType}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-indigo-600 tracking-wider">Est. Delivery</span>
                <div className="text-xs font-bold text-indigo-950 flex items-center gap-1 justify-end">
                  <Clock className="h-3 w-3 text-indigo-600" />
                  <span>{gig.deliveryDays} Days</span>
                </div>
              </div>
            </div>

            {/* Client Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Client / Brand Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Project Brief */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Brief & Deliverable Requirements <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={3}
                placeholder="Describe your vision, raw footage/links, design style preferences, and exact expected deliverables."
                value={projectBrief}
                onChange={(e) => setProjectBrief(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
                required
              />
            </div>

            {/* Proposed Deadline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Preferred Delivery Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={proposedDeadline}
                    onChange={(e) => setProposedDeadline(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Reference Links or Assets
                </label>
                <input
                  type="text"
                  placeholder="Google Drive, Figma, or Dropbox link"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
                />
              </div>
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-[11px] text-slate-500">
                Funds held securely. Zero fees if declined.
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDone}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isStrictLocked}
                  className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-cyan-700 disabled:opacity-50 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{isStrictLocked ? 'Creator Busy' : `Confirm Booking ($${gig.rate})`}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
