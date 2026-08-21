import React, { useState, useEffect, useRef } from 'react';
import { audioEngine } from '../utils/audio';
import { Play, Pause, RotateCcw, X, Volume2 } from 'lucide-react';

interface RestTimerProps {
  initialSeconds?: number;
  onClose: () => void;
}

export const RestTimer: React.FC<RestTimerProps> = ({
  initialSeconds = 60,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const [totalTime, setTotalTime] = useState<number>(initialSeconds);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 5 && prev > 1) {
            audioEngine.playTimerTick();
          }
          if (prev <= 1) {
            audioEngine.playTimerComplete();
            setIsRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft]);

  const togglePlay = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setTimeLeft(totalTime);
    setIsRunning(true);
  };

  const adjustTime = (delta: number) => {
    const newTime = Math.max(5, timeLeft + delta);
    setTimeLeft(newTime);
    if (newTime > totalTime) setTotalTime(newTime);
  };

  // SVG Progress Calculation
  const progress = (timeLeft / totalTime) * 100;
  const strokeDashoffset = 283 - (283 * progress) / 100;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
      <div className="glass-panel-gold rounded-2xl p-5 border border-amber-500/50 shadow-2xl flex flex-col items-center gap-3 max-w-xs w-72">
        {/* Header */}
        <div className="flex items-center justify-between w-full border-b border-amber-500/30 pb-2">
          <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
            <Volume2 className="w-3.5 h-3.5" /> Rest & Recovery Timer
          </span>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Circular Timer Ring */}
        <div className="relative w-32 h-32 flex items-center justify-center my-1">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Background Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className="text-slate-800 stroke-current"
              strokeWidth="6"
              fill="transparent"
            />
            {/* Progress Ring */}
            <circle
              cx="50"
              cy="50"
              r="45"
              className={`stroke-current transition-all duration-1000 ${
                timeLeft <= 10 ? 'text-red-500' : 'text-amber-400'
              }`}
              strokeWidth="6"
              strokeDasharray="283"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Time Center Label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white tracking-wider font-mono">
              {formattedTime}
            </span>
            <span className="text-[10px] uppercase text-amber-400 font-semibold">
              {timeLeft === 0 ? 'REST DONE!' : isRunning ? 'RESTING' : 'PAUSED'}
            </span>
          </div>
        </div>

        {/* Adjust Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => adjustTime(-15)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold"
          >
            -15s
          </button>
          <button
            onClick={togglePlay}
            className="p-2.5 rounded-full bg-gradient-to-r from-amber-500 to-yellow-400 text-slate-950 shadow-md hover:brightness-110"
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button
            onClick={resetTimer}
            className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500/50"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={() => adjustTime(15)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300 border border-slate-700 hover:border-amber-500/50 text-xs font-semibold"
          >
            +15s
          </button>
        </div>
      </div>
    </div>
  );
};
