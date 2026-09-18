import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Users,
  Sparkles,
  Lock,
  Unlock,
  Download,
  Video,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ArrowRight,
  RefreshCw,
  Check,
  Smile,
  Info
} from 'lucide-react';
import { BarterChain, ChainChatMessage, ChainScheduleProposal } from '../types';

interface ChainNegotiationChatProps {
  chain: BarterChain;
  onUpdateChain: (updatedChain: BarterChain) => void;
  onLaunchWorkspace?: (chain: BarterChain) => void;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

export const ChainNegotiationChat: React.FC<ChainNegotiationChatProps> = ({
  chain,
  onUpdateChain,
  onLaunchWorkspace,
  onAddToast,
}) => {
  // Current active proposal
  const [proposal, setProposal] = useState<ChainScheduleProposal>(
    chain.scheduleProposal || {
      proposedDate: '2026-09-26',
      timeSlot: '14:00 - 18:00 UTC',
      timezone: 'UTC',
      hours: chain.timeBalanceHours || 4,
      format: '1-on-1 Interactive Code Pairing & Conversational German',
      status: 'coordinating',
      confirmations: [
        {
          userId: 'you',
          userName: 'You (Explorer)',
          role: `Teaches ${chain.sourceSkill} (${chain.timeBalanceHours}h)`,
          confirmed: true,
          confirmedAt: '10 mins ago',
        },
        {
          userId: chain.steps[0]?.toUser.id || 'user-b',
          userName: chain.steps[0]?.toUser.name || 'Elena Rostova',
          role: `Teaches ${chain.steps[1]?.teachesSkill || 'Intermediary Skill'} (${chain.timeBalanceHours}h)`,
          confirmed: true,
          confirmedAt: '5 mins ago',
        },
        {
          userId: chain.steps[1]?.toUser.id || 'user-a',
          userName: chain.steps[1]?.toUser.name || 'Marco Weber',
          role: `Teaches ${chain.targetSkill} (${chain.timeBalanceHours}h)`,
          confirmed: false,
        },
      ],
      notes: 'Synchronized multi-party time-escrow block. All slots overlap on Saturday to ensure zero currency parity.',
    }
  );

  // Chat message state
  const [messages, setMessages] = useState<ChainChatMessage[]>(
    chain.chatHistory || [
      {
        id: 'msg-1',
        chainId: chain.id,
        senderId: 'system',
        senderName: 'Nexus Escrow Protocol',
        senderAvatar: '',
        role: 'System',
        timestamp: 'Today, 13:45 UTC',
        content: `Circular barter loop initiated for "${chain.sourceSkill}" ➔ "${chain.targetSkill}". 3 peers in escrow coordination.`,
        type: 'system_alert',
      },
      {
        id: 'msg-2',
        chainId: chain.id,
        senderId: chain.steps[0]?.toUser.id || 'user-b',
        senderName: chain.steps[0]?.toUser.name || 'Elena Rostova',
        senderAvatar: chain.steps[0]?.toUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        badge: 'Quick Responder',
        role: 'Intermediary',
        timestamp: '13:48 UTC',
        content: `Hey everyone! Excited about this loop. I am available to coordinate on Saturday afternoon UTC.`,
        type: 'text',
      },
    ]
  );

  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [isCounterProposalOpen, setIsCounterProposalOpen] = useState(false);

  // Counter proposal form inputs
  const [counterDate, setCounterDate] = useState('2026-09-27');
  const [counterTimeSlot, setCounterTimeSlot] = useState('15:00 - 19:00 UTC');
  const [counterHours, setCounterHours] = useState(chain.timeBalanceHours || 4);
  const [counterFormat, setCounterFormat] = useState(
    'Split Sessions: 2x 2h Live Pairing & Speaking Immersion'
  );
  const [counterNote, setCounterNote] = useState(
    'Proposing Sunday afternoon to better accommodate Berlin & European timezones.'
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom on message update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Check consensus: do all 3 participants agree?
  const allConfirmed = proposal.confirmations.every((c) => c.confirmed);
  const confirmedCount = proposal.confirmations.filter((c) => c.confirmed).length;

  // Handle User Confirm / Toggle Escrow Agreement
  const handleToggleUserConfirmation = () => {
    const userConf = proposal.confirmations.find((c) => c.userId === 'you');
    const nextConfirmed = !userConf?.confirmed;

    const updatedConfirmations = proposal.confirmations.map((c) =>
      c.userId === 'you'
        ? {
            ...c,
            confirmed: nextConfirmed,
            confirmedAt: nextConfirmed ? 'Just now' : undefined,
          }
        : c
    );

    const willAllConfirm = updatedConfirmations.every((c) => c.confirmed);

    const updatedProposal: ChainScheduleProposal = {
      ...proposal,
      confirmations: updatedConfirmations,
      status: willAllConfirm ? 'locked' : 'coordinating',
    };

    setProposal(updatedProposal);

    // Add confirmation message to chat
    const newMsg: ChainChatMessage = {
      id: `msg-${Date.now()}`,
      chainId: chain.id,
      senderId: 'you',
      senderName: 'You (Explorer)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isCurrentUser: true,
      role: 'Provider',
      timestamp: 'Just now',
      content: nextConfirmed
        ? `✓ I have signed and confirmed the time-escrow schedule for ${proposal.proposedDate} (${proposal.timeSlot}).`
        : 'I withdrew my schedule confirmation to suggest an adjustment.',
      type: nextConfirmed ? 'schedule_agreed' : 'text',
    };

    const newMessages = [...messages, newMsg];
    setMessages(newMessages);

    // Update parent chain state
    onUpdateChain({
      ...chain,
      status: willAllConfirm ? 'active' : 'in_negotiation',
      scheduleProposal: updatedProposal,
      chatHistory: newMessages,
    });

    if (onAddToast) {
      if (nextConfirmed) {
        onAddToast(
          'Schedule Signed!',
          `You approved the time slot: ${proposal.proposedDate} • ${proposal.timeSlot}.`,
          'success'
        );
      } else {
        onAddToast('Confirmation Withdrawn', 'Schedule slot marked as pending.', 'info');
      }
    }
  };

  // Simulate Peer Confirmation (e.g. Marco Weber signs to achieve 3/3 consensus)
  const handleSimulatePeerSign = () => {
    const pendingPeer = proposal.confirmations.find((c) => !c.confirmed);
    if (!pendingPeer) return;

    setIsTyping(`${pendingPeer.userName} is signing escrow schedule...`);

    setTimeout(() => {
      setIsTyping(null);

      const updatedConfirmations = proposal.confirmations.map((c) =>
        c.userId === pendingPeer.userId
          ? {
              ...c,
              confirmed: true,
              confirmedAt: 'Just now',
            }
          : c
      );

      const updatedProposal: ChainScheduleProposal = {
        ...proposal,
        confirmations: updatedConfirmations,
        status: 'locked',
      };

      setProposal(updatedProposal);

      const peerMsg: ChainChatMessage = {
        id: `msg-${Date.now()}`,
        chainId: chain.id,
        senderId: pendingPeer.userId,
        senderName: pendingPeer.userName,
        senderAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        badge: 'Master Instructor',
        role: 'Recipient',
        timestamp: 'Just now',
        content: `Wunderbar! I have checked my Berlin calendar and signed the schedule. 4.0 hours time-escrow is fully matched and locked. Looking forward to our session!`,
        type: 'schedule_agreed',
      };

      const systemLockMsg: ChainChatMessage = {
        id: `msg-sys-${Date.now()}`,
        chainId: chain.id,
        senderId: 'system',
        senderName: 'Nexus Escrow Protocol',
        senderAvatar: '',
        role: 'System',
        timestamp: 'Just now',
        content: `🎉 3/3 Mutual Consensus Reached! Escrow Vault is pre-funded with ${proposal.hours}h per peer. Schedule synchronized for ${proposal.proposedDate} (${proposal.timeSlot}). Live Swap Room is now unlocked.`,
        type: 'escrow_lock',
      };

      const newMessages = [...messages, peerMsg, systemLockMsg];
      setMessages(newMessages);

      onUpdateChain({
        ...chain,
        status: 'active',
        scheduleProposal: updatedProposal,
        chatHistory: newMessages,
      });

      if (onAddToast) {
        onAddToast(
          '3/3 Consensus Reached!',
          'All 3 participants signed! Escrow Vault locked and Live Swap Room is ready.',
          'chain'
        );
      }
    }, 900);
  };

  // Submit Counter Proposal
  const handleSubmitCounterProposal = (e: React.FormEvent) => {
    e.preventDefault();

    const newProposal: ChainScheduleProposal = {
      proposedDate: counterDate,
      timeSlot: counterTimeSlot,
      timezone: 'UTC',
      hours: counterHours,
      format: counterFormat,
      status: 'coordinating',
      confirmations: [
        {
          userId: 'you',
          userName: 'You (Explorer)',
          role: `Teaches ${chain.sourceSkill} (${counterHours}h)`,
          confirmed: true,
          confirmedAt: 'Just now',
        },
        {
          userId: chain.steps[0]?.toUser.id || 'user-b',
          userName: chain.steps[0]?.toUser.name || 'Elena Rostova',
          role: `Teaches ${chain.steps[1]?.teachesSkill || 'UI/UX'} (${counterHours}h)`,
          confirmed: false,
        },
        {
          userId: chain.steps[1]?.toUser.id || 'user-a',
          userName: chain.steps[1]?.toUser.name || 'Marco Weber',
          role: `Teaches ${chain.targetSkill} (${counterHours}h)`,
          confirmed: false,
        },
      ],
      notes: counterNote,
    };

    setProposal(newProposal);
    setIsCounterProposalOpen(false);

    const proposalMsg: ChainChatMessage = {
      id: `msg-prop-${Date.now()}`,
      chainId: chain.id,
      senderId: 'you',
      senderName: 'You (Explorer)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isCurrentUser: true,
      role: 'Provider',
      timestamp: 'Just now',
      content: `I have counter-proposed an updated time-escrow schedule for ${counterDate} at ${counterTimeSlot}. Reason: "${counterNote}"`,
      type: 'schedule_proposal',
      scheduleData: {
        proposedDate: counterDate,
        timeSlot: counterTimeSlot,
        hours: counterHours,
        format: counterFormat,
        proposerName: 'You (Explorer)',
      },
    };

    const newMessages = [...messages, proposalMsg];
    setMessages(newMessages);

    onUpdateChain({
      ...chain,
      status: 'in_negotiation',
      scheduleProposal: newProposal,
      chatHistory: newMessages,
    });

    if (onAddToast) {
      onAddToast(
        'Counter-Proposal Broadcasted',
        `Dispatched new proposed slot (${counterDate} ${counterTimeSlot}) to loop participants.`,
        'info'
      );
    }

    // Simulate realistic peer response to the counter proposal
    setIsTyping('Elena Rostova is reviewing new schedule...');
    setTimeout(() => {
      setIsTyping(null);
      const peerReply: ChainChatMessage = {
        id: `msg-reply-${Date.now()}`,
        chainId: chain.id,
        senderId: chain.steps[0]?.toUser.id || 'user-b',
        senderName: chain.steps[0]?.toUser.name || 'Elena Rostova',
        senderAvatar: chain.steps[0]?.toUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        badge: 'Quick Responder',
        role: 'Intermediary',
        timestamp: 'Just now',
        content: `The Sunday slot (${counterDate} at ${counterTimeSlot}) works seamlessly for my Figma critique. I just signed!`,
        type: 'schedule_agreed',
      };

      setProposal((prev) => ({
        ...prev,
        confirmations: prev.confirmations.map((c) =>
          c.userId === (chain.steps[0]?.toUser.id || 'user-b')
            ? { ...c, confirmed: true, confirmedAt: 'Just now' }
            : c
        ),
      }));

      setMessages((prev) => [...prev, peerReply]);
    }, 1500);
  };

  // Send standard chat message
  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim()) return;

    const userText = inputMessage.trim();
    setInputMessage('');

    const newMsg: ChainChatMessage = {
      id: `msg-${Date.now()}`,
      chainId: chain.id,
      senderId: 'you',
      senderName: 'You (Explorer)',
      senderAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isCurrentUser: true,
      role: 'Provider',
      timestamp: 'Just now',
      content: userText,
      type: 'text',
    };

    const nextList = [...messages, newMsg];
    setMessages(nextList);

    onUpdateChain({
      ...chain,
      chatHistory: nextList,
    });

    // Real-time conversational simulation
    const lower = userText.toLowerCase();
    let replySender = chain.steps[0]?.toUser.name || 'Elena Rostova';
    let replyAvatar = chain.steps[0]?.toUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';
    let replyContent = `Noted! Let's make sure our 4-hour escrow blocks align so the smart vault auto-disburses.`;

    if (lower.includes('saturday') || lower.includes('weekend') || lower.includes('sunday')) {
      replyContent = `Weekend works great. I can pair for 2 hours in the morning and 2 hours in the late afternoon.`;
    } else if (lower.includes('split') || lower.includes('2h') || lower.includes('hours')) {
      replyContent = `Splitting into two 2-hour milestones is smart. That way the Proof-of-Skill milestones release incrementally!`;
    } else if (lower.includes('marco') || lower.includes('german')) {
      replySender = chain.steps[1]?.toUser.name || 'Marco Weber';
      replyAvatar = chain.steps[1]?.toUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
      replyContent = `Ja, genau! I will prepare the B2 conversation prompt sheets beforehand so we get the most out of our session.`;
    } else if (lower.includes('ready') || lower.includes('lock') || lower.includes('confirm')) {
      replyContent = `Everything looks locked in on my end. Ready whenever you are!`;
    }

    setIsTyping(`${replySender} is typing...`);

    setTimeout(() => {
      setIsTyping(null);
      const peerMsg: ChainChatMessage = {
        id: `msg-peer-${Date.now()}`,
        chainId: chain.id,
        senderId: 'peer-auto',
        senderName: replySender,
        senderAvatar: replyAvatar,
        role: replySender.includes('Elena') ? 'Intermediary' : 'Recipient',
        timestamp: 'Just now',
        content: replyContent,
        type: 'text',
      };
      setMessages((prev) => [...prev, peerMsg]);
    }, 1200);
  };

  // Download real .ics calendar invite
  const handleExportICS = () => {
    const calendarContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//SkillNexus//Barter Escrow Coordination//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `SUMMARY:SkillNexus 3-Party Swap: ${chain.sourceSkill} ➔ ${chain.targetSkill}`,
      `DESCRIPTION:Coordinated time-escrow barter session between You, ${chain.steps[0]?.toUser.name}, and ${chain.steps[1]?.toUser.name}. Zero currency, 1:1 time parity. Format: ${proposal.format}`,
      `DTSTART:${proposal.proposedDate.replace(/-/g, '')}T140000Z`,
      `DTEND:${proposal.proposedDate.replace(/-/g, '')}T180000Z`,
      'LOCATION:SkillNexus Live Workspace Room',
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([calendarContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SkillNexus-Barter-${chain.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    if (onAddToast) {
      onAddToast('Calendar Invite Downloaded', '.ics calendar file exported successfully.', 'success');
    }
  };

  // Quick suggestion chips
  const quickSuggestions = [
    '📅 Saturday 14:00 - 18:00 UTC works for me!',
    '✅ Confirmed my 4.0h escrow allocation',
    '⏱️ Can we split this into two 2h milestones?',
    '🔄 Propose Sunday afternoon slot instead',
  ];

  return (
    <div className="space-y-4">
      {/* 1. Header & Live Participants Presence Ribbon */}
      <div className="rounded-xl border border-indigo-200/90 bg-gradient-to-r from-indigo-50/90 via-cyan-50/60 to-white p-4 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-indigo-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="rounded-full bg-indigo-600 px-2.5 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">
                In Negotiation
              </span>
              <span className="text-xs font-bold text-slate-900">
                3-Party Time-Escrow Coordination Channel
              </span>
            </div>
            <p className="mt-1 text-xs text-slate-600">
              Synchronizing session times & smart escrow parity between all 3 peers before final contract execution.
            </p>
          </div>

          {/* Time Parity Pill */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            <div className="rounded-lg border border-emerald-300 bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-800 flex items-center gap-1.5 shadow-xs">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              <span>{proposal.hours}h : {proposal.hours}h : {proposal.hours}h Parity</span>
            </div>
            {allConfirmed ? (
              <span className="rounded-lg bg-emerald-600 text-white px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                <Lock className="h-3.5 w-3.5" />
                <span>Escrow Locked</span>
              </span>
            ) : (
              <span className="rounded-lg bg-amber-100 border border-amber-300 text-amber-900 px-2.5 py-1 text-xs font-bold flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-amber-700" />
                <span>{confirmedCount}/3 Signed</span>
              </span>
            )}
          </div>
        </div>

        {/* Participant Presence Cards */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {/* Participant 1: You */}
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white/90 p-2.5">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="You"
                className="h-9 w-9 rounded-full object-cover border border-indigo-200"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate flex items-center gap-1">
                <span>You (Explorer)</span>
              </div>
              <div className="text-[10px] text-indigo-600 font-medium truncate">
                Teaches: {chain.sourceSkill}
              </div>
              <div className="text-[10px] text-emerald-600 font-semibold flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Active Online</span>
              </div>
            </div>
          </div>

          {/* Participant 2: User B */}
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white/90 p-2.5">
            <div className="relative">
              <img
                src={chain.steps[0]?.toUser.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt={chain.steps[0]?.toUser.name || 'Elena Rostova'}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {chain.steps[0]?.toUser.name || 'Elena Rostova'}
              </div>
              <div className="text-[10px] text-indigo-600 font-medium truncate">
                Teaches: {chain.steps[1]?.teachesSkill || 'UI/UX Design'}
              </div>
              <div className="text-[10px] text-slate-500 flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span>Active 2m ago</span>
              </div>
            </div>
          </div>

          {/* Participant 3: User A */}
          <div className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white/90 p-2.5">
            <div className="relative">
              <img
                src={chain.steps[1]?.toUser.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={chain.steps[1]?.toUser.name || 'Marco Weber'}
                className="h-9 w-9 rounded-full object-cover border border-slate-200"
              />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-amber-500 ring-2 ring-white"></span>
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-slate-900 truncate">
                {chain.steps[1]?.toUser.name || 'Marco Weber'}
              </div>
              <div className="text-[10px] text-indigo-600 font-medium truncate">
                Teaches: {chain.targetSkill}
              </div>
              <div className="text-[10px] text-amber-700 font-semibold flex items-center gap-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                <span>In Berlin (UTC+2)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive Time-Escrow Schedule Coordination Module */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-start gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
              <Calendar className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-slate-900">
                  Proposed Time-Escrow Schedule
                </h4>
                {allConfirmed ? (
                  <span className="rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5">
                    Synchronized & Verified
                  </span>
                ) : (
                  <span className="rounded bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5">
                    Awaiting Mutual Sign-off
                  </span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                <span className="font-semibold text-indigo-700">
                  📅 {proposal.proposedDate}
                </span>
                <span>•</span>
                <span className="font-semibold text-slate-800">
                  ⏰ {proposal.timeSlot}
                </span>
                <span>•</span>
                <span>Format: {proposal.format}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleExportICS}
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
            >
              <Download className="h-3.5 w-3.5 text-slate-500" />
              <span>Export .ics</span>
            </button>

            <button
              onClick={() => setIsCounterProposalOpen(!isCounterProposalOpen)}
              className="flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50/70 px-3 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-100/70 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5 text-indigo-600" />
              <span>Propose Counter-Time</span>
              {isCounterProposalOpen ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* 3-Party Consensus Checklist */}
        <div className="my-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
          {proposal.confirmations.map((conf) => (
            <div
              key={conf.userId}
              className={`rounded-lg border p-2.5 transition-all ${
                conf.confirmed
                  ? 'border-emerald-200 bg-emerald-50/50'
                  : 'border-amber-200 bg-amber-50/40'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900">{conf.userName}</span>
                {conf.confirmed ? (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Signed</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                    <Clock className="h-3.5 w-3.5 text-amber-600" />
                    <span>Pending</span>
                  </span>
                )}
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5 truncate">{conf.role}</div>
              <div className="text-[10px] text-slate-400 mt-1">
                {conf.confirmed ? `Confirmed ${conf.confirmedAt || 'recently'}` : 'Needs approval'}
              </div>
            </div>
          ))}
        </div>

        {/* Sign Actions Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <button
              id="confirm-escrow-schedule-btn"
              onClick={handleToggleUserConfirmation}
              className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold shadow-xs transition-all ${
                proposal.confirmations.find((c) => c.userId === 'you')?.confirmed
                  ? 'border border-emerald-300 bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'
              }`}
            >
              <Check className="h-4 w-4" />
              <span>
                {proposal.confirmations.find((c) => c.userId === 'you')?.confirmed
                  ? 'You Signed (Click to Revoke)'
                  : 'Sign & Agree to Escrow Schedule'}
              </span>
            </button>

            {!allConfirmed && (
              <button
                id="simulate-peer-sign-btn"
                onClick={handleSimulatePeerSign}
                className="flex items-center gap-1.5 rounded-xl border border-amber-300 bg-amber-50 px-3.5 py-2 text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all"
                title="Simulate Marco Weber's approval to achieve immediate 3/3 consensus"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-600" />
                <span>Simulate Peer Approval (Marco Signs)</span>
              </button>
            )}
          </div>

          {allConfirmed && (
            <button
              id="launch-swap-room-chain-btn"
              onClick={() => onLaunchWorkspace && onLaunchWorkspace(chain)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-emerald-500/20 hover:from-emerald-700 hover:to-teal-700 active:scale-[0.98] transition-all"
            >
              <Video className="h-4 w-4" />
              <span>Enter Live Swap Room</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Counter-Proposal Drawer Form */}
        {isCounterProposalOpen && (
          <form
            onSubmit={handleSubmitCounterProposal}
            className="mt-4 rounded-xl border border-indigo-200 bg-indigo-50/40 p-4 animate-in fade-in duration-200 space-y-3"
          >
            <div className="flex items-center justify-between">
              <h5 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-indigo-600" />
                <span>Propose Counter-Schedule to Loop Participants</span>
              </h5>
              <span className="text-[10px] text-slate-500">
                Will require mutual 3/3 re-confirmation
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Proposed Date
                </label>
                <input
                  type="date"
                  value={counterDate}
                  onChange={(e) => setCounterDate(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Time Slot (UTC)
                </label>
                <select
                  value={counterTimeSlot}
                  onChange={(e) => setCounterTimeSlot(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                >
                  <option value="10:00 - 14:00 UTC">Morning (10:00 - 14:00 UTC)</option>
                  <option value="14:00 - 18:00 UTC">Afternoon (14:00 - 18:00 UTC)</option>
                  <option value="15:00 - 19:00 UTC">Late Afternoon (15:00 - 19:00 UTC)</option>
                  <option value="18:00 - 22:00 UTC">Evening (18:00 - 22:00 UTC)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Session Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="8"
                  value={counterHours}
                  onChange={(e) => setCounterHours(parseFloat(e.target.value) || 4)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Format & Notes for Peers
              </label>
              <input
                type="text"
                value={counterNote}
                onChange={(e) => setCounterNote(e.target.value)}
                placeholder="e.g. Proposing Sunday to fit European timezone"
                className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsCounterProposalOpen(false)}
                className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200/60"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-indigo-600 px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700"
              >
                Broadcast Counter-Proposal
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 3. Real-Time Group Message Stream */}
      <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4 shadow-xs">
        <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-indigo-600" />
            <h4 className="text-xs sm:text-sm font-bold text-slate-900">
              Live Negotiation Thread
            </h4>
            <span className="rounded-full bg-slate-200 px-2 py-0.2 text-[10px] font-semibold text-slate-700">
              {messages.length} messages
            </span>
          </div>
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3 text-emerald-600" />
            <span>Encrypted Nexus Handshake</span>
          </span>
        </div>

        {/* Messages List */}
        <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
          {messages.map((msg) => {
            if (msg.type === 'system_alert' || msg.type === 'escrow_lock') {
              return (
                <div key={msg.id} className="flex justify-center my-2">
                  <div
                    className={`max-w-md rounded-xl border px-3.5 py-2 text-center text-xs shadow-2xs ${
                      msg.type === 'escrow_lock'
                        ? 'border-emerald-300 bg-emerald-50 text-emerald-900 font-medium'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5 font-bold mb-0.5 text-indigo-700">
                      <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
                      <span>{msg.senderName}</span>
                      <span className="text-[10px] font-normal text-slate-400">
                        • {msg.timestamp}
                      </span>
                    </div>
                    <div>{msg.content}</div>
                  </div>
                </div>
              );
            }

            const isMe = msg.isCurrentUser || msg.senderId === 'you';

            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={msg.senderAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                    alt={msg.senderName}
                    className="h-7 w-7 rounded-full object-cover border border-slate-200 mt-1 shrink-0"
                  />
                )}

                <div
                  className={`max-w-sm sm:max-w-md rounded-2xl p-3 shadow-2xs ${
                    isMe
                      ? 'bg-indigo-600 text-white rounded-br-xs'
                      : 'bg-white border border-slate-200/90 text-slate-800 rounded-bl-xs'
                  }`}
                >
                  <div
                    className={`flex items-center gap-1.5 text-[10px] mb-1 ${
                      isMe ? 'text-indigo-200 justify-end' : 'text-slate-500'
                    }`}
                  >
                    <span className="font-bold">{msg.senderName}</span>
                    {msg.role && (
                      <span
                        className={`rounded px-1.5 py-0.2 text-[9px] font-semibold uppercase ${
                          isMe
                            ? 'bg-indigo-700 text-indigo-100'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {msg.role}
                      </span>
                    )}
                    <span>• {msg.timestamp}</span>
                  </div>

                  {/* Message body */}
                  <div className="text-xs leading-relaxed">{msg.content}</div>

                  {/* If this is a schedule proposal card inside the chat */}
                  {msg.scheduleData && (
                    <div
                      className={`mt-2 rounded-lg border p-2.5 text-xs ${
                        isMe
                          ? 'border-indigo-400 bg-indigo-700/60 text-white'
                          : 'border-slate-200 bg-slate-50 text-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 font-bold mb-1">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>Proposed Slot: {msg.scheduleData.proposedDate}</span>
                      </div>
                      <div className="text-[11px] opacity-90">
                        {msg.scheduleData.timeSlot} • {msg.scheduleData.hours} Hours
                      </div>
                      <div className="text-[10px] opacity-75 mt-0.5">
                        {msg.scheduleData.format}
                      </div>
                    </div>
                  )}
                </div>

                {isMe && (
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="You"
                    className="h-7 w-7 rounded-full object-cover border border-indigo-200 mt-1 shrink-0"
                  />
                )}
              </div>
            );
          })}

          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center gap-2 text-xs text-slate-500 italic py-1 animate-pulse">
              <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
              <span>{isTyping}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Chips */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200">
          <span className="text-[10px] font-semibold text-slate-500 mr-1">Quick Responses:</span>
          {quickSuggestions.map((text, idx) => (
            <button
              key={idx}
              onClick={() => {
                setInputMessage(text);
              }}
              className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-medium text-slate-700 hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-800 transition-colors"
            >
              {text}
            </button>
          ))}
        </div>

        {/* Interactive Chat Composer */}
        <form onSubmit={handleSendMessage} className="mt-3 flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type message to coordinate schedule with Elena and Marco..."
            className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none shadow-2xs"
          />

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
