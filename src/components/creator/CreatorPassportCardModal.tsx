import React, { useState } from 'react';
import {
  Sparkles,
  Award,
  ShieldCheck,
  Star,
  QrCode,
  Copy,
  Check,
  Download,
  Share2,
  X,
  ExternalLink,
  Flame,
  Zap
} from 'lucide-react';
import { CreatorProfile, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';

interface CreatorPassportCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  creator?: CreatorProfile;
  currency: CurrencyCode;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

const DEFAULT_CREATOR: CreatorProfile = {
  id: 'cr_alex_rivera',
  name: 'Alex Rivera',
  title: 'Senior 3D Motion Director & Blender Artist',
  avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  bio: 'Specialized in 4K octane product renders, Figma UI animation, and zero-cash 3D creator collaborations.',
  rating: 4.98,
  reviewsCount: 142,
  completedGigsCount: 189,
  category: 'Video & Animation',
  hourlyRate: 85,
  skills: ['Blender 3D', 'After Effects', 'Figma', 'Octane Render', 'Motion Graphics', 'Sound Design'],
  badges: ['Top Rated Pro', 'Zero-Dispute Escrow', 'Speed Demon (24h SLA)'],
  reputationScore: 980,
  barterHoursCompleted: 48,
  responseRatePercent: 100,
};

export const CreatorPassportCardModal: React.FC<CreatorPassportCardModalProps> = ({
  isOpen,
  onClose,
  creator = DEFAULT_CREATOR,
  currency,
  onAddToast,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://skillnexus-2.ai.studio/passport/${creator.id}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
    if (onAddToast) {
      onAddToast('Passport Link Copied!', 'Share your verified creator badge anywhere.', 'success');
    }
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      if (onAddToast) {
        onAddToast('Passport Exported!', 'High-res holographic card rendered.', 'success');
      }
    }, 600);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="my-auto w-full max-w-md overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 p-4 bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white shadow-xs">
              <Award className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-black text-slate-900">Verified Creator Passport</h3>
              <p className="text-[10px] text-slate-500">SkillNexus Cryptographic Credential</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Card Canvas */}
        <div className="p-5 space-y-4">
          {/* Holographic Passport Card */}
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 p-5 text-white shadow-2xl">
            {/* Shimmer Effect Background */}
            <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-purple-500/10 to-amber-500/10 pointer-events-none"></div>

            {/* Top Row: SkillNexus Mark & ID */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 text-slate-950 text-xs font-black">
                  SN
                </span>
                <span className="text-xs font-black tracking-wider uppercase text-white">
                  SkillNexus Passport
                </span>
              </div>
              <span className="font-mono text-[10px] text-cyan-300 font-bold bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-md">
                ID: #{creator.id.slice(0, 10)}
              </span>
            </div>

            {/* Middle Profile Bio */}
            <div className="py-4 flex items-start gap-3.5 relative z-10">
              <img
                src={creator.avatar}
                alt={creator.name}
                className="h-16 w-16 rounded-2xl object-cover border-2 border-indigo-400 shadow-md"
              />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-sm text-white">{creator.name}</h4>
                  <ShieldCheck className="h-4 w-4 text-cyan-400" />
                </div>
                <p className="text-[11px] text-indigo-200 font-medium">{creator.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[10px]">
                  <span className="flex items-center gap-1 text-amber-300 font-bold">
                    <Star className="h-3 w-3 fill-amber-300" /> {creator.rating} ({creator.reviewsCount})
                  </span>
                  <span className="text-slate-400">·</span>
                  <span className="text-emerald-300 font-semibold">
                    {creator.completedGigsCount} Gigs Done
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Skills Pills */}
            <div className="flex flex-wrap gap-1.5 py-1 relative z-10">
              {creator.skills.slice(0, 4).map((skill, idx) => (
                <span
                  key={idx}
                  className="rounded-lg bg-white/10 border border-white/10 px-2 py-0.5 text-[10px] font-medium text-slate-200"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Bottom Bar: Reputation & Simulated QR */}
            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
              <div>
                <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider block">
                  Trust Reputation Score
                </span>
                <span className="text-sm font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-indigo-300">
                  {creator.reputationScore} / 1000 Pts
                </span>
              </div>

              <div className="flex items-center gap-2 bg-white/10 border border-white/20 p-1.5 rounded-xl">
                <QrCode className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-2 text-center text-xs">
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-2">
              <span className="text-[10px] text-slate-400 block font-semibold">Zero-Dispute Escrows</span>
              <span className="font-bold text-emerald-600 text-xs">100% Guaranteed</span>
            </div>
            <div className="rounded-xl border border-slate-100 bg-slate-50 p-2">
              <span className="text-[10px] text-slate-400 block font-semibold">Hourly Equivalent</span>
              <span className="font-bold text-indigo-600 text-xs">
                {formatPrice(creator.hourlyRate, currency)}/hr
              </span>
            </div>
          </div>

          {/* Share & Export Buttons */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={handleCopyLink}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              <span>{copiedLink ? 'Link Copied!' : 'Copy Link'}</span>
            </button>

            <button
              onClick={handleExport}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 py-2.5 text-xs font-bold text-white shadow-xs hover:opacity-95 transition-opacity"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{isExporting ? 'Exporting...' : 'Export Badge'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
