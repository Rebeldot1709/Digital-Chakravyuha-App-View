import React from 'react';
import { Shield, Sparkles, FileText, Lock, LogIn, User as UserIcon, ShieldAlert } from 'lucide-react';
import { DefenseStance } from '../types/chakravyuha';
import { useAuth } from '../context/AuthContext';
import { useSecurityAlerts } from '../context/SecurityAlertContext';

interface HeaderProps {
  currentStance: DefenseStance;
  onStanceChange: (stance: DefenseStance) => void;
  onOpenReport: () => void;
  onOpenVision: () => void;
  onOpenUserPanel: () => void;
  activeThreatCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentStance,
  onStanceChange,
  onOpenReport,
  onOpenVision,
  onOpenUserPanel,
  activeThreatCount,
}) => {
  const { user, profile, signInWithGoogle } = useAuth();
  const { unreadCount, setIsDrawerOpen } = useSecurityAlerts();

  return (
    <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-rose-600 to-indigo-600 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Shield className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
            </div>
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-wider uppercase text-white font-mono flex items-center gap-2">
                Digital Chakravyuha
              </h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono font-semibold">
                7-LAYER AI DEFENSE
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <span>Architected on the Vision by</span>
              <button
                onClick={onOpenVision}
                className="text-amber-400 hover:text-amber-300 underline underline-offset-2 font-medium cursor-pointer"
              >
                Abhishek Raj
              </button>
              <span className="text-slate-600">•</span>
              <span className="text-emerald-400 font-mono text-[11px] font-semibold flex items-center gap-1">
                <Lock className="w-3 h-3 inline" /> CORE: UNBREAKABLE (0.00% BREACH)
              </span>
            </p>
          </div>
        </div>

        {/* Center / Right controls */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Defense Stance Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 font-mono">
            <span className="text-[10px] text-slate-500 px-2 font-semibold uppercase">STANCE:</span>
            {(
              [
                { id: 'STANDARD', label: 'SENTINEL', color: 'text-cyan-400' },
                { id: 'GARUDA', label: 'GARUDA', color: 'text-amber-400' },
                { id: 'BRAHMASTRA', label: 'BRAHMASTRA', color: 'text-rose-400' },
                { id: 'ABHIMANYU', label: 'ABHIMANYU', color: 'text-purple-400' },
              ] as const
            ).map((s) => (
              <button
                key={s.id}
                onClick={() => onStanceChange(s.id)}
                className={`px-2.5 py-1 rounded text-[11px] transition font-medium cursor-pointer ${
                  currentStance === s.id
                    ? 'bg-slate-800 text-white shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Persistent Security Alert Vault Trigger Button */}
          <button
            onClick={() => setIsDrawerOpen(true)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-bold transition cursor-pointer ${
              unreadCount > 0
                ? 'bg-rose-950/80 hover:bg-rose-900/80 border-rose-500/80 text-rose-300 shadow-md shadow-rose-950/60 ring-1 ring-rose-500/50'
                : 'bg-slate-900 hover:bg-slate-800 border-slate-700 text-slate-300'
            }`}
            title="Open Security Alert Vault"
          >
            <ShieldAlert
              className={`w-3.5 h-3.5 ${unreadCount > 0 ? 'text-rose-400 animate-bounce' : 'text-slate-400'}`}
            />
            <span>ALERTS</span>
            {unreadCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-rose-600 text-white text-[9.5px] font-black">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Action buttons */}
          <button
            onClick={onOpenVision}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-700/50 text-indigo-300 font-medium cursor-pointer transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Founder's Vision</span>
          </button>

          <button
            onClick={onOpenReport}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium cursor-pointer transition"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>Audit Certificate</span>
          </button>

          {/* User Auth Section */}
          {user ? (
            <button
              onClick={onOpenUserPanel}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-700/50 text-emerald-300 font-mono text-xs cursor-pointer transition"
            >
              {profile?.photoURL ? (
                <img
                  src={profile.photoURL}
                  alt={profile.displayName}
                  className="w-4 h-4 rounded-full"
                />
              ) : (
                <UserIcon className="w-3.5 h-3.5 text-emerald-400" />
              )}
              <span className="font-bold truncate max-w-[100px]">
                {profile?.displayName || 'Defender'}
              </span>
            </button>
          ) : (
            <button
              onClick={signInWithGoogle}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-mono text-xs font-bold cursor-pointer transition shadow-sm"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Google Sign-In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
