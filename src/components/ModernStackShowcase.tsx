import React, { useState } from 'react';
import {
  Zap,
  Flame,
  Layers,
  Cpu,
  Palette,
  Cloud,
  ExternalLink,
  Copy,
  Check,
  Code2,
  Terminal,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

interface StackTool {
  name: string;
  category: string;
  role: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  iconBg: string;
  whyChosen: string;
  freeTier: string;
  docsUrl: string;
  codeSnippet: string;
}

interface ModernStackShowcaseProps {
  onAddToast?: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

export const ModernStackShowcase: React.FC<ModernStackShowcaseProps> = ({ onAddToast }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const stackTools: StackTool[] = [
    {
      name: 'Google Firebase',
      category: 'Database & Realtime',
      role: 'Backend, Auth & Live Sync',
      badge: 'Core Backend',
      icon: Flame,
      iconBg: 'from-amber-500 to-orange-600',
      whyChosen:
        'Cloud Firestore offers instantaneous document synchronization with onSnapshot listeners, secure client-side rule evaluation, and built-in Auth.',
      freeTier: '50k reads / day, 1GB Firestore free',
      docsUrl: 'https://firebase.google.com/docs',
      codeSnippet: `// Firebase onSnapshot Realtime Listener
import { db } from './firebaseClient';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';

const q = query(collection(db, 'gigs'), orderBy('createdAt', 'desc'));
const unsub = onSnapshot(q, (snapshot) => {
  const liveGigs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  setGigs(liveGigs);
});`,
    },
    {
      name: 'Groq Cloud LPU',
      category: 'Ultra-Fast AI',
      role: 'LLM Inference & Agent Engine',
      badge: '500+ Tok/Sec',
      icon: Cpu,
      iconBg: 'from-orange-500 to-red-600',
      whyChosen:
        'Language Processing Units (LPU) deliver 500+ tokens/sec on Llama-3 & Mixtral models, enabling real-time streaming AI assistance without lag.',
      freeTier: 'Generous free daily RPM & TPM limits',
      docsUrl: 'https://console.groq.com/docs',
      codeSnippet: `// Groq Ultra-Fast AI Stream
import Groq from 'groq-sdk';
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const chatCompletion = await groq.chat.completions.create({
  messages: [{ role: 'user', content: 'Suggest 3 viral tech gig titles' }],
  model: 'llama-3.3-70b-versatile',
  stream: true,
});`,
    },
    {
      name: '21st.dev / Tailwind Components',
      category: 'Modern UI Kit',
      role: 'Pre-built High Quality Animations',
      badge: 'Instant UI',
      icon: Layers,
      iconBg: 'from-indigo-500 to-purple-600',
      whyChosen:
        'Curated registry of Tailwind & Framer Motion components (Aceternity UI, Magic UI, Shadcn) for beautiful glassmorphism and modern cards.',
      freeTier: '100% Free Open Source Components',
      docsUrl: 'https://21st.dev',
      codeSnippet: `// Glassmorphic Tailwind Utility Container
<div className="rounded-3xl border border-white/20 bg-white/70 backdrop-blur-md shadow-2xl p-6 hover:border-indigo-500/30 transition-all">
  <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent font-bold">
    Live Reactive Card
  </span>
</div>`,
    },
    {
      name: 'Canva Pro Assets',
      category: 'Design & Branding',
      role: 'Thumbnails, Banners & Social Creatives',
      badge: 'Visual Asset Hub',
      icon: Palette,
      iconBg: 'from-cyan-500 to-blue-600',
      whyChosen:
        'Rapid asset generation, SVG illustrations, creator profile banners, gig card mockups, and client presentation decks.',
      freeTier: 'Free templates & image exports',
      docsUrl: 'https://www.canva.com',
      codeSnippet: `<!-- Canva SVG Clean Export Specs -->
<svg viewBox="0 0 800 400" className="w-full h-auto rounded-2xl shadow-lg">
  <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">...</linearGradient></defs>
  <rect width="100%" height="100%" rx="24" fill="url(#g)" />
</svg>`,
    },
    {
      name: 'Vercel / Edge Network',
      category: 'Deployment & CI/CD',
      role: 'Global CDN & Serverless API Routes',
      badge: 'Zero-Config Deploy',
      icon: Cloud,
      iconBg: 'from-slate-800 to-slate-950',
      whyChosen:
        'Instant git push deployments, automatic HTTPS/SSL, preview branch environments, and sub-50ms edge caching across 300+ global locations.',
      freeTier: 'Free Unlimited Personal Deployments',
      docsUrl: 'https://vercel.com/docs',
      codeSnippet: `// vercel.json - Single Page App Rewrite Rule
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "headers": [
    { "source": "/(.*)", "headers": [{ "key": "X-Frame-Options", "value": "DENY" }] }
  ]
}`,
    },
  ];

  const handleCopyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
    if (onAddToast) {
      onAddToast('Snippet Copied!', 'Integration snippet copied to clipboard.', 'info');
    }
  };

  return (
    <section className="rounded-3xl border border-slate-200/90 bg-gradient-to-b from-slate-900 via-slate-900 to-indigo-950 p-6 sm:p-10 text-white shadow-2xl">
      {/* Top Tagline */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300 mb-3">
            <Zap className="h-3.5 w-3.5 text-indigo-400" />
            <span>Modern Production AI Stack Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            The Modern AI & Full Stack{' '}
            <span className="bg-gradient-to-r from-amber-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              Hackathon Toolkit
            </span>
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
            The battle-tested technology stack powering high-velocity Web3, AI, and Creator marketplace applications: Realtime Firebase databases, Groq sub-second LLM inference, 21st.dev components, Canva branding, and Vercel edge deployment.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 px-4 py-3">
            <div className="text-xs text-slate-400">Total Deployment Time</div>
            <div className="text-xl font-black text-emerald-400">&lt; 3 Minutes</div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-800/60 px-4 py-3">
            <div className="text-xs text-slate-400">Monthly Cloud Cost</div>
            <div className="text-xl font-black text-cyan-400">$0.00 / Free Tier</div>
          </div>
        </div>
      </div>

      {/* Grid of Stack Pillars */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stackTools.map((tool, idx) => {
          const Icon = tool.icon;
          const isCopied = copiedIndex === idx;

          return (
            <div
              key={tool.name}
              className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md hover:border-indigo-500/50 hover:bg-slate-900/95 transition-all group"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${tool.iconBg} text-white shadow-lg`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-300 transition-colors">
                        {tool.name}
                      </h3>
                      <span className="text-[11px] text-slate-400">{tool.category}</span>
                    </div>
                  </div>

                  <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300">
                    {tool.badge}
                  </span>
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-300 leading-relaxed mb-4">
                  {tool.whyChosen}
                </p>

                {/* Code Snippet Box */}
                <div className="relative rounded-xl border border-slate-800 bg-slate-950 p-3 mb-4 overflow-hidden">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mb-2 pb-1.5 border-b border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Terminal className="h-3 w-3 text-indigo-400" />
                      <span>snippet.ts</span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(tool.codeSnippet, idx)}
                      className="flex items-center gap-1 rounded bg-slate-800 hover:bg-slate-700 px-2 py-0.5 text-[10px] text-slate-200 transition-all"
                    >
                      {isCopied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-300">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 text-slate-400" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="text-[11px] font-mono text-slate-300 overflow-x-auto max-h-28 leading-relaxed">
                    <code>{tool.codeSnippet}</code>
                  </pre>
                </div>
              </div>

              {/* Bottom Card Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <span className="text-[11px] text-emerald-400 font-medium">
                  ✓ {tool.freeTier}
                </span>

                <a
                  href={tool.docsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors"
                >
                  <span>Docs</span>
                  <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
