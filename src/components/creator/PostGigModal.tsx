import React, { useState } from 'react';
import { X, Sparkles, DollarSign, Clock, Layers, CheckCircle2, Tag } from 'lucide-react';
import { GigItem, GigCategory, GigRateType } from '../../types';

interface PostGigModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostGig: (gig: GigItem) => void;
  onAddToast: (title: string, message: string, type?: 'success' | 'info' | 'chain') => void;
}

const CATEGORIES: GigCategory[] = [
  'Video & Animation',
  'Design & Branding',
  'Social Media & Growth',
  'Music & Audio',
  'Web & Coding',
  'Writing & Content',
];

export const PostGigModal: React.FC<PostGigModalProps> = ({
  isOpen,
  onClose,
  onPostGig,
  onAddToast,
}) => {
  if (!isOpen) return null;

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GigCategory>('Video & Animation');
  const [rate, setRate] = useState<number>(45);
  const [rateType, setRateType] = useState<GigRateType>('fixed');
  const [deliveryDays, setDeliveryDays] = useState<number>(2);
  const [description, setDescription] = useState('');
  const [deliverablesInput, setDeliverablesInput] = useState('High-res source files, 2 rounds of revisions, Commercial use license');
  const [tagsInput, setTagsInput] = useState('Creative, Fast Turnaround, GenZ');

  // Creator identity (simulated login-free young creator)
  const [creatorName, setCreatorName] = useState('Alex Rivera');
  const [creatorBio, setCreatorBio] = useState('20 y/o digital designer & creator monetizing skills directly with global clients.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const deliverables = deliverablesInput
      .split(',')
      .map((d) => d.trim())
      .filter(Boolean);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const newGig: GigItem = {
      id: `gig-${Date.now()}`,
      title: title.trim(),
      creatorId: `creator-${Date.now()}`,
      creatorName: creatorName.trim() || 'Alex Rivera',
      creatorHandle: `@${(creatorName.trim() || 'creator').toLowerCase().replace(/\s+/g, '')}`,
      creatorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      creatorBio: creatorBio.trim(),
      category,
      rate: Number(rate) || 25,
      rateType,
      deliveryDays: Number(deliveryDays) || 1,
      description: description.trim(),
      deliverables: deliverables.length > 0 ? deliverables : ['Complete project files', '1 revision round'],
      rating: 5.0,
      reviewsCount: 0,
      completedGigs: 0,
      createdAt: 'Just now',
      isFeatured: false,
      pendingBookingsCount: 0,
      rotationScore: 95, // Brand new gig gets fresh boost!
      tags: tags.length > 0 ? tags : [category],
    };

    onPostGig(newGig);
    onAddToast(
      'Gig Published Successfully!',
      `"${title}" is now live in the creator marketplace. Clients can book immediately.`,
      'success'
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-3 sm:p-4 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Post a Creator Gig</h3>
              <p className="text-xs text-slate-500">List your creative or technical service and start earning</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Service Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Gig Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. High-Retention TikTok & Reels Video Editing with Sound Design"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
              required
            />
          </div>

          {/* Category & Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GigCategory)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none bg-white"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rate ($ USD) <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">$</span>
                <input
                  type="number"
                  min="5"
                  max="5000"
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 pl-7 pr-3 py-2.5 text-xs font-bold text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Pricing Structure
              </label>
              <select
                value={rateType}
                onChange={(e) => setRateType(e.target.value as GigRateType)}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none bg-white"
              >
                <option value="fixed">Fixed Rate / Project</option>
                <option value="hourly">Hourly Rate ($/hr)</option>
              </select>
            </div>
          </div>

          {/* Turnaround Time & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Turnaround Time (Days)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Number(e.target.value))}
                  className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-600 focus:outline-none"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">days delivery</span>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Tags (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. CapCut, Premiere, Fast, Gen-Z"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Service Description <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Detail your process, what makes your creative work stand out, tools you use, and why clients should book you."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
              required
            />
          </div>

          {/* Deliverables */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Included Deliverables (Comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. 4K 60fps MP4 file, Motion graphics, 2 revision rounds"
              value={deliverablesInput}
              onChange={(e) => setDeliverablesInput(e.target.value)}
              className="w-full rounded-xl border border-slate-300 px-3.5 py-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none"
            />
          </div>

          {/* Creator Profile Details */}
          <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5 space-y-2.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
              Creator Profile Identity
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Your Name</label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-600 mb-1">Short Bio</label>
                <input
                  type="text"
                  value={creatorBio}
                  onChange={(e) => setCreatorBio(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 px-5 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:from-indigo-700 hover:to-cyan-700 transition-all active:scale-[0.98]"
            >
              <Sparkles className="h-4 w-4" />
              <span>Publish Gig</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
