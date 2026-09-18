import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  AlertTriangle,
  FileCheck,
  ChevronRight,
  UserCheck,
  Award,
  Hash,
  RefreshCw,
  Sliders,
  Send,
  Video
} from 'lucide-react';
import { ActiveBarterSession, BarterMilestone, TrustAnchor } from '../types';

interface EscrowVaultProps {
  sessions: ActiveBarterSession[];
  onUpdateSessions: (sessions: ActiveBarterSession[]) => void;
  availableTrustAnchors: TrustAnchor[];
  onLaunchWorkspace?: (session: ActiveBarterSession) => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

export const EscrowVaultMilestoneValidator: React.FC<EscrowVaultProps> = ({
  sessions,
  onUpdateSessions,
  availableTrustAnchors,
  onLaunchWorkspace,
  onAddToast,
}) => {
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');
  const [activeTab, setActiveTab] = useState<'sessions' | 'rules' | 'new'>('sessions');

  // New session creation state
  const [newPartnerId, setNewPartnerId] = useState<string>(availableTrustAnchors[0]?.id || '');
  const [newTeachingSkill, setNewTeachingSkill] = useState<string>('React Basics');
  const [newReceivingSkill, setNewReceivingSkill] = useState<string>('German');
  const [newTotalHours, setNewTotalHours] = useState<number>(4);

  // Ratings for current signoff
  const [rubricClarity, setRubricClarity] = useState<number>(5);
  const [rubricPractical, setRubricPractical] = useState<number>(5);
  const [rubricPacing, setRubricPacing] = useState<number>(4);

  // Dispute modal
  const [disputeModalMilestone, setDisputeModalMilestone] = useState<{
    sessionId: string;
    milestone: BarterMilestone;
  } | null>(null);
  const [disputeReason, setDisputeReason] = useState<string>('Partner rescheduled with less than 2h notice.');

  const currentSession = sessions.find((s) => s.id === selectedSessionId) || sessions[0];

  // Calculate vault totals
  const totalLockedHours = sessions.reduce((acc, sess) => {
    const unreleased = sess.milestones
      .filter((m) => !m.isReleased)
      .reduce((sum, m) => sum + m.hours, 0);
    return acc + unreleased;
  }, 0);

  const totalReleasedHours = sessions.reduce((acc, sess) => {
    const released = sess.milestones
      .filter((m) => m.isReleased)
      .reduce((sum, m) => sum + m.hours, 0);
    return acc + released;
  }, 0);

  // Toggle sign-off on a milestone
  const handleToggleSignoff = (
    sessionId: string,
    milestoneId: string,
    role: 'mentor' | 'student'
  ) => {
    const updated = sessions.map((sess) => {
      if (sess.id !== sessionId) return sess;
      const updatedMilestones = sess.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        if (role === 'mentor') {
          return { ...m, isMentorSigned: !m.isMentorSigned };
        } else {
          return {
            ...m,
            isStudentSigned: !m.isStudentSigned,
            rubricScore: !m.isStudentSigned
              ? { clarity: rubricClarity, practicality: rubricPractical, pacing: rubricPacing }
              : undefined,
          };
        }
      });
      return { ...sess, milestones: updatedMilestones };
    });

    onUpdateSessions(updated);
    onAddToast(
      `${role === 'mentor' ? 'Mentor' : 'Student'} Sign-off Updated`,
      `Cryptographic attestation state modified for milestone.`,
      'info'
    );
  };

  // Execute Escrow Release
  const handleExecuteRelease = (sessionId: string, milestoneId: string) => {
    const randomHash = `0x${Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`;

    let releasedHours = 0;

    const updated = sessions.map((sess) => {
      if (sess.id !== sessionId) return sess;
      const updatedMilestones = sess.milestones.map((m) => {
        if (m.id !== milestoneId) return m;
        releasedHours = m.hours;
        return {
          ...m,
          isReleased: true,
          txHash: randomHash,
        };
      });

      // Check if all milestones are released
      const allDone = updatedMilestones.every((m) => m.isReleased);

      return {
        ...sess,
        milestones: updatedMilestones,
        status: allDone ? ('settled' as const) : ('in_progress' as const),
      };
    });

    onUpdateSessions(updated);
    onAddToast(
      'Time Credits Released from Escrow!',
      `Successfully released ${releasedHours} hours to the teaching party. Tx: ${randomHash.slice(0, 10)}...`,
      'success'
    );
  };

  // Create new active escrow session
  const handleCreateNewSession = (e: React.FormEvent) => {
    e.preventDefault();
    const partner = availableTrustAnchors.find((a) => a.id === newPartnerId) || availableTrustAnchors[0];
    const halfHours = newTotalHours / 2;

    const newSession: ActiveBarterSession = {
      id: `session-${Date.now()}`,
      title: `${newTeachingSkill} ⇄ ${newReceivingSkill}`,
      partner: {
        id: partner.id,
        name: partner.name,
        avatar: partner.avatar,
        handle: partner.handle,
        reputation: partner.rating,
      },
      teaching: newTeachingSkill,
      receiving: newReceivingSkill,
      escrowTotalHours: newTotalHours,
      status: 'locked',
      createdAt: 'Just now',
      milestones: [
        {
          id: `m-${Date.now()}-1`,
          title: `Milestone 1: Foundations & Initial Practical Exchange`,
          hours: halfHours,
          deliverable: `Complete core concepts and initial 1-on-1 practical review in ${newTeachingSkill} & ${newReceivingSkill}`,
          isMentorSigned: false,
          isStudentSigned: false,
          isReleased: false,
        },
        {
          id: `m-${Date.now()}-2`,
          title: `Milestone 2: Advanced Synthesis & Reciprocal Capstone`,
          hours: halfHours,
          deliverable: `Final code/portfolio review and bilateral sign-off attestation`,
          isMentorSigned: false,
          isStudentSigned: false,
          isReleased: false,
        },
      ],
    };

    onUpdateSessions([newSession, ...sessions]);
    setSelectedSessionId(newSession.id);
    setActiveTab('sessions');
    onAddToast(
      'New Escrow Agreement Initialized',
      `${newTotalHours} hours locked in bilateral escrow with ${partner.name}.`,
      'success'
    );
  };

  return (
    <section
      id="escrow-vault-section"
      className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
              <ShieldCheck className="h-4 w-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Smart Escrow & Proof-of-Skill Milestone Validator
            </h2>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
              Zero-Cash Settlement
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Time credits are locked in escrow upon barter initiation. Both mentor and student must cryptographically attest to curriculum completion before credits are unlocked.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 p-1">
          <button
            onClick={() => setActiveTab('sessions')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'sessions'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Active Escrows ({sessions.length})
          </button>
          <button
            onClick={() => setActiveTab('new')}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              activeTab === 'new'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            + Lock New Escrow
          </button>
        </div>
      </div>

      {/* Vault Metric Cards Grid */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Available Balance</span>
            <Unlock className="h-3.5 w-3.5 text-emerald-600" />
          </div>
          <div className="mt-1 text-xl font-black text-emerald-700">
            {(6.5 + totalReleasedHours).toFixed(1)} hrs
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Ready to redeem with any mentor</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Locked in Escrow</span>
            <Lock className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="mt-1 text-xl font-black text-amber-700">
            {totalLockedHours.toFixed(1)} hrs
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Awaiting bilateral milestone sign-offs</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Lifetime Settled</span>
            <Award className="h-3.5 w-3.5 text-indigo-600" />
          </div>
          <div className="mt-1 text-xl font-black text-indigo-700">
            {(24.0 + totalReleasedHours).toFixed(1)} hrs
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Knowledge successfully exchanged</p>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Dispute Rate</span>
            <CheckCircle2 className="h-3.5 w-3.5 text-cyan-600" />
          </div>
          <div className="mt-1 text-xl font-black text-slate-900">0.0%</div>
          <p className="text-[10px] text-emerald-600 font-medium mt-0.5">100% mutual consensus</p>
        </div>
      </div>

      {activeTab === 'new' ? (
        /* Create New Escrow Contract Form */
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/30 p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">Initialize Custom Bilateral Escrow Agreement</h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Specify your barter partner, reciprocal skills, and time credit commitment. Both parties' hours will be placed into the smart vault until deliverables are verified.
            </p>
          </div>

          <form onSubmit={handleCreateNewSession} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Select Trust Anchor Partner
                </label>
                <select
                  value={newPartnerId}
                  onChange={(e) => setNewPartnerId(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                >
                  {availableTrustAnchors.map((anchor) => (
                    <option key={anchor.id} value={anchor.id}>
                      {anchor.name} ({anchor.handle}) • ★ {anchor.rating.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Time Commitment in Escrow: <span className="text-indigo-700 font-bold">{newTotalHours} Hours</span>
                </label>
                <input
                  type="range"
                  min={2}
                  max={10}
                  step={1}
                  value={newTotalHours}
                  onChange={(e) => setNewTotalHours(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 mt-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skill You Are Offering (Your Commitment)
                </label>
                <input
                  type="text"
                  value={newTeachingSkill}
                  onChange={(e) => setNewTeachingSkill(e.target.value)}
                  placeholder="e.g. React Custom Hooks, Piano"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Skill You Will Receive (Partner's Commitment)
                </label>
                <input
                  type="text"
                  value={newReceivingSkill}
                  onChange={(e) => setNewReceivingSkill(e.target.value)}
                  placeholder="e.g. Conversational German, Ableton"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-indigo-100">
              <button
                type="button"
                onClick={() => setActiveTab('sessions')}
                className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-cyan-700"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>Initialize Escrow Vault</span>
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Active Escrow Sessions View */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Session Selector */}
          <div className="lg:col-span-4 space-y-2.5">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
              Active Escrow Contracts
            </span>
            {sessions.map((sess) => {
              const unreleasedCount = sess.milestones.filter((m) => !m.isReleased).length;
              const isSelected = sess.id === currentSession?.id;

              return (
                <div
                  key={sess.id}
                  onClick={() => setSelectedSessionId(sess.id)}
                  className={`cursor-pointer rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={sess.partner.avatar}
                        alt={sess.partner.name}
                        className="h-7 w-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{sess.partner.name}</h4>
                        <span className="text-[10px] text-slate-500">{sess.partner.handle}</span>
                      </div>
                    </div>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        sess.status === 'settled'
                          ? 'bg-emerald-100 text-emerald-800'
                          : unreleasedCount === 0
                          ? 'bg-cyan-100 text-cyan-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {sess.status === 'settled' ? 'Settled' : `${unreleasedCount} Pending`}
                    </span>
                  </div>

                  <p className="mt-2 text-xs font-medium text-slate-700 line-clamp-1">
                    {sess.title}
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-indigo-600" />
                      {sess.escrowTotalHours}h Escrowed
                    </span>
                    <span className="font-semibold text-slate-700">
                      {sess.milestones.filter((m) => m.isReleased).length} of {sess.milestones.length} Released
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Milestone Validator Room */}
          {currentSession && (
            <div className="lg:col-span-8 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
              {/* Partner Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <img
                    src={currentSession.partner.avatar}
                    alt={currentSession.partner.name}
                    className="h-10 w-10 rounded-full border-2 border-indigo-400 object-cover"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {currentSession.title}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-500">
                      Partner: <span className="font-semibold text-slate-800">{currentSession.partner.name}</span> ({currentSession.partner.handle}) • ★ {currentSession.partner.reputation.toFixed(2)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {onLaunchWorkspace && (
                    <button
                      id="escrow-enter-workspace-btn"
                      onClick={() => onLaunchWorkspace(currentSession)}
                      className="flex items-center gap-1.5 rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800 shadow-2xs hover:bg-emerald-100 transition-colors"
                    >
                      <Video className="h-3.5 w-3.5 text-emerald-600" />
                      <span>Enter Live Barter Room</span>
                    </button>
                  )}
                  <div className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-center shadow-2xs">
                    <span className="text-[10px] text-slate-500 uppercase block font-semibold">Total Escrow</span>
                    <span className="text-xs font-bold text-indigo-700">{currentSession.escrowTotalHours} Hours</span>
                  </div>
                </div>
              </div>

              {/* Milestones List */}
              <div className="mt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Interactive Proof-of-Skill Milestones
                  </span>
                  <span className="text-[11px] text-slate-500">
                    Dual signatures required for each milestone
                  </span>
                </div>

                {currentSession.milestones.map((milestone, idx) => {
                  const bothSigned = milestone.isMentorSigned && milestone.isStudentSigned;

                  return (
                    <div
                      key={milestone.id}
                      className={`rounded-xl border p-4 transition-all ${
                        milestone.isReleased
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : bothSigned
                          ? 'border-indigo-300 bg-indigo-50/40'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-slate-100 text-xs font-bold text-slate-700">
                            {idx + 1}
                          </span>
                          <div>
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
                              {milestone.title}
                            </h4>
                            <p className="mt-1 text-xs text-slate-600">
                              <span className="font-semibold text-slate-700">Target Deliverable: </span>
                              {milestone.deliverable}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-start">
                          <span className="rounded bg-indigo-100 px-2 py-0.5 text-xs font-bold text-indigo-800">
                            {milestone.hours} Hours
                          </span>
                          {milestone.isReleased ? (
                            <span className="flex items-center gap-1 rounded bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Released
                            </span>
                          ) : (
                            <span className="flex items-center gap-1 rounded bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
                              <Lock className="h-3 w-3" />
                              In Escrow
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Cryptographic hash badge if released */}
                      {milestone.isReleased && milestone.txHash && (
                        <div className="mt-3 flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50/60 p-2 text-[11px] text-emerald-900">
                          <Hash className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="font-mono truncate">
                            Settled on Ledger: {milestone.txHash}
                          </span>
                        </div>
                      )}

                      {/* Dual Sign-off Control Row */}
                      {!milestone.isReleased && (
                        <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* Mentor Signature Toggle */}
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <UserCheck className="h-3.5 w-3.5 text-indigo-600" />
                                <span className="text-xs font-bold text-slate-800">Mentor Attestation</span>
                              </div>
                              <p className="text-[10px] text-slate-500">
                                {milestone.isMentorSigned ? 'Signed & Verified' : 'Awaiting instructor sign-off'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggleSignoff(currentSession.id, milestone.id, 'mentor')}
                              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                                milestone.isMentorSigned
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {milestone.isMentorSigned ? 'Signed ✓' : 'Sign as Mentor'}
                            </button>
                          </div>

                          {/* Student Signature Toggle */}
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 flex items-center justify-between">
                            <div>
                              <div className="flex items-center gap-1.5">
                                <FileCheck className="h-3.5 w-3.5 text-cyan-600" />
                                <span className="text-xs font-bold text-slate-800">Student Sign-off</span>
                              </div>
                              <p className="text-[10px] text-slate-500">
                                {milestone.isStudentSigned ? 'Signed & Received' : 'Click to attest knowledge received'}
                              </p>
                            </div>
                            <button
                              onClick={() => handleToggleSignoff(currentSession.id, milestone.id, 'student')}
                              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-colors ${
                                milestone.isStudentSigned
                                  ? 'bg-emerald-600 text-white'
                                  : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-100'
                              }`}
                            >
                              {milestone.isStudentSigned ? 'Attested ✓' : 'Attest as Student'}
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Release Action Button */}
                      {!milestone.isReleased && (
                        <div className="mt-3 flex items-center justify-between gap-3 pt-2">
                          <button
                            onClick={() =>
                              setDisputeModalMilestone({
                                sessionId: currentSession.id,
                                milestone,
                              })
                            }
                            className="text-[11px] text-slate-500 hover:text-rose-600 underline"
                          >
                            Need mediation or reschedule?
                          </button>

                          <button
                            disabled={!bothSigned}
                            onClick={() => handleExecuteRelease(currentSession.id, milestone.id)}
                            className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all ${
                              bothSigned
                                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/20 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98]'
                                : 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                            }`}
                          >
                            <Unlock className="h-3.5 w-3.5" />
                            <span>
                              {bothSigned
                                ? `Execute Escrow Release (${milestone.hours} hrs)`
                                : 'Dual Signatures Required to Unlock'}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dispute / Mediation Simulation Modal */}
      {disputeModalMilestone && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-900">Request Peer Barter Mediation</h3>
            </div>

            <div className="py-4 space-y-3 text-xs">
              <p className="text-slate-600">
                If a peer failed to attend, delivered unvetted material, or became unresponsive, you may trigger community arbitration.
              </p>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Reason for Dispute</label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div className="rounded-lg bg-amber-50 border border-amber-200 p-2.5 text-[11px] text-amber-900">
                Both parties' time credits for this milestone remain safely locked in escrow until the dispute is resolved. No credits are lost.
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setDisputeModalMilestone(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setDisputeModalMilestone(null);
                  onAddToast(
                    'Dispute Filed with Community Arbiter',
                    'A neutral Trust Anchor has been assigned to audit the curriculum log.',
                    'info'
                  );
                }}
                className="rounded-lg bg-amber-600 hover:bg-amber-700 px-4 py-2 text-xs font-bold text-white shadow-xs"
              >
                Submit for Mediation
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
