import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Mic, Sparkles } from 'lucide-react';

interface AudioPitchPlayerProps {
  creatorName: string;
  durationSec?: number;
  waveform?: number[];
  tone?: 'energetic' | 'calm' | 'professional';
  compact?: boolean;
}

const DEFAULT_WAVEFORM = [18, 35, 60, 85, 40, 95, 70, 50, 80, 100, 65, 45, 90, 75, 30, 85, 95, 60, 40, 70, 85, 50, 30, 20];

export const AudioPitchPlayer: React.FC<AudioPitchPlayerProps> = ({
  creatorName,
  durationSec = 28,
  waveform = DEFAULT_WAVEFORM,
  tone = 'energetic',
  compact = false,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0 to 100
  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Synthesize a pleasant audio melody/tone on play using standard Web Audio API
  const startSynthMelody = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      // Play soft arpeggio chords simulating human voice harmony
      const notes = tone === 'energetic' ? [330, 392, 440, 523, 659] : tone === 'calm' ? [220, 261, 329, 392, 440] : [261, 329, 392, 523];

      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.25);
        gain.gain.setValueAtTime(0.001, ctx.currentTime + idx * 0.25);
        gain.gain.exponentialRampToValueAtTime(0.06, ctx.currentTime + idx * 0.25 + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.25 + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.25);
        osc.stop(ctx.currentTime + idx * 0.25 + 1.3);
      });
    } catch {
      // Graceful fallback if browser restricts audio context
    }
  };

  const stopSynth = () => {
    if (audioCtxRef.current) {
      try {
        audioCtxRef.current.close();
      } catch {
        // Ignore
      }
      audioCtxRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      stopSynth();
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      setIsPlaying(true);
      startSynthMelody();
      const stepTime = (durationSec * 1000) / 100;
      intervalRef.current = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            stopSynth();
            if (intervalRef.current) clearInterval(intervalRef.current);
            return 0;
          }
          return prev + 1;
        });
      }, stepTime);
    }
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      stopSynth();
    };
  }, []);

  const currentSeconds = Math.floor((progress / 100) * durationSec);

  return (
    <div
      className={`rounded-xl border border-indigo-100 bg-gradient-to-r from-indigo-50/70 via-purple-50/40 to-slate-50 p-2.5 transition-all ${
        compact ? 'text-[11px]' : 'text-xs'
      }`}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="flex items-center gap-1.5">
          <span className="flex h-5 w-5 items-center justify-center rounded-md bg-indigo-600 text-white shadow-xs">
            <Mic className="h-3 w-3" />
          </span>
          <span className="font-bold text-slate-800 truncate">
            {creatorName}'s 30s Audio Intro
          </span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono font-semibold text-indigo-700 bg-white/90 border border-indigo-100 px-1.5 py-0.5 rounded-md">
          <Volume2 className="h-3 w-3 text-indigo-500" />
          <span>
            0:{currentSeconds < 10 ? `0${currentSeconds}` : currentSeconds} / 0:{durationSec}
          </span>
        </div>
      </div>

      {/* Waveform & Play button */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={togglePlay}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-xs hover:bg-indigo-700 active:scale-95 transition-all"
          title={isPlaying ? 'Pause Intro' : 'Listen to Voice Pitch'}
        >
          {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 ml-0.5" />}
        </button>

        {/* Dynamic Waveform Bars */}
        <div className="flex flex-1 items-center gap-1 h-7 px-1">
          {waveform.map((height, idx) => {
            const barProgress = (idx / waveform.length) * 100;
            const isFilled = progress >= barProgress;
            return (
              <div
                key={idx}
                style={{ height: `${Math.max(15, height)}%` }}
                className={`flex-1 rounded-full transition-all duration-150 ${
                  isFilled
                    ? 'bg-gradient-to-t from-indigo-600 to-cyan-500 shadow-2xs'
                    : 'bg-slate-200'
                } ${isPlaying && isFilled ? 'scale-y-110' : ''}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
