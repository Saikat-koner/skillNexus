import React from 'react';
import {
  ShoppingBag,
  PlusCircle,
  Command,
  LayoutDashboard,
  Video,
  Sparkles
} from 'lucide-react';
import { AppMode, MarketplaceSubTab } from './Navbar';

interface StickyMobileCTAProps {
  currentMode: AppMode;
  currentTab: MarketplaceSubTab;
  onSetAppMode: (mode: AppMode) => void;
  onNavigateTab: (tab: MarketplaceSubTab) => void;
  onOpenCommandPalette: () => void;
  onOpenPostGig: () => void;
  onOpenLiveSwap: () => void;
}

export const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  currentMode,
  currentTab,
  onSetAppMode,
  onNavigateTab,
  onOpenCommandPalette,
  onOpenPostGig,
  onOpenLiveSwap,
}) => {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 block md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-md px-3 py-2 shadow-2xl">
      <div className="flex items-center justify-around">
        {/* Browse Gigs */}
        <button
          onClick={() => {
            onSetAppMode('creator_market');
            onNavigateTab('browse');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentMode === 'creator_market' && currentTab === 'browse'
              ? 'text-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <ShoppingBag className="h-4 w-4" />
          <span>Gigs</span>
        </button>

        {/* ⌘K Command Palette */}
        <button
          onClick={onOpenCommandPalette}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600"
        >
          <Command className="h-4 w-4" />
          <span>Search</span>
        </button>

        {/* Center Primary Action: Post Gig */}
        <button
          onClick={onOpenPostGig}
          className="flex flex-col items-center -mt-4 bg-gradient-to-tr from-indigo-600 to-purple-600 text-white rounded-2xl p-2.5 shadow-lg shadow-indigo-600/30 active:scale-95 transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          <span className="text-[9px] font-black mt-0.5">Post Gig</span>
        </button>

        {/* Live Swap / Mentorship */}
        <button
          onClick={onOpenLiveSwap}
          className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-indigo-600"
        >
          <Video className="h-4 w-4" />
          <span>Mentorship</span>
        </button>

        {/* Dashboard */}
        <button
          onClick={() => {
            onSetAppMode('creator_market');
            onNavigateTab('dashboard');
          }}
          className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
            currentMode === 'creator_market' && currentTab === 'dashboard'
              ? 'text-indigo-600'
              : 'text-slate-500 hover:text-slate-900'
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span>Earnings</span>
        </button>
      </div>
    </div>
  );
};
