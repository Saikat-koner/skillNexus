import React, { useState, useEffect, useRef } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  ScreenShare,
  Play,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  FileCode,
  Languages,
  Palette,
  Terminal,
  Clock,
  ArrowRightLeft,
  X,
  Send,
  MessageSquare,
  ShieldCheck,
  Award,
  Volume2,
  Lock,
  Layers
} from 'lucide-react';
import { ActiveBarterSession } from '../types';

interface LiveBarterWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  session?: ActiveBarterSession | null;
  onAttestAndSettle?: (sessionId: string, milestoneId: string) => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

export const LiveBarterSessionWorkspace: React.FC<LiveBarterWorkspaceProps> = ({
  isOpen,
  onClose,
  session,
  onAttestAndSettle,
  onAddToast,
}) => {
  if (!isOpen) return null;

  // Session timer (60 mins total: 30m Teach, 30m Learn)
  const [secondsRemaining, setSecondsRemaining] = useState(3600); // 60 mins
  const [timerRunning, setTimerRunning] = useState(true);
  const [activeRole, setActiveRole] = useState<'teach' | 'learn'>('teach');

  // Media toggles
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  // Active Workspace tool
  const [workspaceMode, setWorkspaceMode] = useState<'code' | 'language' | 'scribe'>('code');

  // Interactive Code Sandbox State
  const [codeContent, setCodeContent] = useState<string>(`// Live Barter Scratchpad: React Custom Hook
import { useState, useEffect } from 'react';

export function useDebouncedValue<T>(value: T, delayMs: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(handler);
  }, [value, delayMs]);

  return debounced;
}

// Mentor Exercise: Refactor to add cancellation state`);

  const [consoleOutput, setConsoleOutput] = useState<string>('Ready. Click "Execute Sandbox" to test module in peer runtime.');
  const [isExecuting, setIsExecuting] = useState(false);

  // Language Practice State
  const [germanVocab, setGermanVocab] = useState<{ de: string; en: string; mastered: boolean }[]>([
    { de: 'Der Wissensaustausch', en: 'Knowledge Barter / Exchange', mastered: true },
    { de: 'Die Gegenseitigkeit', en: 'Reciprocity / Mutuality', mastered: true },
    { de: 'Die Treuhandvereinbarung', en: 'Escrow Agreement', mastered: false },
    { de: 'Gemeinsames Lernen', en: 'Collaborative Learning', mastered: false },
  ]);

  // AI Peer Scribe Live Feed
  const [scribeNotes, setScribeNotes] = useState<string[]>([
    '12:02 - Established reciprocal goal: 30m React optimization, 30m German technical vocabulary.',
    '12:14 - Alex demonstrated React hook cleanup with setTimeout memory leak prevention.',
    '12:28 - Elena provided pronunciation nuances for compound German professional terms.',
  ]);
  const [newScribeNote, setNewScribeNote] = useState('');

  // Audio waveform animation ref
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, secondsRemaining]);

  // Animated Audio wave
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!micOn) return;

      ctx.fillStyle = '#6366f1';
      const bars = 16;
      const barWidth = 3;
      const gap = 3;

      for (let i = 0; i < bars; i++) {
        const height = Math.sin(phase + i * 0.4) * 8 + 10;
        const x = i * (barWidth + gap);
        const y = (canvas.height - height) / 2;
        ctx.fillRect(x, y, barWidth, height);
      }
      phase += 0.15;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [micOn]);

  // Format timer
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Run code simulation
  const handleRunCode = () => {
    setIsExecuting(true);
    setConsoleOutput('Compiling in sandboxed container...');
    setTimeout(() => {
      setIsExecuting(false);
      setConsoleOutput(`[Execution Success]
✓ useDebouncedValue test suite passed (3 assertions).
✓ Memory leak verification: Timer cleanup unmounted without leaks.
✓ Mutual time credit parity: Synchronized.`);
      onAddToast('Sandbox Executed', 'Live test completed with peer verification.', 'success');
    }, 800);
  };

  // Add AI Scribe note
  const handleAddScribeNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newScribeNote.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setScribeNotes((prev) => [...prev, `${time} - ${newScribeNote.trim()}`]);
    setNewScribeNote('');
  };

  // Complete & Settle Session
  const handleCompleteAndSettle = () => {
    if (session && session.milestones.length > 0 && onAttestAndSettle) {
      onAttestAndSettle(session.id, session.milestones[0].id);
    }
    onAddToast(
      'Live Session Attested & Settled!',
      'Both parties signed. Escrow released 1.5 time credits with ledger hash.',
      'success'
    );
    onClose();
  };

  const partnerName = session?.partner.name || 'Elena Rostova';
  const partnerAvatar = session?.partner.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80';
  const teachingSkill = session?.teaching || 'React Basics & Performance';
  const receivingSkill = session?.receiving || 'German Conversational Fluency';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200">
      <div className="flex h-[94vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl">
        {/* Top Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold">
              <ArrowRightLeft className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  Nexus Live Barter Workspace
                </h3>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  P2P Stream 24ms
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Active Bilateral Exchange: <span className="text-indigo-300 font-semibold">{teachingSkill}</span> ⇄ <span className="text-cyan-300 font-semibold">{receivingSkill}</span>
              </p>
            </div>
          </div>

          {/* Center: Reciprocal Timer & Role Switcher */}
          <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
            <Clock className="h-4 w-4 text-indigo-400" />
            <span className="font-mono text-sm font-bold text-white">{formatTime(secondsRemaining)}</span>
            <div className="h-4 w-px bg-slate-700 mx-1"></div>
            <button
              onClick={() => setActiveRole(activeRole === 'teach' ? 'learn' : 'teach')}
              className="flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 transition-colors"
            >
              <span>{activeRole === 'teach' ? 'You are Teaching' : 'You are Learning'}</span>
              <ArrowRightLeft className="h-3 w-3" />
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCompleteAndSettle}
              className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-lg shadow-emerald-600/30 transition-all active:scale-95"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Settle Escrow Milestone</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Main Body Split View */}
        <div className="flex flex-1 overflow-hidden">
          {/* Left Column: Interactive Tools & Ide/Terminal */}
          <div className="flex flex-1 flex-col border-r border-slate-800 bg-slate-900">
            {/* Tool selection header */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/60 px-4 py-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setWorkspaceMode('code')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    workspaceMode === 'code'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileCode className="h-3.5 w-3.5" />
                  <span>Code Sandbox</span>
                </button>

                <button
                  onClick={() => setWorkspaceMode('language')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    workspaceMode === 'language'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Languages className="h-3.5 w-3.5" />
                  <span>Language Drills</span>
                </button>

                <button
                  onClick={() => setWorkspaceMode('scribe')}
                  className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                    workspaceMode === 'scribe'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Peer Scribe</span>
                </button>
              </div>

              {workspaceMode === 'code' && (
                <button
                  onClick={handleRunCode}
                  disabled={isExecuting}
                  className="flex items-center gap-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 px-3 py-1 text-xs font-bold text-white shadow transition-all active:scale-95"
                >
                  <Play className="h-3 w-3" />
                  <span>{isExecuting ? 'Running...' : 'Execute Sandbox'}</span>
                </button>
              )}
            </div>

            {/* Tool Work Area */}
            <div className="flex-1 overflow-y-auto p-4">
              {workspaceMode === 'code' && (
                <div className="flex h-full flex-col gap-3">
                  <div className="relative flex-1 rounded-xl border border-slate-700 bg-slate-950 p-3 font-mono text-xs text-indigo-200">
                    <textarea
                      value={codeContent}
                      onChange={(e) => setCodeContent(e.target.value)}
                      className="h-full w-full resize-none bg-transparent font-mono text-xs text-slate-100 focus:outline-none"
                      spellCheck={false}
                    />
                  </div>

                  {/* Terminal Console */}
                  <div className="h-36 rounded-xl border border-slate-800 bg-black/70 p-3 font-mono text-[11px] text-emerald-400 overflow-y-auto">
                    <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 text-slate-500 text-[10px]">
                      <span className="flex items-center gap-1">
                        <Terminal className="h-3 w-3" />
                        P2P Test Runner Console
                      </span>
                      <span>Node.js v20 runtime</span>
                    </div>
                    <pre className="mt-2 whitespace-pre-wrap">{consoleOutput}</pre>
                  </div>
                </div>
              )}

              {workspaceMode === 'language' && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Languages className="h-4 w-4 text-cyan-400" />
                      Live Conversational Prompt: German for Tech Barters
                    </h4>
                    <p className="mt-1 text-xs text-slate-400">
                      Partner Prompt: "Erkläre mir, wie die Escrow-Validierung auf der Plattform funktioniert." (Explain to me how escrow validation works on the platform.)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                      Target Vocabulary Flashcards (Reciprocal Sync)
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {germanVocab.map((item, idx) => (
                        <div
                          key={idx}
                          className="rounded-xl border border-slate-800 bg-slate-950 p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="text-sm font-bold text-cyan-300">{item.de}</div>
                            <div className="text-xs text-slate-400">{item.en}</div>
                          </div>
                          <button
                            onClick={() => {
                              setGermanVocab((prev) =>
                                prev.map((v, i) => (i === idx ? { ...v, mastered: !v.mastered } : v))
                              );
                              onAddToast('Card Updated', `Mastery toggled for "${item.de}".`, 'info');
                            }}
                            className={`rounded px-2 py-1 text-[10px] font-bold ${
                              item.mastered
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {item.mastered ? 'Mastered ✓' : 'Practice'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {workspaceMode === 'scribe' && (
                <div className="flex h-full flex-col">
                  <div className="flex-1 space-y-2.5 overflow-y-auto">
                    {scribeNotes.map((note, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 text-xs text-slate-300"
                      >
                        {note}
                      </div>
                    ))}
                  </div>

                  <form onSubmit={handleAddScribeNote} className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an AI Scribe takeaway or key deliverable..."
                      value={newScribeNote}
                      onChange={(e) => setNewScribeNote(e.target.value)}
                      className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    />
                    <button
                      type="submit"
                      className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500"
                    >
                      Log Note
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Peer Video Streams & Interaction Panel */}
          <div className="w-80 sm:w-96 flex flex-col bg-slate-950 p-4 space-y-4">
            {/* Peer Video Tile */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 aspect-video shadow-md">
              <img
                src={partnerAvatar}
                alt={partnerName}
                className="h-full w-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Peer label */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{partnerName}</span>
                <span className="rounded bg-indigo-600/80 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  Partner
                </span>
              </div>
            </div>

            {/* Local Video Tile */}
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900 aspect-video shadow-md">
              {videoOn ? (
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80"
                  alt="You"
                  className="h-full w-full object-cover opacity-80"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-slate-900 text-slate-500">
                  <VideoOff className="h-8 w-8" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

              {/* Local wave visualizer */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm px-2 py-1 rounded">
                <canvas ref={canvasRef} width="60" height="16" />
              </div>

              {/* Local label */}
              <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-xs">
                <span className="font-bold text-white">You (Alex Rivera)</span>
                <span className="text-[10px] text-emerald-400 font-mono">1080p WebRTC</span>
              </div>
            </div>

            {/* Stream Control Strip */}
            <div className="flex items-center justify-center gap-3 py-2 border-y border-slate-800">
              <button
                onClick={() => setMicOn(!micOn)}
                className={`rounded-full p-2.5 transition-colors ${
                  micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </button>

              <button
                onClick={() => setVideoOn(!videoOn)}
                className={`rounded-full p-2.5 transition-colors ${
                  videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {videoOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
              </button>

              <button
                onClick={() => {
                  setScreenSharing(!screenSharing);
                  onAddToast('Screen Share', screenSharing ? 'Screen share paused.' : 'Sharing active workspace.', 'info');
                }}
                className={`rounded-full p-2.5 transition-colors ${
                  screenSharing ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <ScreenShare className="h-4 w-4" />
              </button>
            </div>

            {/* Milestone Checklist in Progress */}
            <div className="flex-1 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-xs overflow-y-auto">
              <div className="flex items-center gap-1.5 font-bold text-slate-300 uppercase tracking-wider text-[10px] mb-2">
                <Lock className="h-3 w-3 text-emerald-400" />
                <span>Locked Milestone Objective</span>
              </div>
              <h5 className="font-bold text-white text-xs">
                {session?.milestones[0]?.title || 'Custom Hooks & Conversational Fluency'}
              </h5>
              <p className="mt-1 text-[11px] text-slate-400">
                Deliverable: {session?.milestones[0]?.deliverable || 'Interactive code solution and spoken German dialogue recording.'}
              </p>

              <div className="mt-3 rounded-lg bg-slate-950 p-2 border border-slate-800 flex items-center justify-between text-[11px]">
                <span className="text-slate-400">Escrow Value:</span>
                <span className="font-bold text-emerald-400">{session?.milestones[0]?.hours || 1.5} Time Credits</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
