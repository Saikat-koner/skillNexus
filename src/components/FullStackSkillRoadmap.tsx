import React, { useState } from 'react';
import {
  Code,
  Server,
  Database,
  Globe,
  ShieldCheck,
  Cloud,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  BookOpen,
  Users,
  Check,
  Copy,
  ExternalLink,
  ChevronRight,
  Award,
  Layers,
  Video
} from 'lucide-react';

interface SkillNodeItem {
  id: string;
  name: string;
  category: string;
  description: string;
  subskills: string[];
  popularGigsCount: number;
  averageRate: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
}

interface FullStackSkillRoadmapProps {
  onSelectSkill?: (skillName: string) => void;
  onBookMentorship?: (skillName: string) => void;
  onAddToast?: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

export const FullStackSkillRoadmap: React.FC<FullStackSkillRoadmapProps> = ({
  onSelectSkill,
  onBookMentorship,
  onAddToast,
}) => {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [completedSkills, setCompletedSkills] = useState<string[]>([
    'HTML5 & Semantic Markup',
    'CSS3 & Flexbox/Grid',
    'JavaScript ES6+ Fundamentals',
  ]);
  const [selectedSkillDetails, setSelectedSkillDetails] = useState<SkillNodeItem | null>(null);
  const [copiedRoadmap, setCopiedRoadmap] = useState(false);

  const stages = [
    {
      step: 1,
      title: '1. Frontend Foundations',
      shortTitle: 'HTML/CSS/JS',
      icon: Code,
      color: 'from-amber-500 to-orange-500',
      badgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'The visual client layer: DOM rendering, layout styling, and client-side interactivity.',
      skills: [
        {
          id: 'fe-html',
          name: 'HTML5 & Semantic Markup',
          category: 'Frontend',
          description: 'Structure web documents, semantic tags, forms, accessibility (ARIA), and SEO tags.',
          subskills: ['Semantic Elements', 'Form Validation', 'Audio/Video Tags', 'SEO Meta Tags'],
          popularGigsCount: 14,
          averageRate: '$25/hr',
          difficulty: 'Beginner' as const,
        },
        {
          id: 'fe-css',
          name: 'CSS3 & Modern Layouts',
          category: 'Frontend',
          description: 'Flexbox, CSS Grid, animations, Tailwind CSS utility classes, and glassmorphism styling.',
          subskills: ['Flexbox & Grid', 'Tailwind CSS', 'Responsive Media Queries', 'CSS Custom Variables'],
          popularGigsCount: 28,
          averageRate: '$35/hr',
          difficulty: 'Beginner' as const,
        },
        {
          id: 'fe-js',
          name: 'JavaScript ES6+ & DOM',
          category: 'Frontend',
          description: 'Async/Await, Fetch API, DOM manipulation, closures, promises, and event delegation.',
          subskills: ['Promises & Async/Await', 'DOM Events', 'Array Methods (map, filter)', 'Local Storage'],
          popularGigsCount: 42,
          averageRate: '$45/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'fe-react',
          name: 'React 19 & Next.js Ecosystem',
          category: 'Frontend',
          description: 'Component lifecycles, custom hooks, state management, server components, and Tailwind UI.',
          subskills: ['Hooks (useState, useEffect)', 'Custom Hooks', 'Context API', 'SSR & Next.js Routing'],
          popularGigsCount: 56,
          averageRate: '$60/hr',
          difficulty: 'Intermediate' as const,
        },
      ],
    },
    {
      step: 2,
      title: '2. Backend Engineering',
      shortTitle: 'Backend',
      icon: Server,
      color: 'from-emerald-500 to-teal-600',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Server runtime logic, routing engines, request validation, and microservices.',
      skills: [
        {
          id: 'be-node',
          name: 'Node.js & Express.js',
          category: 'Backend',
          description: 'Asynchronous event-driven I/O, middleware pipelines, error handling, and routing.',
          subskills: ['Express Middleware', 'Route Handlers', 'Environment Variables', 'Error Boundaries'],
          popularGigsCount: 38,
          averageRate: '$50/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'be-python',
          name: 'Python & FastAPI',
          category: 'Backend',
          description: 'High-performance ASGI endpoints, Pydantic type validation, and AI agent integration.',
          subskills: ['Pydantic Models', 'FastAPI Dependency Injection', 'Async Endpoints', 'OpenAPI Docs'],
          popularGigsCount: 29,
          averageRate: '$65/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'be-java',
          name: 'Java & Spring Boot',
          category: 'Backend',
          description: 'Enterprise grade OOP architecture, dependency injection, JPA Hibernate repositories.',
          subskills: ['Spring Boot Starters', 'REST Controllers', 'Spring Security', 'JPA / Hibernate'],
          popularGigsCount: 22,
          averageRate: '$70/hr',
          difficulty: 'Advanced' as const,
        },
      ],
    },
    {
      step: 3,
      title: '3. Databases & Persistence',
      shortTitle: 'Databases',
      icon: Database,
      color: 'from-blue-500 to-indigo-600',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Relational SQL and NoSQL persistence, document schemas, query optimization, and caching.',
      skills: [
        {
          id: 'db-postgres',
          name: 'PostgreSQL & SQL Queries',
          category: 'Databases',
          description: 'Relational modeling, multi-table JOINs, indexing, foreign keys, and transactions.',
          subskills: ['Schema Design', 'Complex JOIN Queries', 'Indexes & B-Trees', 'RLS Security Policies'],
          popularGigsCount: 35,
          averageRate: '$55/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'db-firestore',
          name: 'Google Cloud Firestore & NoSQL',
          category: 'Databases',
          description: 'Real-time document-collection trees, snapshot streaming, subcollections, and security rules.',
          subskills: ['Collection Queries', 'Real-time onSnapshot', 'Atomic Transactions', 'Declarative Rules'],
          popularGigsCount: 31,
          averageRate: '$50/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'db-redis',
          name: 'Redis In-Memory Caching',
          category: 'Databases',
          description: 'Sub-millisecond key-value retrieval, pub/sub channels, TTL expiry, and session caching.',
          subskills: ['Key-Value Operations', 'Pub/Sub Messaging', 'Rate Limiting', 'Session Persistence'],
          popularGigsCount: 18,
          averageRate: '$60/hr',
          difficulty: 'Advanced' as const,
        },
      ],
    },
    {
      step: 4,
      title: '4. APIs & Communication Protocols',
      shortTitle: 'APIs',
      icon: Globe,
      color: 'from-purple-500 to-pink-600',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Standardized interfaces for data interchange between client apps and backend systems.',
      skills: [
        {
          id: 'api-rest',
          name: 'RESTful API Architecture',
          category: 'APIs',
          description: 'HTTP verbs (GET, POST, PUT, DELETE), status codes (200, 201, 400, 404, 500), JSON schemas.',
          subskills: ['HTTP Status Codes', 'Payload Sanitization', 'Pagination & Filtering', 'CORS Headers'],
          popularGigsCount: 45,
          averageRate: '$45/hr',
          difficulty: 'Beginner' as const,
        },
        {
          id: 'api-graphql',
          name: 'GraphQL Queries & Mutations',
          category: 'APIs',
          description: 'Flexible schema definitions, avoiding over-fetching, resolvers, and subscriptions.',
          subskills: ['Schema Definition Language', 'Resolvers & Typed Queries', 'Apollo Client', 'Mutations'],
          popularGigsCount: 24,
          averageRate: '$65/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'api-ws',
          name: 'WebSockets & Live Streams',
          category: 'APIs',
          description: 'Bi-directional real-time communication channels for chats, live auctions, and alerts.',
          subskills: ['Socket.io / ws', 'Heartbeat Pings', 'Room Channels', 'Binary Data Frames'],
          popularGigsCount: 27,
          averageRate: '$60/hr',
          difficulty: 'Advanced' as const,
        },
      ],
    },
    {
      step: 5,
      title: '5. Authentication & Security',
      shortTitle: 'Auth & Security',
      icon: ShieldCheck,
      color: 'from-red-500 to-rose-600',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Zero-trust identity verification, token validation, encryption, and protected routes.',
      skills: [
        {
          id: 'sec-jwt',
          name: 'JWT Tokens & Refresh Cycles',
          category: 'Auth & Security',
          description: 'Stateless cryptographic signing, payload encryption, HttpOnly cookies, and token refresh.',
          subskills: ['Bearer Authentication', 'HttpOnly Cookie Storage', 'Token Expiry', 'Signature Verification'],
          popularGigsCount: 33,
          averageRate: '$60/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'sec-oauth',
          name: 'OAuth 2.0 & Google Sign-In',
          category: 'Auth & Security',
          description: 'Third-party social authentication flow, authorization codes, and scope management.',
          subskills: ['Google & GitHub OAuth', 'PKCE Code Flow', 'User Identity Linking', 'Session Tokens'],
          popularGigsCount: 26,
          averageRate: '$55/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'sec-https',
          name: 'HTTPS, CSRF & Security Headers',
          category: 'Auth & Security',
          description: 'TLS certificates, Content Security Policies (CSP), sanitizing XSS vulnerabilities.',
          subskills: ['CORS Configuration', 'Content Security Policy', 'XSS Prevention', 'Rate Limiting'],
          popularGigsCount: 19,
          averageRate: '$70/hr',
          difficulty: 'Advanced' as const,
        },
      ],
    },
    {
      step: 6,
      title: '6. Deployment & DevOps',
      shortTitle: 'DevOps & Deploy',
      icon: Cloud,
      color: 'from-cyan-500 to-blue-600',
      badgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'Containerization, automated build pipelines, and zero-downtime cloud hosting.',
      skills: [
        {
          id: 'ops-git',
          name: 'Git & GitHub Version Control',
          category: 'DevOps',
          description: 'Branch management, pull requests, merge conflict resolution, and collaborative workflow.',
          subskills: ['Git Branching & Rebase', 'Pull Requests & Reviews', 'Git Hooks', 'Merge Conflict Resolution'],
          popularGigsCount: 40,
          averageRate: '$40/hr',
          difficulty: 'Beginner' as const,
        },
        {
          id: 'ops-docker',
          name: 'Docker Containers & Compose',
          category: 'DevOps',
          description: 'Reproducible runtime environments, multi-stage builds, Dockerfiles, container networking.',
          subskills: ['Dockerfile Directives', 'Docker Compose Services', 'Volume Mounting', 'Image Optimization'],
          popularGigsCount: 30,
          averageRate: '$65/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'ops-cicd',
          name: 'GitHub Actions & CI/CD Pipelines',
          category: 'DevOps',
          description: 'Automated test runners, continuous deployment to Vercel/Firebase, secret management.',
          subskills: ['Workflow YAML Config', 'Automated Test Matrix', 'Deployment Webhooks', 'Artifact Uploads'],
          popularGigsCount: 25,
          averageRate: '$70/hr',
          difficulty: 'Advanced' as const,
        },
      ],
    },
    {
      step: 7,
      title: '7. Testing & Tools',
      shortTitle: 'Testing & Tools',
      icon: Award,
      color: 'from-violet-500 to-indigo-600',
      badgeColor: 'bg-violet-50 text-violet-700 border-violet-200',
      description: 'Quality assurance, regression testing, API profiling, and debugging instrumentation.',
      skills: [
        {
          id: 'tool-postman',
          name: 'Postman & API Test Suites',
          category: 'Testing & Tools',
          description: 'Automated request collections, pre-request scripts, test assertions, and mock servers.',
          subskills: ['Collection Runners', 'Environment Variables', 'Response Assertions', 'Mock Endpoints'],
          popularGigsCount: 23,
          averageRate: '$45/hr',
          difficulty: 'Beginner' as const,
        },
        {
          id: 'tool-testing',
          name: 'Unit & Integration Testing (Vitest/Jest)',
          category: 'Testing & Tools',
          description: 'Mocking dependencies, snapshot testing, test coverage analysis, and assertion patterns.',
          subskills: ['Component Testing', 'Mocking API Requests', 'Code Coverage Reports', 'E2E with Playwright'],
          popularGigsCount: 28,
          averageRate: '$65/hr',
          difficulty: 'Intermediate' as const,
        },
        {
          id: 'tool-debug',
          name: 'Logging, Sentry & Debugging Profilers',
          category: 'Testing & Tools',
          description: 'Source map debugging, structured JSON logging, telemetry, and performance profiling.',
          subskills: ['Chrome DevTools Profiling', 'Sentry Error Tracking', 'Memory Leak Detection', 'Structured Logs'],
          popularGigsCount: 17,
          averageRate: '$70/hr',
          difficulty: 'Advanced' as const,
        },
      ],
    },
  ];

  const totalSkillsCount = stages.reduce((acc, stage) => acc + stage.skills.length, 0);
  const masteryPercentage = Math.round((completedSkills.length / totalSkillsCount) * 100);

  const toggleSkillComplete = (skillName: string) => {
    setCompletedSkills((prev) => {
      const exists = prev.includes(skillName);
      const next = exists ? prev.filter((s) => s !== skillName) : [...prev, skillName];
      if (!exists && onAddToast) {
        onAddToast('Skill Mastered! 🎉', `Added "${skillName}" to your verified knowledge stack.`, 'success');
      }
      return next;
    });
  };

  const handleCopyRoadmap = () => {
    const text = stages
      .map(
        (s) =>
          `📌 ${s.title}\n${s.skills.map((k) => `  • ${k.name} (${k.difficulty}) - Avg Rate: ${k.averageRate}`).join('\n')}`
      )
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedRoadmap(true);
    setTimeout(() => setCopiedRoadmap(false), 2000);
    if (onAddToast) {
      onAddToast('Roadmap Copied!', 'Complete Full Stack developer curriculum copied to clipboard.', 'info');
    }
  };

  const currentStage = stages[activeStage];

  return (
    <section id="fullstack-roadmap-section" className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-xl shadow-slate-200/40">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-8 border-b border-slate-100">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700 mb-3 shadow-xs">
            <Sparkles className="h-3.5 w-3.5 text-indigo-600" />
            <span>Official Developer Curriculum Roadmap</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            FULL STACK Developer{' '}
            <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
              Skills You Must Learn
            </span>
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Interactive visual curriculum tracking the 7 core pillars of modern engineering. Master each domain, hire specialist creators, or book 1-on-1 mentorship sessions.
          </p>
        </div>

        {/* Progress & Quick Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4 min-w-[200px]">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-1.5">
              <span>Knowledge Progress</span>
              <span className="text-indigo-600 font-extrabold">{masteryPercentage}%</span>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 via-cyan-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${masteryPercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 text-[11px] text-slate-500 text-center">
              {completedSkills.length} of {totalSkillsCount} Skills Mastered
            </div>
          </div>

          <button
            onClick={handleCopyRoadmap}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition-all"
          >
            {copiedRoadmap ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 text-slate-500" />
                <span>Copy Syllabus</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* "LEARN IN THIS ORDER" Sequence Bar (Image 1 Bottom Feature) */}
      <div className="my-8 rounded-2xl border border-indigo-100 bg-gradient-to-r from-indigo-50/80 via-purple-50/50 to-cyan-50/60 p-4 sm:p-5">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-900 mb-3 uppercase tracking-wider">
          <Layers className="h-4 w-4 text-indigo-600" />
          <span>Learn In This Recommended Order</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
          {stages.map((stg, idx) => {
            const Icon = stg.icon;
            const isCurrent = activeStage === idx;
            return (
              <button
                key={stg.step}
                onClick={() => setActiveStage(idx)}
                className={`relative flex items-center justify-between rounded-xl px-3 py-2.5 text-left transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20 ring-2 ring-indigo-400'
                    : 'bg-white/90 text-slate-700 hover:bg-white hover:text-slate-900 border border-slate-200/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className={`text-[10px] font-black ${isCurrent ? 'text-indigo-200' : 'text-indigo-600'}`}>
                    0{stg.step}
                  </span>
                  <span className="truncate text-xs font-bold">{stg.shortTitle}</span>
                </div>
                {idx < stages.length - 1 && (
                  <ChevronRight
                    className={`hidden lg:block h-3.5 w-3.5 shrink-0 ${
                      isCurrent ? 'text-indigo-300' : 'text-slate-300'
                    }`}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Stage Detail & Skills Grid */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${currentStage.color} text-white shadow-md`}>
              <currentStage.icon className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{currentStage.title}</h3>
              <p className="text-xs text-slate-500">{currentStage.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-slate-500">Stage {currentStage.step} of 7</span>
            <div className="flex gap-1">
              <button
                onClick={() => setActiveStage((prev) => (prev > 0 ? prev - 1 : stages.length - 1))}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50"
              >
                ←
              </button>
              <button
                onClick={() => setActiveStage((prev) => (prev < stages.length - 1 ? prev + 1 : 0))}
                className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-600 hover:bg-slate-50"
              >
                →
              </button>
            </div>
          </div>
        </div>

        {/* Skills Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {currentStage.skills.map((skill) => {
            const isCompleted = completedSkills.includes(skill.name);
            return (
              <div
                key={skill.id}
                className={`group relative flex flex-col justify-between rounded-2xl border p-5 transition-all ${
                  isCompleted
                    ? 'border-emerald-200 bg-emerald-50/30 shadow-xs'
                    : 'border-slate-200/90 bg-white hover:border-indigo-300 hover:shadow-lg hover:shadow-indigo-500/5'
                }`}
              >
                <div>
                  {/* Top Badges */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-[10px] font-bold text-slate-600">
                      {skill.difficulty}
                    </span>

                    <button
                      onClick={() => toggleSkillComplete(skill.name)}
                      className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'border border-slate-300 bg-white text-slate-600 hover:border-emerald-500 hover:text-emerald-700'
                      }`}
                    >
                      <CheckCircle2 className="h-3 w-3" />
                      <span>{isCompleted ? 'Mastered' : 'Mark Learned'}</span>
                    </button>
                  </div>

                  {/* Title & Description */}
                  <h4 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {skill.name}
                  </h4>
                  <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                    {skill.description}
                  </p>

                  {/* Subtopics Checklist */}
                  <div className="mt-4 space-y-1.5 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <span className="text-[10px] font-bold uppercase text-slate-400">Core Subtopics:</span>
                    <div className="grid grid-cols-2 gap-1 text-[11px] font-medium text-slate-700">
                      {skill.subskills.map((sub, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5">
                          <span className="h-1 w-1 rounded-full bg-indigo-500"></span>
                          <span className="truncate">{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Card Action Controls */}
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-medium text-slate-400 block">Marketplace Demand</span>
                    <span className="text-xs font-bold text-slate-800">{skill.popularGigsCount} Live Gigs · {skill.averageRate}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {onBookMentorship && (
                      <button
                        onClick={() => onBookMentorship(skill.name)}
                        title="Book 1-on-1 Mentorship on this skill"
                        className="flex items-center gap-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1.5 text-xs font-bold text-indigo-700 transition-all"
                      >
                        <Video className="h-3.5 w-3.5 text-indigo-600" />
                        <span className="hidden sm:inline">1-on-1</span>
                      </button>
                    )}
                    {onSelectSkill && (
                      <button
                        onClick={() => onSelectSkill(skill.name)}
                        className="flex items-center gap-1 rounded-lg bg-slate-900 hover:bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white transition-all shadow-xs"
                      >
                        <span>Find Creators</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
