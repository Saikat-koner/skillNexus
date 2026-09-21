import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Sparkles,
  Clock,
  Star,
  Tag,
  CheckCircle2,
  DollarSign,
  ArrowUpDown,
  Info,
  Users,
  AlertCircle,
  Award,
  Bot,
  Calculator,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  X,
  Film,
  Palette,
  TrendingUp,
  Music2,
  Code,
  PenTool,
  RotateCcw
} from 'lucide-react';
import {
  GigItem,
  GigCategory,
  DiscoverySortOption,
  DoubleBookingPolicy,
  CurrencyCode,
  BudgetRangeFilter
} from '../../types';
import { formatPrice } from '../../utils/currency';
import { AudioPitchPlayer } from './AudioPitchPlayer';

interface BrowseGigsSectionProps {
  gigs: GigItem[];
  onSelectBookGig: (gig: GigItem) => void;
  onOpenPostModal: () => void;
  doubleBookingPolicy: DoubleBookingPolicy;
  currency: CurrencyCode;
  onOpenPassport?: (creatorName: string) => void;
  onOpenBriefCopilot?: () => void;
  onOpenRateCalculator?: () => void;
}

const CATEGORY_CONFIGS: {
  category: 'All' | GigCategory;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { category: 'All', label: 'All Categories', icon: Sparkles },
  { category: 'Video & Animation', label: 'Video & Animation', icon: Film },
  { category: 'Design & Branding', label: 'Design & Branding', icon: Palette },
  { category: 'Social Media & Growth', label: 'Social & Growth', icon: TrendingUp },
  { category: 'Music & Audio', label: 'Music & Audio', icon: Music2 },
  { category: 'Web & Coding', label: 'Web & Coding', icon: Code },
  { category: 'Writing & Content', label: 'Writing & Content', icon: PenTool },
];

const BUDGET_PRESETS: {
  id: BudgetRangeFilter;
  min: number;
  max: number;
}[] = [
  { id: 'all', min: 0, max: Infinity },
  { id: '0-50', min: 0, max: 50 },
  { id: '50-200', min: 50, max: 200 },
  { id: '200+', min: 200, max: Infinity },
];

export const BrowseGigsSection: React.FC<BrowseGigsSectionProps> = ({
  gigs,
  onSelectBookGig,
  onOpenPostModal,
  doubleBookingPolicy,
  currency,
  onOpenPassport,
  onOpenBriefCopilot,
  onOpenRateCalculator,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | GigCategory>('All');
  const [budgetRange, setBudgetRange] = useState<BudgetRangeFilter>('all');
  const [sortOption, setSortOption] = useState<DiscoverySortOption>('smart_rotation');
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Helper to get formatted budget range label according to selected currency
  const getBudgetLabel = (id: BudgetRangeFilter) => {
    switch (id) {
      case 'all':
        return 'All Budgets';
      case '0-50':
        return `${formatPrice(0, currency)} – ${formatPrice(50, currency)}`;
      case '50-200':
        return `${formatPrice(50, currency)} – ${formatPrice(200, currency)}`;
      case '200+':
        return `${formatPrice(200, currency)}+`;
    }
  };

  // Toggle skill category (toggling an active one reverts to 'All')
  const handleToggleCategory = (category: 'All' | GigCategory) => {
    if (selectedCategory === category) {
      setSelectedCategory('All');
    } else {
      setSelectedCategory(category);
    }
  };

  // Toggle budget range (toggling an active one reverts to 'all')
  const handleToggleBudget = (range: BudgetRangeFilter) => {
    if (budgetRange === range) {
      setBudgetRange('all');
    } else {
      setBudgetRange(range);
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setBudgetRange('all');
  };

  // Calculate dynamic counts for each budget range given active category & search
  const budgetCounts = useMemo(() => {
    const counts: Record<BudgetRangeFilter, number> = {
      all: 0,
      '0-50': 0,
      '50-200': 0,
      '200+': 0,
    };
    gigs.forEach((gig) => {
      const matchesCategory =
        selectedCategory === 'All' || gig.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        gig.title.toLowerCase().includes(q) ||
        gig.creatorName.toLowerCase().includes(q) ||
        gig.creatorBio.toLowerCase().includes(q) ||
        gig.tags.some((t) => t.toLowerCase().includes(q));

      if (matchesCategory && matchesSearch) {
        counts.all++;
        if (gig.rate <= 50) counts['0-50']++;
        if (gig.rate >= 50 && gig.rate <= 200) counts['50-200']++;
        if (gig.rate >= 200) counts['200+']++;
      }
    });
    return counts;
  }, [gigs, selectedCategory, searchQuery]);

  // Calculate dynamic counts for each category given active budget range & search
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: 0 };
    CATEGORY_CONFIGS.forEach((c) => {
      counts[c.category] = 0;
    });

    gigs.forEach((gig) => {
      let matchesBudget = true;
      if (budgetRange === '0-50') matchesBudget = gig.rate <= 50;
      else if (budgetRange === '50-200') matchesBudget = gig.rate >= 50 && gig.rate <= 200;
      else if (budgetRange === '200+') matchesBudget = gig.rate >= 200;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        gig.title.toLowerCase().includes(q) ||
        gig.creatorName.toLowerCase().includes(q) ||
        gig.creatorBio.toLowerCase().includes(q) ||
        gig.tags.some((t) => t.toLowerCase().includes(q));

      if (matchesBudget && matchesSearch) {
        counts.All++;
        if (counts[gig.category] !== undefined) {
          counts[gig.category]++;
        }
      }
    });
    return counts;
  }, [gigs, budgetRange, searchQuery]);

  // Filter and rank gigs
  const filteredAndSortedGigs = useMemo(() => {
    let result = gigs.filter((gig) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All' || gig.category === selectedCategory;

      // Budget match
      let matchesBudget = true;
      if (budgetRange === '0-50') {
        matchesBudget = gig.rate <= 50;
      } else if (budgetRange === '50-200') {
        matchesBudget = gig.rate >= 50 && gig.rate <= 200;
      } else if (budgetRange === '200+') {
        matchesBudget = gig.rate >= 200;
      }

      // Search match
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        gig.title.toLowerCase().includes(q) ||
        gig.creatorName.toLowerCase().includes(q) ||
        gig.creatorBio.toLowerCase().includes(q) ||
        gig.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesBudget && matchesSearch;
    });

    // Sorting (DP3 Discovery logic)
    result.sort((a, b) => {
      switch (sortOption) {
        case 'smart_rotation':
          // Balances rotationScore (fairness) with rating
          return b.rotationScore - a.rotationScore;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'cheapest':
          return a.rate - b.rate;
        case 'highest_rated':
          return b.rating - a.rating;
        case 'fastest':
          return a.deliveryDays - b.deliveryDays;
        default:
          return 0;
      }
    });

    return result;
  }, [gigs, searchQuery, selectedCategory, budgetRange, sortOption]);

  const hasActiveFilters =
    selectedCategory !== 'All' || budgetRange !== 'all' || searchQuery.trim() !== '';

  const activeFiltersCount =
    (selectedCategory !== 'All' ? 1 : 0) +
    (budgetRange !== 'all' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  return (
    <div className="space-y-6">
      {/* Top Value Banner with AI Copilot & Rate Calc triggers */}
      <div className="rounded-3xl border border-indigo-100 dark:border-indigo-900/50 bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 p-5 sm:p-6 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-cyan-400/20 border border-cyan-400/30 px-2 py-0.5 text-[10px] font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1">
              <Zap className="h-3 w-3" /> Groq 500 tok/s Powered
            </span>
            <span className="text-xs text-purple-200">Zero-Loss Escrow Protection</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black tracking-tight">
            Find Top Creators or Let AI Scope Your Project
          </h2>
          <p className="text-xs text-indigo-200 max-w-xl">
            Match with vetted video editors, 3D animators, Figma designers, and full-stack devs with milestone escrow protection.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {onOpenBriefCopilot && (
            <button
              id="ai-brief-copilot-trigger"
              onClick={onOpenBriefCopilot}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 px-4 py-2.5 text-xs font-bold text-slate-950 shadow-md transition-all active:scale-95"
            >
              <Bot className="h-4 w-4" />
              <span>AI Brief Copilot</span>
            </button>
          )}

          {onOpenRateCalculator && (
            <button
              id="rate-calc-trigger"
              onClick={onOpenRateCalculator}
              className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 px-3.5 py-2.5 text-xs font-bold text-white transition-colors"
            >
              <Calculator className="h-4 w-4" />
              <span>Rate Calc</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Sort Top Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            id="marketplace-search-input"
            type="text"
            placeholder="Search creator skills, editing, branding, beats, coding, TikTok, Blender..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white dark:focus:bg-slate-900 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              title="Clear search"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Discovery Sort Dropdown (DP3 Implementation) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 px-3 py-2 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-slate-500 dark:text-slate-400 hidden sm:inline">Rank by:</span>
            <select
              id="marketplace-sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as DiscoverySortOption)}
              className="bg-transparent font-semibold text-slate-900 dark:text-slate-100 focus:outline-none cursor-pointer"
            >
              <option value="smart_rotation">Fair Rotation (DP3 Default)</option>
              <option value="newest">Newest First</option>
              <option value="cheapest">Lowest Rate</option>
              <option value="highest_rated">Highest Rated (★)</option>
              <option value="fastest">Fastest Turnaround</option>
            </select>
          </div>

          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="rounded-xl border border-indigo-200 dark:border-indigo-800 bg-indigo-50/60 dark:bg-indigo-950/40 p-2 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100/70 dark:hover:bg-indigo-900/60 transition-colors"
            title="Inspect DP3 Discovery Algorithm"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* DP3 Discovery Algorithm Explainer Drawer (When toggled) */}
      {showFormulaDetails && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-800/70 bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/50 dark:from-slate-900 dark:via-indigo-950/40 dark:to-slate-900 p-4 text-xs animate-in slide-in-from-top-2 duration-150 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  DP3 Discovery Architecture
                </span>
                <span className="font-bold text-slate-900 dark:text-slate-100">Why Fair Rotation over Pure Popularity?</span>
              </div>
              <p className="mt-1.5 text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
                Traditional gig marketplaces create a winner-take-all monopoly where top 1% creators hoard all client bookings. Our discovery ranker uses an anti-monopoly rotation formula:
                <code className="mx-1 rounded bg-indigo-100/80 dark:bg-indigo-900/60 px-1.5 py-0.5 font-mono text-indigo-800 dark:text-indigo-300">
                  Score = (Recency × 0.35) + (Rotation Factor × 0.35) + (Completion Rate × 0.30)
                </code>
                This ensures young creators get genuine client impressions within their first 48 hours without paying pay-to-win sponsored listing fees.
              </p>
            </div>
            <button
              onClick={() => setShowFormulaDetails(false)}
              className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Interactive Filter System Box */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 sm:p-5 space-y-4 shadow-xs">
        {/* Filter System Header */}
        <div className="flex items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400">
              <SlidersHorizontal className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-slate-100">
                  Interactive Filter System
                </h3>
                {hasActiveFilters && (
                  <span className="rounded-full bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.2">
                    {activeFiltersCount} active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Filter by budget range or skill category · Click an active filter to toggle off
              </p>
            </div>
          </div>

          {hasActiveFilters && (
            <button
              id="reset-all-filters-btn"
              onClick={handleResetFilters}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset Filters</span>
            </button>
          )}
        </div>

        {/* 1. Budget Range Filter Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <DollarSign className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Budget Range:</span>
              <span className="text-slate-400 font-normal">
                {budgetRange === 'all' ? '(Showing all tiers)' : `(Filtered: ${getBudgetLabel(budgetRange)})`}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Prices auto-converted to {currency}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {BUDGET_PRESETS.map((preset) => {
              const isSelected = budgetRange === preset.id;
              const count = budgetCounts[preset.id];

              return (
                <button
                  key={preset.id}
                  id={`budget-filter-${preset.id}`}
                  onClick={() => handleToggleBudget(preset.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{getBudgetLabel(preset.id)}</span>
                  </div>
                  <span
                    className={`ml-1.5 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Skill Category Filter Section */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-slate-200">
              <Tag className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Skill Category:</span>
              <span className="text-slate-400 font-normal">
                {selectedCategory === 'All' ? '(All skills included)' : `(Filtered: ${selectedCategory})`}
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Click active skill to toggle off
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
            {CATEGORY_CONFIGS.map(({ category, label, icon: IconComponent }) => {
              const isSelected = selectedCategory === category;
              const count = categoryCounts[category] ?? 0;

              return (
                <button
                  key={category}
                  id={`category-filter-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
                  onClick={() => handleToggleCategory(category)}
                  className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-2 text-xs font-semibold transition-all border ${
                    isSelected
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs font-bold'
                      : 'bg-slate-50/80 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent className={`h-3.5 w-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                  <span>{label}</span>
                  <span
                    className={`ml-1 rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Filter Tags Row (if any filter is applied) */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Active Filters:
            </span>

            {selectedCategory !== 'All' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 px-2.5 py-1 text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                <Tag className="h-3 w-3" />
                <span>Skill: {selectedCategory}</span>
                <button
                  onClick={() => setSelectedCategory('All')}
                  className="ml-1 hover:text-indigo-950 dark:hover:text-white"
                  title="Remove category filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {budgetRange !== 'all' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <DollarSign className="h-3 w-3" />
                <span>Budget: {getBudgetLabel(budgetRange)}</span>
                <button
                  onClick={() => setBudgetRange('all')}
                  className="ml-1 hover:text-emerald-950 dark:hover:text-white"
                  title="Remove budget filter"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            {searchQuery.trim() !== '' && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Search className="h-3 w-3" />
                <span>Keyword: "{searchQuery}"</span>
                <button
                  onClick={() => setSearchQuery('')}
                  className="ml-1 hover:text-slate-900 dark:hover:text-white"
                  title="Remove search query"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-[11px] font-bold text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 ml-auto"
            >
              Clear all
            </button>
          </div>
        )}
      </div>

      {/* Results Count & Policy Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <div>
          Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredAndSortedGigs.length}</span> creator gigs
          {selectedCategory !== 'All' && (
            <span> in <span className="font-semibold text-indigo-700 dark:text-indigo-400">{selectedCategory}</span></span>
          )}
          {budgetRange !== 'all' && (
            <span> within <span className="font-semibold text-emerald-700 dark:text-emerald-400">{getBudgetLabel(budgetRange)}</span></span>
          )}
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Zero Client Platform Fees · Displaying in {currency}</span>
        </div>
      </div>

      {/* Gigs Grid */}
      {filteredAndSortedGigs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-900 dark:text-slate-100">No gigs matched your filter criteria</h4>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Try broadening your budget range, choosing another skill category, or clearing your search term.
          </p>
          <button
            onClick={handleResetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-xs transition-colors"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedGigs.map((gig) => {
            const hasPending = gig.pendingBookingsCount > 0;
            const isStrictLocked = doubleBookingPolicy === 'strict_lockout' && hasPending;

            return (
              <div
                key={gig.id}
                className="group flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs transition-all hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-lg"
              >
                {/* Card Top */}
                <div className="p-5 space-y-3">
                  {/* Creator Info & Passport Trigger */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={gig.creatorAvatar}
                        alt={gig.creatorName}
                        className="h-10 w-10 rounded-xl border border-slate-200 dark:border-slate-700 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">{gig.creatorName}</h4>
                          <span className="rounded bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-100 dark:border-indigo-800 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700 dark:text-indigo-300">
                            Creator
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">{gig.creatorHandle}</p>
                      </div>
                    </div>

                    {onOpenPassport && (
                      <button
                        onClick={() => onOpenPassport(gig.creatorName)}
                        className="flex items-center gap-1 text-[10px] font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200/80 dark:border-indigo-800 px-2 py-1 rounded-lg transition-colors"
                        title="View Verified Creator Passport"
                      >
                        <Award className="h-3 w-3 text-indigo-600 dark:text-indigo-400" />
                        <span>Passport</span>
                      </button>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {gig.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {gig.description}
                  </p>

                  {/* 30s Audio Pitch Waveform Player */}
                  <div className="pt-1">
                    <AudioPitchPlayer
                      creatorName={gig.creatorName.split(' ')[0]}
                      tone={gig.category === 'Video & Animation' ? 'energetic' : gig.category === 'Web & Coding' ? 'professional' : 'calm'}
                      compact={true}
                    />
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {gig.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 px-2 py-0.5 text-[10px] text-slate-600 dark:text-slate-400 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* DP2 Notice if pending bookings exist */}
                  {hasPending && (
                    <div className="rounded-xl bg-amber-50/80 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/60 p-2 text-[10px] text-amber-800 dark:text-amber-300 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {gig.pendingBookingsCount} client in queue
                      </span>
                      <span className="font-bold">
                        {isStrictLocked ? 'Lockout Active' : 'Accepting'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Meta & Booking CTA */}
                <div className="border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900 dark:text-slate-100">{gig.rating.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400">({gig.reviewsCount})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{gig.deliveryDays}d turnaround</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900 dark:text-slate-100 leading-none">
                        {formatPrice(gig.rate, currency)}
                      </div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                        {gig.rateType === 'hourly' ? '/ hr' : 'fixed'}
                      </span>
                    </div>

                    <button
                      id={`book-gig-btn-${gig.id}`}
                      onClick={() => onSelectBookGig(gig)}
                      disabled={isStrictLocked}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-all active:scale-[0.98]"
                    >
                      {isStrictLocked ? 'Locked' : 'Book Gig'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
