import React, { useState } from 'react';
import {
  ShieldAlert,
  Scale,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  FileText,
  User,
  ArrowRight,
  X,
  Sliders,
  Award,
  Zap
} from 'lucide-react';
import { DisputeCase, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';

interface EscrowDisputeArbitratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  disputeCase?: DisputeCase;
  currency: CurrencyCode;
  onResolveDispute?: (caseId: string, clientRefund: number, creatorPayout: number) => void;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

const DEFAULT_DISPUTE: DisputeCase = {
  id: 'disp_901',
  orderId: 'ord_7829',
  gigTitle: '3D Cyberpunk Motion Brand Identity & Figma Design Kit',
  totalEscrowUSD: 180,
  client: {
    name: 'Sarah Chen (Acme Labs)',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    role: 'Client',
    claim: 'Deliverable included 2 of 3 3D renders, but source Figma typography styles were missing.',
  },
  creator: {
    name: 'Alex Rivera (Motion Director)',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    role: 'Creator',
    claim: 'Full Blender source files and 4K MP4 renders were provided. Missing font was proprietary commercial license.',
  },
  issueSummary: 'Disagreement over Phase 2 commercial font licensing and secondary render iteration scope.',
  aiArbitrationBreakdown: {
    clientRefundPercent: 35,
    creatorPayoutPercent: 65,
    rationale: 'Creator completed 85% of complex 3D modeling and rendering labor. Client is owed 35% escrow compensation for missing typography source integration.',
    unlockedDeliverables: [
      'All 4K Master MP4 Motion Renders (Licensed for Commercial Use)',
      'Raw Blender 3D Project Files (.blend)',
      'Escrow split credited instantly with $0 arbitration fees',
    ],
  },
  status: 'deliberating',
};

export const EscrowDisputeArbitratorModal: React.FC<EscrowDisputeArbitratorModalProps> = ({
  isOpen,
  onClose,
  disputeCase = DEFAULT_DISPUTE,
  currency,
  onResolveDispute,
  onAddToast,
}) => {
  const [clientSplit, setClientSplit] = useState(disputeCase.aiArbitrationBreakdown.clientRefundPercent);
  const [isSettling, setIsSettling] = useState(false);
  const [isSettled, setIsSettled] = useState(false);

  if (!isOpen) return null;

  const creatorSplit = 100 - clientSplit;
  const clientAmount = Math.round((disputeCase.totalEscrowUSD * clientSplit) / 100);
  const creatorAmount = disputeCase.totalEscrowUSD - clientAmount;

  const handleApplyAiRecommendation = () => {
    setClientSplit(disputeCase.aiArbitrationBreakdown.clientRefundPercent);
    if (onAddToast) {
      onAddToast('AI Split Applied', 'Reset to mathematically verified equitable ratio.', 'info');
    }
  };

  const handleExecuteSettlement = () => {
    setIsSettling(true);
    setTimeout(() => {
      setIsSettling(false);
      setIsSettled(true);
      if (onResolveDispute) {
        onResolveDispute(disputeCase.id, clientAmount, creatorAmount);
      }
      if (onAddToast) {
        onAddToast(
          'Dispute Settled & Escrow Released!',
          `Refunded ${formatPrice(clientAmount, currency)} to Client & paid ${formatPrice(creatorAmount, currency)} to Creator.`,
          'success'
        );
      }
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative overflow-hidden bg-gradient-to-r from-rose-900 via-purple-950 to-slate-900 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-rose-400 to-amber-500 shadow-md">
                <Scale className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">AI Escrow Dispute Arbitrator</h3>
                  <span className="flex items-center gap-1 rounded-md bg-rose-500/20 border border-rose-400/40 px-2 py-0.5 text-[10px] font-bold text-rose-300">
                    <ShieldAlert className="h-3 w-3" /> Zero-Loss Escrow Protection
                  </span>
                </div>
                <p className="text-xs text-rose-200">
                  Fair, transparent, AI-guided escrow resolution avoiding protracted manual reviews.
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

        {/* Content */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Case Overview Badge */}
          <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Disputed Contract
              </span>
              <span className="font-bold text-slate-900 text-sm">{disputeCase.gigTitle}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Locked Escrow Value
              </span>
              <span className="font-black text-indigo-700 text-base">
                {formatPrice(disputeCase.totalEscrowUSD, currency)}
              </span>
            </div>
          </div>

          {/* Opposing Claims Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {/* Client Statement */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <img
                  src={disputeCase.client.avatar}
                  alt={disputeCase.client.name}
                  className="h-8 w-8 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="font-bold text-slate-900 block truncate">{disputeCase.client.name}</span>
                  <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                    Client Claim
                  </span>
                </div>
              </div>
              <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                "{disputeCase.client.claim}"
              </p>
            </div>

            {/* Creator Statement */}
            <div className="rounded-2xl border border-slate-200 bg-white p-3.5 space-y-2 shadow-2xs">
              <div className="flex items-center gap-2">
                <img
                  src={disputeCase.creator.avatar}
                  alt={disputeCase.creator.name}
                  className="h-8 w-8 rounded-xl object-cover border border-slate-200"
                />
                <div>
                  <span className="font-bold text-slate-900 block truncate">{disputeCase.creator.name}</span>
                  <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                    Creator Response
                  </span>
                </div>
              </div>
              <p className="text-slate-600 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                "{disputeCase.creator.claim}"
              </p>
            </div>
          </div>

          {/* AI Arbitration Analysis Box */}
          <div className="rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                <Sparkles className="h-4 w-4 text-indigo-600" />
                <span>AI Arbitration Rationale (Groq LPU Audit)</span>
              </div>
              <button
                onClick={handleApplyAiRecommendation}
                className="text-[11px] font-bold text-indigo-700 bg-white hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                Reset to AI Split
              </button>
            </div>

            <p className="text-xs text-indigo-950 font-medium leading-relaxed">
              {disputeCase.aiArbitrationBreakdown.rationale}
            </p>

            <div className="space-y-1.5 text-[11px] pt-1">
              <span className="font-bold text-slate-800 block">Unlocked Deliverables Upon Settlement:</span>
              {disputeCase.aiArbitrationBreakdown.unlockedDeliverables.map((item, idx) => (
                <div key={idx} className="flex items-center gap-1.5 text-slate-600">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Split Slider */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800">
              <span>Interactive Escrow Distribution:</span>
              <span className="font-mono text-indigo-600">
                Client {clientSplit}% / Creator {creatorSplit}%
              </span>
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={clientSplit}
              onChange={(e) => setClientSplit(Number(e.target.value))}
              className="w-full accent-indigo-600 cursor-pointer h-2 bg-slate-200 rounded-lg appearance-none"
            />

            {/* Live Visual Payout Bar */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-rose-700 uppercase tracking-wider block">
                  Client Refund ({clientSplit}%)
                </span>
                <span className="text-base font-black text-rose-950 block mt-0.5">
                  {formatPrice(clientAmount, currency)}
                </span>
                <span className="text-[10px] text-slate-500">Credited to wallet</span>
              </div>

              <div className="rounded-2xl border border-emerald-200 bg-emerald-50/60 p-3 shadow-2xs">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                  Creator Payout ({creatorSplit}%)
                </span>
                <span className="text-base font-black text-emerald-950 block mt-0.5">
                  {formatPrice(creatorAmount, currency)}
                </span>
                <span className="text-[10px] text-slate-500">Released to bank</span>
              </div>
            </div>
          </div>

          {/* Settlement Action Button */}
          <div className="pt-2">
            {isSettled ? (
              <div className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-200 p-3.5 text-xs font-bold text-emerald-800">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                <span>Escrow Settlement Complete · Funds Disbursed Instantly</span>
              </div>
            ) : (
              <button
                onClick={handleExecuteSettlement}
                disabled={isSettling}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 py-3 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:opacity-95 active:scale-[0.99] transition-all"
              >
                <span>
                  {isSettling
                    ? 'Disbursing Multi-Party Escrow Funds...'
                    : `Execute Equitable Settlement (${formatPrice(clientAmount, currency)} / ${formatPrice(creatorAmount, currency)})`}
                </span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
