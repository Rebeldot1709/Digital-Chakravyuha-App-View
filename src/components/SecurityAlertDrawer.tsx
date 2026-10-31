import React, { useState } from 'react';
import { useSecurityAlerts } from '../context/SecurityAlertContext';
import {
  X,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Trash2,
  Download,
  Search,
  Filter,
  Lock,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface SecurityAlertDrawerProps {
  onInspectLayer: (layerId: number) => void;
}

export const SecurityAlertDrawer: React.FC<SecurityAlertDrawerProps> = ({ onInspectLayer }) => {
  const {
    alertHistory,
    isDrawerOpen,
    setIsDrawerOpen,
    acknowledgeAlert,
    clearAllAlerts,
    unreadCount,
  } = useSecurityAlerts();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  if (!isDrawerOpen) return null;

  const filteredAlerts = alertHistory.filter((alert) => {
    const matchesSearch =
      searchTerm === '' ||
      alert.threatClassification.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.attackerPayload.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.tacticalNeutralization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeverity =
      filterSeverity === 'ALL' || alert.severityLevel === filterSeverity;

    return matchesSearch && matchesSeverity;
  });

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(alertHistory, null, 2));
    const a = document.createElement('a');
    a.href = dataStr;
    a.download = `chakravyuha-security-alerts-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
      <div className="bg-slate-950 border-l border-slate-800 w-full max-w-xl h-full flex flex-col shadow-2xl font-mono text-xs select-text">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-rose-500/20 border border-rose-500/50 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Security Alert Vault
                </h3>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.2 rounded-full bg-rose-950 text-rose-300 border border-rose-800 text-[10px] font-bold">
                    {unreadCount} NEW
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400">
                Persistent historical registry of intercepted penetration vectors.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDrawerOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg bg-slate-900 border border-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar & Filter */}
        <div className="p-3 border-b border-slate-800/80 bg-slate-950 space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search threat name or payload..."
                className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleExport}
              disabled={alertHistory.length === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer disabled:opacity-50"
              title="Export alerts to JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span>
            </button>

            <button
              onClick={clearAllAlerts}
              disabled={alertHistory.length === 0}
              className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg bg-slate-900 border border-slate-800 transition cursor-pointer disabled:opacity-50"
              title="Clear all alerts"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Severity Filters */}
          <div className="flex items-center gap-1 text-[10px]">
            <span className="text-slate-500 mr-1">SEVERITY:</span>
            {['ALL', 'EXTREME', 'CRITICAL', 'MAXIMUM', 'HIGH'].map((sev) => (
              <button
                key={sev}
                onClick={() => setFilterSeverity(sev)}
                className={`px-2 py-0.5 rounded font-bold transition cursor-pointer ${
                  filterSeverity === sev
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Scrollable Alert Cards List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-16 text-slate-500 space-y-2">
              <ShieldCheck className="w-10 h-10 text-emerald-500/40 mx-auto" />
              <p className="text-xs">No active alerts recorded yet.</p>
              <p className="text-[10px] text-slate-600">
                Launch attacks in the Penetration Sandbox to generate live interception alerts.
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert, index) => {
              const isExtreme =
                alert.severityLevel === 'EXTREME' || alert.severityLevel === 'CRITICAL';

              return (
                <div
                  key={`${alert.id}-${index}`}
                  className={`rounded-xl p-3.5 border transition space-y-2 ${
                    alert.acknowledged
                      ? 'bg-slate-900/40 border-slate-800 opacity-80'
                      : isExtreme
                        ? 'bg-slate-900/90 border-rose-500/50 shadow-md shadow-rose-950/40'
                        : 'bg-slate-900/90 border-amber-500/50 shadow-md shadow-amber-950/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 border-b border-slate-800/80 pb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px]">{alert.timestamp}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase ${
                            isExtreme
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                              : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                          }`}
                        >
                          {alert.severityLevel}
                        </span>
                        {!alert.acknowledged && (
                          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
                        )}
                      </div>
                      <h4 className="font-bold text-white text-xs mt-1">
                        {alert.threatClassification}
                      </h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-cyan-300 font-bold text-[10px]">
                        L{alert.stoppingLayer} STOPPED
                      </span>
                    </div>
                  </div>

                  {/* Payload Excerpt */}
                  {alert.attackerPayload && (
                    <div className="bg-black/80 rounded p-1.5 border border-slate-800 text-[10px] text-rose-300 truncate">
                      <span className="text-slate-500 mr-1">PAYLOAD:</span>
                      {alert.attackerPayload}
                    </div>
                  )}

                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    {alert.tacticalNeutralization}
                  </p>

                  <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/80 text-[10.5px]">
                    <span className="text-emerald-400 font-bold">CORE: 0.00% BREACH</span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setIsDrawerOpen(false);
                          onInspectLayer(alert.stoppingLayer);
                        }}
                        className="text-cyan-400 hover:text-cyan-300 underline font-bold flex items-center gap-1 cursor-pointer"
                      >
                        Inspect Layer {alert.stoppingLayer} <ChevronRight className="w-3 h-3 inline" />
                      </button>

                      {!alert.acknowledged && (
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold cursor-pointer"
                        >
                          Acknowledge
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[10.5px] text-slate-500">
          <span>{alertHistory.length} Total Alerts in Partition</span>
          <span className="text-emerald-400 font-bold">Chakravyuha Axiom: Impervious</span>
        </div>
      </div>
    </div>
  );
};
