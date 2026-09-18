export type SkillCategory = 'tech' | 'languages' | 'music' | 'design' | 'business' | 'craft';

export type ProficiencyTier = 'Beginner' | 'Intermediate' | 'Expert';

export interface SkillNode {
  id: string;
  name: string;
  category: SkillCategory;
  level: ProficiencyTier;
  teachesCount: number;
  wantsCount: number;
  liquidityScore: number; // 1 - 100
  color: string;
  description: string;
  x?: number;
  y?: number;
  vx?: number;
  vy?: number;
  fx?: number | null;
  fy?: number | null;
}

export interface SkillEdge {
  id: string;
  source: string;
  target: string;
  type: 'active_chain' | 'high_demand' | 'direct_swap';
  label?: string;
  volume: number;
}

export interface BarterStep {
  stepNumber: number;
  fromUser: {
    id: string;
    name: string;
    avatar: string;
    isCurrentUser?: boolean;
    badge?: string;
  };
  toUser: {
    id: string;
    name: string;
    avatar: string;
    isCurrentUser?: boolean;
    badge?: string;
  };
  teachesSkill: string;
  skillCategory: SkillCategory;
  hours: number;
  format: string;
}

export interface ChainChatMessage {
  id: string;
  chainId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  isCurrentUser?: boolean;
  badge?: string;
  role: 'Provider' | 'Intermediary' | 'Recipient' | 'System';
  timestamp: string;
  content: string;
  type?: 'text' | 'schedule_proposal' | 'escrow_lock' | 'schedule_agreed' | 'system_alert';
  scheduleData?: {
    proposedDate: string;
    timeSlot: string;
    hours: number;
    format: string;
    proposerName: string;
  };
}

export interface ChainScheduleProposal {
  proposedDate: string;
  timeSlot: string;
  timezone: string;
  hours: number;
  format: string;
  status: 'coordinating' | 'locked' | 'disputed';
  confirmations: {
    userId: string;
    userName: string;
    role: string;
    confirmed: boolean;
    confirmedAt?: string;
  }[];
  notes?: string;
}

export interface BarterChain {
  id: string;
  title: string;
  targetSkill: string;
  sourceSkill: string;
  hopsCount: number;
  confidenceScore: number; // e.g. 98%
  timeBalanceHours: number; // e.g. 4 hours each
  savingsDays: number; // time saved vs bilateral search
  description: string;
  steps: BarterStep[];
  status: 'recommended' | 'active' | 'in_negotiation';
  category: SkillCategory;
  verifiedAnchorsInvolved: number;
  scheduleProposal?: ChainScheduleProposal;
  chatHistory?: ChainChatMessage[];
}

export type TrustBadgeType = 'Community Vetted' | 'Quick Responder' | 'Master Instructor' | 'Sprint Lead';

export interface TrustAnchor {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  location: string;
  bio: string;
  completedHours: number;
  rating: number;
  reviewCount: number;
  responseTime: string;
  badges: TrustBadgeType[];
  glowColor: 'emerald' | 'cyan' | 'amber' | 'purple';
  teachSkills: { name: string; tier: ProficiencyTier; category: SkillCategory }[];
  wantSkills: { name: string; tier: ProficiencyTier; category: SkillCategory }[];
  recentReview: {
    author: string;
    rating: number;
    text: string;
    swapSkill: string;
  };
  verifiedSince: string;
}

export interface Sprint {
  id: string;
  title: string;
  description: string;
  category: SkillCategory;
  host: {
    id: string;
    name: string;
    avatar: string;
    badge: TrustBadgeType;
  };
  scheduledDate: string;
  durationMins: number;
  currentParticipants: number;
  maxParticipants: number;
  tags: string[];
  isJoined?: boolean;
  difficulty: ProficiencyTier;
}

export interface PostSkillSubmission {
  teachSkill: string;
  teachCategory: SkillCategory;
  teachTier: ProficiencyTier;
  teachDescription: string;
  learnSkill: string;
  learnCategory: SkillCategory;
  learnTier: ProficiencyTier;
  sessionFormat: '1-on-1 Live' | 'Async Code/Work Review' | 'Pair Jam / Practice';
  hoursPerWeek: number;
}

export interface BarterMilestone {
  id: string;
  title: string;
  hours: number;
  deliverable: string;
  isMentorSigned: boolean;
  isStudentSigned: boolean;
  isReleased: boolean;
  txHash?: string;
  rubricScore?: {
    clarity: number; // 1-5
    practicality: number; // 1-5
    pacing: number; // 1-5
  };
}

export interface ActiveBarterSession {
  id: string;
  title: string;
  partner: {
    id: string;
    name: string;
    avatar: string;
    handle: string;
    reputation: number;
  };
  teaching: string;
  receiving: string;
  escrowTotalHours: number;
  status: 'locked' | 'in_progress' | 'settled';
  milestones: BarterMilestone[];
  createdAt: string;
}

export interface EqualizerAnalysis {
  cognitiveParityRatio: number;
  prepTimeDifferentialMins: number;
  recommendedCurriculum: {
    session: number;
    title: string;
    offerContribution: string;
    seekContribution: string;
    duration: string;
  }[];
  fairnessVerdict: string;
  suggestedOffset: string;
}

export interface VerifiableAttestation {
  id: string;
  skill: string;
  category: SkillCategory;
  tier: ProficiencyTier;
  attestedBy: string;
  attesterHandle: string;
  attesterAvatar: string;
  timestamp: string;
  txHash: string;
  rating: number;
  feedback: string;
}

export interface KnowledgePassportData {
  ownerName: string;
  handle: string;
  avatar: string;
  did: string; // Decentralized Identifier e.g. did:nexus:8f921...
  verifiedHours: number;
  totalSwaps: number;
  reputationScore: number;
  categoryCompetencies: {
    category: SkillCategory;
    score: number; // 0 - 100
    level: ProficiencyTier;
  }[];
  attestations: VerifiableAttestation[];
  badges: {
    id: string;
    name: string;
    description: string;
    iconType: string;
    earnedDate: string;
  }[];
}

// ==========================================
// CREATOR MARKETPLACE & GIG MONETIZATION TYPES
// ==========================================

export type GigCategory =
  | 'Video & Animation'
  | 'Design & Branding'
  | 'Social Media & Growth'
  | 'Music & Audio'
  | 'Web & Coding'
  | 'Writing & Content';

export type GigRateType = 'fixed' | 'hourly';

export interface GigItem {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar: string;
  creatorBio: string;
  category: GigCategory;
  rate: number;
  rateType: GigRateType;
  deliveryDays: number;
  description: string;
  deliverables: string[];
  rating: number;
  reviewsCount: number;
  completedGigs: number;
  createdAt: string;
  isFeatured?: boolean;
  pendingBookingsCount: number; // For DP2 double booking tracking
  rotationScore: number; // For DP3 fair discovery rank
  tags: string[];
}

export type BookingStatus = 'Pending' | 'Accepted' | 'Declined';

export interface BookingItem {
  id: string; // e.g. "BK-8291"
  gigId: string;
  gigTitle: string;
  gigCategory: GigCategory;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  clientName: string;
  clientEmail: string;
  projectBrief: string;
  proposedDeadline: string;
  rate: number;
  rateType: GigRateType;
  status: BookingStatus;
  submittedAt: string;
  declineReason?: string; // For DP1
  declineNote?: string;   // For DP1
  acceptedAt?: string;
}

export type DoubleBookingPolicy = 'flexible_queue' | 'strict_lockout';
export type DiscoverySortOption = 'smart_rotation' | 'newest' | 'cheapest' | 'highest_rated' | 'fastest';
