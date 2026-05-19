import React, { useState } from 'react';
import { Zap, Lock, Unlock, Loader2 } from 'lucide-react';

const StakingPanel = ({ stake, claim, loading, isStakingOpen, stakedAmount }) => {
  const [amount, setAmount] = useState('');
  const hasStake = parseFloat(stakedAmount) > 0;

  const handleStake = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) return;
    const success = await stake(amount);
    if (success) setAmount('');
  };

  return (
    <div className="glass-panel p-6 border-2 border-matrix/30 h-full flex flex-col justify-between relative">
      <div className="scanline" />
      
      <div className="relative z-20">
        <div className="flex items-center gap-2 mb-6">
          <Zap className="text-matrix animate-pulse" size={20} />
          <h2 className="text-lg font-bold neon-text tracking-widest uppercase">Generator Core</h2>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <label className="text-[10px] uppercase text-matrix/60 mb-1 block">Injection Amount (CC)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-void border border-matrix/30 p-4 text-matrix focus:outline-none focus:border-matrix transition-colors placeholder:text-matrix/20"
            />
            <div className="absolute top-[34px] right-4 text-[10px] text-matrix/40">CC_TOKEN</div>
          </div>

          <button
            onClick={handleStake}
            disabled={loading || !isStakingOpen}
            className={`w-full py-4 border-2 flex items-center justify-center gap-3 uppercase tracking-widest text-sm font-bold transition-all duration-500
              ${isStakingOpen 
                ? 'border-matrix text-matrix hover:bg-matrix hover:text-void shadow-[0_0_15px_rgba(79,255,176,0.2)]' 
                : 'border-slate-700 text-slate-700 cursor-not-allowed opacity-50'}`}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={20} />
            ) : isStakingOpen ? (
              <>
                <Lock size={18} />
                Initialize Stake
              </>
            ) : (
              'Core Locked'
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-matrix/10 relative z-20">
        <h3 className="text-[10px] uppercase text-slate-500 mb-4 tracking-tighter">Extraction Protocol</h3>
        <button
          onClick={claim}
          disabled={loading || isStakingOpen || !hasStake}
          className={`w-full py-3 flex items-center justify-center gap-3 uppercase tracking-widest text-xs font-bold transition-all
            ${(!isStakingOpen && hasStake)
              ? 'bg-psionic text-void hover:bg-psionic/80 shadow-[0_0_10px_#7b5cff]' 
              : 'border border-psionic/20 text-psionic/40 cursor-not-allowed'}`}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              <Unlock size={16} />
              {hasStake ? 'Claim All Yield' : 'No Yield to Extract'}
            </>
          )}
        </button>
        {isStakingOpen && hasStake && (
          <p className="text-[8px] text-center mt-2 text-emergency/60 italic uppercase tracking-widest">
            Extraction unauthorized - lockup in progress
          </p>
        )}
      </div>
    </div>
  );
};

export default StakingPanel;
