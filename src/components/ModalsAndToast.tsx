import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Users,
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';
import { BarterChain, TrustAnchor } from '../types';

interface ProposeChainModalProps {
  chain: BarterChain | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmProposal: (chainId: string, message: string) => void;
}

export const ProposeChainModal: React.FC<ProposeChainModalProps> = ({
  chain,
  isOpen,
  onClose,
  onConfirmProposal,
}) => {
  const [proposalNote, setProposalNote] = useState(
    'Hi everyone! Excited to initiate this circular barter loop. My schedule is flexible for 2 sessions a week.'
  );
  const [preferredDays, setPreferredDays] = useState(['Tue', 'Thu', 'Sat']);

  if (!isOpen || !chain) return null;

  const toggleDay = (day: string) => {
    setPreferredDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSend = () => {
    onConfirmProposal(chain.id, proposalNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-emerald-50 border border-emerald-200 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                {chain.confidenceScore}% Algorithm Confidence
              </span>
              <span className="text-xs text-slate-500">
                {chain.hopsCount + 1}-Party Circular Escrow
              </span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 mt-1">
              Propose Nexus Barter Chain
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          {/* Visual Exchange Chain recap */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Proposed Knowledge Flow
            </h4>
            <div className="space-y-2 text-xs">
              {chain.steps.map((step) => (
                <div
                  key={step.stepNumber}
                  className="flex items-center justify-between border-b border-slate-200 pb-1.5 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-indigo-600">Step {step.stepNumber}:</span>
                    <span className="text-slate-700 font-medium">{step.fromUser.name}</span>
                    <span className="text-slate-400">➔</span>
                    <span className="text-slate-700 font-medium">{step.toUser.name}</span>
                  </div>
                  <span className="font-semibold text-cyan-800">{step.teachesSkill} ({step.hours}h)</span>
                </div>
              ))}
            </div>
          </div>

          {/* Time credit parity badge */}
          <div className="flex items-center gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
            <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold text-emerald-950">Automated Time-Credit Parity Guarantee:</span>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                Each participant contributes exactly {chain.timeBalanceHours} hours. Credits are locked in escrow and released simultaneously upon reciprocal peer confirmation.
              </p>
            </div>
          </div>

          {/* Availability selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Your Preferred Session Days:
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                const isSelected = preferredDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`rounded-lg px-3 py-1 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Proposal note */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Introduction & Context to Participants:
            </label>
            <textarea
              rows={2}
              value={proposalNote}
              onChange={(e) => setProposalNote(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none placeholder-slate-400"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            id="confirm-propose-chain-btn"
            onClick={handleSend}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-cyan-700 transition-all"
          >
            <Send className="h-4 w-4" />
            <span>Broadcast Proposal ({chain.steps.length} Peers)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

interface DirectSwapModalProps {
  anchor: TrustAnchor | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmSwap: (anchorName: string, skillWanted: string, skillOffered: string) => void;
}

export const DirectSwapModal: React.FC<DirectSwapModalProps> = ({
  anchor,
  isOpen,
  onClose,
  onConfirmSwap,
}) => {
  const [skillWanted, setSkillWanted] = useState('');
  const [skillOffered, setSkillOffered] = useState('React Basics');
  const [hours, setHours] = useState(2);

  if (!isOpen || !anchor) return null;

  const targetSkill = skillWanted || anchor.teachSkills[0]?.name || 'Skills';

  const handleSend = () => {
    onConfirmSwap(anchor.name, targetSkill, skillOffered);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <img
              src={anchor.avatar}
              alt={anchor.name}
              className="h-10 w-10 rounded-full border border-slate-200 object-cover"
            />
            <div>
              <h3 className="text-base font-bold text-slate-900">Direct Swap Request</h3>
              <p className="text-xs text-slate-500">With {anchor.name} ({anchor.handle})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="py-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill You Want to Learn from {anchor.name}:
            </label>
            <select
              value={targetSkill}
              onChange={(e) => setSkillWanted(e.target.value)}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
            >
              {anchor.teachSkills.map((s) => (
                <option key={s.name} value={s.name}>
                  {s.name} ({s.tier} Tier)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Skill You Are Offering to Teach:
            </label>
            <input
              type="text"
              value={skillOffered}
              onChange={(e) => setSkillOffered(e.target.value)}
              placeholder="e.g. React Basics, Python, UI Design..."
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none placeholder-slate-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Initial Swap Duration: <span className="text-cyan-700 font-bold">{hours} Hours</span>
            </label>
            <input
              type="range"
              min={1}
              max={6}
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              className="w-full accent-cyan-600"
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Send Direct Request</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'chain';
}

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3.5 shadow-xl transition-all animate-in slide-in-from-bottom-3 duration-200"
        >
          {toast.type === 'chain' ? (
            <Sparkles className="h-5 w-5 text-cyan-600 shrink-0 mt-0.5" />
          ) : toast.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" />
          )}

          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-slate-900">{toast.title}</h4>
            <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">
              {toast.message}
            </p>
          </div>

          <button
            onClick={() => onDismiss(toast.id)}
            className="text-slate-400 hover:text-slate-700 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
