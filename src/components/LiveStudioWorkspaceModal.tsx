import React, { useState, useRef, useEffect } from 'react';
import {
  Video,
  Mic,
  MicOff,
  VideoOff,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Code,
  PenTool,
  FileText,
  Send,
  Download,
  Copy,
  Check,
  X,
  Clock,
  Terminal,
  Eraser,
  Square,
  Circle,
  HelpCircle
} from 'lucide-react';
import { ActiveBarterSession } from '../types';

interface LiveStudioWorkspaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  session: ActiveBarterSession | null;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info') => void;
}

type StudioTab = 'whiteboard' | 'code_scratchpad' | 'sprint_notes';

export const LiveStudioWorkspaceModal: React.FC<LiveStudioWorkspaceModalProps> = ({
  isOpen,
  onClose,
  session,
  onAddToast,
}) => {
  const [activeTab, setActiveTab] = useState<StudioTab>('whiteboard');
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);

  // Timer state (45:00 default)
  const [timerSeconds, setTimerSeconds] = useState(45 * 60);
  const [isTimerRunning, setIsTimerRunning] = useState(true);

  // Chat state
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'Chloe Dubois', text: 'Hey! Ready to dive into the Next.js server actions & Firebase Firestore sync?', time: '10:02 AM' },
    { sender: 'You', text: 'Yes! Let’s walk through the whiteboard architectural diagram first.', time: '10:03 AM' },
  ]);
  const [newChatText, setNewChatText] = useState('');

  // Whiteboard Canvas State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [strokeColor, setStrokeColor] = useState('#4f46e5');
  const [lineWidth, setLineWidth] = useState(3);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');

  // Code Scratchpad State
  const [codeLanguage, setCodeLanguage] = useState<'typescript' | 'python' | 'react'>('typescript');
  const [codeContent, setCodeContent] = useState(`// SkillNexus Live Pair-Coding Scratchpad
// Milestone: Firebase Cloud Firestore Realtime Listener

import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseClient';

export function listenToActiveEscrows(creatorId: string) {
  const q = query(
    collection(db, 'orders'),
    where('creatorId', '==', creatorId),
    where('status', '==', 'in_escrow')
  );

  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    console.log('⚡ Realtime Escrow Orders Updated:', orders.length);
  });
}`);
  const [codeOutput, setCodeOutput] = useState<string | null>(null);
  const [isExecutingCode, setIsExecutingCode] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sprint Notes State
  const [notes, setNotes] = useState<{ id: string; text: string; completed: boolean }[]>([
    { id: '1', text: 'Review component props and Figma design token hierarchy', completed: true },
    { id: '2', text: 'Implement Firebase Firestore onSnapshot unsubscribe cleanup in useEffect', completed: true },
    { id: '3', text: 'Test milestone release handshake and verify $0 dispute release', completed: false },
    { id: '4', text: 'Export production build and push to GitHub main repository', completed: false },
  ]);
  const [newNoteText, setNewNoteText] = useState('');

  // Timer effect
  useEffect(() => {
    let interval: number | null = null;
    if (isTimerRunning && isOpen) {
      interval = window.setInterval(() => {
        setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, isOpen]);

  // Canvas drawing handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.strokeStyle = tool === 'eraser' ? '#ffffff' : strokeColor;
    ctx.lineWidth = tool === 'eraser' ? 16 : lineWidth;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (onAddToast) {
      onAddToast('Canvas Cleared', 'Whiteboard wiped for fresh sketching.', 'info');
    }
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    setChatMessages((prev) => [
      ...prev,
      { sender: 'You', text: newChatText.trim(), time: 'Just now' },
    ]);
    setNewChatText('');
  };

  const handleRunCode = () => {
    setIsExecutingCode(true);
    setCodeOutput(null);
    setTimeout(() => {
      setIsExecutingCode(false);
      setCodeOutput(`[SkillNexus Runtime] ⚡ Compilation succeeded in 42ms.
> 1 active escrow listener connected to Firebase Firestore.
> Realtime WebSocket snapshot channel established: wss://firestore.googleapis.com/...
> 0 runtime errors. Test assertion passed!`);
      if (onAddToast) {
        onAddToast('Code Executed!', 'Output rendered to scratchpad console.', 'success');
      }
    }, 450);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeContent);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
    if (onAddToast) {
      onAddToast('Code Copied!', 'Snippet copied to clipboard.', 'info');
    }
  };

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;
    setNotes((prev) => [
      ...prev,
      { id: Date.now().toString(), text: newNoteText.trim(), completed: false },
    ]);
    setNewNoteText('');
  };

  const toggleNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, completed: !n.completed } : n))
    );
  };

  if (!isOpen) return null;

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden rounded-3xl border border-slate-700 bg-slate-900 text-slate-100 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Studio Top Control Bar */}
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Live Collaboration Studio · {session?.partner?.name || 'Chloe Dubois'}
                </h3>
                <span className="flex items-center gap-1 rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping"></span> Live WebRTC Session
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                1-on-1 Mentorship & Zero-Cash Skill Swap Jam Room
              </p>
            </div>
          </div>

          {/* Sprint Countdown Timer & Close */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-900 border border-slate-700 px-3 py-1.5">
              <Clock className="h-3.5 w-3.5 text-cyan-400" />
              <span className="font-mono text-xs font-bold text-cyan-300">
                {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
              <button
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="text-slate-400 hover:text-white transition-colors"
                title={isTimerRunning ? 'Pause Sprint' : 'Resume Sprint'}
              >
                {isTimerRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
              </button>
            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Studio Main Workspace (Split Screen) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          {/* Left Panel: Video & Live Chat (4 Cols) */}
          <div className="lg:col-span-4 border-r border-slate-800 bg-slate-950/60 flex flex-col justify-between overflow-hidden">
            {/* Video Streams */}
            <div className="p-4 space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 flex items-center justify-center shadow-inner">
                {isVideoOn ? (
                  <img
                    src={session?.partner?.avatar || 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'}
                    alt="Partner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-500">
                    <VideoOff className="h-8 w-8" />
                    <span className="text-xs">Camera is Off</span>
                  </div>
                )}

                {/* Partner Name Badge */}
                <div className="absolute bottom-2.5 left-2.5 rounded-lg bg-slate-950/80 backdrop-blur-md px-2 py-0.5 text-[10px] font-bold text-white flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  <span>{session?.partner?.name || 'Chloe Dubois'} (Host)</span>
                </div>

                {/* Self Small Video Overlay */}
                <div className="absolute top-2.5 right-2.5 h-16 w-24 rounded-xl border border-slate-700 bg-slate-800 overflow-hidden shadow-md flex items-center justify-center">
                  <span className="text-[10px] font-bold text-slate-400">You</span>
                </div>
              </div>

              {/* AV Controls */}
              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => setIsMicOn(!isMicOn)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    isMicOn
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isMicOn ? <Mic className="h-3.5 w-3.5 text-emerald-400" /> : <MicOff className="h-3.5 w-3.5 text-rose-400" />}
                  <span>{isMicOn ? 'Mute' : 'Unmute'}</span>
                </button>

                <button
                  onClick={() => setIsVideoOn(!isVideoOn)}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    isVideoOn
                      ? 'bg-slate-800 text-white hover:bg-slate-700'
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}
                >
                  {isVideoOn ? <Video className="h-3.5 w-3.5 text-cyan-400" /> : <VideoOff className="h-3.5 w-3.5 text-rose-400" />}
                  <span>{isVideoOn ? 'Stop Cam' : 'Start Cam'}</span>
                </button>
              </div>
            </div>

            {/* Live Chat Stream */}
            <div className="flex-1 border-t border-slate-800 flex flex-col justify-between overflow-hidden p-3 bg-slate-900/40">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 block">
                Session Chat & Links
              </span>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                {chatMessages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`rounded-xl p-2.5 ${
                      msg.sender === 'You'
                        ? 'bg-indigo-600/30 border border-indigo-500/40 ml-4'
                        : 'bg-slate-800/70 border border-slate-700/60 mr-4'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                      <span className="font-bold text-slate-200">{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                    <p className="text-slate-100">{msg.text}</p>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendChat} className="mt-2 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Share a link or code note..."
                  value={newChatText}
                  onChange={(e) => setNewChatText(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 p-2 text-white hover:bg-indigo-500 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Panel: Collaborative Tool Tabs (8 Cols) */}
          <div className="lg:col-span-8 flex flex-col bg-slate-900 overflow-hidden">
            {/* Tab Navigation */}
            <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4 py-2.5">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('whiteboard')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'whiteboard'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <PenTool className="h-3.5 w-3.5" />
                  <span>Interactive Whiteboard</span>
                </button>

                <button
                  onClick={() => setActiveTab('code_scratchpad')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'code_scratchpad'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Code className="h-3.5 w-3.5" />
                  <span>Code Scratchpad</span>
                </button>

                <button
                  onClick={() => setActiveTab('sprint_notes')}
                  className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
                    activeTab === 'sprint_notes'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Sprint Notes ({notes.filter((n) => n.completed).length}/{notes.length})</span>
                </button>
              </div>
            </div>

            {/* Tab 1: Interactive Whiteboard */}
            {activeTab === 'whiteboard' && (
              <div className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
                {/* Whiteboard Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setTool('pen')}
                      className={`rounded-lg p-1.5 transition-all ${
                        tool === 'pen' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Pen Tool"
                    >
                      <PenTool className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setTool('eraser')}
                      className={`rounded-lg p-1.5 transition-all ${
                        tool === 'eraser' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                      title="Eraser"
                    >
                      <Eraser className="h-4 w-4" />
                    </button>

                    <div className="h-4 w-[1px] bg-slate-800 mx-1"></div>

                    {/* Color Swatches */}
                    <div className="flex items-center gap-1.5">
                      {['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ffffff'].map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setStrokeColor(color);
                            setTool('pen');
                          }}
                          style={{ backgroundColor: color }}
                          className={`h-4 w-4 rounded-full border border-slate-700 transition-transform ${
                            strokeColor === color && tool === 'pen' ? 'scale-125 ring-2 ring-indigo-400' : ''
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={clearCanvas}
                      className="rounded-lg border border-slate-700 px-2.5 py-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      Clear Canvas
                    </button>
                  </div>
                </div>

                {/* Canvas Area */}
                <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden relative shadow-inner cursor-crosshair">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="w-full h-full"
                  />
                  <div className="absolute bottom-3 right-3 text-[11px] text-slate-500 font-mono pointer-events-none">
                    Collaborative Canvas · Draw freely with your mouse or stylus
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Code Scratchpad */}
            {activeTab === 'code_scratchpad' && (
              <div className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
                {/* Code Toolbar */}
                <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/80 p-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-semibold">Language:</span>
                    <select
                      value={codeLanguage}
                      onChange={(e) => setCodeLanguage(e.target.value as 'typescript' | 'python' | 'react')}
                      className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-white focus:outline-none"
                    >
                      <option value="typescript">TypeScript / Node.js</option>
                      <option value="react">React JSX</option>
                      <option value="python">Python 3.12</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCopyCode}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 px-2.5 py-1 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
                    >
                      {copiedCode ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                      <span>{copiedCode ? 'Copied' : 'Copy'}</span>
                    </button>

                    <button
                      onClick={handleRunCode}
                      disabled={isExecutingCode}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1 font-bold text-white hover:bg-emerald-500 active:scale-95 transition-all shadow-xs"
                    >
                      <Terminal className="h-3.5 w-3.5" />
                      <span>{isExecutingCode ? 'Running...' : 'Run in Sandbox'}</span>
                    </button>
                  </div>
                </div>

                {/* Code Editor Area */}
                <div className="flex-1 flex flex-col rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs shadow-inner">
                  <textarea
                    value={codeContent}
                    onChange={(e) => setCodeContent(e.target.value)}
                    className="flex-1 p-4 bg-transparent text-emerald-300 focus:outline-none resize-none leading-relaxed"
                  />

                  {/* Output Terminal Drawer */}
                  {codeOutput && (
                    <div className="border-t border-slate-800 bg-slate-900/90 p-3 text-[11px] text-slate-300 max-h-28 overflow-y-auto">
                      <div className="flex items-center justify-between pb-1 mb-1 border-b border-slate-800 text-[10px] text-slate-500 font-bold uppercase">
                        <span>Console Terminal Output</span>
                        <button onClick={() => setCodeOutput(null)} className="hover:text-white">Dismiss</button>
                      </div>
                      <pre className="text-emerald-400 whitespace-pre-wrap">{codeOutput}</pre>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 3: Sprint Notes & Checklist */}
            {activeTab === 'sprint_notes' && (
              <div className="flex-1 flex flex-col p-4 space-y-3 overflow-hidden">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Collaborative Sprint Action Items</span>
                  <span>Changes auto-save to session escrow</span>
                </div>

                {/* Notes List */}
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      onClick={() => toggleNote(note.id)}
                      className={`flex items-center gap-3 rounded-xl border p-3 cursor-pointer transition-all ${
                        note.completed
                          ? 'border-slate-800 bg-slate-950/40 text-slate-500 line-through'
                          : 'border-slate-700 bg-slate-800/60 text-slate-100 hover:border-indigo-500'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={note.completed}
                        onChange={() => toggleNote(note.id)}
                        className="rounded border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer"
                      />
                      <span className="flex-1">{note.text}</span>
                    </div>
                  ))}
                </div>

                {/* Add Note Form */}
                <form onSubmit={handleAddNote} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                  <input
                    type="text"
                    placeholder="Add an actionable sprint deliverable..."
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-500 transition-colors"
                  >
                    Add Task
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
