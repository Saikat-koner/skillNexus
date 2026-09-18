import React from 'react';
import { X, ShieldCheck, FileText, Lock, Globe, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  type: 'privacy' | 'terms';
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, type, onClose }) => {
  if (!isOpen) return null;

  const isPrivacy = type === 'privacy';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border border-slate-200 bg-white shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              {isPrivacy ? <Lock className="h-5 w-5" /> : <Scale className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                {isPrivacy ? 'SkillNexus Privacy Policy' : 'Terms of Service & Escrow Agreement'}
              </h3>
              <p className="text-xs text-slate-500">Last updated: September 2026 · Effective Immediately</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-all"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Body Content */}
        <div className="overflow-y-auto p-6 space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
          {isPrivacy ? (
            <>
              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Information We Collect</h4>
                <p>
                  We collect information necessary to operate the SkillNexus creator marketplace and P2P skill network, including your public profile name, email address, portfolio skills, gig listing descriptions, and transaction histories.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Cloud Firestore & Realtime Sync</h4>
                <p>
                  Public gigs and reviews are stored in Google Cloud Firestore and distributed across low-latency global CDN nodes. Private direct chat messages and wallet transactions are protected with strict Firestore Security Rules based on authenticated user IDs.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Escrow Data & Financial Security</h4>
                <p>
                  Payment transactions and milestone deposits are processed through PCI-DSS certified payment gateways. SkillNexus does not store raw credit card numbers on platform servers.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">4. Your Data Rights (GDPR & CCPA)</h4>
                <p>
                  You retain complete ownership over all uploaded creative assets and source code. You may request data export or account deletion at any time by contacting privacy@skillnexus.io.
                </p>
              </section>
            </>
          ) : (
            <>
              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">1. Acceptance of Terms</h4>
                <p>
                  By creating an account, booking a creator gig, or participating in the P2P Skill Barter Network on SkillNexus, you agree to be bound by these Terms of Service.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">2. Milestone Escrow Protection</h4>
                <p>
                  All cash gig bookings require milestone funding into the SkillNexus escrow vault. Creators must submit completed deliverable files for review. Once the client approves the deliverables, funds are immediately unlocked for creator payout.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">3. Skill Barter Network Commitments</h4>
                <p>
                  Creators participating in direct 1-to-1 or 3-way circular skill swaps pledge to provide equivalent professional effort. Unfulfilled swap commitments may result in badge demotion or account suspension.
                </p>
              </section>

              <section>
                <h4 className="font-bold text-slate-900 text-sm mb-1">4. Intellectual Property & Commercial License</h4>
                <p>
                  Upon final milestone release and payment completion, all intellectual property rights and commercial licenses for the commissioned deliverables transfer unconditionally to the hiring client.
                </p>
              </section>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="border-t border-slate-100 bg-slate-50/80 px-6 py-3 flex items-center justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800 transition-all shadow-xs"
          >
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};
