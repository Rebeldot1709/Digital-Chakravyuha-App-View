import React, { useState, useEffect } from 'react';
import { INITIAL_LIVE_EVENTS } from '../data/layersData';
import { LiveThreatEvent } from '../types/chakravyuha';
import { ThreatGeoMap } from './ThreatGeoMap';
import { ThreatFrequencyChart } from './ThreatFrequencyChart';
import { LiveMitigationLog } from './LiveMitigationLog';
import { Radio, ShieldAlert, Globe, Filter, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

let threatEventSeqCounter = 9022;

export const ThreatIntelligenceFeed: React.FC = () => {
  const [events, setEvents] = useState<LiveThreatEvent[]>(INITIAL_LIVE_EVENTS);
  const [filter, setFilter] = useState<string>('ALL');
  const [repelledCounter, setRepelledCounter] = useState<number>(1842910);
  const [latestEvent, setLatestEvent] = useState<LiveThreatEvent | null>(INITIAL_LIVE_EVENTS[0]);

  // Periodically generate simulated live attacks being stopped across the 7 layers
  useEffect(() => {
    const interval = setInterval(() => {
      setRepelledCounter((prev) => prev + Math.floor(Math.random() * 5) + 1);

      const origins = [
        { geo: 'London, UK', ip: '185.12.89.44' },
        { geo: 'Seoul, South Korea', ip: '211.234.118.9' },
        { geo: 'Sydney, Australia', ip: '139.130.4.5' },
        { geo: 'Warsaw, Poland', ip: '91.231.140.22' },
        { geo: 'Toronto, Canada', ip: '142.250.70.14' },
        { geo: 'Singapore', ip: '202.166.192.10' },
        { geo: 'Frankfurt, Germany', ip: '194.26.29.112' },
        { geo: 'Shenzhen, China', ip: '113.108.82.4' },
        { geo: 'Reston, VA, USA', ip: '64.124.8.19' },
        { geo: 'São Paulo, Brazil', ip: '177.18.204.91' },
        { geo: 'Tokyo, Japan', ip: '133.242.18.99' },
        { geo: 'Moscow, Russia', ip: '95.173.136.2' },
      ];

      const attackTypes = [
        {
          type: 'HTTP/3 Rapid-Reset Ingress Flood',
          layer: 1,
          name: 'Layer 1: Perimeter Sentinel',
          action: 'Kinetic eBPF Drop',
          status: 'BLOCKED' as const,
        },
        {
          type: 'Credential Stuffing on Synthetic Vault',
          layer: 2,
          name: 'Layer 2: Maya Deception Labyrinth',
          action: 'Trapped in Infinite Labyrinth Decoy',
          status: 'HONEYPOT_TRAPPED' as const,
        },
        {
          type: 'Memory Leak & Heap Spray Attempt',
          layer: 3,
          name: 'Layer 3: Neural Threat Interceptor',
          action: 'Thread Frozen & Memory Purged',
          status: 'DISINTEGRATED' as const,
        },
        {
          type: 'Multi-Agent Rogue Coordination Packet',
          layer: 4,
          name: 'Layer 4: Inter-Layer AI Mesh Bridges',
          action: 'Neural Bridge Severed Dynamic Air-Gap',
          status: 'CONTAINED' as const,
        },
        {
          type: 'Container Escape & Hypervisor Jailbreak',
          layer: 5,
          name: 'Layer 5: Rogue AI Sanctorum',
          action: 'Hypervisor Cage Locked & Disarmed',
          status: 'CONTAINED' as const,
        },
      ];

      const randOrigin = origins[Math.floor(Math.random() * origins.length)];
      const randAttack = attackTypes[Math.floor(Math.random() * attackTypes.length)];
      threatEventSeqCounter += 1;
      const uniqueEventId = `EVT-${threatEventSeqCounter}-${Math.floor(100 + Math.random() * 900)}`;

      const newEvent: LiveThreatEvent = {
        id: uniqueEventId,
        timestamp: 'Just now',
        originGeo: randOrigin.geo,
        ip: randOrigin.ip,
        attackType: randAttack.type,
        stoppedAtLayer: randAttack.layer,
        layerName: randAttack.name,
        actionTaken: randAttack.action,
        status: randAttack.status,
      };

      setLatestEvent(newEvent);
      setEvents((prev) => {
        const withoutDup = prev.filter((e) => e.id !== uniqueEventId);
        return [newEvent, ...withoutDup.slice(0, 14)];
      });
    }, 4200);

    return () => clearInterval(interval);
  }, []);

  const filteredEvents =
    filter === 'ALL' ? events : events.filter((e) => e.status === filter);

  return (
    <div className="space-y-4">
      {/* 1. D3.js Geographic Heatmap & Impenetrable Containment Matrix */}
      <ThreatGeoMap latestEvent={latestEvent} />

      {/* 2. Recharts 24-Hour Threat Frequency Line Chart */}
      <ThreatFrequencyChart />

      {/* 3. Scrollable Live Threat Mitigation Log */}
      <LiveMitigationLog />

      {/* 3. Live Telemetry Stream and Filterable Events List */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
        {/* Header and stats */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-indigo-400" />
            <div>
              <h2 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                Global Interception Telemetry
              </h2>
              <p className="text-[11px] text-slate-400">
                Real-time incoming adversarial probes neutralized across the 7 concentric rings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="text-slate-400">Attacks Repelled:</span>
            <span className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-500/40 text-emerald-400 font-bold">
              {repelledCounter.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center gap-2 mb-3 text-xs overflow-x-auto pb-1">
          {['ALL', 'BLOCKED', 'HONEYPOT_TRAPPED', 'CONTAINED', 'DISINTEGRATED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-medium transition cursor-pointer whitespace-nowrap ${
                filter === f
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Events table / stream */}
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {filteredEvents.map((evt, index) => (
            <div
              key={`${evt.id}-${index}`}
              className="bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 text-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-2.5 transition"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-2 h-2 rounded-full shrink-0 ${
                    evt.status === 'HONEYPOT_TRAPPED'
                      ? 'bg-amber-400'
                      : evt.status === 'CONTAINED'
                        ? 'bg-purple-400'
                        : evt.status === 'DISINTEGRATED'
                          ? 'bg-rose-400'
                          : 'bg-cyan-400'
                  }`}
                />
                <div>
                  <div className="font-bold text-slate-200 truncate">{evt.attackType}</div>
                  <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{evt.originGeo}</span>
                    <span>•</span>
                    <span className="text-slate-500">{evt.ip}</span>
                    <span>•</span>
                    <span className="text-indigo-400">{evt.timestamp}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-right shrink-0 font-mono text-[11px]">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
                  {evt.layerName}
                </span>
                <span
                  className={`px-2 py-0.5 rounded font-bold uppercase text-[10px] ${
                    evt.status === 'HONEYPOT_TRAPPED'
                      ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                      : evt.status === 'CONTAINED'
                        ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                        : evt.status === 'DISINTEGRATED'
                          ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                          : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/40'
                  }`}
                >
                  {evt.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
