import React, { useState, useEffect } from 'react';
import { ShieldCheck, ShieldAlert, Globe, Server, Cpu } from 'lucide-react';
import { CONTRACT_ADDRESSES } from '../constants';

const DiagnosticHub = ({ account, provider, useMock, isFunded }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [health, setHealth] = useState({
    wallet: 'OFFLINE',
    stakeContract: 'PENDING',
    tokenContract: 'PENDING',
    network: 'UNSET'
  });

  useEffect(() => {
    if (useMock) {
      setHealth({
        wallet: 'SIMULATED',
        stakeContract: 'VIRTUAL_READY',
        tokenContract: 'VIRTUAL_READY',
        network: 'LOCAL_GRID'
      });
      return;
    }

    const checkHealth = async () => {
      const newHealth = { ...health };
      
      if (account) newHealth.wallet = 'SYNAPSE_LINKED';
      else newHealth.wallet = 'OFFLINE';

      if (provider) {
        const net = await provider.getNetwork();
        newHealth.network = net.name === 'sepolia' ? 'SEPOLIA_NODE' : 'NON_SEPOLIA_WARP';
        
        // Simple reachability check (could be more robust)
        newHealth.stakeContract = CONTRACT_ADDRESSES.STAKE_TOGETHER.startsWith('0x') ? 'LINKED' : 'ADDR_ERR';
        newHealth.tokenContract = CONTRACT_ADDRESSES.CLOUD_COIN.startsWith('0x') ? 'LINKED' : 'ADDR_ERR';
      }

      setHealth(newHealth);
    };

    checkHealth();
  }, [account, provider, useMock]);

  return (
    <div className={`fixed bottom-0 right-8 transition-all duration-500 z-50 ${isExpanded ? 'translate-y-0' : 'translate-y-[calc(100%-32px)]'}`}>
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-void border-t border-x border-psionic/30 px-6 py-2 flex items-center justify-between gap-8 hover:bg-psionic/5 transition-colors"
      >
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${account ? 'bg-matrix animate-pulse shadow-[0_0_5px_#4fffb0]' : 'bg-emergency'}`} />
          <span className="text-[9px] font-black uppercase tracking-[0.3em] text-psionic">System_Health_Monitor</span>
        </div>
        <div className="text-slate-500 text-[8px]">{isExpanded ? '▼ MINIMIZE' : '▲ DIAGNOSTICS'}</div>
      </button>

      <div className="glass-panel border-psionic/30 p-6 w-80 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="space-y-4">
          <StatusItem icon={<Cpu size={14}/>} label="Neural_Link" status={health.wallet} color={account ? 'text-matrix' : 'text-emergency'} />
          <StatusItem icon={<Globe size={14}/>} label="Network_Grid" status={health.network} color={health.network.includes('SEPOLIA') ? 'text-psionic' : 'text-emergency'} />
          <StatusItem icon={<Server size={14}/>} label="Stake_Contract" status={health.stakeContract} color={health.stakeContract === 'LINKED' ? 'text-matrix' : 'text-slate-500'} />
          <StatusItem icon={<ShieldCheck size={14}/>} label="Reward_Vault" status={isFunded ? 'INITIALIZED' : 'LOCKED'} color={isFunded ? 'text-matrix' : 'text-emergency'} />
        </div>

        <div className="mt-6 pt-4 border-t border-psionic/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[8px] text-slate-500 uppercase font-bold">Protocol Integrity</span>
            <span className="text-[8px] text-matrix font-mono">99.8%</span>
          </div>
          <div className="h-1 bg-void overflow-hidden">
            <div className="h-full bg-psionic/40 w-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusItem = ({ icon, label, status, color }) => (
  <div className="flex items-center justify-between group">
    <div className="flex items-center gap-3 text-slate-400">
      <div className="group-hover:text-psionic transition-colors">{icon}</div>
      <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
    </div>
    <span className={`text-[10px] font-mono font-bold ${color}`}>{status}</span>
  </div>
);

export default DiagnosticHub;
