import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Play,
  Pause,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Compass,
  Info
} from 'lucide-react';
import { SkillNode, SkillEdge, SkillCategory } from '../types';

interface SkillGraphProps {
  skills: SkillNode[];
  edges: SkillEdge[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  onSelectSkillForBarter: (skillName: string, role: 'teach' | 'learn') => void;
  onFindChainsForSkill: (skillName: string) => void;
}

interface Particle {
  sourceId: string;
  targetId: string;
  progress: number;
  speed: number;
  color: string;
}

export const SkillGraphVisualization: React.FC<SkillGraphProps> = ({
  skills,
  edges,
  selectedCategory,
  onSelectCategory,
  onSelectSkillForBarter,
  onFindChainsForSkill,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('german');
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showParticles, setShowParticles] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [draggedNode, setDraggedNode] = useState<SkillNode | null>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Store mutable node positions for physics simulation
  const nodesRef = useRef<(SkillNode & { x: number; y: number; vx: number; vy: number; radius: number })[]>([]);
  const particlesRef = useRef<Particle[]>([]);

  // Initialize node physics positions once or when skills list changes
  useEffect(() => {
    const width = containerRef.current?.clientWidth || 800;
    const height = containerRef.current?.clientHeight || 520;
    const centerX = width / 2;
    const centerY = height / 2;

    const existingMap = new Map(nodesRef.current.map((n) => [n.id, n]));

    nodesRef.current = skills.map((skill, index) => {
      const existing = existingMap.get(skill.id);
      if (existing) {
        return {
          ...skill,
          x: existing.x,
          y: existing.y,
          vx: existing.vx,
          vy: existing.vy,
          radius: 26 + (skill.liquidityScore - 70) * 0.4,
        };
      }
      // Distribute evenly in a circular orbit with slight jitter
      const angle = (index / skills.length) * Math.PI * 2;
      const radius = 140 + (index % 3) * 60;
      return {
        ...skill,
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: 26 + (skill.liquidityScore - 70) * 0.4,
      };
    });

    // Initialize flowing particles
    const newParticles: Particle[] = [];
    edges.forEach((edge) => {
      newParticles.push({
        sourceId: edge.source,
        targetId: edge.target,
        progress: Math.random(),
        speed: 0.006 + Math.random() * 0.005,
        color: edge.type === 'active_chain' ? '#38bdf8' : '#a855f7',
      });
      if (edge.type === 'active_chain') {
        newParticles.push({
          sourceId: edge.target,
          targetId: edge.source,
          progress: Math.random(),
          speed: 0.005 + Math.random() * 0.004,
          color: '#10b981',
        });
      }
    });
    particlesRef.current = newParticles;
  }, [skills, edges]);

  // Main canvas rendering & physics loop
  useEffect(() => {
    let animationFrameId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick++;
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      // 1. Physics update (if playing)
      if (isPlaying) {
        const nodes = nodesRef.current;
        const centerX = width / 2;
        const centerY = height / 2;

        // Apply forces
        for (let i = 0; i < nodes.length; i++) {
          const n1 = nodes[i];
          if (draggedNode && draggedNode.id === n1.id) continue;

          // Gentle center gravity
          n1.vx += (centerX - n1.x) * 0.0003;
          n1.vy += (centerY - n1.y) * 0.0003;

          // Subtle organic floating float
          n1.vx += Math.sin(tick * 0.02 + i) * 0.03;
          n1.vy += Math.cos(tick * 0.02 + i) * 0.03;

          // Node-to-node repulsion
          for (let j = i + 1; j < nodes.length; j++) {
            const n2 = nodes[j];
            const dx = n2.x - n1.x;
            const dy = n2.y - n1.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const minDist = n1.radius + n2.radius + 60;

            if (dist < minDist) {
              const force = (minDist - dist) / dist * 0.04;
              n1.vx -= dx * force;
              n1.vy -= dy * force;
              n2.vx += dx * force;
              n2.vy += dy * force;
            }
          }
        }

        // Link spring attraction
        edges.forEach((edge) => {
          const source = nodes.find((n) => n.id === edge.source);
          const target = nodes.find((n) => n.id === edge.target);
          if (source && target) {
            const dx = target.x - source.x;
            const dy = target.y - source.y;
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            const desiredDist = edge.type === 'active_chain' ? 140 : 180;
            const force = (dist - desiredDist) * 0.0008;

            if (!draggedNode || draggedNode.id !== source.id) {
              source.vx += dx * force;
              source.vy += dy * force;
            }
            if (!draggedNode || draggedNode.id !== target.id) {
              target.vx -= dx * force;
              target.vy -= dy * force;
            }
          }
        });

        // Apply velocity & damping
        nodes.forEach((n) => {
          if (draggedNode && draggedNode.id === n.id) return;
          n.x += n.vx;
          n.y += n.vy;
          n.vx *= 0.88;
          n.vy *= 0.88;

          // Bound within viewport bounds
          const pad = n.radius + 20;
          if (n.x < pad) { n.x = pad; n.vx *= -0.5; }
          if (n.x > width - pad) { n.x = width - pad; n.vx *= -0.5; }
          if (n.y < pad) { n.y = pad; n.vy *= -0.5; }
          if (n.y > height - pad) { n.y = height - pad; n.vy *= -0.5; }
        });
      }

      // 2. Clear canvas with sleek dark backdrop
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const dpr = window.devicePixelRatio || 1;
      ctx.scale(dpr, dpr);

      // Apply pan and zoom
      ctx.translate(pan.x, pan.y);
      ctx.translate(width / 2, height / 2);
      ctx.scale(zoom, zoom);
      ctx.translate(-width / 2, -height / 2);

      // Draw subtle background grid
      ctx.strokeStyle = 'rgba(203, 213, 225, 0.45)';
      ctx.lineWidth = 1;
      const gridSize = 40;
      const startX = Math.floor((-pan.x - width) / gridSize) * gridSize;
      const endX = Math.ceil((width * 2 - pan.x) / gridSize) * gridSize;
      const startY = Math.floor((-pan.y - height) / gridSize) * gridSize;
      const endY = Math.ceil((height * 2 - pan.y) / gridSize) * gridSize;

      ctx.beginPath();
      for (let x = startX; x < endX; x += gridSize) {
        ctx.moveTo(x, startY);
        ctx.lineTo(x, endY);
      }
      for (let y = startY; y < endY; y += gridSize) {
        ctx.moveTo(startX, y);
        ctx.lineTo(endX, y);
      }
      ctx.stroke();

      const nodes = nodesRef.current;
      const nodeMap = new Map(nodes.map((n) => [n.id, n]));

      // 3. Draw Edges (Barter Paths)
      edges.forEach((edge) => {
        const source = nodeMap.get(edge.source);
        const target = nodeMap.get(edge.target);
        if (!source || !target) return;

        const isRelated =
          selectedNodeId === source.id ||
          selectedNodeId === target.id ||
          hoveredNodeId === source.id ||
          hoveredNodeId === target.id;

        const isCategoryMatch =
          selectedCategory === 'all' ||
          source.category === selectedCategory ||
          target.category === selectedCategory;

        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);

        if (edge.type === 'active_chain') {
          ctx.strokeStyle = isRelated
            ? 'rgba(2, 132, 199, 0.9)'
            : isCategoryMatch
            ? 'rgba(2, 132, 199, 0.45)'
            : 'rgba(2, 132, 199, 0.15)';
          ctx.lineWidth = isRelated ? 2.5 : 1.5;
          ctx.setLineDash(isRelated ? [] : [4, 4]);
        } else if (edge.type === 'high_demand') {
          ctx.strokeStyle = isRelated
            ? 'rgba(147, 51, 234, 0.9)'
            : isCategoryMatch
            ? 'rgba(147, 51, 234, 0.45)'
            : 'rgba(147, 51, 234, 0.15)';
          ctx.lineWidth = isRelated ? 2 : 1.2;
          ctx.setLineDash([2, 2]);
        } else {
          ctx.strokeStyle = isRelated
            ? 'rgba(16, 185, 129, 0.85)'
            : isCategoryMatch
            ? 'rgba(16, 185, 129, 0.35)'
            : 'rgba(16, 185, 129, 0.12)';
          ctx.lineWidth = isRelated ? 2 : 1;
          ctx.setLineDash([]);
        }

        ctx.stroke();
        ctx.setLineDash([]); // Reset line dash

        // Draw edge label if selected or hovered
        if (isRelated && edge.label) {
          const midX = (source.x + target.x) / 2;
          const midY = (source.y + target.y) / 2;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.fillRect(midX - 34, midY - 9, 68, 18);
          ctx.strokeStyle = 'rgba(203, 213, 225, 0.9)';
          ctx.strokeRect(midX - 34, midY - 9, 68, 18);
          ctx.fillStyle = '#334155';
          ctx.font = '600 10px "Plus Jakarta Sans", sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(edge.label, midX, midY);
        }
      });

      // 4. Draw Animated Particles along barter links
      if (showParticles) {
        particlesRef.current.forEach((p) => {
          const source = nodeMap.get(p.sourceId);
          const target = nodeMap.get(p.targetId);
          if (!source || !target) return;

          p.progress = (p.progress + p.speed) % 1;
          const px = source.x + (target.x - source.x) * p.progress;
          const py = source.y + (target.y - source.y) * p.progress;

          ctx.beginPath();
          ctx.arc(px, py, 2.5, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.shadowColor = p.color;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        });
      }

      // 5. Draw Skill Nodes
      nodes.forEach((node) => {
        const isSelected = selectedNodeId === node.id;
        const isHovered = hoveredNodeId === node.id;
        const matchesCategory = selectedCategory === 'all' || node.category === selectedCategory;
        const matchesSearch = !searchQuery || node.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isHighlighted = matchesCategory && matchesSearch;

        const baseAlpha = isHighlighted ? 1 : 0.3;

        // Outer pulsing aura for selected/high liquidity nodes
        if (isSelected || (node.liquidityScore >= 90 && isHighlighted)) {
          ctx.beginPath();
          const pulseR = node.radius + 6 + Math.sin(tick * 0.05) * 3;
          ctx.arc(node.x, node.y, pulseR, 0, Math.PI * 2);
          ctx.fillStyle = isSelected ? 'rgba(99, 102, 241, 0.18)' : 'rgba(14, 165, 233, 0.15)';
          ctx.fill();
        }

        // Verification / active swap outer ring
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected
          ? '#4f46e5'
          : isHovered
          ? '#0284c7'
          : isHighlighted
          ? `${node.color}${Math.floor(baseAlpha * 255).toString(16).padStart(2, '0')}`
          : 'rgba(203, 213, 225, 0.6)';
        ctx.lineWidth = isSelected ? 3 : isHovered ? 2.5 : 1.5;
        ctx.stroke();

        // Node Body (Crisp light gradient)
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(node.x - 6, node.y - 6, 2, node.x, node.y, node.radius);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(1, '#f8fafc');
        ctx.fillStyle = grad;
        ctx.fill();

        // Node Inner Color Accent Glow
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.7, 0, Math.PI * 2);
        ctx.fillStyle = `${node.color}18`;
        ctx.fill();

        // Node Text (Skill Name - Bold and High-Contrast)
        ctx.fillStyle = isHighlighted ? '#0f172a' : '#94a3b8';
        ctx.font = `${isSelected ? 'bold 12px' : '700 11px'} "Plus Jakarta Sans", sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Word wrap for long skill names
        const words = node.name.split(' ');
        if (words.length > 1 && node.name.length > 9) {
          ctx.fillText(words[0], node.x, node.y - 6);
          ctx.fillText(words.slice(1).join(' '), node.x, node.y + 7);
        } else {
          ctx.fillText(node.name, node.x, node.y);
        }

        // Small level badge below node
        if (isHighlighted) {
          const badgeY = node.y + node.radius + 12;
          ctx.font = '600 9px "JetBrains Mono", monospace';
          ctx.fillStyle = isSelected ? '#4f46e5' : '#64748b';
          ctx.fillText(`${node.liquidityScore}% match`, node.x, badgeY);
        }
      });

      ctx.restore();
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isPlaying, showParticles, zoom, pan, selectedCategory, searchQuery, selectedNodeId, hoveredNodeId, draggedNode, edges]);

  // Handle Resize
  useEffect(() => {
    const handleResize = () => {
      if (!canvasRef.current || !containerRef.current) return;
      const dpr = window.devicePixelRatio || 1;
      const rect = containerRef.current.getBoundingClientRect();
      canvasRef.current.width = rect.width * dpr;
      canvasRef.current.height = rect.height * dpr;
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Map screen coordinates to graph coordinates considering pan & zoom
  const screenToGraph = (clientX: number, clientY: number) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const screenX = clientX - rect.left;
    const screenY = clientY - rect.top;

    // Invert canvas transform:
    // 1. subtract center
    // 2. divide by zoom
    // 3. subtract pan
    // 4. add center
    const centeredX = screenX - width / 2 - pan.x;
    const centeredY = screenY - height / 2 - pan.y;

    const graphX = centeredX / zoom + width / 2;
    const graphY = centeredY / zoom + height / 2;

    return { x: graphX, y: graphY };
  };

  // Find node under mouse
  const getNodeAt = (x: number, y: number) => {
    for (const node of nodesRef.current) {
      const dx = node.x - x;
      const dy = node.y - y;
      if (Math.sqrt(dx * dx + dy * dy) <= node.radius + 5) {
        return node;
      }
    }
    return null;
  };

  // Mouse Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    const { x, y } = screenToGraph(e.clientX, e.clientY);
    const clickedNode = getNodeAt(x, y);

    if (clickedNode) {
      setDraggedNode(clickedNode);
      setSelectedNodeId(clickedNode.id);
    } else {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const { x, y } = screenToGraph(e.clientX, e.clientY);

    if (draggedNode) {
      const node = nodesRef.current.find((n) => n.id === draggedNode.id);
      if (node) {
        node.x = x;
        node.y = y;
        node.vx = 0;
        node.vy = 0;
      }
      return;
    }

    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
      return;
    }

    const hovered = getNodeAt(x, y);
    setHoveredNodeId(hovered ? hovered.id : null);
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
    setIsPanning(false);
  };

  // Reset view to center
  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Selected Node Details
  const selectedNode = useMemo(() => {
    return skills.find((s) => s.id === selectedNodeId) || skills[0];
  }, [skills, selectedNodeId]);

  // Related edges for selected node
  const relatedEdges = useMemo(() => {
    if (!selectedNode) return [];
    return edges.filter((e) => e.source === selectedNode.id || e.target === selectedNode.id);
  }, [edges, selectedNode]);

  const categories: { id: string; label: string; count: number }[] = [
    { id: 'all', label: 'All Skills', count: skills.length },
    { id: 'tech', label: 'Tech & Code', count: skills.filter((s) => s.category === 'tech').length },
    { id: 'languages', label: 'Languages', count: skills.filter((s) => s.category === 'languages').length },
    { id: 'music', label: 'Music & Audio', count: skills.filter((s) => s.category === 'music').length },
    { id: 'design', label: 'Visual Design', count: skills.filter((s) => s.category === 'design').length },
    { id: 'business', label: 'Business & Writing', count: skills.filter((s) => s.category === 'business').length },
  ];

  return (
    <div id="skill-graph-section" className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40">
      {/* Header bar */}
      <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-cyan-500 animate-pulse"></span>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Interactive Skill Network Graph
            </h2>
            <span className="rounded-md border border-cyan-500/30 bg-cyan-50 px-2 py-0.5 text-xs font-semibold text-cyan-700">
              Live Nexus Topology
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Real-time multi-dimensional knowledge barter web. Drag nodes, explore active exchange vectors, and uncover circular trade liquidity.
          </p>
        </div>

        {/* Search & Graph Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <input
              id="graph-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search skill (e.g. Python, German)..."
              className="h-9 w-48 sm:w-60 rounded-lg border border-slate-300 bg-white pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 transition-colors focus:border-indigo-500 focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-800"
              >
                ×
              </button>
            )}
          </div>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Simulation' : 'Resume Simulation'}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setZoom((z) => Math.min(z + 0.15, 2))}
            title="Zoom In"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
          >
            <ZoomIn className="h-4 w-4" />
          </button>

          <button
            onClick={() => setZoom((z) => Math.max(z - 0.15, 0.5))}
            title="Zoom Out"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
          >
            <ZoomOut className="h-4 w-4" />
          </button>

          <button
            onClick={resetView}
            title="Reset View"
            className="flex h-9 items-center gap-1 rounded-lg border border-slate-200 bg-slate-50 px-2.5 text-xs text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-xs"
          >
            <RefreshCw className="h-3 w-3" />
            <span className="hidden sm:inline">Reset</span>
          </button>

          <button
            onClick={() => setShowParticles(!showParticles)}
            title="Toggle Trade Particle Flows"
            className={`flex h-9 items-center gap-1.5 rounded-lg border px-2.5 text-xs transition-colors shadow-xs ${
              showParticles
                ? 'border-indigo-300 bg-indigo-50 text-indigo-700 font-medium'
                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span className="hidden sm:inline">Packet Flow</span>
          </button>
        </div>
      </div>

      {/* Category Pills Bar (Sidebar / Horizontal filter) */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="flex items-center gap-1 text-xs font-semibold text-slate-500">
          <Filter className="h-3 w-3 text-slate-400" /> Filter:
        </span>
        {categories.map((cat) => (
          <button
            key={cat.id}
            id={`filter-cat-${cat.id}`}
            onClick={() => onSelectCategory(cat.id)}
            className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-600 text-white shadow-md shadow-indigo-500/20'
                : 'border border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300 hover:text-slate-900'
            }`}
          >
            <span>{cat.label}</span>
            <span
              className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                selectedCategory === cat.id
                  ? 'bg-white/25 text-white'
                  : 'bg-slate-200 text-slate-600'
              }`}
            >
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Main Canvas & Detail Split Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Interactive Canvas Viewport */}
        <div
          ref={containerRef}
          className="relative col-span-1 lg:col-span-8 h-[440px] sm:h-[500px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 shadow-inner"
        >
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className="h-full w-full cursor-grab active:cursor-grabbing"
          />

          {/* Graph overlay helper instructions */}
          <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-lg border border-slate-200/90 bg-white/95 px-2.5 py-1.5 text-[11px] text-slate-600 shadow-sm backdrop-blur-md">
            <Compass className="h-3.5 w-3.5 text-cyan-600 animate-spin" />
            <span>Drag nodes • Scroll / buttons to zoom • Click node to inspect barter loop</span>
          </div>

          {/* Legend badge overlay */}
          <div className="pointer-events-none absolute top-3 right-3 hidden sm:flex flex-col gap-1.5 rounded-lg border border-slate-200/90 bg-white/95 p-2 text-[10px] text-slate-700 shadow-sm backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-500"></span>
              <span>Active Barter Route</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-purple-500"></span>
              <span>High Demand Link</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>Escrow Confirmed</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Inspection Card */}
        <div className="col-span-1 lg:col-span-4 flex flex-col justify-between rounded-xl border border-slate-200/90 bg-slate-50/70 p-4 shadow-xs">
          {selectedNode ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: selectedNode.color }}
                    ></span>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {selectedNode.name}
                    </h3>
                  </div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                    {selectedNode.category} • {selectedNode.level} Tier
                  </span>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold text-cyan-700">
                    {selectedNode.liquidityScore}%
                  </div>
                  <div className="text-[10px] text-slate-500 font-medium">Trade Liquidity</div>
                </div>
              </div>

              <p className="text-xs leading-relaxed text-slate-600">
                {selectedNode.description}
              </p>

              {/* Supply vs Demand Liquidity Bar */}
              <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-xs">
                <div className="mb-1.5 flex justify-between text-xs text-slate-600">
                  <span className="text-emerald-700 font-semibold">
                    {selectedNode.teachesCount} Mentors Teaching
                  </span>
                  <span className="text-cyan-700 font-semibold">
                    {selectedNode.wantsCount} Learners Seeking
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200 flex">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${(selectedNode.teachesCount / (selectedNode.teachesCount + selectedNode.wantsCount)) * 100}%`,
                    }}
                  ></div>
                  <div
                    className="h-full bg-cyan-500"
                    style={{
                      width: `${(selectedNode.wantsCount / (selectedNode.teachesCount + selectedNode.wantsCount)) * 100}%`,
                    }}
                  ></div>
                </div>
                <div className="mt-1 flex justify-between text-[10px] text-slate-400">
                  <span>Supply Ratio</span>
                  <span>Demand Velocity</span>
                </div>
              </div>

              {/* Connected Active Routes */}
              <div>
                <h4 className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                  <ArrowRight className="h-3 w-3 text-indigo-600" />
                  Active Barter Connections ({relatedEdges.length})
                </h4>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {relatedEdges.map((edge) => {
                    const otherId = edge.source === selectedNode.id ? edge.target : edge.source;
                    const otherNode = skills.find((s) => s.id === otherId);
                    return (
                      <div
                        key={edge.id}
                        onClick={() => setSelectedNodeId(otherId)}
                        className="flex cursor-pointer items-center justify-between rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs text-slate-700 shadow-xs transition-colors hover:border-slate-300 hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: otherNode?.color || '#94a3b8' }}
                          ></span>
                          <span className="font-medium text-slate-800">{otherNode?.name}</span>
                        </div>
                        <span className="rounded bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 text-[10px] text-indigo-700 font-mono font-medium">
                          {edge.label || 'Direct Swap'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col gap-2">
                <button
                  id="graph-find-chains-btn"
                  onClick={() => onFindChainsForSkill(selectedNode.name)}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 px-3 py-2 text-xs font-semibold text-white shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                  <span>Suggest Multi-Party Barter Chains</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectSkillForBarter(selectedNode.name, 'teach')}
                    className="rounded-lg border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 py-1.5 text-xs font-semibold text-emerald-700 transition-colors text-center"
                  >
                    I Can Teach This
                  </button>
                  <button
                    onClick={() => onSelectSkillForBarter(selectedNode.name, 'learn')}
                    className="rounded-lg border border-cyan-300 bg-cyan-50 hover:bg-cyan-100 py-1.5 text-xs font-semibold text-cyan-700 transition-colors text-center"
                  >
                    I Want to Learn
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center p-6 text-slate-400">
              <Info className="h-8 w-8 text-slate-400 mb-2" />
              <p className="text-xs">Click on any node in the graph to inspect liquidity, active barter links, and swap opportunities.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
