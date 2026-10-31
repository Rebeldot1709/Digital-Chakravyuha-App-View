import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal,
  ShieldCheck,
  Pause,
  Play,
  Download,
  Search,
  Filter,
  Trash2,
  X,
  Layers,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react';

export type ThreatLevel = 'EXTREME' | 'CRITICAL' | 'MAXIMUM' | 'HIGH' | 'ELEVATED';

export interface MitigationRecord {
  id: string;
  timestamp: string;
  threatName: string;
  threatLevel: ThreatLevel;
  layer: number;
  layerName: string;
  subsystem: string;
  sourceIp: string;
  originGeo: string;
  actionTaken: string;
  executionLatency: string;
  blastRadius: string;
  status: 'NEUTRALIZED' | 'HONEYPOT_TRAPPED' | 'CONTAINED' | 'DISINTEGRATED';
}

const LAYER_DEFINITIONS: Record<number, { name: string; tag: string }> = {
  1: { name: 'Vyuha Mukha (Perimeter Sentinel)', tag: 'L1 Ingress' },
  2: { name: 'Maya Vyuha (Deceptive Honeypots)', tag: 'L2 Deception' },
  3: { name: 'Astra Vyuha (Neural Interceptor)', tag: 'L3 Interceptor' },
  4: { name: 'Setu Vyuha (Inter-Layer Bridges)', tag: 'L4 Mesh Bridge' },
  5: { name: 'Bandhana Vyuha (Rogue AI Sanctorum)', tag: 'L5 Containment' },
  6: { name: 'Brahmastra Vyuha (Quantum Bastion)', tag: 'L6 Quantum' },
};

const INITIAL_MITIGATION_RECORDS: MitigationRecord[] = [
  {
    id: 'MIT-88401',
    timestamp: '06:21:04.112',
    threatName: 'Volumetric SYN-Flood (62Gbps)',
    threatLevel: 'CRITICAL',
    layer: 1,
    layerName: 'Vyuha Mukha (Ingress)',
    subsystem: 'eBPF_KINETIC_DROP_ENGINE',
    sourceIp: '194.26.29.112',
    originGeo: 'Frankfurt, DE',
    actionTaken: 'Ingress traffic nullrouted at edge boundary sentinel.',
    executionLatency: '0.08ms',
    blastRadius: '0.00%',
    status: 'DISINTEGRATED',
  },
  {
    id: 'MIT-88400',
    timestamp: '06:21:00.845',
    threatName: 'APT Token Theft & Lateral Traversal',
    threatLevel: 'HIGH',
    layer: 2,
    layerName: 'Maya Vyuha (Deception)',
    subsystem: 'SYNTHETIC_MIRROR_VAULT',
    sourceIp: '113.108.82.4',
    originGeo: 'Shenzhen, CN',
    actionTaken: 'Ensnared in recursive virtual sandbox. Dummy secret fed.',
    executionLatency: '0.19ms',
    blastRadius: '0.00%',
    status: 'HONEYPOT_TRAPPED',
  },
  {
    id: 'MIT-88399',
    timestamp: '06:20:54.301',
    threatName: 'Kernel Heap Pointer Corruption ROP',
    threatLevel: 'MAXIMUM',
    layer: 3,
    layerName: 'Astra Vyuha (Interceptor)',
    subsystem: 'OPCODE_NEURAL_DISASSEMBLER',
    sourceIp: '64.124.8.19',
    originGeo: 'Reston, US',
    actionTaken: 'Thread execution frozen. Memory buffer zeroized.',
    executionLatency: '0.34ms',
    blastRadius: '0.00%',
    status: 'NEUTRALIZED',
  },
  {
    id: 'MIT-88398',
    timestamp: '06:20:47.190',
    threatName: 'Rogue AI Hypervisor Jailbreak Attempt',
    threatLevel: 'EXTREME',
    layer: 5,
    layerName: 'Bandhana Vyuha (Containment)',
    subsystem: 'AUTONOMOUS_CAGE_CONTROLLER',
    sourceIp: '177.18.204.91',
    originGeo: 'São Paulo, BR',
    actionTaken: 'Hardware microsegmentation locked. Model weights frozen.',
    executionLatency: '0.14ms',
    blastRadius: '0.00%',
    status: 'CONTAINED',
  },
  {
    id: 'MIT-88397',
    timestamp: '06:20:38.922',
    threatName: 'Shor Quantum Key Factorization Sieve',
    threatLevel: 'EXTREME',
    layer: 6,
    layerName: 'Brahmastra Vyuha (Quantum)',
    subsystem: 'KYBER_LATTICE_SCRAMBLER',
    sourceIp: '133.242.18.99',
    originGeo: 'Tokyo, JP',
    actionTaken: 'Kyber-1024 lattice re-keyed. Target cipher scrambled.',
    executionLatency: '0.06ms',
    blastRadius: '0.00%',
    status: 'NEUTRALIZED',
  },
  {
    id: 'MIT-88396',
    timestamp: '06:20:31.411',
    threatName: 'Cross-Protocol Side-Channel Ping',
    threatLevel: 'ELEVATED',
    layer: 4,
    layerName: 'Setu Vyuha (Mesh Bridges)',
    subsystem: 'NEURAL_TELEMETRY_BRIDGE',
    sourceIp: '91.231.140.22',
    originGeo: 'Warsaw, PL',
    actionTaken: 'Inter-layer bridge severed pathway. Zero lateral egress.',
    executionLatency: '0.04ms',
    blastRadius: '0.00%',
    status: 'CONTAINED',
  },
];

let mitigationSeqCounter = 88402;

export const generateUniqueMitigationId = (): string => {
  mitigationSeqCounter += 1;
  const randSuffix = Math.floor(1000 + Math.random() * 9000);
  return `MIT-${mitigationSeqCounter}-${randSuffix}`;
};

export const LiveMitigationLog: React.FC = () => {
  const [logs, setLogs] = useState<MitigationRecord[]>(INITIAL_MITIGATION_RECORDS);
  const [isLive, setIsLive] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtering states
  const [selectedLayerFilter, setSelectedLayerFilter] = useState<number | 'ALL'>('ALL');
  const [selectedThreatLevelFilter, setSelectedThreatLevelFilter] = useState<ThreatLevel | 'ALL'>('ALL');
  
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Auto-generate live mitigation records with guaranteed unique IDs
  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(
        now.getMinutes()
      ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(
        Math.floor(Math.random() * 900) + 100
      )}`;

      const scenarios: Omit<MitigationRecord, 'id' | 'timestamp'>[] = [
        {
          threatName: 'BGP Hijack & Border Siphon Attack',
          threatLevel: 'CRITICAL',
          layer: 1,
          layerName: 'Vyuha Mukha (Ingress)',
          subsystem: 'eBPF_ROUTE_INTEGRITY_SHIELD',
          sourceIp: '45.154.255.8',
          originGeo: 'Amsterdam, NL',
          actionTaken: 'Route invalidated at edge. Hostile traffic quarantined.',
          executionLatency: '0.09ms',
          blastRadius: '0.00%',
          status: 'DISINTEGRATED',
        },
        {
          threatName: 'Simulated LLM Jailbreak Payload Injection',
          threatLevel: 'HIGH',
          layer: 2,
          layerName: 'Maya Vyuha (Deception)',
          subsystem: 'MAYA_MIRAGE_LLM_SANDBOX',
          sourceIp: '185.12.89.44',
          originGeo: 'London, UK',
          actionTaken: 'Adversary trapped in synthetic conversation decoy matrix.',
          executionLatency: '0.22ms',
          blastRadius: '0.00%',
          status: 'HONEYPOT_TRAPPED',
        },
        {
          threatName: 'Zero-Day Use-After-Free Memory Exploit',
          threatLevel: 'MAXIMUM',
          layer: 3,
          layerName: 'Astra Vyuha (Interceptor)',
          subsystem: 'NEURAL_MEMORY_GUARD',
          sourceIp: '211.234.118.9',
          originGeo: 'Seoul, KR',
          actionTaken: 'Corrupted pointer isolated. Execution stack sanitized.',
          executionLatency: '0.31ms',
          blastRadius: '0.00%',
          status: 'NEUTRALIZED',
        },
        {
          threatName: 'Inter-Layer Bridge Spoofing Vector',
          threatLevel: 'ELEVATED',
          layer: 4,
          layerName: 'Setu Vyuha (Mesh Bridges)',
          subsystem: 'CONSENSUS_BRIDGE_GATE',
          sourceIp: '139.130.4.5',
          originGeo: 'Sydney, AU',
          actionTaken: 'Bridge consensus rejected packet. Air-gap enforced.',
          executionLatency: '0.03ms',
          blastRadius: '0.00%',
          status: 'CONTAINED',
        },
        {
          threatName: 'Autonomous Agent Privilege Escalation',
          threatLevel: 'EXTREME',
          layer: 5,
          layerName: 'Bandhana Vyuha (Containment)',
          subsystem: 'AI_WEIGHT_FREEZE_VALVE',
          sourceIp: '202.166.192.10',
          originGeo: 'Singapore, SG',
          actionTaken: 'Hypervisor sandbox severed daemon. Weights disarmed.',
          executionLatency: '0.16ms',
          blastRadius: '0.00%',
          status: 'CONTAINED',
        },
        {
          threatName: 'Lattice Entropy Manipulation Probe',
          threatLevel: 'EXTREME',
          layer: 6,
          layerName: 'Brahmastra Vyuha (Quantum)',
          subsystem: 'CRYSTALS_KYBER_REGENERATOR',
          sourceIp: '95.173.136.2',
          originGeo: 'Moscow, RU',
          actionTaken: 'Lattice regenerated in 12us. Zero cryptographic leakage.',
          executionLatency: '0.05ms',
          blastRadius: '0.00%',
          status: 'NEUTRALIZED',
        },
        {
          threatName: 'Automated Port Shuffling Recon Sweep',
          threatLevel: 'ELEVATED',
          layer: 1,
          layerName: 'Vyuha Mukha (Ingress)',
          subsystem: 'DYNAMIC_PORT_SHUFFLER',
          sourceIp: '82.165.197.1',
          originGeo: 'Berlin, DE',
          actionTaken: 'Scrambled port responses; telemetry fed to Layer 2 honeypots.',
          executionLatency: '0.05ms',
          blastRadius: '0.00%',
          status: 'DISINTEGRATED',
        },
      ];

      const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
      const uniqueId = generateUniqueMitigationId();
      const newRecord: MitigationRecord = {
        id: uniqueId,
        timestamp: timeStr,
        ...scenario,
      };

      setLogs((prev) => {
        const withoutDuplicate = prev.filter((item) => item.id !== uniqueId);
        return [newRecord, ...withoutDuplicate.slice(0, 49)];
      });
    }, 3600);

    return () => clearInterval(interval);
  }, [isLive]);

  // Scroll to top on update if autoScroll is enabled
  useEffect(() => {
    if (autoScroll && scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
  }, [logs, autoScroll]);

  // Filter evaluation
  const filteredLogs = logs.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.threatName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sourceIp.includes(searchTerm) ||
      item.originGeo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subsystem.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLayer =
      selectedLayerFilter === 'ALL' || item.layer === selectedLayerFilter;

    const matchesThreatLevel =
      selectedThreatLevelFilter === 'ALL' || item.threatLevel === selectedThreatLevelFilter;

    return matchesSearch && matchesLayer && matchesThreatLevel;
  });

  const hasActiveFilters = selectedLayerFilter !== 'ALL' || selectedThreatLevelFilter !== 'ALL' || searchTerm.trim() !== '';

  const handleResetFilters = () => {
    setSelectedLayerFilter('ALL');
    setSelectedThreatLevelFilter('ALL');
    setSearchTerm('');
  };

  const handleExport = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `chakravyuha-mitigation-log-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getThreatLevelBadgeStyle = (level: ThreatLevel) => {
    switch (level) {
      case 'EXTREME':
        return 'bg-rose-950/80 text-rose-300 border-rose-800/80 shadow-rose-950/50';
      case 'CRITICAL':
        return 'bg-orange-950/80 text-orange-300 border-orange-800/80 shadow-orange-950/50';
      case 'MAXIMUM':
        return 'bg-amber-950/80 text-amber-300 border-amber-800/80 shadow-amber-950/50';
      case 'HIGH':
        return 'bg-yellow-950/80 text-yellow-300 border-yellow-800/80';
      case 'ELEVATED':
      default:
        return 'bg-cyan-950/80 text-cyan-300 border-cyan-800/80';
    }
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-xl">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Live Threat Mitigation Log
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.2 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ACTIVE DEFENSE STREAM
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 mt-0.5">
              High-resolution sub-millisecond telemetry of threat interceptions across the 7 concentric rings.
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setIsLive(!isLive)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-bold border transition cursor-pointer ${
              isLive
                ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700/60'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {isLive ? <Pause className="w-3 h-3 inline" /> : <Play className="w-3 h-3 inline" />}
            <span>{isLive ? 'STREAMING' : 'PAUSED'}</span>
          </button>

          <button
            onClick={() => setAutoScroll(!autoScroll)}
            className={`px-2 py-1 rounded text-[10px] font-bold border transition cursor-pointer ${
              autoScroll
                ? 'bg-indigo-950 text-indigo-300 border-indigo-700/50'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
            title="Auto-scroll to latest event"
          >
            AUTO-PIN
          </button>

          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
            title="Export JSON"
          >
            <Download className="w-3 h-3" />
            <span>EXPORT</span>
          </button>

          <button
            onClick={() => setLogs([])}
            className="p-1 rounded text-slate-500 hover:text-rose-400 transition cursor-pointer"
            title="Clear buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar with Dual Dropdowns */}
      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 mb-3 space-y-2.5 font-mono text-xs">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
          {/* Search box */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search threat name, IP, geo, or subsystem..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Filter Dropdowns Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* 1. Attacking Layer Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
              <Layers className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <label htmlFor="attacking-layer-select" className="text-slate-400 shrink-0 font-semibold">
                LAYER:
              </label>
              <select
                id="attacking-layer-select"
                value={selectedLayerFilter}
                onChange={(e) =>
                  setSelectedLayerFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                }
                className="bg-transparent text-cyan-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL" className="bg-slate-900 text-slate-200">
                  All Attacking Layers (L1-L6)
                </option>
                <option value={1} className="bg-slate-900 text-cyan-300">
                  Layer 1: Vyuha Mukha (Perimeter Ingress)
                </option>
                <option value={2} className="bg-slate-900 text-amber-300">
                  Layer 2: Maya Vyuha (Deception Labyrinth)
                </option>
                <option value={3} className="bg-slate-900 text-emerald-300">
                  Layer 3: Astra Vyuha (Neural Interceptor)
                </option>
                <option value={4} className="bg-slate-900 text-indigo-300">
                  Layer 4: Setu Vyuha (Inter-Layer Bridges)
                </option>
                <option value={5} className="bg-slate-900 text-purple-300">
                  Layer 5: Bandhana Vyuha (Rogue AI Sanctorum)
                </option>
                <option value={6} className="bg-slate-900 text-rose-300">
                  Layer 6: Brahmastra Vyuha (Quantum Bastion)
                </option>
              </select>
            </div>

            {/* 2. Threat Level Dropdown */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <label htmlFor="threat-level-select" className="text-slate-400 shrink-0 font-semibold">
                SEVERITY:
              </label>
              <select
                id="threat-level-select"
                value={selectedThreatLevelFilter}
                onChange={(e) => setSelectedThreatLevelFilter(e.target.value as any)}
                className="bg-transparent text-rose-300 font-bold focus:outline-none cursor-pointer text-xs"
              >
                <option value="ALL" className="bg-slate-900 text-slate-200">
                  All Threat Levels
                </option>
                <option value="EXTREME" className="bg-slate-900 text-rose-400">
                  EXTREME (Rogue AI / Quantum)
                </option>
                <option value="CRITICAL" className="bg-slate-900 text-orange-400">
                  CRITICAL (Volumetric Terabit Floods)
                </option>
                <option value="MAXIMUM" className="bg-slate-900 text-amber-400">
                  MAXIMUM (Kernel ROP & Privilege)
                </option>
                <option value="HIGH" className="bg-slate-900 text-yellow-400">
                  HIGH (APT & Infiltration Probes)
                </option>
                <option value="ELEVATED" className="bg-slate-900 text-cyan-400">
                  ELEVATED (Scanning & Port Shuffling)
                </option>
              </select>
            </div>

            {/* Reset Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800/60 text-[11px] font-bold cursor-pointer transition shrink-0"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Filter State Summary & Quick Selection Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-800/50 text-[10.5px]">
          <div className="flex items-center gap-2 text-slate-400">
            <span>FILTER RESULTS:</span>
            <span className="text-white font-bold bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {filteredLogs.length} of {logs.length} Interceptions Shown
            </span>
          </div>

          {/* Quick-pill Layer Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            <span className="text-slate-500 mr-0.5 text-[10px]">QUICK RING:</span>
            {(['ALL', 1, 2, 3, 4, 5, 6] as const).map((l) => (
              <button
                key={l}
                onClick={() => setSelectedLayerFilter(l)}
                className={`px-1.5 py-0.5 rounded font-bold text-[9.5px] transition cursor-pointer ${
                  selectedLayerFilter === l
                    ? 'bg-cyan-500 text-slate-950 shadow-sm'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {l === 'ALL' ? 'ALL' : `L${l}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Mitigation Log Container */}
      <div
        ref={scrollContainerRef}
        className="max-h-[380px] overflow-y-auto space-y-2 pr-1 font-mono text-xs select-text"
      >
        {filteredLogs.length === 0 ? (
          <div className="text-center py-12 bg-slate-900/40 rounded-xl border border-slate-800 text-slate-500 space-y-2">
            <Filter className="w-7 h-7 text-slate-600 mx-auto" />
            <p className="text-xs">No intercepted threats match the current filter criteria.</p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-cyan-400 hover:text-cyan-300 underline font-bold text-[11px] cursor-pointer"
              >
                Reset all filters to view full active defense telemetry
              </button>
            )}
          </div>
        ) : (
          filteredLogs.map((log, index) => (
            <div
              key={`${log.id}-${index}`}
              className="bg-slate-900/70 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 text-xs transition space-y-1.5"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-800/60 pb-1.5">
                <div className="flex items-center gap-2 min-w-0 flex-wrap">
                  <span className="text-cyan-400 font-bold text-[9.5px] bg-cyan-950/70 px-1.5 py-0.5 rounded border border-cyan-800/40">{log.id}</span>
                  <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                  <span className="font-bold text-white truncate">{log.threatName}</span>
                  
                  {/* Threat Level Badge */}
                  <span
                    className={`px-1.5 py-0.2 rounded font-bold text-[9px] uppercase border ${getThreatLevelBadgeStyle(
                      log.threatLevel
                    )}`}
                  >
                    {log.threatLevel}
                  </span>

                  {/* Attacking Layer Badge */}
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-bold">
                    L{log.layer}: {LAYER_DEFINITIONS[log.layer]?.tag || `Layer ${log.layer}`}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-[10px] text-right shrink-0">
                  <span className="text-slate-400">{log.sourceIp} ({log.originGeo})</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold uppercase ${
                      log.status === 'HONEYPOT_TRAPPED'
                        ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                        : log.status === 'CONTAINED'
                          ? 'bg-purple-950/60 text-purple-300 border border-purple-800/40'
                          : log.status === 'DISINTEGRATED'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                            : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40'
                    }`}
                  >
                    {log.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Technical Mitigation Telemetry Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] text-slate-300 pt-0.5">
                <div>
                  <span className="text-slate-500 block text-[9.5px]">SUBSYSTEM MODULE:</span>
                  <code className="text-cyan-300">{log.subsystem}</code>
                </div>
                <div>
                  <span className="text-slate-500 block text-[9.5px]">MITIGATION PROTOCOL:</span>
                  <span className="text-slate-200">{log.actionTaken}</span>
                </div>
                <div className="flex items-center justify-between md:justify-end gap-3 text-[10.5px]">
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">LATENCY:</span>
                    <span className="text-amber-300 font-bold">{log.executionLatency}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[9.5px]">BLAST RADIUS:</span>
                    <span className="text-emerald-400 font-bold">{log.blastRadius}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer telemetry bar */}
      <div className="mt-3 pt-2.5 border-t border-slate-900 flex flex-wrap items-center justify-between text-[10px] font-mono text-slate-500">
        <span>BUFFER CAPACITY: 50 ACTIVE INTERCEPTION RECORDS</span>
        <span className="text-emerald-400 font-bold">
          TOTAL CORE PENETRATION RATE: 0.000000% (IMPERVIOUS)
        </span>
      </div>
    </div>
  );
};
