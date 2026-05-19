import React from 'react';
import { ShieldCheck, Database, Loader2, AlertTriangle } from 'lucide-react';

const AdminPanel = ({ isFunded, fundPool, loading, account }) => {
  if (isFunded) return (
    <div className="glass-panel p-4 border-l-4 border-l-matrix flex items-center gap-4 bg-matrix/5">
      <ShieldCheck className="text-matrix" size={24} />
      <div>
        <h3 className="text-[10px] uppercase font-black tracking-widest text-matrix">Reward Protocol Active</h3>
        <p className="text-xs text-slate-400">The 1,000,000 CC pool has been initialized and secured.</p>
      </div>
    </div>
  );

  return (
    <div className="glass-panel p-6 border-2 border-psionic/40 relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-2 bg-psionic/10 border-b border-l border-psionic/20 text-[8px] text-psionic font-bold uppercase tracking-widest">
        Owner_Auth_Required
      </div>
      
      <div className="flex items-center gap-3 mb-6">
        <Database className="text-psionic" size={20} />
        <h2 className="text-lg font-bold psionic-text tracking-widest uppercase">Vault Initialization</h2>
      </div>

      <div className="bg-psionic/5 border border-psionic/20 p-4 mb-6 relative">
        <div className="flex items-start gap-3">
          <AlertTriangle className="text-psionic shrink-0 mt-0.5" size={14} />
          <p className="text-[10px] text-slate-400 leading-relaxed italic">
            WARNING: Protocol requires a two-stage authorization sequence. 
            1. Approve the Vault to access 1,000,000 CC.
            2. Transfer the assets to the Staking Arena.
          </p>
        </div>
      </div>

      <button
        onClick={fundPool}
        disabled={loading || !account}
        className={`w-full py-4 border-2 flex items-center justify-center gap-3 uppercase tracking-[0.3em] text-xs font-black transition-all duration-500
          ${!account 
            ? 'border-slate-800 text-slate-800 cursor-not-allowed' 
            : 'border-psionic text-psionic hover:bg-psionic hover:text-void shadow-[0_0_15px_rgba(123,92,255,0.3)]'}`}
      >
        {loading ? (
          <>
            <Loader2 className="animate-spin" size={18} />
            Initializing_Vault...
          </>
        ) : (
          <>
            <Database size={18} />
            Authorize_Reward_Pool
          </>
        )}
      </button>

      {!account && (
        <p className="text-[8px] text-center mt-3 text-psionic/40 uppercase tracking-widest">
          establish_link_to_access_admin_protocols
        </p>
      )}
    </div>
  );
};

export default AdminPanel;
