import React, { useState, useEffect } from 'react';
import { Navbar, AppMode, MarketplaceSubTab } from './components/Navbar';
import { SkillGraphVisualization } from './components/SkillGraphVisualization';
import { NexusBarterChainTool } from './components/NexusBarterChainTool';
import { PostSkillPanel } from './components/PostSkillPanel';
import { TrustAnchorProfiles } from './components/TrustAnchorProfiles';
import { CollaborativeSprintsBoard } from './components/CollaborativeSprintsBoard';
import { BarterRatioEqualizer } from './components/BarterRatioEqualizer';
import { EscrowVaultMilestoneValidator } from './components/EscrowVaultMilestoneValidator';
import { KnowledgePassportCard } from './components/KnowledgePassportCard';
import { LiveBarterSessionWorkspace } from './components/LiveBarterSessionWorkspace';
import { CreatorMarketplaceView } from './components/creator/CreatorMarketplaceView';
import { BriefAiCopilotModal } from './components/creator/BriefAiCopilotModal';
import { FreelanceRateCalculatorModal } from './components/creator/FreelanceRateCalculatorModal';
import { EscrowDisputeArbitratorModal } from './components/creator/EscrowDisputeArbitratorModal';
import { CircularBarterLoopVisualizer } from './components/creator/CircularBarterLoopVisualizer';
import { CreatorPassportCardModal } from './components/creator/CreatorPassportCardModal';
import { FullStackSkillRoadmap } from './components/FullStackSkillRoadmap';
import { ModernStackShowcase } from './components/ModernStackShowcase';
import { FaqAccordion } from './components/FaqAccordion';
import { CommandPalette } from './components/CommandPalette';
import { OfflineBanner } from './components/OfflineBanner';
import { FloatingSupport } from './components/FloatingSupport';
import { CookieBanner } from './components/CookieBanner';
import { LegalModal } from './components/LegalModals';
import { BackToTop } from './components/BackToTop';
import { StickyMobileCTA } from './components/StickyMobileCTA';
import {
  ProposeChainModal,
  DirectSwapModal,
  ToastContainer,
  ToastMessage
} from './components/ModalsAndToast';
import {
  INITIAL_SKILL_NODES,
  INITIAL_SKILL_EDGES,
  INITIAL_BARTER_CHAINS,
  INITIAL_TRUST_ANCHORS,
  INITIAL_SPRINTS,
  INITIAL_ACTIVE_SESSIONS,
  INITIAL_KNOWLEDGE_PASSPORT
} from './data/mockData';
import { INITIAL_GIGS } from './data/creatorMarketplaceData';
import {
  SkillNode,
  SkillEdge,
  BarterChain,
  TrustAnchor,
  Sprint,
  PostSkillSubmission,
  ActiveBarterSession,
  KnowledgePassportData,
  VerifiableAttestation,
  CurrencyCode,
  CreatorProfile,
  GigItem,
  GigCategory
} from './types';
import {
  Network,
  ArrowRightLeft,
  GraduationCap,
  ShieldCheck,
  Calendar,
  Sparkles,
  Zap,
  Clock,
  Users,
  CheckCircle2,
  Scale,
  Lock,
  Award,
  Video,
  ShoppingBag,
  Sliders,
  ArrowRight,
  PlusCircle,
  Code,
  Layers,
  HelpCircle,
  FileText
} from 'lucide-react';

export default function App() {
  // App mode defaulting to Creator Marketplace
  const [appMode, setAppMode] = useState<AppMode>('creator_market');
  const [marketplaceTab, setMarketplaceTab] = useState<MarketplaceSubTab>('browse');
  const [isPostGigModalOpen, setIsPostGigModalOpen] = useState<boolean>(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState<boolean>(false);
  const [legalModalType, setLegalModalType] = useState<'privacy' | 'terms' | null>(null);

  // 5 Unique Ecosystem Modal & Currency States
  const [currency, setCurrency] = useState<CurrencyCode>('USD');
  const [isBriefCopilotOpen, setIsBriefCopilotOpen] = useState<boolean>(false);
  const [isRateCalculatorOpen, setIsRateCalculatorOpen] = useState<boolean>(false);
  const [isDisputeArbitratorOpen, setIsDisputeArbitratorOpen] = useState<boolean>(false);
  const [isCircularBarterOpen, setIsCircularBarterOpen] = useState<boolean>(false);
  const [isPassportModalOpen, setIsPassportModalOpen] = useState<boolean>(false);
  const [selectedPassportCreator, setSelectedPassportCreator] = useState<CreatorProfile | undefined>(undefined);

  const [skills, setSkills] = useState<SkillNode[]>(INITIAL_SKILL_NODES);
  const [edges, setEdges] = useState<SkillEdge[]>(INITIAL_SKILL_EDGES);
  const [barterChains, setBarterChains] = useState<BarterChain[]>(INITIAL_BARTER_CHAINS);
  const [trustAnchors, setTrustAnchors] = useState<TrustAnchor[]>(INITIAL_TRUST_ANCHORS);
  const [sprints, setSprints] = useState<Sprint[]>(INITIAL_SPRINTS);
  const [activeSessions, setActiveSessions] = useState<ActiveBarterSession[]>(INITIAL_ACTIVE_SESSIONS);
  const [passport, setPassport] = useState<KnowledgePassportData>(INITIAL_KNOWLEDGE_PASSPORT);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<string>('skill-graph-section');

  // Modal states
  const [proposingChain, setProposingChain] = useState<BarterChain | null>(null);
  const [selectedSwapAnchor, setSelectedSwapAnchor] = useState<TrustAnchor | null>(null);
  const [isLiveWorkspaceOpen, setIsLiveWorkspaceOpen] = useState<boolean>(false);
  const [currentWorkspaceSession, setCurrentWorkspaceSession] = useState<ActiveBarterSession | null>(null);
  const [prefilledTeachSkill, setPrefilledTeachSkill] = useState<string>('React Basics');
  const [prefilledLearnSkill, setPrefilledLearnSkill] = useState<string>('German');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'chain' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Global ⌘K / Ctrl+K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCommandAction = (actionId: string, meta?: any) => {
    switch (actionId) {
      case 'open_post_gig':
        setAppMode('creator_market');
        setIsPostGigModalOpen(true);
        break;
      case 'open_post_skill':
        setAppMode('barter_network');
        handleNavigate('post-skill-section');
        break;
      case 'open_live_swap':
        setCurrentWorkspaceSession(activeSessions[0] || null);
        setIsLiveWorkspaceOpen(true);
        break;
      case 'nav_roadmap':
        handleNavigate('developer-roadmap-section');
        break;
      case 'nav_stack':
        handleNavigate('hackathon-stack-section');
        break;
      case 'nav_faq':
        handleNavigate('platform-faq-section');
        break;
      case 'nav_privacy':
        setLegalModalType('privacy');
        break;
      case 'nav_terms':
        setLegalModalType('terms');
        break;
      case 'select_skill':
        if (meta?.skill) {
          handleSelectSkillForBarter(meta.skill, 'learn');
        }
        break;
      case 'book_mentorship':
        if (meta?.skill) {
          setAppMode('creator_market');
          setMarketplaceTab('browse');
          addToast('Mentorship Query', `Searching gigs & mentors for "${meta.skill}".`, 'info');
        }
        break;
      default:
        break;
    }
  };

  // Scroll smoothly to section
  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Skill selected from Graph
  const handleSelectSkillForBarter = (skillName: string, role: 'teach' | 'learn') => {
    if (role === 'teach') {
      setPrefilledTeachSkill(skillName);
      addToast('Skill Selected to Teach', `Set "${skillName}" as your teaching offer.`, 'info');
    } else {
      setPrefilledLearnSkill(skillName);
      addToast('Skill Selected to Learn', `Set "${skillName}" as your learning target.`, 'info');
    }
    handleNavigate('post-skill-section');
  };

  const handleFindChainsForSkill = (skillName: string) => {
    handleNavigate('barter-chains-section');
    addToast(
      'Nexus Barter Routes',
      `Displaying active multi-party trade loops involving "${skillName}".`,
      'chain'
    );
  };

  const handleApplyEqualizerToPost = (teachSkill: string, learnSkill: string) => {
    setPrefilledTeachSkill(teachSkill);
    setPrefilledLearnSkill(learnSkill);
    handleNavigate('post-skill-section');
    addToast(
      'Equalizer Applied to Post Panel',
      `Configured "${teachSkill}" to teach and "${learnSkill}" to learn.`,
      'success'
    );
  };

  const handleLaunchWorkspaceForSession = (session: ActiveBarterSession) => {
    setCurrentWorkspaceSession(session);
    setIsLiveWorkspaceOpen(true);
    addToast(
      'Nexus Swap Room Initialized',
      `Connected to live P2P exchange with ${session.partner.name}.`,
      'info'
    );
  };

  const handleAttestAndSettleFromWorkspace = (sessionId: string, milestoneId: string) => {
    const txHash = `0x${Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;

    setActiveSessions((prev) =>
      prev.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          milestones: s.milestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  isMentorSigned: true,
                  isStudentSigned: true,
                  isReleased: true,
                  txHash,
                }
              : m
          ),
        };
      })
    );

    // Update passport stats
    setPassport((prev) => ({
      ...prev,
      verifiedHours: Number((prev.verifiedHours + 1.5).toFixed(1)),
      totalSwaps: prev.totalSwaps + 1,
    }));
  };

  const handleAddAttestation = (att: VerifiableAttestation) => {
    setPassport((prev) => ({
      ...prev,
      attestations: [att, ...prev.attestations],
      totalSwaps: prev.totalSwaps + 1,
      verifiedHours: Number((prev.verifiedHours + 1.0).toFixed(1)),
    }));
  };

  // Handle Post Form Submit
  const handlePostSubmit = (submission: PostSkillSubmission) => {
    // 1. Check if node exists or add new node
    const teachId = submission.teachSkill.toLowerCase().replace(/\s+/g, '-');
    const learnId = submission.learnSkill.toLowerCase().replace(/\s+/g, '-');

    setSkills((prev) => {
      let next = [...prev];
      if (!next.find((s) => s.name.toLowerCase() === submission.teachSkill.toLowerCase())) {
        next.push({
          id: teachId,
          name: submission.teachSkill,
          category: submission.teachCategory,
          level: submission.teachTier,
          teachesCount: 1,
          wantsCount: 0,
          liquidityScore: 85,
          color: '#10b981',
          description: submission.teachDescription || 'User offered skill in community pool.',
        });
      }
      if (!next.find((s) => s.name.toLowerCase() === submission.learnSkill.toLowerCase())) {
        next.push({
          id: learnId,
          name: submission.learnSkill,
          category: submission.learnCategory,
          level: submission.learnTier,
          teachesCount: 0,
          wantsCount: 1,
          liquidityScore: 80,
          color: '#06b6d4',
          description: 'Community sought learning objective.',
        });
      }
      return next;
    });

    // 2. Add an edge representing this barter intent
    setEdges((prev) => [
      ...prev,
      {
        id: `e-user-${Date.now()}`,
        source: teachId,
        target: learnId,
        type: 'active_chain',
        label: 'Your Trade Intent',
        volume: 1,
      },
    ]);

    // 3. Dynamically generate a brand new 3-party circular barter chain for this user's declaration!
    const newChain: BarterChain = {
      id: `chain-user-${Date.now()}`,
      title: `The ${submission.teachSkill} ➔ ${submission.learnSkill} Nexus Loop`,
      targetSkill: submission.learnSkill,
      sourceSkill: submission.teachSkill,
      hopsCount: 2,
      confidenceScore: 97,
      timeBalanceHours: submission.hoursPerWeek,
      savingsDays: 4.8,
      status: 'recommended',
      category: submission.learnCategory,
      verifiedAnchorsInvolved: 2,
      description: `To unlock "${submission.learnSkill}" from Master Instructor Marco, you teach "${submission.teachSkill}" to Elena Rostova, who teaches UI Systems to Marco.`,
      steps: [
        {
          stepNumber: 1,
          fromUser: {
            id: 'you',
            name: 'You (Explorer)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            isCurrentUser: true,
          },
          toUser: {
            id: 'user-b',
            name: 'Elena Rostova',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            badge: 'Quick Responder',
          },
          teachesSkill: submission.teachSkill,
          skillCategory: submission.teachCategory,
          hours: submission.hoursPerWeek,
          format: submission.sessionFormat,
        },
        {
          stepNumber: 2,
          fromUser: {
            id: 'user-b',
            name: 'Elena Rostova',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
            badge: 'Quick Responder',
          },
          toUser: {
            id: 'user-a',
            name: 'Marco Weber',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            badge: 'Master Instructor',
          },
          teachesSkill: 'UI/UX Design Systems',
          skillCategory: 'design',
          hours: submission.hoursPerWeek,
          format: 'Design Critique & Specs',
        },
        {
          stepNumber: 3,
          fromUser: {
            id: 'user-a',
            name: 'Marco Weber',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
            badge: 'Master Instructor',
          },
          toUser: {
            id: 'you',
            name: 'You (Explorer)',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
            isCurrentUser: true,
          },
          teachesSkill: submission.learnSkill,
          skillCategory: submission.learnCategory,
          hours: submission.hoursPerWeek,
          format: 'Conversational Mentorship',
        },
      ],
    };

    setBarterChains((prev) => [newChain, ...prev]);

    addToast(
      'Declaration Published to Nexus!',
      `Synthesized a new 3-party circular barter chain for "${submission.teachSkill}" ➔ "${submission.learnSkill}".`,
      'chain'
    );
  };

  // Propose Chain confirmation
  const handleConfirmChainProposal = (chainId: string, message: string) => {
    setBarterChains((prev) =>
      prev.map((c) => (c.id === chainId ? { ...c, status: 'in_negotiation' } : c))
    );
    addToast(
      'Barter Chain Broadcasted!',
      'All 3 participants have received your proposal and time-escrow allocation notice.',
      'success'
    );
  };

  // Direct Swap Request confirmation
  const handleConfirmDirectSwap = (anchorName: string, skillWanted: string, skillOffered: string) => {
    addToast(
      'Direct Swap Request Sent',
      `Invitation dispatched to ${anchorName} for ${skillWanted} in exchange for ${skillOffered}.`,
      'success'
    );
  };

  // Toggle Sprint Join state
  const handleToggleSprintJoin = (sprintId: string) => {
    setSprints((prev) =>
      prev.map((s) => {
        if (s.id === sprintId) {
          const nextJoined = !s.isJoined;
          const nextCount = nextJoined ? s.currentParticipants + 1 : s.currentParticipants - 1;
          if (nextJoined) {
            addToast('Enrolled in Sprint!', `You joined "${s.title}". See you in the cohort!`, 'success');
          } else {
            addToast('Removed from Sprint', `You withdrew from "${s.title}".`, 'info');
          }
          return {
            ...s,
            isJoined: nextJoined,
            currentParticipants: nextCount,
          };
        }
        return s;
      })
    );
  };

  const handleAddNewSprint = (newSprint: Sprint) => {
    setSprints((prev) => [newSprint, ...prev]);
    addToast('Sprint Published!', `"${newSprint.title}" is now live on the Sprint Board.`, 'success');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-500/20 selection:text-indigo-700">
      {/* Top sticky navigation */}
      <Navbar
        appMode={appMode}
        onSetAppMode={setAppMode}
        activeMarketplaceTab={marketplaceTab}
        onSetMarketplaceTab={(tab) => {
          setAppMode('creator_market');
          setMarketplaceTab(tab);
          const el = document.getElementById('creator-marketplace-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        pendingInquiriesCount={1}
        onOpenPostGigModal={() => {
          setAppMode('creator_market');
          setIsPostGigModalOpen(true);
        }}
        onNavigate={handleNavigate}
        activeSection={activeSection}
        onOpenPostSkillModal={() => handleNavigate('post-skill-section')}
        onOpenLiveWorkspace={() => {
          setCurrentWorkspaceSession(activeSessions[0] || null);
          setIsLiveWorkspaceOpen(true);
        }}
        barterChainsCount={barterChains.length}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        currency={currency}
        onSetCurrency={setCurrency}
        onOpenBriefCopilot={() => setIsBriefCopilotOpen(true)}
        onOpenRateCalculator={() => setIsRateCalculatorOpen(true)}
        onOpenCircularBarter={() => setIsCircularBarterOpen(true)}
        onOpenDisputeArbitrator={() => setIsDisputeArbitratorOpen(true)}
      />

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-12">
        {appMode === 'creator_market' ? (
          <>
            {/* Creator Economy Hero Banner */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-indigo-50/40 to-cyan-50/30 p-6 sm:p-10 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

              <div className="relative z-10 max-w-3xl">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 shadow-xs">
                    <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                    <span>The Creator Economy Runs on Marketplaces</span>
                  </span>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>5 Features + 3 Decision Points (20 PTS)</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Where Young Creators Monetize Skills &{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    Clients Book Gigs.
                  </span>
                </h1>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  Empowering Gen-Z and student creators to turn real-world creative capabilities (video editing, branding, beats, web coding, copywriting) into paid client engagements with zero barrier to entry.
                </p>

                {/* Platform Metrics */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 pt-6">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900">6 Specialized</div>
                    <div className="text-[11px] font-medium text-slate-500">Live Creator Gigs</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-cyan-600">$25 - $80</div>
                    <div className="text-[11px] font-medium text-slate-500">Young Creator Rates</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">1 - 3 Days</div>
                    <div className="text-[11px] font-medium text-slate-500">Rapid Turnaround Times</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-indigo-600">$0.00 Hold</div>
                    <div className="text-[11px] font-medium text-slate-500">Guaranteed Escrow Protection</div>
                  </div>
                </div>

                {/* Quick Navigation Controls */}
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    id="hero-browse-gigs-btn"
                    onClick={() => setMarketplaceTab('browse')}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-indigo-500/25 hover:from-indigo-700 hover:to-cyan-700 active:scale-[0.98] transition-all"
                  >
                    <ShoppingBag className="h-4 w-4" />
                    <span>Browse & Search Gigs</span>
                  </button>

                  <button
                    id="hero-post-gig-btn"
                    onClick={() => setIsPostGigModalOpen(true)}
                    className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-indigo-700 shadow-xs hover:bg-indigo-50 transition-all"
                  >
                    <PlusCircle className="h-4 w-4 text-indigo-600" />
                    <span>Post a Gig (Feature 1)</span>
                  </button>

                  <button
                    id="hero-dashboard-btn"
                    onClick={() => setMarketplaceTab('dashboard')}
                    className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs sm:text-sm font-bold text-slate-800 shadow-xs hover:bg-slate-50 transition-all"
                  >
                    <span>Creator Dashboard (1 Pending)</span>
                  </button>

                  <button
                    id="hero-decision-points-btn"
                    onClick={() => setMarketplaceTab('decision_points')}
                    className="flex items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50/70 px-4 py-2.5 text-xs sm:text-sm font-bold text-cyan-800 shadow-xs hover:bg-cyan-100 transition-all"
                  >
                    <Sliders className="h-4 w-4 text-cyan-700" />
                    <span>20 PTS Decision Points</span>
                  </button>
                </div>
              </div>
            </section>

            {/* Creator Marketplace Core Component */}
            <CreatorMarketplaceView
              activeTab={marketplaceTab}
              onChangeTab={setMarketplaceTab}
              isPostGigModalOpen={isPostGigModalOpen}
              onOpenPostModal={() => setIsPostGigModalOpen(true)}
              onClosePostModal={() => setIsPostGigModalOpen(false)}
              onAddToast={addToast}
              currency={currency}
              onOpenPassport={(creatorName) => {
                const gig = INITIAL_GIGS.find((g) => g.creatorName.toLowerCase() === creatorName?.toLowerCase()) || INITIAL_GIGS[0];
                const profile: CreatorProfile = {
                  id: gig.creatorId,
                  name: gig.creatorName,
                  title: `${gig.category} Specialist`,
                  avatar: gig.creatorAvatar,
                  bio: gig.creatorBio,
                  rating: gig.rating,
                  reviewsCount: gig.reviewsCount,
                  completedGigsCount: gig.completedGigs,
                  category: gig.category,
                  hourlyRate: gig.rate,
                  skills: gig.tags,
                  badges: ['Community Vetted', 'Top 5% Response'],
                  reputationScore: 98,
                  barterHoursCompleted: 14.5,
                  responseRatePercent: 99,
                };
                setSelectedPassportCreator(profile);
                setIsPassportModalOpen(true);
              }}
              onOpenBriefCopilot={() => setIsBriefCopilotOpen(true)}
              onOpenRateCalculator={() => setIsRateCalculatorOpen(true)}
            />

            {/* Mode Switch Transition Callout */}
            <div className="rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                  <Network className="h-4 w-4" />
                  <span>Looking for Zero-Cash Peer Swaps?</span>
                </div>
                <h3 className="text-lg font-bold text-white">
                  Explore the SkillNexus Peer Knowledge Barter Network
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Trade skills without cash. Features interactive 3D/2D force-directed skill graphs, autonomous circular barter loop synthesis, and soulbound knowledge passports.
                </p>
              </div>

              <button
                onClick={() => {
                  setAppMode('barter_network');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-900 shadow-md hover:bg-slate-100 active:scale-[0.98] transition-all whitespace-nowrap"
              >
                <span>Launch Barter Lab</span>
                <ArrowRight className="h-4 w-4 text-indigo-600" />
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Barter Return Notice */}
            <div className="flex items-center justify-between rounded-xl border border-indigo-200 bg-indigo-50/80 px-4 py-3 text-xs sm:text-sm text-indigo-900">
              <div className="flex items-center gap-2">
                <Network className="h-4 w-4 text-indigo-600" />
                <span className="font-semibold">P2P Knowledge Barter Lab Active</span>
                <span className="text-indigo-500">•</span>
                <span className="text-indigo-700 hidden sm:inline">Zero-cash skill exchange protocol</span>
              </div>
              <button
                onClick={() => {
                  setAppMode('creator_market');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-700 shadow-xs"
              >
                <ShoppingBag className="h-3.5 w-3.5" />
                <span>Back to Creator Marketplace</span>
              </button>
            </div>

            {/* Barter Hero */}
            <section className="relative overflow-hidden rounded-3xl border border-slate-200/90 bg-gradient-to-br from-white via-indigo-50/40 to-cyan-50/30 p-6 sm:p-10 shadow-xl shadow-slate-200/50 backdrop-blur-xl">
              <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl"></div>
              <div className="pointer-events-none absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl"></div>

              <div className="relative z-10 max-w-3xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 mb-4 shadow-xs">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>Multi-Party Peer-to-Peer Knowledge Protocol</span>
                </div>

                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
                  Trade What You Know.{' '}
                  <span className="bg-gradient-to-r from-indigo-600 via-cyan-600 to-purple-600 bg-clip-text text-transparent">
                    Unlock What You Need.
                  </span>
                </h1>

                <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl">
                  SkillNexus replaces currency with pure knowledge barter. Our AI graph engine automatically resolves complex circular trade chains, enabling seamless learning loops between mentors across disciplines.
                </p>

                {/* Platform Stats Row */}
                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-slate-200/80 pt-6">
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-slate-900">428</div>
                    <div className="text-[11px] font-medium text-slate-500">Active Barter Links</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-cyan-600">1,420 hrs</div>
                    <div className="text-[11px] font-medium text-slate-500">Knowledge Escrowed</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-emerald-600">98.4%</div>
                    <div className="text-[11px] font-medium text-slate-500">Chain Completion</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-indigo-600">$0.00</div>
                    <div className="text-[11px] font-medium text-slate-500">Zero Cash Required</div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => {
                      setCurrentWorkspaceSession(activeSessions[0] || null);
                      setIsLiveWorkspaceOpen(true);
                    }}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all"
                  >
                    <Video className="h-4 w-4" />
                    <span>Enter Live Swap Room</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('skill-graph-section')}
                    className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-xs hover:bg-indigo-100/70 transition-all"
                  >
                    <Network className="h-4 w-4" />
                    <span>Explore Skill Graph</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('knowledge-passport-section')}
                    className="flex items-center gap-2 rounded-xl border border-indigo-200 bg-indigo-50/70 px-4 py-2.5 text-xs sm:text-sm font-semibold text-indigo-700 shadow-xs hover:bg-indigo-100/70 transition-all"
                  >
                    <Award className="h-4 w-4 text-indigo-600" />
                    <span>Knowledge Passport</span>
                  </button>

                  <button
                    onClick={() => handleNavigate('barter-equalizer-section')}
                    className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
                  >
                    <Scale className="h-4 w-4 text-indigo-600" />
                    <span>Equalizer Lab</span>
                  </button>
                </div>
              </div>
            </section>

            {/* 1. Interactive Skill Graph Visualization */}
            <SkillGraphVisualization
              skills={skills}
              edges={edges}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              onSelectSkillForBarter={handleSelectSkillForBarter}
              onFindChainsForSkill={handleFindChainsForSkill}
            />

            {/* 2. Dynamic "Nexus Barter Chain" Tool */}
            <NexusBarterChainTool
              chains={barterChains}
              availableSkills={skills}
              onProposeChain={(chain) => setProposingChain(chain)}
              onSelectSkill={handleFindChainsForSkill}
            />

            {/* 3. Autonomous Barter Ratio & Equalizer Lab */}
            <BarterRatioEqualizer
              availableSkills={skills}
              onApplyToPostForm={handleApplyEqualizerToPost}
              onAddToast={addToast}
            />

            {/* 4. Smart Escrow & Proof-of-Skill Milestone Validator */}
            <EscrowVaultMilestoneValidator
              sessions={activeSessions}
              onUpdateSessions={setActiveSessions}
              availableTrustAnchors={trustAnchors}
              onLaunchWorkspace={handleLaunchWorkspaceForSession}
              onAddToast={addToast}
            />

            {/* 5. Soulbound Knowledge Passport & Skill Radar */}
            <KnowledgePassportCard
              passport={passport}
              onAddAttestation={handleAddAttestation}
              onAddToast={addToast}
            />

            {/* 6. Structured "Post a Skill/Request" Panel */}
            <PostSkillPanel
              onPostSubmit={handlePostSubmit}
              availableSkills={skills}
              initialTeachSkill={prefilledTeachSkill}
              initialLearnSkill={prefilledLearnSkill}
            />

            {/* 7. Community "Trust Anchor" Profiles */}
            <TrustAnchorProfiles
              anchors={trustAnchors}
              onRequestSwap={(anchor) => setSelectedSwapAnchor(anchor)}
              onFilterBySkill={(skillName) => {
                handleNavigate('skill-graph-section');
                addToast('Filtered Graph', `Focused on skills matching "${skillName}".`, 'info');
              }}
            />

            {/* 8. Collaborative "Sprints" & Workshop Board */}
            <CollaborativeSprintsBoard
              sprints={sprints}
              onToggleJoin={handleToggleSprintJoin}
              onAddNewSprint={handleAddNewSprint}
            />
          </>
        )}

        {/* ========================================================================= */}
        {/* UNIVERSAL ECOSYSTEM SECTIONS (ROADMAP, MODERN STACK & FAQ)               */}
        {/* ========================================================================= */}

        {/* 1. Full Stack Developer Roadmap Section (Images 1 & 2) */}
        <section id="developer-roadmap-section" className="pt-6">
          <FullStackSkillRoadmap
            onSelectSkill={(skillName) => {
              if (appMode === 'creator_market') {
                setMarketplaceTab('browse');
                const el = document.getElementById('creator-marketplace-section');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              } else {
                handleSelectSkillForBarter(skillName, 'learn');
              }
              addToast('Skill Selected', `Filtering roadmap gigs & barter offers for "${skillName}".`, 'info');
            }}
            onBookMentorship={(skillName) => {
              setCurrentWorkspaceSession(activeSessions[0] || null);
              setIsLiveWorkspaceOpen(true);
              addToast('Mentorship Session', `Opening 1-on-1 mentorship room for "${skillName}".`, 'success');
            }}
            onAddToast={addToast}
          />
        </section>

        {/* 2. Modern AI & Hackathon Stack Showcase (Image 3) */}
        <section id="hackathon-stack-section" className="pt-6">
          <ModernStackShowcase onAddToast={addToast} />
        </section>

        {/* 3. Platform FAQ Section (Images 4 & 5) */}
        <section id="platform-faq-section" className="pt-6">
          <FaqAccordion />
        </section>
      </main>

      {/* Enhanced Production Footer */}
      <footer className="mt-16 border-t border-slate-200 bg-white py-12 text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-3 md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-600 text-white font-black text-sm">
                  SN
                </div>
                <span className="text-base font-bold text-slate-900">Skill<span className="text-indigo-600">Nexus</span></span>
                <span className="rounded-full bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 text-[10px] border border-emerald-200">Production v2.4</span>
              </div>
              <p className="text-slate-600 text-xs leading-relaxed max-w-md">
                The dual-mode creative infrastructure for Gen-Z specialists. Monetize creator capabilities through milestone escrow or trade knowledge via autonomous multi-party barter loops.
              </p>
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => setIsCommandPaletteOpen(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100"
                >
                  <kbd className="font-mono bg-white border border-slate-200 rounded px-1 text-[10px]">⌘K</kbd>
                  <span>Quick Commands</span>
                </button>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Platform Navigation</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => { setAppMode('creator_market'); setMarketplaceTab('browse'); }} className="hover:text-indigo-600 transition-colors">
                    Browse Creator Gigs
                  </button>
                </li>
                <li>
                  <button onClick={() => { setAppMode('creator_market'); setMarketplaceTab('dashboard'); }} className="hover:text-indigo-600 transition-colors">
                    Creator Dashboard
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('developer-roadmap-section')} className="hover:text-indigo-600 transition-colors">
                    Full Stack Roadmap (7 Branches)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('hackathon-stack-section')} className="hover:text-indigo-600 transition-colors">
                    Modern Stack (Firebase, Groq, 21st.dev)
                  </button>
                </li>
                <li>
                  <button onClick={() => handleNavigate('platform-faq-section')} className="hover:text-indigo-600 transition-colors">
                    FAQ & Security
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-3">Compliance & Escrow</h4>
              <ul className="space-y-2 text-xs">
                <li>
                  <button onClick={() => setLegalModalType('privacy')} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                    <Lock className="h-3 w-3 text-slate-400" />
                    <span>Privacy Policy (GDPR/CCPA)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => setLegalModalType('terms')} className="hover:text-indigo-600 transition-colors flex items-center gap-1">
                    <Scale className="h-3 w-3 text-slate-400" />
                    <span>Terms & Escrow Agreement</span>
                  </button>
                </li>
                <li>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <ShieldCheck className="h-3 w-3" />
                    <span>Milestone Escrow Protected</span>
                  </span>
                </li>
                <li>
                  <span className="text-slate-400">Firebase Firestore Real-time Sync</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400">
            <div>
              © 2026 SkillNexus Technologies Inc. All rights reserved.
            </div>
            <div className="flex items-center gap-4 text-xs">
              <button onClick={() => setLegalModalType('privacy')} className="hover:text-slate-600">Privacy</button>
              <span>•</span>
              <button onClick={() => setLegalModalType('terms')} className="hover:text-slate-600">Terms</button>
              <span>•</span>
              <button onClick={() => handleNavigate('developer-roadmap-section')} className="hover:text-slate-600">Roadmap</button>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals & Toasts */}
      <ProposeChainModal
        chain={proposingChain}
        isOpen={!!proposingChain}
        onClose={() => setProposingChain(null)}
        onConfirmProposal={handleConfirmChainProposal}
      />

      <DirectSwapModal
        anchor={selectedSwapAnchor}
        isOpen={!!selectedSwapAnchor}
        onClose={() => setSelectedSwapAnchor(null)}
        onConfirmSwap={handleConfirmDirectSwap}
      />

      {/* Real-time Peer Barter Workspace Modal */}
      <LiveBarterSessionWorkspace
        isOpen={isLiveWorkspaceOpen}
        onClose={() => setIsLiveWorkspaceOpen(false)}
        session={currentWorkspaceSession || activeSessions[0] || null}
        onAttestAndSettle={handleAttestAndSettleFromWorkspace}
        onAddToast={addToast}
      />

      {/* 5 Unique Advanced Ecosystem Modals */}
      <BriefAiCopilotModal
        isOpen={isBriefCopilotOpen}
        onClose={() => setIsBriefCopilotOpen(false)}
        gigs={INITIAL_GIGS}
        onSelectGigToBook={(gig, prefilledBrief) => {
          setIsBriefCopilotOpen(false);
          setAppMode('creator_market');
          setMarketplaceTab('browse');
          addToast(
            'Creator Gig Matched',
            `Selected "${gig.title}" by ${gig.creatorName}. ${prefilledBrief ? 'Brief loaded!' : ''}`,
            'success'
          );
        }}
        currency={currency}
        onAddToast={addToast}
      />

      <FreelanceRateCalculatorModal
        isOpen={isRateCalculatorOpen}
        onClose={() => setIsRateCalculatorOpen(false)}
        currency={currency}
        onOpenPostGigWithRate={(rate, category) => {
          setIsRateCalculatorOpen(false);
          setAppMode('creator_market');
          setIsPostGigModalOpen(true);
          addToast('Rate Applied', `Preset $${rate}/hr loaded for ${category} gig.`, 'info');
        }}
        onAddToast={addToast}
      />

      <EscrowDisputeArbitratorModal
        isOpen={isDisputeArbitratorOpen}
        onClose={() => setIsDisputeArbitratorOpen(false)}
        currency={currency}
        onAddToast={addToast}
      />

      <CircularBarterLoopVisualizer
        isOpen={isCircularBarterOpen}
        onClose={() => setIsCircularBarterOpen(false)}
        currency={currency}
        onAddToast={addToast}
      />

      <CreatorPassportCardModal
        isOpen={isPassportModalOpen}
        onClose={() => {
          setIsPassportModalOpen(false);
          setSelectedPassportCreator(undefined);
        }}
        creator={selectedPassportCreator}
        currency={currency}
        onAddToast={addToast}
      />

      {/* 20 Crucial Production & UI Polish Widgets */}
      <OfflineBanner />
      <FloatingSupport />
      <BackToTop />
      <StickyMobileCTA
        currentMode={appMode}
        currentTab={marketplaceTab}
        onSetAppMode={setAppMode}
        onNavigateTab={(tab) => {
          setAppMode('creator_market');
          setMarketplaceTab(tab);
          const el = document.getElementById('creator-marketplace-section');
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenPostGig={() => {
          setAppMode('creator_market');
          setIsPostGigModalOpen(true);
        }}
        onOpenLiveSwap={() => {
          setCurrentWorkspaceSession(activeSessions[0] || null);
          setIsLiveWorkspaceOpen(true);
        }}
      />
      <CookieBanner
        onOpenPrivacyPolicy={() => setLegalModalType('privacy')}
        onOpenTerms={() => setLegalModalType('terms')}
      />
      <LegalModal
        isOpen={!!legalModalType}
        type={legalModalType || 'privacy'}
        onClose={() => setLegalModalType(null)}
      />
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectAction={handleCommandAction}
        onNavigateMarketplaceTab={(tab) => {
          setAppMode('creator_market');
          setMarketplaceTab(tab);
        }}
        onSetAppMode={setAppMode}
      />

      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
