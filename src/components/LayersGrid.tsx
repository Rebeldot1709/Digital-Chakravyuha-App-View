import React from 'react';
import { LayerInfo } from '../types/chakravyuha';
import { Shield, Lock, Radio, Cpu, Sparkles, ChevronRight, CheckCircle2 } from 'lucide-react';

interface LayersGridProps {
  layers: LayerInfo[];
  selectedLayerId: number | null;
  onSelectLayer: (layer: LayerInfo) => void;
}

export const LayersGrid: React.FC<LayersGridProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
}) => {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-1 mb-1">
        <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-cyan-400" />
          THE 7 CONCENTRIC DEFENSE RINGS
        </h3>
        <span className="text-[11px] font-mono text-emerald-400">ALL 7 ACTIVE (100% PURITY)</span>
      </div>

      <div className="space-y-2">
        {layers.map((layer) => {
          const isSelected = selectedLayerId === layer.id;
          return (
            <button
              key={layer.id}
              onClick={() => onSelectLayer(layer)}
              className={`w-full text-left p-3.5 rounded-xl border transition cursor-pointer flex items-center justify-between gap-3 ${
                isSelected
                  ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-950/60 ring-1 ring-cyan-400/40'
                  : 'border-slate-800 bg-slate-900/80 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* Layer Number Badge */}
                <div
                  className={`w-9 h-9 rounded-lg font-mono font-bold flex items-center justify-center shrink-0 text-xs shadow-md ${
                    layer.id === 7
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/50'
                      : layer.id === 6
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                        : layer.id === 5
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50'
                          : layer.id === 4
                            ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/50'
                            : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50'
                  }`}
                >
                  L{layer.id}
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white truncate font-mono">
                      {layer.name}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 hidden sm:inline">
                      ({layer.sanskritName})
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {layer.tagline}
                  </div>
                </div>
              </div>

              {/* Status and Arrow */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right hidden md:block font-mono text-[11px]">
                  <div className="text-slate-300 font-medium">
                    {layer.activeNodes.toLocaleString()} nodes
                  </div>
                  <div className="text-slate-500 text-[10px]">{layer.technicalSpecs.latency}</div>
                </div>

                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                    layer.status === 'LOCKED'
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/50'
                      : layer.status === 'HONEY_TRAPPING'
                        ? 'bg-yellow-950/60 text-yellow-300 border border-yellow-800/50'
                        : layer.status === 'ACTIVE_SCRUB'
                          ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/50'
                          : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                  }`}
                >
                  {layer.status.replace('_', ' ')}
                </span>

                <ChevronRight className={`w-4 h-4 transition ${isSelected ? 'text-cyan-400 rotate-90' : 'text-slate-600'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
