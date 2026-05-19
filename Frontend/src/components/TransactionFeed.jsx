import React, { useState, useEffect } from 'react';
import { Terminal, Activity, ArrowRight } from 'lucide-react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESSES, STAKE_TOGETHER_ABI } from '../constants';

const TransactionFeed = ({ provider, useMock }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (useMock) {
      const mockEvents = [
        "PROTOCOL_BOOT_SEQUENCE_COMPLETE",
        "ENCRYPTED_LINK_ESTABLISHED_0x4A...453",
        "DATA_STREAM_SYNCHRONIZED",
      ];
      setLogs(mockEvents.map((m, i) => ({ 
        id: `mock-init-${i}-${Date.now()}`, 
        timestamp: Date.now(),
        msg: m, 
        type: 'system' 
      })));

      const interval = setInterval(() => {
        const addr = `0x${Math.random().toString(16).slice(2, 6)}...${Math.random().toString(16).slice(2, 6)}`;
        const amount = (Math.random() * 500).toFixed(0);
        const newMsg = {
          id: `mock-ev-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
          msg: `STAKE_DETECTED: [${addr}] fueled ${amount} CC`,
          type: 'event'
        };
        setLogs(prev => [newMsg, ...prev].slice(0, 10));
      }, 8000);
      return () => clearInterval(interval);
    }

    if (!provider) return;

    const contract = new ethers.Contract(CONTRACT_ADDRESSES.STAKE_TOGETHER, STAKE_TOGETHER_ABI, provider);

    const handleStaked = (user, amount) => {
      const msg = {
        id: `stake-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        msg: `INJECTION_SUCCESS: ${user.slice(0, 6)}... added ${ethers.formatEther(amount)} CC`,
        type: 'staked'
      };
      setLogs(prev => [msg, ...prev].slice(0, 10));
    };

    const handleClaimed = (user, reward) => {
      const msg = {
        id: `claim-${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        msg: `EXTRACTION_SUCCESS: ${user.slice(0, 6)}... claimed ${ethers.formatEther(reward)} yield`,
        type: 'claimed'
      };
      setLogs(prev => [msg, ...prev].slice(0, 10));
    };

    contract.on("Staked", handleStaked);
    contract.on("Claimed", handleClaimed);

    return () => {
      contract.off("Staked", handleStaked);
      contract.off("Claimed", handleClaimed);
    };
  }, [provider, useMock]);

  return (
    <div className="glass-panel border-matrix/20 p-4 h-48 flex flex-col">
      <div className="flex items-center justify-between mb-3 border-b border-matrix/10 pb-2">
        <div className="flex items-center gap-2">
          <Terminal size={14} className="text-matrix" />
          <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] neon-text">Neural Event Stream</h3>
        </div>
        <div className="flex items-center gap-2">
          <Activity size={10} className="text-matrix animate-pulse" />
          <span className="text-[8px] text-matrix/60 font-mono">LIVE_FEED</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-1 font-mono scrollbar-hide">
        {logs.map((log) => (
          <div key={log.id} className="flex items-start gap-2 group">
            <ArrowRight size={8} className="mt-1 text-slate-600 group-hover:text-matrix transition-colors" />
            <p className={`text-[9px] leading-relaxed break-all ${
              log.type === 'system' ? 'text-slate-500' : 
              log.type === 'staked' ? 'text-matrix' : 
              log.type === 'claimed' ? 'text-psionic' : 'text-slate-300'
            }`}>
              <span className="opacity-40 mr-2">[{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]</span>
              {log.msg}
            </p>
          </div>
        ))}
        {logs.length === 0 && (
          <p className="text-[9px] text-slate-700 italic">Listening for neural fluctuations...</p>
        )}
      </div>

      <div className="mt-2 text-[7px] text-slate-600 text-right uppercase tracking-widest font-bold">
        Buffer_Status: Optimized
      </div>
    </div>
  );
};

export default TransactionFeed;
