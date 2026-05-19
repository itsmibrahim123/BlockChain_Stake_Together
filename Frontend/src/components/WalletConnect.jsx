import React from 'react';
import { Cpu, Link as LinkIcon, ShieldCheck, LogOut, RefreshCw, Zap, Database } from 'lucide-react';

const WalletConnect = ({ account, connectWallet, disconnectWallet, useMock, toggleMock }) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Mode Toggle Bar */}
      <div className="flex items-center justify-between px-4 py-2 bg-void border border-matrix/20 rounded-sm">
        <div className="flex items-center gap-2">
          <Database size={12} className={useMock ? 'text-matrix' : 'text-slate-500'} />
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Environment:</span>
          <span className={`text-[10px] font-bold uppercase ${useMock ? 'neon-text' : 'text-psionic'}`}>
            {useMock ? 'Simulated_Grid' : 'Mainnet_Core'}
          </span>
        </div>
        <button 
          onClick={toggleMock}
          className={`flex items-center gap-2 px-3 py-1 text-[9px] font-bold uppercase tracking-tighter transition-all border
            ${useMock ? 'bg-matrix/10 border-matrix text-matrix' : 'bg-psionic/10 border-psionic text-psionic'}`}
        >
          <RefreshCw size={10} className={useMock ? '' : 'rotate-180'} />
          Switch to {useMock ? 'Live' : 'Mock'}
        </button>
      </div>

      {/* Main Connection Panel */}
      <div className="glass-panel p-4 flex items-center justify-between border-l-4 border-l-matrix">
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-full ${account ? 'bg-matrix/20 text-matrix' : 'bg-emergency/20 text-emergency'} ${account ? 'aura-pulse' : 'animate-pulse'}`}>
            <Cpu size={24} />
          </div>
          <div>
            <h3 className="text-xs uppercase tracking-[0.2em] text-slate-400">Neural Link Status</h3>
            <p className={`font-bold ${account ? 'neon-text' : 'text-emergency'}`}>
              {account ? 'SYNAPSE ESTABLISHED' : 'OFFLINE - LINK REQUIRED'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!account ? (
            <button
              onClick={connectWallet}
              className="px-6 py-2 bg-matrix/10 border border-matrix text-matrix uppercase text-xs tracking-widest hover:bg-matrix hover:text-void transition-all duration-300 flex items-center gap-2"
            >
              <LinkIcon size={14} />
              Initialize Link
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <div className="flex items-center gap-2 text-matrix text-[10px] font-mono font-bold bg-matrix/5 px-2 py-1 border border-matrix/20">
                  <ShieldCheck size={12} />
                  <span>{account.slice(0, 6)}...{account.slice(-4)}</span>
                </div>
                {useMock && (
                  <button 
                    onClick={connectWallet}
                    className="text-[8px] text-psionic uppercase font-bold mt-1 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw size={8} /> Switch Wallet
                  </button>
                )}
              </div>
              <button
                onClick={disconnectWallet}
                className="p-2 text-emergency hover:bg-emergency/10 border border-transparent hover:border-emergency/30 transition-all"
                title="Disconnect Link"
              >
                <LogOut size={18} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletConnect;
