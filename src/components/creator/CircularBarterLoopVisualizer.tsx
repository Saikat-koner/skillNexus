import React, { useState } from 'react';
import {
  RefreshCw,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Zap,
  Layers,
  CheckCircle2,
  Users,
  ShieldCheck,
  X,
  Play
} from 'lucide-react';
import { MultiPartyLoop, CurrencyCode } from '../../types';
import { formatPrice } from '../../utils/currency';

interface CircularBarterLoopVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
  currency: CurrencyCode;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

const SAMPLE_3_WAY_LOOP: MultiPartyLoop = {
  id: 'loop_3_way',
  title: '3-Way Creator Synergy Ring (Zero Cash)',
  efficiencyGain: '100% Zero-Cash Barter (Saves $450 in platform fees)',
  totalValueUSD: 450,
  status: 'active_pool',
  nodes: [
    {
      id: 'n1',
      name: 'Elena Rostova',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      givesSkill: 'Design: Full Figma Brand Kit & Design System',
      receivesSkill: 'Video: TikTok UGC Editing & Motion Subtitles',
      hours: 6,
      color: '#4f46e5',
    },
    {
      id: 'n2',
      name: 'Marcus Vance',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      givesSkill: 'Web: React & Firebase Realtime Escrow Integration',
      receivesSkill: 'Design: Full Figma Brand Kit & Design System',
      hours: 6,
      color: '#06b6d4',
    },
    {
      id: 'n3',
      name: 'Zara Thorne',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      givesSkill: 'Video: TikTok UGC Editing & Motion Subtitles',
      receivesSkill: 'Web: React & Firebase Realtime Escrow Integration',
      hours: 6,
      color: '#10b981',
    },
  ],
};

const SAMPLE_4_WAY_LOOP: MultiPartyLoop = {
  id: 'loop_4_way',
  title: '4-Way Enterprise Creator Mesh',
  efficiencyGain: '4-Party Multi-Hop Trade Matrix (Zero Liquidity Required)',
  totalValueUSD: 780,
  status: 'active_pool',
  nodes: [
    {
      id: 'm1',
      name: 'Alex Rivera',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      givesSkill: '3D & Motion: Blender 4K Product Renders',
      receivesSkill: 'Copywriting: High-Converting SaaS Pitch Deck',
      hours: 8,
      color: '#8b5cf6',
    },
    {
      id: 'm2',
      name: 'Devon Miles',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      givesSkill: 'Full-Stack: Next.js & Supabase Backend APIs',
      receivesSkill: '3D & Motion: Blender 4K Product Renders',
      hours: 8,
      color: '#ec4899',
    },
    {
      id: 'm3',
      name: 'Chloe Dubois',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      givesSkill: 'Music & Sound: Custom Lo-Fi Launch Theme & Foley',
      receivesSkill: 'Full-Stack: Next.js & Supabase Backend APIs',
      hours: 8,
      color: '#3b82f6',
    },
    {
      id: 'm4',
      name: 'Sarah Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
      givesSkill: 'Copywriting: High-Converting SaaS Pitch Deck',
      receivesSkill: 'Music & Sound: Custom Lo-Fi Launch Theme & Foley',
      hours: 8,
      color: '#f59e0b',
    },
  ],
};

export const CircularBarterLoopVisualizer: React.FC<CircularBarterLoopVisualizerProps> = ({
  isOpen,
  onClose,
  currency,
  onAddToast,
}) => {
  const [activeLoopType, setActiveLoopType] = useState<'3way' | '4way'>('3way');
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeStep, setActiveStep] = useState(0);

  if (!isOpen) return null;

  const currentLoop = activeLoopType === '3way' ? SAMPLE_3_WAY_LOOP : SAMPLE_4_WAY_LOOP;

  const handleSimulateCycle = () => {
    setIsSimulating(true);
    setActiveStep(1);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= currentLoop.nodes.length) {
          clearInterval(stepInterval);
          setIsSimulating(false);
          if (onAddToast) {
            onAddToast(
              'Circular Barter Completed!',
              `All ${currentLoop.nodes.length} parties exchanged services with $0 transaction fees!`,
              'success'
            );
          }
          return 0;
        }
        return prev + 1;
      });
    }, 800);
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
        <div className="relative overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 shadow-md">
                <RefreshCw className="h-5 w-5 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black tracking-tight">Circular Barter Loop Solver</h3>
                  <span className="flex items-center gap-1 rounded-md bg-cyan-500/20 border border-cyan-400/40 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                    <Zap className="h-3 w-3" /> Graph Theory Engine
                  </span>
                </div>
                <p className="text-xs text-indigo-200">
                  Eliminates the "Double Coincidence of Wants" through automated multi-party swap matching.
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
          {/* Top Loop Mode Selector */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 rounded-xl bg-slate-100 p-1 text-xs">
              <button
                onClick={() => setActiveLoopType('3way')}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                  activeLoopType === '3way'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                3-Party Ring
              </button>
              <button
                onClick={() => setActiveLoopType('4way')}
                className={`rounded-lg px-3 py-1.5 font-bold transition-all ${
                  activeLoopType === '4way'
                    ? 'bg-white text-indigo-600 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                4-Party Mesh
              </button>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                Total Barter Value
              </span>
              <span className="text-base font-black text-indigo-600">
                {formatPrice(currentLoop.totalValueUSD, currency)} (Zero Cash)
              </span>
            </div>
          </div>

          {/* Value Badge */}
          <div className="rounded-xl border border-emerald-100 bg-emerald-50/60 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-emerald-800 font-bold">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
              <span>{currentLoop.efficiencyGain}</span>
            </div>
            <span className="rounded-md bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
              100% Matched
            </span>
          </div>

          {/* Interactive Circular Trade Nodes */}
          <div className="space-y-3">
            <span className="text-xs font-bold text-slate-800 block">Multi-Party Trade Sequence:</span>

            <div className="space-y-2.5">
              {currentLoop.nodes.map((node, idx) => {
                const nextNode = currentLoop.nodes[(idx + 1) % currentLoop.nodes.length];
                const isCurrentActive = isSimulating && activeStep === idx + 1;

                return (
                  <div
                    key={node.id}
                    className={`rounded-2xl border p-3.5 transition-all shadow-2xs ${
                      isCurrentActive
                        ? 'border-cyan-500 bg-cyan-50/70 ring-2 ring-cyan-400/50'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Left: User Avatar & Name */}
                      <div className="flex items-center gap-3">
                        <img
                          src={node.avatar}
                          alt={node.name}
                          className="h-10 w-10 rounded-xl object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-xs text-slate-900">{node.name}</span>
                            <span className="text-[10px] font-mono text-slate-400">({node.hours}h Swap)</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-semibold text-indigo-700 mt-0.5">
                            <span className="text-slate-400 font-normal">Gives:</span>
                            <span className="truncate max-w-xs">{node.givesSkill}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Transferred to next node */}
                      <div className="flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/80 px-3 py-1.5 text-[11px] self-start sm:self-auto">
                        <span className="text-slate-500 font-medium">To:</span>
                        <span className="font-bold text-slate-800">{nextNode.name.split(' ')[0]}</span>
                        <ArrowRight className="h-3.5 w-3.5 text-indigo-600" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Simulate Barter Swap Button */}
          <div className="pt-2">
            <button
              onClick={handleSimulateCycle}
              disabled={isSimulating}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-xs font-bold text-white shadow-md transition-all ${
                isSimulating
                  ? 'bg-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 hover:opacity-95 shadow-indigo-600/20 active:scale-[0.99]'
              }`}
            >
              <Play className="h-4 w-4" />
              <span>
                {isSimulating
                  ? `Simulating Circular Exchange Step ${activeStep}/${currentLoop.nodes.length}...`
                  : `Simulate ${currentLoop.nodes.length}-Way Trade Execution`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
