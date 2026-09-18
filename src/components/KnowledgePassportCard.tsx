import React, { useState } from 'react';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  Sparkles,
  ExternalLink,
  Lock,
  PlusCircle,
  Hash,
  Star,
  Users,
  Zap,
  Flame,
  X
} from 'lucide-react';
import { KnowledgePassportData, VerifiableAttestation, SkillCategory, ProficiencyTier } from '../types';

interface KnowledgePassportProps {
  passport: KnowledgePassportData;
  onAddAttestation: (attestation: VerifiableAttestation) => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

export const KnowledgePassportCard: React.FC<KnowledgePassportProps> = ({
  passport,
  onAddAttestation,
  onAddToast,
}) => {
  const [activeTab, setActiveTab] = useState<'radar' | 'attestations' | 'badges'>('radar');
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isMintModalOpen, setIsMintModalOpen] = useState(false);

  // Mint modal form state
  const [mintSkill, setMintSkill] = useState('Next.js Server Components');
  const [mintCategory, setMintCategory] = useState<SkillCategory>('tech');
  const [mintTier, setMintTier] = useState<ProficiencyTier>('Expert');
  const [mintAttester, setMintAttester] = useState('Elena Rostova');
  const [mintFeedback, setMintFeedback] = useState('Demonstrated deep mastery of async server actions and cache revalidation.');

  // Radar chart math
  const categories = passport.categoryCompetencies;
  const radius = 90;
  const centerX = 120;
  const centerY = 120;
  const angleStep = (Math.PI * 2) / categories.length;

  // Calculate polygon points for competency scores
  const polygonPoints = categories
    .map((cat, i) => {
      const angle = i * angleStep - Math.PI / 2;
      const r = (cat.score / 100) * radius;
      const x = centerX + r * Math.cos(angle);
      const y = centerY + r * Math.sin(angle);
      return `${x},${y}`;
    })
    .join(' ');

  // Copy DID or Verifiable Credential
  const handleCopyDID = () => {
    navigator.clipboard.writeText(passport.did);
    onAddToast('Decentralized ID Copied', passport.did, 'info');
  };

  const handleExportJSON = () => {
    const vcBlob = {
      '@context': ['https://www.w3.org/2018/credentials/v1'],
      type: ['VerifiableCredential', 'SkillNexusKnowledgePassport'],
      issuer: 'did:nexus:registry_v1',
      issuanceDate: new Date().toISOString(),
      credentialSubject: {
        id: passport.did,
        name: passport.ownerName,
        handle: passport.handle,
        verifiedBarterHours: passport.verifiedHours,
        reputation: passport.reputationScore,
        competencies: passport.categoryCompetencies,
        attestationsCount: passport.attestations.length,
      },
      proof: {
        type: 'Ed25519Signature2020',
        created: new Date().toISOString(),
        verificationMethod: 'did:nexus:governance_multi_sig',
        proofValue: 'z3h8F92mKp9LqW4v...verified',
      },
    };

    navigator.clipboard.writeText(JSON.stringify(vcBlob, null, 2));
    onAddToast(
      'W3C Verifiable Credential Exported',
      'JSON-LD credential copied to clipboard. Ready for on-chain or portfolio inclusion.',
      'success'
    );
  };

  const handleMintSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newAtt: VerifiableAttestation = {
      id: `att-${Date.now()}`,
      skill: mintSkill,
      category: mintCategory,
      tier: mintTier,
      attestedBy: mintAttester,
      attesterHandle: `@${mintAttester.toLowerCase().replace(/\s+/g, '_')}`,
      attesterAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      timestamp: 'Just now',
      txHash: `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
      rating: 5.0,
      feedback: mintFeedback,
    };

    onAddAttestation(newAtt);
    setIsMintModalOpen(false);
    onAddToast(
      'New Verifiable Attestation Minted!',
      `Peer endorsement for "${mintSkill}" recorded on ledger with cryptographic proof.`,
      'success'
    );
  };

  return (
    <section
      id="knowledge-passport-section"
      className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40"
    >
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Award className="h-4 w-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Soulbound Knowledge Passport & Skill Radar
            </h2>
            <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-800">
              Zero-Cash Proof of Skill
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Every minute of barter instruction is cryptographically attested by peer mentors. Your reputation and competency radar are verifiable worldwide without institutions or cash fees.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMintModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100 transition-colors shadow-2xs"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>+ Mint Attestation</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3.5 py-1.5 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Verifiable Credential</span>
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Holographic ID Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-5 text-white shadow-xl">
            {/* Subtle holographic sheen */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-48 w-48 rounded-full bg-cyan-500/20 blur-2xl"></div>
            <div className="pointer-events-none absolute -bottom-24 -left-24 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl"></div>

            <div className="relative z-10">
              {/* Card top */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded-md bg-indigo-500/30 border border-indigo-400/40 text-cyan-300">
                    <Sparkles className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-xs font-mono font-bold tracking-wider text-indigo-300">
                    SKILLNEXUS DID PASSPORT
                  </span>
                </div>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-400/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  Vetted
                </span>
              </div>

              {/* User Identity */}
              <div className="mt-4 flex items-center gap-3.5">
                <img
                  src={passport.avatar}
                  alt={passport.ownerName}
                  className="h-14 w-14 rounded-full border-2 border-indigo-400/80 object-cover shadow-md"
                />
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">
                    {passport.ownerName}
                  </h3>
                  <p className="text-xs text-indigo-200/80">{passport.handle}</p>
                  <button
                    onClick={handleCopyDID}
                    className="mt-1 flex items-center gap-1 text-[10px] font-mono text-cyan-300/80 hover:text-cyan-200 transition-colors"
                  >
                    <Copy className="h-2.5 w-2.5" />
                    <span>{passport.did.slice(0, 16)}...</span>
                  </button>
                </div>
              </div>

              {/* Stats Matrix */}
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-slate-950/60 border border-slate-800/80 p-3 text-center">
                <div>
                  <div className="text-base font-black text-white">{passport.verifiedHours} hrs</div>
                  <div className="text-[10px] text-slate-400">Verified Taught</div>
                </div>
                <div>
                  <div className="text-base font-black text-cyan-400">{passport.totalSwaps}</div>
                  <div className="text-[10px] text-slate-400">Total Barters</div>
                </div>
                <div>
                  <div className="text-base font-black text-amber-400">★ {passport.reputationScore}</div>
                  <div className="text-[10px] text-slate-400">Trust Score</div>
                </div>
              </div>

              {/* Micro ledger proof */}
              <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 pt-3 border-t border-slate-800/80">
                <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                  <Hash className="h-3 w-3 text-indigo-400" />
                  Consensus Root: 0x9f4a...e12d
                </span>
                <span className="text-emerald-400 font-semibold text-[10px]">Zero Defaults</span>
              </div>
            </div>
          </div>

          {/* Quick Badges Preview */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-3.5">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
              Earned Network Badges ({passport.badges.length})
            </span>
            <div className="grid grid-cols-2 gap-2">
              {passport.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="rounded-lg border border-slate-200 bg-white p-2.5 shadow-2xs flex items-start gap-2"
                >
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded bg-indigo-50 text-indigo-600">
                    {badge.iconType === 'chain' ? (
                      <Sparkles className="h-3.5 w-3.5" />
                    ) : badge.iconType === 'shield' ? (
                      <ShieldCheck className="h-3.5 w-3.5" />
                    ) : badge.iconType === 'users' ? (
                      <Users className="h-3.5 w-3.5" />
                    ) : (
                      <Zap className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div>
                    <h5 className="text-[11px] font-bold text-slate-900 leading-tight">{badge.name}</h5>
                    <span className="text-[9px] text-slate-400 block">{badge.earnedDate}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Competency Radar & Attestation Feed */}
        <div className="lg:col-span-7 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:p-5">
          {/* Sub-nav tabs */}
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-200">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('radar')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === 'radar'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Competency Radar
              </button>
              <button
                onClick={() => setActiveTab('attestations')}
                className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                  activeTab === 'attestations'
                    ? 'bg-white text-indigo-700 shadow-2xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Peer Sign-Offs ({passport.attestations.length})
              </button>
            </div>

            <span className="text-[11px] text-slate-500 font-medium">
              W3C Verifiable Credential Standard
            </span>
          </div>

          {activeTab === 'radar' ? (
            /* Radar Visualizer */
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              {/* SVG Radar Chart */}
              <div className="relative flex items-center justify-center">
                <svg width="240" height="240" className="overflow-visible">
                  {/* Background grid concentric circles */}
                  {[0.25, 0.5, 0.75, 1.0].map((level) => (
                    <circle
                      key={`ring-${level}`}
                      cx={centerX}
                      cy={centerY}
                      r={radius * level}
                      fill="none"
                      stroke="#e2e8f0"
                      strokeDasharray={level < 1 ? '2 2' : undefined}
                    />
                  ))}

                  {/* Axis spokes */}
                  {categories.map((cat, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const x = centerX + radius * Math.cos(angle);
                    const y = centerY + radius * Math.sin(angle);
                    return (
                      <line
                        key={`spoke-${cat.category}`}
                        x1={centerX}
                        y1={centerY}
                        x2={x}
                        y2={y}
                        stroke="#cbd5e1"
                        strokeWidth="1"
                      />
                    );
                  })}

                  {/* Filled Competency Polygon */}
                  <polygon
                    points={polygonPoints}
                    fill="rgba(99, 102, 241, 0.2)"
                    stroke="#4f46e5"
                    strokeWidth="2.5"
                    className="transition-all duration-300"
                  />

                  {/* Category Points & Labels */}
                  {categories.map((cat, i) => {
                    const angle = i * angleStep - Math.PI / 2;
                    const r = (cat.score / 100) * radius;
                    const x = centerX + r * Math.cos(angle);
                    const y = centerY + r * Math.sin(angle);

                    const labelR = radius + 22;
                    const labelX = centerX + labelR * Math.cos(angle);
                    const labelY = centerY + labelR * Math.sin(angle);

                    const isHovered = hoveredCategory === cat.category;

                    return (
                      <g
                        key={`point-${cat.category}`}
                        className="cursor-pointer"
                        onMouseEnter={() => setHoveredCategory(cat.category)}
                        onMouseLeave={() => setHoveredCategory(null)}
                      >
                        <circle
                          cx={x}
                          cy={y}
                          r={isHovered ? 6 : 4}
                          fill="#4f46e5"
                          stroke="#ffffff"
                          strokeWidth="2"
                          className="transition-all"
                        />
                        <text
                          x={labelX}
                          y={labelY + 4}
                          textAnchor="middle"
                          className={`text-[10px] font-bold capitalize transition-colors ${
                            isHovered ? 'fill-indigo-600 font-black text-xs' : 'fill-slate-600'
                          }`}
                        >
                          {cat.category}
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Competency Level List */}
              <div className="flex-1 w-full space-y-2.5">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                  Category Competency Matrix
                </span>
                {categories.map((cat) => (
                  <div
                    key={cat.category}
                    onMouseEnter={() => setHoveredCategory(cat.category)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`rounded-lg border p-2.5 transition-all ${
                      hoveredCategory === cat.category
                        ? 'border-indigo-400 bg-indigo-50/50 shadow-2xs'
                        : 'border-slate-200 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="capitalize text-slate-800">{cat.category}</span>
                      <span className="text-indigo-700">{cat.score}% ({cat.level})</span>
                    </div>
                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full"
                        style={{ width: `${cat.score}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Attestations Ledger Feed */
            <div className="space-y-3">
              {passport.attestations.map((att) => (
                <div
                  key={att.id}
                  className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={att.attesterAvatar}
                        alt={att.attestedBy}
                        className="h-8 w-8 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">
                          {att.skill}{' '}
                          <span className="rounded bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[9px] font-bold text-indigo-700 ml-1">
                            {att.tier}
                          </span>
                        </h4>
                        <p className="text-[10px] text-slate-500">
                          Attested by <span className="font-semibold text-slate-700">{att.attestedBy}</span> ({att.attesterHandle}) • {att.timestamp}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-2 py-0.5 text-[11px] font-bold text-amber-800">
                      <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                      <span>{att.rating.toFixed(1)}</span>
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg italic border border-slate-100">
                    "{att.feedback}"
                  </p>

                  <div className="mt-2 flex items-center justify-between text-[10px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                    <span className="truncate">Ledger Proof: {att.txHash}</span>
                    <span className="text-emerald-600 font-sans font-semibold">Verified ✓</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mint Attestation Modal */}
      {isMintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-indigo-600" />
                <h3 className="text-base font-bold text-slate-900">Mint Verifiable Skill Attestation</h3>
              </div>
              <button
                onClick={() => setIsMintModalOpen(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleMintSubmit} className="py-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Demonstrated Skill</label>
                <input
                  type="text"
                  value={mintSkill}
                  onChange={(e) => setMintSkill(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={mintCategory}
                    onChange={(e) => setMintCategory(e.target.value as SkillCategory)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="tech">Tech</option>
                    <option value="languages">Languages</option>
                    <option value="design">Design</option>
                    <option value="music">Music</option>
                    <option value="business">Business</option>
                    <option value="craft">Craft</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Proficiency Tier</label>
                  <select
                    value={mintTier}
                    onChange={(e) => setMintTier(e.target.value as ProficiencyTier)}
                    className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Attesting Peer Mentor</label>
                <input
                  type="text"
                  value={mintAttester}
                  onChange={(e) => setMintAttester(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mentor Attestation Feedback</label>
                <textarea
                  value={mintFeedback}
                  onChange={(e) => setMintFeedback(e.target.value)}
                  rows={2}
                  className="w-full rounded-lg border border-slate-300 p-2 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                  required
                />
              </div>

              <div className="rounded-lg bg-indigo-50 border border-indigo-100 p-2.5 text-[11px] text-indigo-900">
                Attestations are signed with your counterparty's simulated cryptographic key and stamped into your Soulbound Knowledge Passport.
              </div>

              <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsMintModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Mint to Passport</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
