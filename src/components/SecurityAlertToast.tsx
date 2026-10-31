import React from 'react';
import { useSecurityAlerts } from '../context/SecurityAlertContext';
import {
  ShieldAlert,
  ShieldCheck,
  X,
  CheckCircle2,
  Lock,
  Pin,
  ChevronRight,
  Volume2,
  VolumeX,
  AlertTriangle,
  Radio,
  Sparkles,
} from 'lucide-react';

interface SecurityAlertToastProps {
  onInspectLayer: (layerId: number) => void;
}

export const SecurityAlertToast: React.FC<SecurityAlertToastProps> = ({ onInspectLayer }) => {
  const {
    activeToasts,
    dismissToast,
    togglePinToast,
    acknowledgeAlert,
    soundEnabled,
    setSoundEnabled,
    setIsDrawerOpen,
  } = useSecurityAlerts();

  if (activeToasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-md w-full px-3 pointer-events-none">
      {activeToasts.map((alert, index) => {
        const isExtreme = alert.severityLevel === 'EXTREME' || alert.severityLevel === 'CRITICAL';

        return (
          <div
            key={`${alert.id}-${index}`}
            className={`pointer-events-auto rounded-2xl p-4 shadow-2xl transition-all duration-300 font-mono text-xs border backdrop-blur-xl ${
              isExtreme
                ? 'bg-slate-950/95 border-rose-500/70 shadow-rose-950/70'
                : 'bg-slate-950/95 border-amber-500/70 shadow-amber-950/70'
            }`}
          >
            {/* Header: Title, Sound & Controls */}
            <div className="flex items-start justify-between gap-2 border-b border-slate-800 pb-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span
                    className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                      isExtreme ? 'bg-rose-400' : 'bg-amber-400'
                    }`}
                  />
                  <span
                    className={`relative inline-flex rounded-full h-3 w-3 ${
                      isExtreme ? 'bg-rose-500' : 'bg-amber-500'
                    }`}
                  />
                </span>

                <div className="flex items-center gap-1.5 font-bold tracking-wider text-white uppercase text-[11px]">
                  <ShieldAlert
                    className={`w-4 h-4 ${isExtreme ? 'text-rose-400' : 'text-amber-400'}`}
                  />
                  <span>SECURITY ALERT: THREAT INTERCEPTED</span>
                </div>
              </div>

              {/* Action Buttons: Pin, Sound, Dismiss */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className="p-1 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  title={soundEnabled ? 'Mute alert chimes' : 'Enable alert chimes'}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
                  ) : (
                    <VolumeX className="w-3.5 h-3.5" />
                  )}
                </button>

                <button
                  onClick={() => togglePinToast(alert.id)}
                  className={`p-1 transition cursor-pointer ${
                    alert.isPinned ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  title={alert.isPinned ? 'Alert pinned (Persistent)' : 'Unpinned'}
                >
                  <Pin className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => dismissToast(alert.id)}
                  className="p-1 text-slate-500 hover:text-white transition cursor-pointer"
                  title="Dismiss alert"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Threat Classification & Stopping Ring */}
            <div className="space-y-1.5 mb-2.5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-white leading-snug">
                  {alert.threatClassification}
                </h4>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[9.5px] shrink-0 ${
                    isExtreme
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                      : 'bg-amber-950 text-amber-300 border border-amber-800/60'
                  }`}
                >
                  {alert.severityLevel}
                </span>
              </div>

              {/* Layer Stopping Badge */}
              <div className="flex items-center justify-between gap-2 bg-slate-900/90 p-2 rounded-lg border border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5 text-cyan-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-bold">
                    STOPPED AT LAYER {alert.stoppingLayer}: {alert.layerName}
                  </span>
                </div>
                <div className="text-[10px] text-emerald-400 font-bold shrink-0">
                  CORE: 0.00% BREACH
                </div>
              </div>
            </div>

            {/* Adversarial Payload Excerpt */}
            {alert.attackerPayload && (
              <div className="mb-2 bg-black/80 rounded p-1.5 border border-slate-800/80 text-[10px] text-rose-300 truncate font-mono">
                <span className="text-slate-500 mr-1">PAYLOAD:</span>
                {alert.attackerPayload}
              </div>
            )}

            {/* Tactical Neutralization Summary */}
            <p className="text-[11px] text-slate-300 line-clamp-2 mb-3 leading-relaxed">
              {alert.tacticalNeutralization}
            </p>

            {/* Bottom Actions */}
            <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-[10.5px]">
              <span className="text-slate-500 text-[10px]">{alert.timestamp}</span>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onInspectLayer(alert.stoppingLayer)}
                  className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2 cursor-pointer"
                >
                  <span>Inspect Layer {alert.stoppingLayer}</span>
                  <ChevronRight className="w-3 h-3 inline" />
                </button>

                <button
                  onClick={() => acknowledgeAlert(alert.id)}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 font-bold cursor-pointer transition flex items-center gap-1"
                >
                  <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                  <span>Acknowledge</span>
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
