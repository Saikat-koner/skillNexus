import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  ArrowRight,
  Download,
  ExternalLink,
  MessageSquare,
  X
} from 'lucide-react';

interface OrderSuccessModalProps {
  isOpen: boolean;
  orderId: string;
  gigTitle: string;
  creatorName: string;
  amount: number;
  deliveryDays: number;
  onClose: () => void;
  onGoToMessages: () => void;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  isOpen,
  orderId,
  gigTitle,
  creatorName,
  amount,
  deliveryDays,
  onClose,
  onGoToMessages,
  onAddToast,
}) => {
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const handleCopyOrderId = () => {
    navigator.clipboard.writeText(orderId);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
    if (onAddToast) {
      onAddToast('Order ID Copied!', `Tracking ID #${orderId.slice(0, 8)} copied.`, 'info');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration Header */}
        <div className="relative overflow-hidden bg-gradient-to-tr from-emerald-600 via-teal-600 to-indigo-700 px-6 py-8 text-center text-white">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-md shadow-inner mb-3">
            <CheckCircle2 className="h-9 w-9 text-white" />
          </div>
          <h3 className="text-xl sm:text-2xl font-black">Escrow Booking Confirmed!</h3>
          <p className="mt-1 text-xs sm:text-sm text-emerald-100">
            ${amount} USD is securely locked in milestone escrow protection.
          </p>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 rounded-xl p-1.5 text-white/80 hover:bg-white/20 hover:text-white transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Order Details Receipt Box */}
        <div className="p-6 space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-2.5 text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/80">
              <span className="text-slate-500">Order Tracking Reference</span>
              <button
                onClick={handleCopyOrderId}
                className="flex items-center gap-1 font-mono font-bold text-slate-800 hover:text-indigo-600"
              >
                <span>#{orderId.slice(0, 10)}...</span>
                {copiedId ? <Check className="h-3 w-3 text-emerald-600" /> : <Copy className="h-3 w-3 text-slate-400" />}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Gig Service</span>
              <span className="font-bold text-slate-800 truncate max-w-[220px]">{gigTitle}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Creator Specialist</span>
              <span className="font-bold text-slate-800">{creatorName}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Estimated Delivery</span>
              <span className="font-bold text-indigo-600">{deliveryDays} Business Days</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/80">
              <span className="font-bold text-slate-800">Total Escrow Deposited</span>
              <span className="font-extrabold text-slate-900 text-sm">${amount}.00 USD</span>
            </div>
          </div>

          {/* Escrow Guarantee Notice */}
          <div className="flex items-start gap-2.5 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-3.5 text-xs text-emerald-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">100% Milestone Escrow Protected</span>
              <span className="text-emerald-700 text-[11px]">
                The creator will begin work immediately. Your funds are not released until you review and approve the final deliverables.
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2.5">
            <button
              onClick={() => {
                onClose();
                onGoToMessages();
              }}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
            >
              <MessageSquare className="h-4 w-4" />
              <span>Open Creator Chat</span>
            </button>

            <button
              onClick={onClose}
              className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
            >
              View My Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
