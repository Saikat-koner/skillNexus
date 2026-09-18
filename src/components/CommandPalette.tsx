import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  PlusCircle,
  ShoppingBag,
  LayoutDashboard,
  Sparkles,
  ArrowRight,
  Code,
  Database,
  Shield,
  Server,
  Cloud,
  Layers,
  Copy,
  Check,
  X,
  HelpCircle,
  Video,
  FileText
} from 'lucide-react';
import { AppMode, MarketplaceSubTab } from './Navbar';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAction: (actionId: string, meta?: any) => void;
  onNavigateMarketplaceTab: (tab: MarketplaceSubTab) => void;
  onSetAppMode: (mode: AppMode) => void;
}

interface CommandItem {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Full Stack Skills' | 'Gigs' | 'Tools';
  icon: React.ComponentType<{ className?: string }>;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectAction,
  onNavigateMarketplaceTab,
  onSetAppMode,
}) => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSearch('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const allItems: CommandItem[] = [
    // Navigation
    {
      id: 'nav-browse',
      title: 'Browse & Search Marketplace Gigs',
      category: 'Navigation',
      icon: ShoppingBag,
      shortcut: 'G B',
      action: () => {
        onSetAppMode('creator_market');
        onNavigateMarketplaceTab('browse');
        onClose();
      },
    },
    {
      id: 'nav-roadmap',
      title: 'Full Stack Developer Skills Roadmap & Tree',
      category: 'Navigation',
      icon: Code,
      shortcut: 'G R',
      action: () => {
        onSelectAction('scroll-to', 'fullstack-roadmap-section');
        onClose();
      },
    },
    {
      id: 'nav-dashboard',
      title: 'Open Creator Dashboard & Earnings',
      category: 'Navigation',
      icon: LayoutDashboard,
      shortcut: 'G D',
      action: () => {
        onSetAppMode('creator_market');
        onNavigateMarketplaceTab('dashboard');
        onClose();
      },
    },
    {
      id: 'nav-decision-points',
      title: 'Inspect 3 Core Decision Points (20 PTS)',
      category: 'Navigation',
      icon: Layers,
      shortcut: 'G P',
      action: () => {
        onSetAppMode('creator_market');
        onNavigateMarketplaceTab('decision_points');
        onClose();
      },
    },
    {
      id: 'nav-barter-graph',
      title: 'Launch P2P Barter Network & Skill Graph',
      category: 'Navigation',
      icon: Sparkles,
      shortcut: 'G S',
      action: () => {
        onSetAppMode('barter_network');
        onClose();
      },
    },

    // Actions
    {
      id: 'act-post-gig',
      title: 'Post a New Creative Gig (Feature 1)',
      category: 'Actions',
      icon: PlusCircle,
      shortcut: 'N G',
      action: () => {
        onSelectAction('open-post-gig');
        onClose();
      },
    },
    {
      id: 'act-copy-url',
      title: 'Copy Live Platform URL to Clipboard',
      category: 'Actions',
      icon: Copy,
      action: () => {
        navigator.clipboard.writeText(window.location.href);
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        onSelectAction('toast', { title: 'URL Copied', message: 'Platform link copied to clipboard!' });
      },
    },
    {
      id: 'act-live-swap',
      title: 'Enter Live Video Mentorship Room',
      category: 'Actions',
      icon: Video,
      action: () => {
        onSelectAction('open-live-swap');
        onClose();
      },
    },
    {
      id: 'act-open-faq',
      title: 'Browse Frequently Asked Questions',
      category: 'Actions',
      icon: HelpCircle,
      action: () => {
        onSelectAction('scroll-to', 'faq-section');
        onClose();
      },
    },

    // Full Stack Skills
    {
      id: 'skill-frontend',
      title: 'Frontend: HTML, CSS, JavaScript, React / Next.js',
      category: 'Full Stack Skills',
      icon: Code,
      action: () => {
        onSelectAction('filter-skill', 'Frontend');
        onClose();
      },
    },
    {
      id: 'skill-backend',
      title: 'Backend: Node.js, Express, Python / FastAPI, Java / Spring',
      category: 'Full Stack Skills',
      icon: Server,
      action: () => {
        onSelectAction('filter-skill', 'Backend');
        onClose();
      },
    },
    {
      id: 'skill-db',
      title: 'Databases: PostgreSQL, MySQL, MongoDB, Redis, Firestore',
      category: 'Full Stack Skills',
      icon: Database,
      action: () => {
        onSelectAction('filter-skill', 'Databases');
        onClose();
      },
    },
    {
      id: 'skill-auth',
      title: 'Auth & Security: JWT, OAuth, Sessions, HTTPS, Firebase Rules',
      category: 'Full Stack Skills',
      icon: Shield,
      action: () => {
        onSelectAction('filter-skill', 'Auth');
        onClose();
      },
    },
    {
      id: 'skill-devops',
      title: 'DevOps & Cloud: Git, Docker, CI/CD, Cloud Deployment',
      category: 'Full Stack Skills',
      icon: Cloud,
      action: () => {
        onSelectAction('filter-skill', 'DevOps');
        onClose();
      },
    },

    // Gigs
    {
      id: 'gig-video',
      title: 'Viral TikTok & Shorts Video Editing ($45)',
      category: 'Gigs',
      icon: ShoppingBag,
      action: () => {
        onSelectAction('search-gig', 'video');
        onClose();
      },
    },
    {
      id: 'gig-uiux',
      title: 'SaaS Design System & High-Fi Mobile UI ($80)',
      category: 'Gigs',
      icon: ShoppingBag,
      action: () => {
        onSelectAction('search-gig', 'design');
        onClose();
      },
    },
    {
      id: 'gig-fullstack',
      title: 'Full Stack Next.js & Firebase MVP Development ($150)',
      category: 'Gigs',
      icon: ShoppingBag,
      action: () => {
        onSelectAction('search-gig', 'web');
        onClose();
      },
    },
  ];

  const filteredItems = allItems.filter(
    (item) =>
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredItems[selectedIndex]) {
        filteredItems[selectedIndex].action();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-slate-200 px-4 py-3.5">
          <Search className="h-5 w-5 text-indigo-600 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command, skill (React, Python, SQL), gig, or page..."
            className="w-full bg-transparent text-sm sm:text-base font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
          />
          <div className="flex items-center gap-1.5 shrink-0">
            <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold text-slate-500">
              ESC
            </kbd>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Search className="mx-auto h-8 w-8 text-slate-300 mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching commands or skills found</p>
              <p className="text-xs text-slate-400 mt-1">Try searching for "React", "Post Gig", "Dashboard", or "Backend"</p>
            </div>
          ) : (
            filteredItems.map((item, index) => {
              const Icon = item.icon;
              const isSelected = index === selectedIndex;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-sm transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-indigo-50 to-cyan-50/50 text-indigo-900 font-semibold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                        isSelected ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="truncate">
                      <div className="truncate text-xs sm:text-sm">{item.title}</div>
                      <div className="text-[10px] text-slate-400 font-normal uppercase tracking-wider">
                        {item.category}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    {item.shortcut && (
                      <kbd className="hidden sm:inline-block rounded border border-slate-200 bg-slate-100 px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                        {item.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={`h-3.5 w-3.5 ${isSelected ? 'text-indigo-600' : 'text-slate-300'}`} />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Quick Hints */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-semibold text-slate-700">↑↓</kbd> to navigate
            </span>
            <span>
              <kbd className="font-semibold text-slate-700">↵</kbd> to select
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
            <Command className="h-3 w-3" />
            <span>SkillNexus Command Hub</span>
          </div>
        </div>
      </div>
    </div>
  );
};
