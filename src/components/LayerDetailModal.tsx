import React, { useState } from 'react';
import { LayerInfo } from '../types/chakravyuha';
import { X, ShieldCheck, Activity, Cpu, Lock, Radio, Sparkles, RefreshCw, Layers } from 'lucide-react';

interface LayerDetailModalProps {
  layer: LayerInfo | null;
  onClose: () => void;
  onTriggerScrub: (layerId: number) => void;
}

export const LayerDetailModal: React.FC<LayerDetailModalProps> = ({
  layer,
  onClose,
  onTriggerScrub,
}) => {
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubMessage, setScrubMessage] = useState<string | null>(null);

  if (!layer) return null;

  const handleScrub = () => {
    setIsScrubbing(true);
    setScrubMessage(`Initiating deep cryptographic scrub & microsegmentation lock on ${layer.name}...`);
    setTimeout(() => {
      onTriggerScrub(layer.id);
      setIsScrubbing(false);
      setScrubMessage(`Layer ${layer.id} fully recalibrated. 0 anomalies detected. Integrity verified at 100.00%.`);
      setTimeout(() => setScrubMessage(null), 4000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100">
        {/* Header with Layer Accent banner */}
        <div className={`p-6 bg-gradient-to-r ${layer.color} relative overflow-hidden rounded-t-2xl`}>
          <div className="absolute inset-0 bg-slate-950/70" />
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                  LAYER {layer.id} OF 7
                </span>
                <span className="text-xs font-mono text-cyan-300 font-semibold">
                  {layer.sanskritName}
                </span>
              </div>
              <h2 className="text-xl font-extrabold text-white font-mono tracking-tight">
                {layer.name}
              </h2>
              <p className="text-xs text-slate-200 mt-1 font-medium">{layer.tagline}</p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* Status Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono">
            <div>
              <div className="text-slate-500 text-[10px] uppercase">STATUS</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1 mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5" /> {layer.status}
              </div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] uppercase">INTEGRITY</div>
              <div className="text-white font-bold mt-0.5">{layer.integrity}.00% (PRISTINE)</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] uppercase">ACTIVE NODES</div>
              <div className="text-cyan-400 font-bold mt-0.5">{layer.activeNodes.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-slate-500 text-[10px] uppercase">LATENCY</div>
              <div className="text-amber-400 font-bold mt-0.5">{layer.technicalSpecs.latency}</div>
            </div>
          </div>

          {/* Core Mechanism */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> CORE ARCHITECTURAL MECHANISM
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {layer.coreMechanism}
            </p>
          </div>

          {/* Containment Protocol */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-rose-400" /> CONTAINMENT & AIR-GAP PROTOCOL
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {layer.containmentProtocol}
            </p>
          </div>

          {/* Inter-Layer Bridges */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-indigo-400" /> NEURAL BRIDGES SYNCHRONIZATION
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
              {layer.bridgesConnection}
            </p>
          </div>

          {/* Threats Neutralized */}
          <div>
            <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> TARGETED THREAT VECTORS NULLIFIED
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {layer.threatsNeutralized.map((th, idx) => (
                <div
                  key={idx}
                  className="bg-slate-950/80 border border-slate-800 p-2.5 rounded-lg text-xs text-slate-300 font-mono flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  <span>{th}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mythological / Ancient Chakravyuha Origin */}
          <div className="bg-amber-950/20 border border-amber-800/40 rounded-xl p-3.5 text-xs">
            <h4 className="font-mono text-amber-300 font-bold uppercase text-[11px] mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              MAHABHARATA STRATEGY TRANSLATED TO CYBERSECURITY
            </h4>
            <p className="text-slate-300 italic leading-relaxed">
              "{layer.mythologicalParallel}"
            </p>
          </div>

          {/* Action scrub message */}
          {scrubMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-xs font-mono text-emerald-300">
              {scrubMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-800">
            <div className="text-[11px] font-mono text-slate-500">
              Algorithm: {layer.technicalSpecs.defenseAlgorithm}
            </div>

            <button
              onClick={handleScrub}
              disabled={isScrubbing}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer flex items-center justify-center gap-2"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isScrubbing ? 'animate-spin' : ''}`} />
              <span>{isScrubbing ? 'Recalibrating Layer...' : 'Run Microsegmentation Scrub'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
