import React from 'react';
import { ShoppingBag, Search, Sparkles, PlusCircle } from 'lucide-react';

export const GigCardSkeleton: React.FC = () => {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-xs animate-pulse flex flex-col justify-between">
      <div>
        <div className="h-44 w-full rounded-2xl bg-slate-200 mb-4"></div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-4 w-16 rounded-full bg-slate-200"></div>
          <div className="h-4 w-24 rounded-full bg-slate-200"></div>
        </div>
        <div className="h-5 w-3/4 rounded-md bg-slate-200 mb-2"></div>
        <div className="h-4 w-full rounded-md bg-slate-100 mb-1"></div>
        <div className="h-4 w-2/3 rounded-md bg-slate-100 mb-4"></div>
      </div>

      <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-slate-200"></div>
          <div className="h-3 w-20 rounded bg-slate-200"></div>
        </div>
        <div className="h-7 w-16 rounded-xl bg-slate-200"></div>
      </div>
    </div>
  );
};

export const DashboardStatsSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="h-3 w-20 rounded bg-slate-200 mb-3"></div>
          <div className="h-7 w-28 rounded bg-slate-300 mb-2"></div>
          <div className="h-3 w-16 rounded bg-slate-100"></div>
        </div>
      ))}
    </div>
  );
};

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon: Icon = Search,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 p-10 text-center max-w-lg mx-auto my-8">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-inner">
        <Icon className="h-7 w-7" />
      </div>
      <h3 className="text-base sm:text-lg font-bold text-slate-900">{title}</h3>
      <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm leading-relaxed">
        {description}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-md shadow-indigo-600/20 hover:bg-indigo-700 transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>{actionLabel}</span>
        </button>
      )}
    </div>
  );
};
