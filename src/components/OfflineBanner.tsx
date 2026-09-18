import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw } from 'lucide-react';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [showReconnected, setShowReconnected] = useState<boolean>(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowReconnected(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (isOnline && !showReconnected) return null;

  return (
    <div
      className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-4 py-2 text-xs font-semibold shadow-md transition-all ${
        !isOnline
          ? 'bg-amber-600 text-white'
          : 'bg-emerald-600 text-white animate-fade-in'
      }`}
    >
      <div className="mx-auto max-w-7xl flex items-center gap-2">
        {!isOnline ? (
          <>
            <WifiOff className="h-4 w-4 shrink-0 animate-pulse" />
            <span>
              You are currently offline. Changes are saved to local cache and will automatically sync to Cloud Firestore once reconnected.
            </span>
          </>
        ) : (
          <>
            <Wifi className="h-4 w-4 shrink-0" />
            <span>Connection restored! Successfully synced with Cloud Firestore.</span>
          </>
        )}
      </div>

      {!isOnline && (
        <button
          onClick={() => window.location.reload()}
          className="flex items-center gap-1 rounded bg-amber-700/80 hover:bg-amber-800 px-2 py-0.5 text-[11px] text-white shrink-0 ml-2"
        >
          <RefreshCw className="h-3 w-3" />
          <span>Retry</span>
        </button>
      )}
    </div>
  );
};
