import React, { useState } from 'react';
import {
  Calendar,
  Users,
  Clock,
  Sparkles,
  CheckCircle2,
  PlusCircle,
  Tag,
  Flame,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Sprint, SkillCategory, ProficiencyTier } from '../types';

interface SprintsBoardProps {
  sprints: Sprint[];
  onToggleJoin: (sprintId: string) => void;
  onAddNewSprint: (sprint: Sprint) => void;
}

export const CollaborativeSprintsBoard: React.FC<SprintsBoardProps> = ({
  sprints,
  onToggleJoin,
  onAddNewSprint,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Sprint form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCategory, setNewCategory] = useState<SkillCategory>('tech');
  const [newMaxParticipants, setNewMaxParticipants] = useState(8);
  const [newDuration, setNewDuration] = useState(90);
  const [newDifficulty, setNewDifficulty] = useState<ProficiencyTier>('Intermediate');

  const filteredSprints = sprints.filter((s) => {
    if (selectedCategory === 'all') return true;
    return s.category === selectedCategory;
  });

  const handleCreateSprint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const created: Sprint = {
      id: `sprint-${Date.now()}`,
      title: newTitle,
      description: newDescription || 'Collaborative hands-on peer sprint and mutual critique session.',
      category: newCategory,
      host: {
        id: 'you',
        name: 'You (Host)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        badge: 'Sprint Lead',
      },
      scheduledDate: 'This Sunday at 18:00 UTC',
      durationMins: newDuration,
      currentParticipants: 1,
      maxParticipants: newMaxParticipants,
      tags: [newCategory, 'Peer Workshop', newDifficulty],
      isJoined: true,
      difficulty: newDifficulty,
    };

    onAddNewSprint(created);
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <section id="sprints-section" className="relative rounded-2xl border border-slate-200/90 bg-white p-4 sm:p-6 shadow-xl shadow-slate-200/40">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Calendar className="h-4 w-4" />
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-900">
              Collaborative "Sprints" & Workshop Board
            </h2>
            <span className="rounded-md border border-purple-200 bg-purple-50 px-2 py-0.5 text-xs font-semibold text-purple-800">
              Cohort Co-Learning
            </span>
          </div>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Intensive group barter workshops where 4–12 peers pool time credits together for focused masterclasses and collaborative lab sprints.
          </p>
        </div>

        {/* Action Button & Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-3 py-1.5 text-xs font-semibold text-white shadow-md shadow-purple-600/20 transition-all active:scale-[0.98]"
          >
            <PlusCircle className="h-3.5 w-3.5" />
            <span>Host a Sprint</span>
          </button>
        </div>
      </div>

      {/* Sprints Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredSprints.map((sprint) => {
          const percentFilled = Math.round((sprint.currentParticipants / sprint.maxParticipants) * 100);
          const isFull = sprint.currentParticipants >= sprint.maxParticipants;

          return (
            <div
              key={sprint.id}
              className="group flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-5 shadow-xs transition-all duration-300 hover:border-slate-300 hover:shadow-md"
            >
              <div>
                {/* Top info badge */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100">
                  <span className="rounded-md bg-purple-50 border border-purple-200 px-2.5 py-0.5 text-[11px] font-semibold text-purple-800 uppercase tracking-wider">
                    {sprint.category} • {sprint.difficulty}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                    <Clock className="h-3.5 w-3.5 text-cyan-600" />
                    <span>{sprint.scheduledDate}</span>
                  </div>
                </div>

                {/* Title and Description */}
                <div className="my-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {sprint.title}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    {sprint.description}
                  </p>
                </div>

                {/* Host Details */}
                <div className="flex items-center gap-2.5 rounded-lg border border-slate-200/80 bg-slate-50/70 p-2.5 mb-3">
                  <img
                    src={sprint.host.avatar}
                    alt={sprint.host.name}
                    className="h-8 w-8 rounded-full border border-slate-300 object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{sprint.host.name}</span>
                      <span className="rounded bg-indigo-100 px-1.5 py-0.2 text-[10px] text-indigo-700 font-semibold">
                        Host
                      </span>
                    </div>
                    <span className="text-[10px] text-amber-700 font-medium">
                      {sprint.host.badge}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    {sprint.durationMins} mins
                  </span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap items-center gap-1.5 mb-4">
                  {sprint.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-medium text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Progress & Join Action */}
              <div className="pt-3 border-t border-slate-200 space-y-3">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-indigo-600" />
                      Participants
                    </span>
                    <span className="font-bold text-slate-900">
                      {sprint.currentParticipants} / {sprint.maxParticipants} Seats Filled
                    </span>
                  </div>

                  {/* Meter */}
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentFilled >= 90
                          ? 'bg-amber-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}
                      style={{ width: `${percentFilled}%` }}
                    ></div>
                  </div>
                </div>

                {/* Join / Leave Sprint Button */}
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] text-slate-500">
                    {sprint.isJoined ? (
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        You are enrolled
                      </span>
                    ) : isFull ? (
                      <span className="text-amber-700 font-medium">Cohort at capacity</span>
                    ) : (
                      <span>Time Credit: 1.5h Escrow</span>
                    )}
                  </div>

                  <button
                    id={`join-sprint-btn-${sprint.id}`}
                    onClick={() => onToggleJoin(sprint.id)}
                    className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-all active:scale-[0.98] ${
                      sprint.isJoined
                        ? 'border border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100'
                        : isFull
                        ? 'cursor-not-allowed border border-slate-200 bg-slate-100 text-slate-400'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md shadow-emerald-600/20'
                    }`}
                  >
                    {sprint.isJoined ? (
                      <span>Leave Sprint</span>
                    ) : isFull ? (
                      <span>Waitlist</span>
                    ) : (
                      <>
                        <Users className="h-3.5 w-3.5" />
                        <span>Join Sprint</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Host New Sprint Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900">Host a Collaborative Sprint</h3>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 font-bold text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSprint} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sprint Topic
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. 48h Conversational German Survival Lab"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none placeholder-slate-400"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Description & Syllabus
                </label>
                <textarea
                  rows={2}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="What will participants build, critique, or practice together?"
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none placeholder-slate-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as SkillCategory)}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none capitalize"
                  >
                    <option value="tech">Tech & Software</option>
                    <option value="languages">Languages</option>
                    <option value="music">Music & Audio</option>
                    <option value="design">Visual Design</option>
                    <option value="business">Business & Writing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Max Capacity</label>
                  <input
                    type="number"
                    min={3}
                    max={20}
                    value={newMaxParticipants}
                    onChange={(e) => setNewMaxParticipants(parseInt(e.target.value))}
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-purple-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-slate-200 px-4 py-2 text-xs text-slate-600 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 px-5 py-2 text-xs font-bold text-white shadow-md shadow-purple-600/20"
                >
                  Publish Sprint to Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};
