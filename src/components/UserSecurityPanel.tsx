import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Lock,
  Cpu,
  Key,
  Sliders,
  Plus,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  History,
  FileCode,
  Sparkles,
  LogIn,
  LogOut,
  RefreshCw,
} from 'lucide-react';
import { DefenseStance } from '../types/chakravyuha';

export const UserSecurityPanel: React.FC = () => {
  const {
    user,
    profile,
    securityLogs,
    customRules,
    signInWithGoogle,
    logout,
    updateDefenseProfile,
    addCustomRule,
    toggleCustomRule,
    deleteCustomRule,
  } = useAuth();

  const [newRuleName, setNewRuleName] = useState('');
  const [newRulePattern, setNewRulePattern] = useState('');
  const [newRuleLayer, setNewRuleLayer] = useState<number>(1);
  const [newRuleAction, setNewRuleAction] = useState<
    'DROP_AND_DISINTEGRATE' | 'REDIRECT_TO_HONEYPOT' | 'QUARANTINE_THREAD' | 'SCRAMBLE_LATTICE'
  >('DROP_AND_DISINTEGRATE');
  const [isAddingRule, setIsAddingRule] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  if (!user) {
    return (
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl text-center">
        <div className="max-w-md mx-auto space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center mx-auto text-indigo-400">
            <Lock className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
              Secure Your Node With Google Sign-In
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Connect to your personal Digital Chakravyuha defense partition. Sign in with Google to
              persist your customized defense rules, track simulation attack logs in Firestore, and
              bind your personal security node to the 7-Layer AI Defense System.
            </p>
          </div>

          <button
            onClick={signInWithGoogle}
            className="flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold font-mono text-xs uppercase tracking-wider mx-auto transition cursor-pointer shadow-lg shadow-indigo-950/60"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign in with Google Account</span>
          </button>
        </div>
      </div>
    );
  }

  const handleStanceChange = async (stance: DefenseStance) => {
    setIsUpdating(true);
    await updateDefenseProfile({ defenseStance: stance });
    setIsUpdating(false);
  };

  const handleQuantumToggle = async () => {
    if (!profile) return;
    setIsUpdating(true);
    await updateDefenseProfile({
      quantumEncryptionEnabled: !profile.quantumEncryptionEnabled,
    });
    setIsUpdating(false);
  };

  const handleHoneypotChange = async (count: number) => {
    setIsUpdating(true);
    await updateDefenseProfile({ honeypotMirrorsCount: count });
    setIsUpdating(false);
  };

  const handleCreateRule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRuleName.trim() || !newRulePattern.trim()) return;

    await addCustomRule({
      ruleName: newRuleName.trim(),
      targetLayer: newRuleLayer,
      action: newRuleAction,
      patternMatch: newRulePattern.trim(),
      enabled: true,
    });

    setNewRuleName('');
    setNewRulePattern('');
    setIsAddingRule(false);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
      {/* Header Profile Identity */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          {profile?.photoURL ? (
            <img
              src={profile.photoURL}
              alt={profile.displayName}
              className="w-12 h-12 rounded-xl border border-indigo-500/50 shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center font-bold text-white font-mono text-lg">
              {profile?.displayName?.[0] || 'U'}
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white font-mono">{profile?.displayName}</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> VERIFIED DEFENDER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-0.5">
              {profile?.email} • UID: <span className="text-slate-500">{user.uid.slice(0, 10)}...</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right font-mono text-xs hidden sm:block">
            <div className="text-slate-500 text-[10px] uppercase">PERSISTENT HEALTH</div>
            <div className="text-emerald-400 font-bold">100/100 (UNBREAKABLE)</div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-xs cursor-pointer transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Defense Posture Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Defensive Stance Control */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              DEFENSE STANCE
            </span>
            <span className="text-cyan-400 font-bold">{profile?.defenseStance}</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {(['STANDARD', 'GARUDA', 'BRAHMASTRA', 'ABHIMANYU'] as const).map((st) => (
              <button
                key={st}
                onClick={() => handleStanceChange(st)}
                disabled={isUpdating}
                className={`px-2 py-1.5 rounded font-mono text-[11px] font-bold transition cursor-pointer ${
                  profile?.defenseStance === st
                    ? 'bg-indigo-600 text-white border border-indigo-400'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Quantum Lattice Cryptography */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
                <Key className="w-3.5 h-3.5 text-rose-400" />
                QUANTUM SHIELD
              </span>
              <span
                className={`font-bold ${
                  profile?.quantumEncryptionEnabled ? 'text-emerald-400' : 'text-slate-500'
                }`}
              >
                {profile?.quantumEncryptionEnabled ? 'KYBER-1024 ACTIVE' : 'DISABLED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Layer 6 post-quantum lattice encryption protecting against Shor's factorization.
            </p>
          </div>
          <button
            onClick={handleQuantumToggle}
            disabled={isUpdating}
            className={`w-full mt-3 py-1.5 rounded font-mono text-xs font-bold transition cursor-pointer ${
              profile?.quantumEncryptionEnabled
                ? 'bg-rose-950/60 text-rose-300 border border-rose-800/60 hover:bg-rose-900/60'
                : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
            }`}
          >
            {profile?.quantumEncryptionEnabled ? 'Toggle Off' : 'Activate Quantum Bastion'}
          </button>
        </div>

        {/* Honeypot Decoy Allocation */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
              <span className="flex items-center gap-1.5 font-bold uppercase text-slate-300">
                <Cpu className="w-3.5 h-3.5 text-amber-400" />
                MAYA HONEYPOTS
              </span>
              <span className="text-amber-400 font-bold">
                {profile?.honeypotMirrorsCount.toLocaleString()} MIRRORS
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Synthetic decoy nodes generating recursive illusions to mislead hostile attackers.
            </p>
          </div>
          <div className="flex items-center gap-1.5 mt-3">
            {[256, 512, 1024, 4096].map((cnt) => (
              <button
                key={cnt}
                onClick={() => handleHoneypotChange(cnt)}
                disabled={isUpdating}
                className={`flex-1 py-1 rounded font-mono text-[10px] font-bold transition cursor-pointer ${
                  profile?.honeypotMirrorsCount === cnt
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
                }`}
              >
                {cnt}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Custom Defense Rules (Firestore Persisted) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              Custom Perimeter & Containment Policies
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Rules defined here are securely enforced across your partition in Firestore.
            </p>
          </div>
          <button
            onClick={() => setIsAddingRule(!isAddingRule)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold cursor-pointer transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Defense Rule</span>
          </button>
        </div>

        {/* Add Rule Form */}
        {isAddingRule && (
          <form
            onSubmit={handleCreateRule}
            className="bg-slate-950 p-4 rounded-xl border border-indigo-500/40 space-y-3 font-mono text-xs"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">RULE NAME</label>
                <input
                  type="text"
                  required
                  value={newRuleName}
                  onChange={(e) => setNewRuleName(e.target.value)}
                  placeholder="e.g. Block SQLi Ingress Probe"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">TARGET LAYER</label>
                <select
                  value={newRuleLayer}
                  onChange={(e) => setNewRuleLayer(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value={1}>Layer 1: Perimeter Sentinel</option>
                  <option value={2}>Layer 2: Maya Honeypot Labyrinth</option>
                  <option value={3}>Layer 3: Neural Threat Interceptor</option>
                  <option value={4}>Layer 4: Inter-Layer AI Mesh Bridges</option>
                  <option value={5}>Layer 5: Rogue AI Sanctorum</option>
                  <option value={6}>Layer 6: Quantum Cryptographic Bastion</option>
                  <option value={7}>Layer 7: Master Orchestrator</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">PATTERN MATCH</label>
                <input
                  type="text"
                  required
                  value={newRulePattern}
                  onChange={(e) => setNewRulePattern(e.target.value)}
                  placeholder="e.g. UNION SELECT|DROP TABLE|malicious_opcode"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">DEFENSIVE ACTION</label>
                <select
                  value={newRuleAction}
                  onChange={(e) => setNewRuleAction(e.target.value as any)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="DROP_AND_DISINTEGRATE">DROP AND DISINTEGRATE</option>
                  <option value="REDIRECT_TO_HONEYPOT">REDIRECT TO MAYA HONEYPOT</option>
                  <option value="QUARANTINE_THREAD">QUARANTINE EXECUTION THREAD</option>
                  <option value="SCRAMBLE_LATTICE">SCRAMBLE LATTICE KEYS</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddingRule(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
              >
                Save Policy to Firestore
              </button>
            </div>
          </form>
        )}

        {/* Existing Rules List */}
        <div className="space-y-2">
          {customRules.length === 0 ? (
            <div className="text-center py-6 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-500 font-mono">
              No custom rules created yet. Click "Add Defense Rule" to add custom perimeter filters.
            </div>
          ) : (
            customRules.map((r, index) => (
              <div
                key={`${r.id}-${index}`}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <button
                    onClick={() => toggleCustomRule(r.id, r.enabled)}
                    className={`w-4 h-4 rounded flex items-center justify-center border cursor-pointer ${
                      r.enabled
                        ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                        : 'border-slate-700 bg-slate-900'
                    }`}
                  >
                    {r.enabled && <CheckCircle2 className="w-3.5 h-3.5 stroke-[3]" />}
                  </button>
                  <div className="min-w-0">
                    <div className="font-bold text-white truncate flex items-center gap-2">
                      <span>{r.ruleName}</span>
                      <span className="text-[10px] text-indigo-400 px-1.5 py-0.2 rounded bg-indigo-950/80 border border-indigo-800/40">
                        L{r.targetLayer}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      Match: <code className="text-cyan-300">{r.patternMatch}</code> • Action:{' '}
                      <span className="text-amber-300">{r.action}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => deleteCustomRule(r.id)}
                  title="Delete rule"
                  className="text-slate-500 hover:text-rose-400 p-1 rounded transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Simulation History (Firestore Persisted) */}
      <div className="space-y-3 pt-3 border-t border-slate-800">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wide flex items-center gap-2">
            <History className="w-4 h-4 text-emerald-400" />
            Your Penetration Test History (Firestore Synced)
          </h4>
          <span className="text-[11px] font-mono text-slate-500">
            {securityLogs.length} Records Persisted
          </span>
        </div>

        <div className="space-y-2 max-h-[220px] overflow-y-auto">
          {securityLogs.length === 0 ? (
            <div className="text-center py-6 bg-slate-950/60 rounded-xl border border-slate-800 text-xs text-slate-500 font-mono">
              Run simulations in the "Penetration Sandbox" tab to persist verified test results here.
            </div>
          ) : (
            securityLogs.map((log, index) => (
              <div
                key={`${log.id}-${index}`}
                className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 font-mono"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200">{log.threatClassification}</span>
                    <span className="text-[10px] text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-950 border border-emerald-800/40">
                      Stopped at L{log.stoppingLayer}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5 max-w-lg">
                    Payload: {log.attackerPayload}
                  </div>
                </div>
                <div className="text-right text-[11px] text-slate-500 shrink-0">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
