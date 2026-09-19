import React, { useState } from 'react';
import {
  Network,
  Sparkles,
  ShieldCheck,
  Users,
  Calendar,
  PlusCircle,
  ArrowRightLeft,
  Scale,
  Lock,
  Award,
  Video,
  ShoppingBag,
  LayoutDashboard,
  ClipboardList,
  Sliders,
  ArrowRight,
  Globe,
  Bot,
  Calculator,
  RefreshCw,
  ChevronDown,
  Sun,
  Moon
} from 'lucide-react';
import { CurrencyCode } from '../types';
import { CURRENCY_CONFIGS } from '../utils/currency';

export type AppMode = 'creator_market' | 'barter_network';
export type MarketplaceSubTab = 'browse' | 'dashboard' | 'bookings' | 'decision_points';

export interface NavbarProps {
  appMode: AppMode;
  onSetAppMode: (mode: AppMode) => void;
  activeMarketplaceTab: MarketplaceSubTab;
  onSetMarketplaceTab: (tab: MarketplaceSubTab) => void;
  pendingInquiriesCount: number;
  onOpenPostGigModal: () => void;
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenPostSkillModal: () => void;
  onOpenLiveWorkspace: () => void;
  barterChainsCount: number;
  onOpenCommandPalette?: () => void;
  currency: CurrencyCode;
  onSetCurrency: (currency: CurrencyCode) => void;
  onOpenBriefCopilot?: () => void;
  onOpenRateCalculator?: () => void;
  onOpenCircularBarter?: () => void;
  onOpenDisputeArbitrator?: () => void;
  theme?: 'light' | 'dark';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  appMode,
  onSetAppMode,
  activeMarketplaceTab,
  onSetMarketplaceTab,
  pendingInquiriesCount,
  onOpenPostGigModal,
  onNavigate,
  activeSection,
  onOpenPostSkillModal,
  onOpenLiveWorkspace,
  barterChainsCount,
  onOpenCommandPalette,
  currency,
  onSetCurrency,
  onOpenBriefCopilot,
  onOpenRateCalculator,
  onOpenCircularBarter,
  onOpenDisputeArbitrator,
  theme = 'light',
  onToggleTheme,
}) => {
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xs transition-colors">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Brand Logo & Mode Pill */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-cyan-500 p-[1.5px] shadow-md shadow-indigo-500/15">
            <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-white dark:bg-slate-900 transition-colors">
              {appMode === 'creator_market' ? (
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
              ) : (
                <Network className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
              )}
            </div>
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 sm:h-3 sm:w-3">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Skill<span className="bg-gradient-to-r from-indigo-600 to-cyan-600 dark:from-indigo-400 dark:to-cyan-400 bg-clip-text text-transparent">Nexus</span>
              </span>
              <span className="hidden rounded-full border border-indigo-200 dark:border-indigo-800 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 sm:inline-block">
                {appMode === 'creator_market' ? 'Creator Marketplace' : 'Barter Network'}
              </span>
            </div>
            <p className="hidden text-[11px] text-slate-500 dark:text-slate-400 md:block">
              {appMode === 'creator_market'
                ? 'Monetize Skills · Clients Book Gigs'
                : 'Zero-Cash Multi-Party Skill Swaps'}
            </p>
          </div>
        </div>

        {/* Navigation Items depending on App Mode */}
        {appMode === 'creator_market' ? (
          <nav className="hidden lg:flex items-center gap-1">
            <button
              id="nav-market-browse"
              onClick={() => onSetMarketplaceTab('browse')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeMarketplaceTab === 'browse'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ShoppingBag className="h-3.5 w-3.5" />
              <span>Browse & Search</span>
            </button>

            <button
              id="nav-market-dashboard"
              onClick={() => onSetMarketplaceTab('dashboard')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeMarketplaceTab === 'dashboard'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span>Creator Dashboard</span>
              {pendingInquiriesCount > 0 && (
                <span className="rounded-full bg-amber-400 text-amber-950 px-1.5 py-0.2 text-[9px] font-black animate-pulse">
                  {pendingInquiriesCount}
                </span>
              )}
            </button>

            <button
              id="nav-market-bookings"
              onClick={() => onSetMarketplaceTab('bookings')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeMarketplaceTab === 'bookings'
                  ? 'bg-slate-900 dark:bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ClipboardList className="h-3.5 w-3.5" />
              <span>My Bookings</span>
            </button>

            <button
              id="nav-market-decision-points"
              onClick={() => onSetMarketplaceTab('decision_points')}
              className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                activeMarketplaceTab === 'decision_points'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/70 dark:border-indigo-800'
              }`}
            >
              <Sliders className="h-3.5 w-3.5" />
              <span>Decision Points (20 PTS)</span>
            </button>

            {/* AI Tools Sub-Actions in Nav */}
            {onOpenBriefCopilot && (
              <button
                onClick={onOpenBriefCopilot}
                className="flex items-center gap-1 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200/80 dark:border-purple-800 px-2.5 py-1.5 text-xs font-bold transition-colors ml-1"
                title="Deconstruct client brief with Groq AI"
              >
                <Bot className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />
                <span>AI Brief</span>
              </button>
            )}

            {onOpenRateCalculator && (
              <button
                onClick={onOpenRateCalculator}
                className="flex items-center gap-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800 px-2.5 py-1.5 text-xs font-bold transition-colors"
                title="Dynamic rate calculator for gig packages"
              >
                <Calculator className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Rate Calc</span>
              </button>
            )}

            {onOpenDisputeArbitrator && (
              <button
                onClick={onOpenDisputeArbitrator}
                className="flex items-center gap-1 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 border border-amber-200/80 dark:border-amber-800 px-2 py-1 text-xs font-semibold transition-colors"
                title="AI Escrow Dispute Resolution"
              >
                <Scale className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span>Escrow AI</span>
              </button>
            )}
          </nav>
        ) : (
          <nav className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => onNavigate('skill-graph-section')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                activeSection === 'skill-graph-section'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Network className="h-3.5 w-3.5" />
              <span>Skill Graph</span>
            </button>

            <button
              onClick={() => onNavigate('barter-chains-section')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                activeSection === 'barter-chains-section'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <ArrowRightLeft className="h-3.5 w-3.5" />
              <span>Barter Chains</span>
            </button>

            <button
              onClick={() => onNavigate('barter-equalizer-section')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                activeSection === 'barter-equalizer-section'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Scale className="h-3.5 w-3.5" />
              <span>Equalizer Lab</span>
            </button>

            <button
              onClick={() => onNavigate('knowledge-passport-section')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                activeSection === 'knowledge-passport-section'
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Award className="h-3.5 w-3.5" />
              <span>Passport</span>
            </button>

            {onOpenCircularBarter && (
              <button
                onClick={onOpenCircularBarter}
                className="flex items-center gap-1 rounded-xl bg-cyan-50 dark:bg-cyan-950/40 text-cyan-800 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-900/60 border border-cyan-200/80 dark:border-cyan-800 px-2.5 py-1.5 text-xs font-bold transition-colors ml-1"
                title="Circular 3-way & 4-way barter solver"
              >
                <RefreshCw className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span>Multi-Hop Solver</span>
              </button>
            )}
          </nav>
        )}

        {/* Global Currency Switcher, Theme Toggle & Primary CTAs */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Theme Toggle Button */}
          {onToggleTheme && (
            <button
              onClick={onToggleTheme}
              className="flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4 text-slate-600" />
              )}
            </button>
          )}

          {/* Multi-Currency Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-slate-700 dark:text-slate-200 transition-colors shadow-2xs"
              title="Change display currency"
            >
              <Globe className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>{currency}</span>
              <ChevronDown className="h-3 w-3 text-slate-400" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 py-1.5 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 text-xs font-semibold">
                <span className="px-3 py-1 text-[10px] uppercase font-bold text-slate-400 tracking-wider block">
                  Select Currency
                </span>
                {(Object.keys(CURRENCY_CONFIGS) as CurrencyCode[]).map((curCode) => {
                  const cfg = CURRENCY_CONFIGS[curCode];
                  return (
                    <button
                      key={curCode}
                      onClick={() => {
                        onSetCurrency(curCode);
                        setIsCurrencyDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors ${
                        currency === curCode
                          ? 'bg-indigo-50/70 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{cfg.symbol}</span>
                        <span>{cfg.code}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 truncate">{cfg.name}</span>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="hidden md:flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 transition-colors"
              title="Global Search & Commands (⌘K / Ctrl+K)"
            >
              <kbd className="font-mono text-[10px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded px-1 text-indigo-600 dark:text-indigo-400 font-bold">
                ⌘K
              </kbd>
            </button>
          )}

          {/* Mode Switcher Button */}
          <button
            onClick={() =>
              onSetAppMode(appMode === 'creator_market' ? 'barter_network' : 'creator_market')
            }
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            title="Switch platform view"
          >
            {appMode === 'creator_market' ? (
              <>
                <Network className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">P2P Barter</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="hidden sm:inline">Marketplace</span>
              </>
            )}
          </button>

          {appMode === 'creator_market' ? (
            <button
              id="nav-post-gig-btn"
              onClick={onOpenPostGigModal}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-3 sm:px-4 py-1.5 sm:py-2 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:from-indigo-700 hover:to-cyan-700 active:scale-[0.98] transition-all"
            >
              <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Post Gig</span>
            </button>
          ) : (
            <button
              id="nav-live-swap-btn"
              onClick={onOpenLiveWorkspace}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/60 px-3 sm:px-3.5 py-1.5 sm:py-2 text-xs font-bold text-emerald-800 dark:text-emerald-300 shadow-2xs hover:bg-emerald-100 dark:hover:bg-emerald-900/80 transition-all"
            >
              <Video className="h-3.5 w-3.5 text-emerald-700 dark:text-emerald-400" />
              <span className="hidden sm:inline">Live Swap</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
