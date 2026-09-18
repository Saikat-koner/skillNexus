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
  AlertCircle
} from 'lucide-react';
import { GigItem, GigCategory, DiscoverySortOption, DoubleBookingPolicy } from '../../types';

interface BrowseGigsSectionProps {
  gigs: GigItem[];
  onSelectBookGig: (gig: GigItem) => void;
  onOpenPostModal: () => void;
  doubleBookingPolicy: DoubleBookingPolicy;
}

const CATEGORIES: ('All' | GigCategory)[] = [
  'All',
  'Video & Animation',
  'Design & Branding',
  'Social Media & Growth',
  'Music & Audio',
  'Web & Coding',
  'Writing & Content',
];

export const BrowseGigsSection: React.FC<BrowseGigsSectionProps> = ({
  gigs,
  onSelectBookGig,
  onOpenPostModal,
  doubleBookingPolicy,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | GigCategory>('All');
  const [sortOption, setSortOption] = useState<DiscoverySortOption>('smart_rotation');
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  // Filter and rank gigs
  const filteredAndSortedGigs = useMemo(() => {
    let result = gigs.filter((gig) => {
      const matchesCategory =
        selectedCategory === 'All' || gig.category === selectedCategory;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        gig.title.toLowerCase().includes(q) ||
        gig.creatorName.toLowerCase().includes(q) ||
        gig.creatorBio.toLowerCase().includes(q) ||
        gig.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
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
  }, [gigs, searchQuery, selectedCategory, sortOption]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Top Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs">
        {/* Search input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search creator skills, editing, branding, beats, coding, TikTok..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        {/* Discovery Sort Dropdown (DP3 Implementation) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-2 text-xs">
            <ArrowUpDown className="h-3.5 w-3.5 text-indigo-600" />
            <span className="text-slate-500 hidden sm:inline">Rank by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as DiscoverySortOption)}
              className="bg-transparent font-semibold text-slate-900 focus:outline-none cursor-pointer"
            >
              <option value="smart_rotation">Fair Rotation (DP3 Default)</option>
              <option value="newest">Newest First</option>
              <option value="cheapest">Lowest Rate ($)</option>
              <option value="highest_rated">Highest Rated (★)</option>
              <option value="fastest">Fastest Turnaround</option>
            </select>
          </div>

          <button
            onClick={() => setShowFormulaDetails(!showFormulaDetails)}
            className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-2 text-indigo-600 hover:bg-indigo-100/70 transition-colors"
            title="Inspect DP3 Discovery Algorithm"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* DP3 Discovery Algorithm Explainer Drawer (When toggled) */}
      {showFormulaDetails && (
        <div className="rounded-2xl border border-indigo-200 bg-gradient-to-r from-indigo-50/80 via-white to-cyan-50/50 p-4 text-xs animate-in slide-in-from-top-2 duration-150 shadow-xs">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded-md bg-indigo-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
                  DP3 Discovery Architecture
                </span>
                <span className="font-bold text-slate-900">Why Fair Rotation over Pure Popularity?</span>
              </div>
              <p className="mt-1.5 text-slate-600 leading-relaxed max-w-3xl">
                Traditional gig marketplaces create a winner-take-all monopoly where top 1% creators hoard all client bookings. Our discovery ranker uses an anti-monopoly rotation formula:
                <code className="mx-1 rounded bg-indigo-100/80 px-1.5 py-0.5 font-mono text-indigo-800">
                  Score = (Recency × 0.35) + (Rotation Factor × 0.35) + (Completion Rate × 0.30)
                </code>
                This ensures young creators get genuine client impressions within their first 48 hours without paying pay-to-win sponsored listing fees.
              </p>
            </div>
            <button
              onClick={() => setShowFormulaDetails(false)}
              className="text-slate-400 hover:text-slate-700 text-xs font-bold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`whitespace-nowrap rounded-xl px-3.5 py-1.5 text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-slate-900'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Results Count & Policy Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredAndSortedGigs.length}</span> creator gigs in{' '}
          <span className="font-semibold text-indigo-700">{selectedCategory}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
          <span>Zero Client Platform Fees</span>
        </div>
      </div>

      {/* Gigs Grid */}
      {filteredAndSortedGigs.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <Search className="h-6 w-6" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-900">No gigs matched your search</h4>
          <p className="mt-1 text-xs text-slate-500">
            Try adjusting your search terms or select another category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
            }}
            className="mt-4 rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Reset Filters
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
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xs transition-all hover:border-slate-300 hover:shadow-lg"
              >
                {/* Card Top */}
                <div className="p-5">
                  {/* Creator Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={gig.creatorAvatar}
                        alt={gig.creatorName}
                        className="h-10 w-10 rounded-full border border-slate-200 object-cover"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs font-bold text-slate-900">{gig.creatorName}</h4>
                          <span className="rounded bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 text-[9px] font-bold text-indigo-700">
                            Creator
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">{gig.creatorHandle}</p>
                      </div>
                    </div>

                    <span className="rounded-lg bg-slate-100 px-2.5 py-1 text-[10px] font-semibold text-slate-700">
                      {gig.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mt-3.5 text-sm font-bold text-slate-900 leading-snug line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {gig.title}
                  </h3>

                  {/* Description */}
                  <p className="mt-2 text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {gig.description}
                  </p>

                  {/* Tags */}
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {gig.tags.slice(0, 3).map((tag, idx) => (
                      <span
                        key={idx}
                        className="rounded-md bg-slate-50 border border-slate-200 px-2 py-0.5 text-[10px] text-slate-600 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* DP2 Notice if pending bookings exist */}
                  {hasPending && (
                    <div className="mt-3 rounded-lg bg-amber-50/80 border border-amber-200/70 p-2 text-[10px] text-amber-800 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {gig.pendingBookingsCount} client currently in queue
                      </span>
                      <span className="font-bold">
                        {isStrictLocked ? 'Lockout Active' : 'Accepting'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Bottom Meta & Booking CTA */}
                <div className="border-t border-slate-100 bg-slate-50/60 p-4 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-1 text-xs">
                      <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      <span className="font-bold text-slate-900">{gig.rating.toFixed(2)}</span>
                      <span className="text-[10px] text-slate-400">({gig.reviewsCount})</span>
                    </div>
                    <div className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span>{gig.deliveryDays}d turnaround</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-base font-extrabold text-slate-900 leading-none">
                        ${gig.rate}
                      </div>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {gig.rateType === 'hourly' ? '/ hr' : 'fixed'}
                      </span>
                    </div>

                    <button
                      id={`book-gig-btn-${gig.id}`}
                      onClick={() => onSelectBookGig(gig)}
                      disabled={isStrictLocked}
                      className="rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-[0.98]"
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
