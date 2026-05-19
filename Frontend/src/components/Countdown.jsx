import React from 'react';
import { Timer, Activity } from 'lucide-react';
import { STAKING_DURATION } from '../constants';

const Countdown = ({ timeRemaining }) => {
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 3600));
    const hours = Math.floor((seconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return { days, hours, minutes, secs };
  };

  const { days, hours, minutes, secs } = formatTime(timeRemaining);
  const progress = ((STAKING_DURATION - timeRemaining) / STAKING_DURATION) * 100;

  return (
    <div className="glass-panel p-6 border-emergency/30 relative">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Timer className="text-emergency" size={20} />
          <h2 className="text-lg font-bold text-emergency tracking-widest uppercase text-shadow-[0_0_10px_#ff4f5e]">Lockup Chronometer</h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emergency/10 border border-emergency/30">
           <Activity size={12} className="text-emergency animate-pulse" />
           <span className="text-[10px] text-emergency font-bold">STABLE_TIME_FLUX</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: 'DAYS', value: days },
          { label: 'HRS', value: hours },
          { label: 'MIN', value: minutes },
          { label: 'SEC', value: secs },
        ].map((item, idx) => (
          <div key={idx} className="bg-void border border-emergency/20 p-4 text-center relative group overflow-hidden">
             <div className="absolute top-0 left-0 w-1 h-1 bg-emergency" />
             <div className="text-3xl font-black text-emergency font-mono tracking-tighter tabular-nums group-hover:scale-110 transition-transform">
               {String(item.value).padStart(2, '0')}
             </div>
             <div className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
               {item.label}
             </div>
          </div>
        ))}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-end">
          <span className="text-[10px] text-slate-500 uppercase font-bold">Progress Engine Tracking</span>
          <span className="text-[10px] text-emergency font-mono font-bold">{progress.toFixed(2)}%</span>
        </div>
        <div className="h-4 bg-void border border-emergency/30 p-0.5 relative">
          <div 
            className="h-full bg-gradient-to-r from-emergency/40 via-emergency to-emergency/40 shadow-[0_0_15px_rgba(255,79,94,0.4)] transition-all duration-1000 ease-linear relative overflow-hidden"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_1s_linear_infinite]" />
          </div>
        </div>
        <div className="flex justify-between text-[8px] text-slate-600 uppercase font-bold tracking-tighter">
          <span>Deployment_Start</span>
          <span>Target_Maturity</span>
        </div>
      </div>

      <style>{`
        @keyframes progress-stripe {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
      `}</style>
    </div>
  );
};

export default Countdown;
