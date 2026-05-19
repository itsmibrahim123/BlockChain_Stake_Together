import React from 'react';
import { Crown, User, ShieldAlert } from 'lucide-react';

const Leaderboard = ({ topStaker, currentAccount }) => {
  const isOverlord = currentAccount && topStaker.address.toLowerCase() === currentAccount.toLowerCase();

  return (
    <div className="glass-panel p-6 border-psionic/30 h-full relative">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="text-psionic" size={20} />
        <h2 className="text-lg font-bold psionic-text tracking-widest uppercase">Overlord Monolith</h2>
      </div>

      <div className={`p-6 border-2 mb-8 relative transition-all duration-500 ${isOverlord ? 'border-matrix aura-pulse bg-matrix/5' : 'border-psionic/30 bg-psionic/5'}`}>
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 bg-void border border-inherit text-[10px] uppercase tracking-widest font-bold">
          {isOverlord ? 'Pool Overlord' : 'Current Leader'}
        </div>

        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 border-2 ${isOverlord ? 'border-matrix text-matrix' : 'border-psionic text-psionic'}`}>
            {isOverlord ? <Crown size={32} /> : <User size={32} />}
          </div>
          
          <p className="font-mono text-xs mb-1 text-slate-400">ADDRESS_HASH</p>
          <p className={`font-bold text-sm truncate w-full mb-3 ${isOverlord ? 'neon-text' : 'psionic-text'}`}>
            {topStaker.address}
          </p>
          
          <p className="text-[10px] uppercase text-slate-500 mb-1">Total Staked Power</p>
          <p className={`text-2xl font-black font-mono ${isOverlord ? 'neon-text' : 'psionic-text'}`}>
            {parseFloat(topStaker.amount).toLocaleString()} CC
          </p>
        </div>

        {isOverlord && (
          <div className="mt-4 py-2 border border-matrix/40 bg-matrix/10 text-center animate-bounce">
            <span className="text-[10px] text-matrix font-bold tracking-[0.3em] uppercase">YOU ARE THE POOL OVERLORD</span>
          </div>
        )}
      </div>

      <div className="space-y-3 opacity-60">
        <div className="flex justify-between text-[10px] text-slate-500 uppercase tracking-widest mb-1 px-2">
          <span>Node</span>
          <span>Power</span>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-bold text-psionic">02</div>
            <div className="text-xs font-mono">0x4a...f2e</div>
          </div>
          <div className="text-xs font-mono">7,240 CC</div>
        </div>
        <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10">
          <div className="flex items-center gap-3">
            <div className="text-[10px] font-bold text-psionic">03</div>
            <div className="text-xs font-mono">0x1b...9c3</div>
          </div>
          <div className="text-xs font-mono">5,100 CC</div>
        </div>
      </div>

      <div className="absolute bottom-2 right-4 flex items-center gap-1 text-[8px] text-psionic/40">
        <ShieldAlert size={10} />
        <span>RANKINGS_LIVE_FEED</span>
      </div>
    </div>
  );
};

export default Leaderboard;
