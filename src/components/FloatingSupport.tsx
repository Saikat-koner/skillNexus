import React, { useState } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Flame,
  HelpCircle,
  ExternalLink,
  ChevronRight,
  Bot,
  User,
  CheckCircle2
} from 'lucide-react';

interface SupportMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
}

export const FloatingSupport: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<SupportMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Hello! I am your SkillNexus AI Assistant. How can I help you today? Select a quick topic below or type your inquiry.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const quickQuestions = [
    {
      q: 'How does escrow protection work?',
      a: 'Client funds are safely held in a milestone-based escrow lock upon booking. The creator receives the payout only after you approve the submitted deliverables.',
    },
    {
      q: 'How does Skill Barter differ from Cash Gigs?',
      a: 'Skill Barter lets creators swap skills directly (e.g. Video Editing for React Development) without cash changing hands, powered by circular 3-way barter chain matching.',
    },
    {
      q: 'Is my data synced with Firebase in real time?',
      a: 'Yes! SkillNexus uses Google Cloud Firestore with real-time onSnapshot listeners, meaning gig postings, direct messages, and order milestones sync instantaneously across all devices.',
    },
    {
      q: 'How do I earn the Top Rated badge?',
      a: 'Complete at least 5 orders with a 4.9+ average client review rating and maintain a 98%+ on-time deliverable rate.',
    },
  ];

  const handleSend = (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: SupportMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      time: 'Just now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');

    // Answer logic
    setTimeout(() => {
      let reply = "Thank you for reaching out! Our team is available 24/7. For urgent inquiries, email support@skillnexus.io or check our documentation.";
      const matched = quickQuestions.find(
        (item) => item.q.toLowerCase() === text.toLowerCase() || text.toLowerCase().includes(item.q.toLowerCase().slice(0, 15))
      );
      if (matched) {
        reply = matched.a;
      } else if (text.toLowerCase().includes('firebase') || text.toLowerCase().includes('database')) {
        reply = "SkillNexus uses Google Firebase SDK v11+ with Firestore NoSQL database, offering client-side caching and offline-first persistence.";
      } else if (text.toLowerCase().includes('refund') || text.toLowerCase().includes('cancel')) {
        reply = "You can request a full escrow refund anytime before the creator begins work or during active milestone mediation.";
      }

      const botMsg: SupportMessage = {
        id: `b-${Date.now()}`,
        sender: 'bot',
        text: reply,
        time: 'Just now',
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 600);
  };

  return (
    <>
      {/* Floating Toggle Button */}
      <div className="fixed bottom-6 left-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Open Live Support Assistant"
          className="group relative flex h-13 w-13 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Bot className="h-6 w-6" />}
          {!isOpen && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white"></span>
            </span>
          )}
        </button>
      </div>

      {/* Floating Support Modal Window */}
      {isOpen && (
        <div className="fixed bottom-22 left-6 z-50 w-full max-w-sm overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 px-5 py-4 text-white">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-md">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold">SkillNexus Assistant</h3>
                <div className="flex items-center gap-1.5 text-[11px] text-indigo-100">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>Online · Sub-second AI</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded-lg p-1 text-white/80 hover:bg-white/10 hover:text-white transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat Messages Log */}
          <div className="max-h-72 min-h-60 overflow-y-auto p-4 space-y-3 bg-slate-50/50 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {m.sender === 'bot' && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 font-bold text-[10px]">
                    AI
                  </div>
                )}
                <div
                  className={`rounded-2xl px-3.5 py-2.5 max-w-[80%] leading-relaxed ${
                    m.sender === 'user'
                      ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                      : 'border border-slate-200/90 bg-white text-slate-800 rounded-bl-xs shadow-xs'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Canned Quick Actions */}
          <div className="border-t border-slate-100 bg-white p-2.5">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1.5">
              Quick Inquiries:
            </div>
            <div className="flex flex-col gap-1">
              {quickQuestions.slice(0, 2).map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(item.q)}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/80 px-2.5 py-1.5 text-left text-[11px] font-medium text-slate-700 hover:border-indigo-200 hover:bg-indigo-50/50 hover:text-indigo-900 transition-all"
                >
                  <span className="truncate">{item.q}</span>
                  <ChevronRight className="h-3 w-3 text-slate-400 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Box */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2 border-t border-slate-200 bg-white px-3 py-2.5"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask anything about SkillNexus..."
              className="w-full text-xs text-slate-800 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-600 text-white disabled:opacity-40 hover:bg-indigo-700 transition-all shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
