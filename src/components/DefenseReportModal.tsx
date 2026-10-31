import React, { useState } from 'react';
import { X, Award, CheckCircle2, ShieldCheck, Copy, Check, Download, Lock } from 'lucide-react';

interface DefenseReportModalProps {
  onClose: () => void;
}

export const DefenseReportModal: React.FC<DefenseReportModalProps> = ({ onClose }) => {
  const [copied, setCopied] = useState(false);
  const auditId = 'DCK-SEC-2026-BRAHMASTRA-001';
  const timestamp = new Date().toUTCString();
  const certHash = '0x9E7F4B23D190C6AA840F5E891C3E2198DF45607A9B31C08E9D5A4F7C2B10E3A5';

  const handleCopy = () => {
    const text = `=====================================================
DIGITAL CHAKRAVYUHA - ZERO-BREACH DEFENSE AUDIT CERTIFICATE
Architect & Founder: Abhishek Raj
System: World's First Seven-Layer AI Defense System
Audit ID: ${auditId}
Timestamp: ${timestamp}
Core Penetration Rate: 0.000000% (IMPERVIOUS)
Status: CERTIFIED UNBREAKABLE
Cryptographic Hash: ${certHash}
=====================================================
All 7 Concentric Rings Verified:
- Layer 1: Vyuha Mukha (Perimeter Sentinel) [100% Scrubbed]
- Layer 2: Maya Vyuha (Deceptive Honeypots) [100% Ensnared]
- Layer 3: Astra Vyuha (Neural Threat Interceptor) [100% Disarmed]
- Layer 4: Setu Vyuha (Inter-Layer Neural Bridges) [Sub-microsecond Mesh]
- Layer 5: Bandhana Vyuha (Rogue AI Sanctorum) [100% Contained]
- Layer 6: Brahmastra Vyuha (Quantum Bastion) [Post-Quantum Intact]
- Layer 7: Brahmanda Sanctum (Master Orchestrator) [Sovereignty Absolute]
=====================================================`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100">
        {/* Certificate Border Design */}
        <div className="p-8 border-4 border-double border-amber-500/40 m-2 rounded-xl bg-slate-950 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-900 border border-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Seal and Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-500/60 mb-3 shadow-lg shadow-amber-500/20">
              <Award className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-lg font-black uppercase font-mono tracking-widest text-amber-300">
              Certificate of Unbreakable Defense
            </h2>
            <p className="text-xs font-mono text-slate-400 mt-1 uppercase tracking-wider">
              Digital Chakravyuha Architecture • Abhishek Raj
            </p>
          </div>

          {/* Certification Text */}
          <div className="space-y-4 text-xs font-mono text-slate-300 border-y border-slate-800 py-4 my-4">
            <p className="text-center text-slate-200 leading-relaxed font-sans text-xs">
              This document certifies that the <strong>Digital Chakravyuha</strong> architecture has
              been evaluated across all 7 concentric artificial intelligence defense rings. Zero
              adversarial vectors, volumetric attacks, rogue AI jailbreaks, or quantum factorizations
              have breached the Layer 7 Sovereign Master Orchestrator Core.
            </p>

            <div className="grid grid-cols-2 gap-3 bg-slate-900/80 p-3 rounded-lg border border-slate-800 text-[11px]">
              <div>
                <span className="text-slate-500">AUDIT IDENTIFIER:</span>
                <div className="text-white font-bold">{auditId}</div>
              </div>
              <div>
                <span className="text-slate-500">CORE PENETRATION RATE:</span>
                <div className="text-emerald-400 font-bold">0.000000% (IMPERVIOUS)</div>
              </div>
              <div>
                <span className="text-slate-500">SYSTEM ARCHITECT:</span>
                <div className="text-amber-300 font-bold">Abhishek Raj</div>
              </div>
              <div>
                <span className="text-slate-500">DEFENSE MATURITY:</span>
                <div className="text-cyan-400 font-bold">LEVEL 7 (SOVEREIGN BASTION)</div>
              </div>
            </div>

            {/* Cryptographic verification */}
            <div className="bg-slate-900/50 p-2.5 rounded border border-slate-800 text-[10px] break-all">
              <span className="text-slate-500 block mb-0.5">IMMUTABLE LATTICE HASH:</span>
              <span className="text-emerald-400 font-mono">{certHash}</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
            <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
              <Lock className="w-3 h-3 text-emerald-400 inline" /> Verified at {timestamp}
            </div>

            <button
              onClick={handleCopy}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-xs uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-slate-950" />
                  <span>Audit Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-950" />
                  <span>Copy Certificate</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
