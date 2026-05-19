import React from 'react';
import { useWeb3 } from './useWeb3';
import WalletConnect from './components/WalletConnect';
import UserStatus from './components/UserStatus';
import StakingPanel from './components/StakingPanel';
import Leaderboard from './components/Leaderboard';
import Countdown from './components/Countdown';
import AdminPanel from './components/AdminPanel';
import TransactionFeed from './components/TransactionFeed';
import DiagnosticHub from './components/DiagnosticHub';
import { Terminal, Shield, Zap } from 'lucide-react';

function App() {
  const web3 = useWeb3();

  return (
    <div className="min-h-screen relative bg-void overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(123,92,255,0.1),transparent_50%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(rgba(79,255,176,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(79,255,176,0.05)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Main Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8 md:py-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-matrix/20 border-2 border-matrix flex items-center justify-center relative">
              <div className="absolute inset-0 bg-matrix animate-pulse opacity-20" />
              <Zap className="text-matrix" size={24} />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-[0.3em] uppercase italic neon-text leading-none">
                STAKE TOGETHER <span className="text-psionic">Arena</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <Terminal size={12} className="text-slate-500" />
                <span className="text-[10px] text-slate-500 font-bold tracking-widest uppercase">
                  v0.4.1 // Sepolia_Node_Active // Stake_Period_Open
                </span>
              </div>
            </div>
          </div>
          <div className="w-full md:w-auto">
            <WalletConnect 
              account={web3.account} 
              connectWallet={web3.connectWallet} 
              disconnectWallet={web3.disconnectWallet}
              useMock={web3.useMock}
              toggleMock={web3.toggleMock}
            />
          </div>
        </header>

        {/* Top Status Bar */}
        <div className="mb-8">
          <UserStatus 
            account={web3.account} 
            balance={web3.balance} 
            stakedAmount={web3.stakedAmount} 
            reward={web3.reward} 
          />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Staking Control */}
          <div className="lg:col-span-4 space-y-6">
            <AdminPanel 
              isFunded={web3.isRewardPoolFunded} 
              fundPool={web3.fundRewardPool} 
              loading={web3.loading}
              account={web3.account}
            />
            <StakingPanel 
              stake={web3.stake} 
              claim={web3.claim} 
              loading={web3.loading} 
              isStakingOpen={web3.timeRemaining > 0} 
              stakedAmount={web3.stakedAmount}
            />
          </div>

          {/* Middle Column: Countdown & Visuals */}
          <div className="lg:col-span-4 space-y-6">
            <Countdown timeRemaining={web3.timeRemaining} />
            <TransactionFeed provider={web3.provider} useMock={web3.useMock} />
            
            <div className="glass-panel p-6 border-psionic/20 group hover:border-psionic transition-colors h-full">
               <div className="flex items-center justify-between mb-4">
                 <Shield className="text-psionic group-hover:animate-bounce" size={18} />
                 <span className="text-[10px] text-psionic font-bold uppercase tracking-widest">Protocol_Security</span>
               </div>
               <div className="space-y-4">
                 <div>
                   <div className="flex justify-between mb-1">
                     <span className="text-[10px] text-slate-500 uppercase">Global Pool Power</span>
                     <span className="text-[10px] text-matrix font-mono">{parseFloat(web3.totalStaked).toLocaleString()} CC</span>
                   </div>
                   <div className="h-1 bg-void overflow-hidden">
                     <div className="h-full bg-matrix/40 w-3/4 animate-pulse" />
                   </div>
                 </div>
                 <div className="bg-psionic/5 border border-psionic/10 p-3">
                   <p className="text-[9px] text-psionic/60 leading-relaxed italic">
                     "In the neon abyss of the Arena, only those with the conviction to lock their assets emerge as the architects of the new digital order."
                   </p>
                 </div>
               </div>
            </div>
          </div>

          {/* Right Column: Leaderboard */}
          <div className="lg:col-span-4">
            <Leaderboard topStaker={web3.topStaker} currentAccount={web3.account} />
          </div>
        </div>

        {/* Footer Stats */}
        <footer className="mt-12 pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-psionic animate-ping" />
              <span className="text-[10px] text-slate-500 uppercase font-bold">Sepolia_Testnet_Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 uppercase font-bold">Contract:</span>
              <span className="text-[10px] text-psionic font-mono">0x1234...C0DE</span>
            </div>
          </div>
          <div className="text-[10px] text-slate-600 font-bold uppercase tracking-widest">
            STAKE_TOGETHER_ARENA © 2026 // Decentralized_Yield_Extraction
          </div>
        </footer>
      </div>

      {/* Persistent Diagnostics Overlay */}
      <DiagnosticHub 
        account={web3.account} 
        provider={web3.provider} 
        useMock={web3.useMock} 
        isFunded={web3.isRewardPoolFunded}
      />
    </div>
  );
}

export default App;
