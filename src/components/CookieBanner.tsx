import React, { useState, useEffect } from 'react';
import { Cookie, ShieldCheck, X, Check, Settings } from 'lucide-react';

interface CookieBannerProps {
  onOpenPrivacyPolicy: () => void;
  onOpenTerms: () => void;
}

export const CookieBanner: React.FC<CookieBannerProps> = ({
  onOpenPrivacyPolicy,
  onOpenTerms,
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [showPreferences, setShowPreferences] = useState<boolean>(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('skillnexus_cookie_consent');
      if (!consent) {
        const timer = setTimeout(() => setIsVisible(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    try {
      localStorage.setItem('skillnexus_cookie_consent', JSON.stringify({ necessary: true, analytics: true, marketing: true, timestamp: Date.now() }));
    } catch {}
    setIsVisible(false);
  };

  const handleRejectNonEssential = () => {
    try {
      localStorage.setItem('skillnexus_cookie_consent', JSON.stringify({ necessary: true, analytics: false, marketing: false, timestamp: Date.now() }));
    } catch {}
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    try {
      localStorage.setItem('skillnexus_cookie_consent', JSON.stringify({ necessary: true, analytics: analyticsConsent, marketing: marketingConsent, timestamp: Date.now() }));
    } catch {}
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-6 sm:max-w-md z-50 animate-slide-up">
      <div className="overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 backdrop-blur-md p-5 shadow-2xl shadow-slate-900/10">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <Cookie className="h-5 w-5" />
          </div>

          <div className="min-w-0">
            <h3 className="text-sm font-bold text-slate-900">Your Privacy Choices</h3>
            <p className="mt-1 text-xs text-slate-600 leading-relaxed">
              We use essential cookies to power authentication, Firestore real-time sync, and escrow transactions.
            </p>
          </div>
        </div>

        {/* Detailed Preferences Accordion */}
        {showPreferences && (
          <div className="mt-4 space-y-2 rounded-2xl border border-slate-100 bg-slate-50 p-3 text-xs">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800">Essential Cookies</span>
                <p className="text-[11px] text-slate-500">Required for login & escrow checkout.</p>
              </div>
              <span className="text-[11px] font-bold text-emerald-600">Always Active</span>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <span className="font-bold text-slate-800">Performance & Analytics</span>
                <p className="text-[11px] text-slate-500">Helps us optimize roadmap page speeds.</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
              <div>
                <span className="font-bold text-slate-800">Personalized Creator Recommendations</span>
                <p className="text-[11px] text-slate-500">Matches skills tailored to your gigs.</p>
              </div>
              <input
                type="checkbox"
                checked={marketingConsent}
                onChange={(e) => setMarketingConsent(e.target.checked)}
                className="h-4 w-4 rounded accent-indigo-600"
              />
            </div>
          </div>
        )}

        {/* Legal Links */}
        <div className="mt-3 flex items-center gap-3 text-[11px] text-slate-500">
          <button
            onClick={onOpenPrivacyPolicy}
            className="hover:text-indigo-600 underline underline-offset-2"
          >
            Privacy Policy
          </button>
          <span>•</span>
          <button
            onClick={onOpenTerms}
            className="hover:text-indigo-600 underline underline-offset-2"
          >
            Terms of Service
          </button>
          <span>•</span>
          <button
            onClick={() => setShowPreferences(!showPreferences)}
            className="hover:text-indigo-600 font-medium"
          >
            {showPreferences ? 'Hide Options' : 'Preferences'}
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex items-center justify-end gap-2">
          {showPreferences ? (
            <button
              onClick={handleSavePreferences}
              className="w-full rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-all"
            >
              Save Choices
            </button>
          ) : (
            <>
              <button
                onClick={handleRejectNonEssential}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all"
              >
                Essential Only
              </button>
              <button
                onClick={handleAcceptAll}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-all"
              >
                Accept All
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
