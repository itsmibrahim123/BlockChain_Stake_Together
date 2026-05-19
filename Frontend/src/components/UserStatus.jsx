import React from 'react';
import { TrendingUp, Wallet, Award, Coins } from 'lucide-react';
import { RANKS } from '../constants';

const UserStatus = ({ account, balance, stakedAmount, reward }) => {
  const getRank = (amount) => {
    const numericAmount = parseFloat(amount);
    return RANKS.find(r => numericAmount >= r.min && numericAmount <= r.max) || RANKS[0];
  };

  const rank = getRank(stakedAmount);

  if (!account) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="glass-panel p-4 border-t-2 border-t-psionic">
        <div className="flex items-center gap-3 mb-2">
          <Wallet className="text-psionic" size={18} />
          <span className="text-[10px] uppercase tracking-tighter text-slate-400">Available Credits</span>
        </div>
        <p className="psionic-text text-xl font-bold">{parseFloat(balance).toLocaleString()} CC</p>
      </div>

      <div className="glass-panel p-4 border-t-2 border-t-matrix">
        <div className="flex items-center gap-3 mb-2">
          <TrendingUp className="text-matrix" size={18} />
          <span className="text-[10px] uppercase tracking-tighter text-slate-400">Active Stake</span>
        </div>
        <p className="neon-text text-xl font-bold">{parseFloat(stakedAmount).toLocaleString()} CC</p>
      </div>

      <div className="glass-panel p-4 border-t-2 border-t-matrix relative group">
        <div className="flex items-center gap-3 mb-2">
          <Coins className="text-matrix" size={18} />
          <span className="text-[10px] uppercase tracking-tighter text-slate-400">Generated Yield</span>
        </div>
        <p className="neon-text text-xl font-bold font-mono tabular-nums">
          {reward}
        </p>
        <div className="absolute top-2 right-2 px-1 bg-matrix/10 text-[8px] text-matrix border border-matrix/30 animate-pulse">
          LIVE
        </div>
      </div>

      <div className="glass-panel p-4 border-t-2 border-t-psionic overflow-visible">
        <div className="flex items-center gap-3 mb-2">
          <Award className="text-psionic" size={18} />
          <span className="text-[10px] uppercase tracking-tighter text-slate-400">Operator Rank</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="psionic-text font-bold text-sm tracking-widest">{rank.name}</span>
          <div className="w-6 h-6 rounded-sm bg-psionic/20 border border-psionic flex items-center justify-center">
             <div className="w-2 h-2 bg-psionic rotate-45 animate-spin shadow-[0_0_10px_#7b5cff]" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserStatus;
