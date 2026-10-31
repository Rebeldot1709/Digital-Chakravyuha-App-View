import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Radio,
  Pause,
  Play,
  ArrowDown,
  Layers,
  ShieldCheck,
  ShieldAlert,
  Search,
  Trash2,
  SlidersHorizontal,
  Zap,
  Cpu,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  FileCode,
  Activity,
  Wifi,
} from 'lucide-react';

export type PacketAction =
  | 'SINKHOLE_DROP'
  | 'MAYA_HONEYPOT_SINK'
  | 'NEURAL_DISSECT'
  | 'MESH_REROUTE'
  | 'HYPERVISOR_CAGE'
  | 'LATTICE_DISSOLVE';

export interface InterceptedPacket {
  id: string;
  packetNum: number;
  timestamp: string;
  sourceIp: string;
  sourcePort: number;
  destIp: string;
  destPort: number;
  geoOrigin: string;
  asn: string;
  protocol: 'TCP' | 'UDP' | 'QUIC' | 'TLS1.3' | 'HTTP2' | 'eBPF' | 'gRPC';
  layerId: number;
  layerName: string;
  attackVector: string;
  action: PacketAction;
  sizeBytes: number;
  latencyMs: number;
  hexDump: string;
  asciiDump: string;
  ruleId: string;
  severity: 'CRITICAL' | 'HIGH' | 'MAXIMUM' | 'EXTREME';
}

const LAYER_MAP: Record<number, { name: string; tag: string; color: string; bg: string; border: string }> = {
  1: {
    name: 'Vyuha Mukha (Perimeter Sentinel)',
    tag: 'L1 Sentinel',
    color: 'text-cyan-400',
    bg: 'bg-cyan-950/40',
    border: 'border-cyan-800/40',
  },
  2: {
    name: 'Maya Vyuha (Deception Labyrinth)',
    tag: 'L2 Deception',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-800/40',
  },
  3: {
    name: 'Astra Vyuha (Neural Interceptor)',
    tag: 'L3 Neural',
    color: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-rose-800/40',
  },
  4: {
    name: 'Setu Vyuha (Inter-Layer Bridges)',
    tag: 'L4 Mesh Bridge',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800/40',
  },
  5: {
    name: 'Bandhana Vyuha (Rogue AI Sanctorum)',
    tag: 'L5 AI Cage',
    color: 'text-purple-400',
    bg: 'bg-purple-950/40',
    border: 'border-purple-800/40',
  },
  6: {
    name: 'Brahmastra Vyuha (Quantum Bastion)',
    tag: 'L6 Quantum',
    color: 'text-indigo-400',
    bg: 'bg-indigo-950/40',
    border: 'border-indigo-800/40',
  },
};

const ACTION_DESCRIPTIONS: Record<PacketAction, { label: string; textClass: string; bgClass: string }> = {
  SINKHOLE_DROP: {
    label: 'EDGE SINKHOLE DROP',
    textClass: 'text-cyan-400',
    bgClass: 'bg-cyan-950/50 border-cyan-800/50',
  },
  MAYA_HONEYPOT_SINK: {
    label: 'TRAPPED IN MAYA DECOY',
    textClass: 'text-amber-400',
    bgClass: 'bg-amber-950/50 border-amber-800/50',
  },
  NEURAL_DISSECT: {
    label: 'NEURAL WEIGHTS STRIPPED',
    textClass: 'text-rose-400',
    bgClass: 'bg-rose-950/50 border-rose-800/50',
  },
  MESH_REROUTE: {
    label: 'MESH QUARANTINED',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-950/50 border-emerald-800/50',
  },
  HYPERVISOR_CAGE: {
    label: 'HYPERVISOR ISOLATED',
    textClass: 'text-purple-400',
    bgClass: 'bg-purple-950/50 border-purple-800/50',
  },
  LATTICE_DISSOLVE: {
    label: 'QUANTUM LATTICE DECOHERENCE',
    textClass: 'text-indigo-400',
    bgClass: 'bg-indigo-950/50 border-indigo-800/50',
  },
};

// Realistic packet pool
const MOCK_PACKET_TEMPLATES = [
  {
    sourceIp: '185.220.101.42',
    sourcePort: 54112,
    destIp: '10.0.0.1',
    destPort: 443,
    geoOrigin: 'Amsterdam, NL',
    asn: 'AS20857 · TorExit',
    protocol: 'TCP' as const,
    layerId: 1,
    attackVector: 'SYN Flood Exhaustion (100k pps)',
    action: 'SINKHOLE_DROP' as const,
    sizeBytes: 64,
    ruleId: 'CKR-L1-EBPF-SYNFLOOD',
    severity: 'HIGH' as const,
    hexDump: '45 00 00 28 d4 31 40 00 40 06 b2 f1 b9 dc 65 2a 0a 00 00 01 d3 60 01 bb',
    asciiDump: 'E..(T1@.@..q..e*....`..',
  },
  {
    sourceIp: '194.26.29.112',
    sourcePort: 48920,
    destIp: '10.0.2.80',
    destPort: 8080,
    geoOrigin: 'Frankfurt, DE',
    asn: 'AS44034 · RogueColo',
    protocol: 'HTTP2' as const,
    layerId: 2,
    attackVector: 'Maya Honey-Trap Credential Probe',
    action: 'MAYA_HONEYPOT_SINK' as const,
    sizeBytes: 1024,
    ruleId: 'CKR-L2-MAYA-DECOY-VAULT',
    severity: 'CRITICAL' as const,
    hexDump: '50 4f 53 54 20 2f 61 70 69 2f 76 31 2f 63 6f 72 65 20 48 54 54 50 2f 32',
    asciiDump: 'POST /api/v1/core HTTP/2',
  },
  {
    sourceIp: '45.145.67.89',
    sourcePort: 51204,
    destIp: '10.0.3.15',
    destPort: 50051,
    geoOrigin: 'Moscow, RU',
    asn: 'AS58224 · CyberHost',
    protocol: 'gRPC' as const,
    layerId: 3,
    attackVector: 'Adversarial Prompt Weight Injection',
    action: 'NEURAL_DISSECT' as const,
    sizeBytes: 2480,
    ruleId: 'CKR-L3-ASTRA-TENSOR-ANOMALY',
    severity: 'EXTREME' as const,
    hexDump: '00 00 09 a2 00 0a 1f 7b 22 72 6f 6c 65 22 3a 22 73 79 73 74 65 6d 22 7d',
    asciiDump: '......{"role":"system"}',
  },
  {
    sourceIp: '203.0.113.88',
    sourcePort: 60233,
    destIp: '10.0.4.5',
    destPort: 8443,
    geoOrigin: 'Singapore, SG',
    asn: 'AS13335 · CloudTransit',
    protocol: 'TLS1.3' as const,
    layerId: 4,
    attackVector: 'Inter-Layer Mesh Protocol Deserialization',
    action: 'MESH_REROUTE' as const,
    sizeBytes: 1420,
    ruleId: 'CKR-L4-SETU-MESH-ISOLATE',
    severity: 'HIGH' as const,
    hexDump: '16 03 03 05 84 01 00 05 80 03 03 89 bc a1 24 99 21 04 f2 18 c0 2c c0 2b',
    asciiDump: '..............$..!......',
  },
  {
    sourceIp: '103.21.244.15',
    sourcePort: 39811,
    destIp: '10.0.5.12',
    destPort: 9000,
    geoOrigin: 'Seoul, KR',
    asn: 'AS9848 · HighCompute',
    protocol: 'eBPF' as const,
    layerId: 5,
    attackVector: 'Autonomous Replicating Agent Breakout',
    action: 'HYPERVISOR_CAGE' as const,
    sizeBytes: 4096,
    ruleId: 'CKR-L5-BANDHANA-HYPERVISOR-LOCK',
    severity: 'MAXIMUM' as const,
    hexDump: '7f 45 4c 46 02 01 01 00 00 00 00 00 00 00 00 00 03 00 3e 00 01 00 00 00',
    asciiDump: '.ELF..............>.....',
  },
  {
    sourceIp: '198.51.100.22',
    sourcePort: 55430,
    destIp: '10.0.6.1',
    destPort: 443,
    geoOrigin: 'Zurich, CH',
    asn: 'AS559 · Q-LabNet',
    protocol: 'QUIC' as const,
    layerId: 6,
    attackVector: "Shor's Quantum Lattice Factorization Probe",
    action: 'LATTICE_DISSOLVE' as const,
    sizeBytes: 3120,
    ruleId: 'CKR-L6-BRAHMASTRA-POST-QUANTUM',
    severity: 'EXTREME' as const,
    hexDump: 'c3 00 00 00 01 08 6a 82 91 03 e9 c0 41 90 00 00 45 28 00 00 00 1a 01 02',
    asciiDump: '......j.....A...E(......',
  },
  {
    sourceIp: '192.0.2.77',
    sourcePort: 43219,
    destIp: '10.0.1.20',
    destPort: 53,
    geoOrigin: 'Tokyo, JP',
    asn: 'AS2516 · EastFiber',
    protocol: 'UDP' as const,
    layerId: 1,
    attackVector: 'DNS Amplification & Anycast Scrub',
    action: 'SINKHOLE_DROP' as const,
    sizeBytes: 512,
    ruleId: 'CKR-L1-ANYCAST-DNS-DROP',
    severity: 'HIGH' as const,
    hexDump: '00 01 01 00 00 01 00 00 00 00 00 00 07 63 6f 72 65 64 62 05 6c 6f 63 61',
    asciiDump: '.............coredb.loca',
  },
  {
    sourceIp: '82.165.197.1',
    sourcePort: 59102,
    destIp: '10.0.2.99',
    destPort: 2222,
    geoOrigin: 'London, UK',
    asn: 'AS8560 · IonosCloud',
    protocol: 'TCP' as const,
    layerId: 2,
    attackVector: 'SSH Brute-Force Mirage Redirection',
    action: 'MAYA_HONEYPOT_SINK' as const,
    sizeBytes: 256,
    ruleId: 'CKR-L2-MAYA-SSH-MIRROR',
    severity: 'CRITICAL' as const,
    hexDump: '53 53 48 2d 32 2e 30 2d 4f 70 65 6e 53 53 48 5f 38 2e 39 70 31 0d 0a 00',
    asciiDump: 'SSH-2.0-OpenSSH_8.9p1...',
  },
];

let globalPacketCounter = 84210;

function generatePacket(): InterceptedPacket {
  globalPacketCounter += 1;
  const template = MOCK_PACKET_TEMPLATES[Math.floor(Math.random() * MOCK_PACKET_TEMPLATES.length)];
  const now = new Date();
  const timeStr = `${now.toTimeString().split(' ')[0]}.${String(now.getMilliseconds()).padStart(3, '0')}`;
  const randomPort = Math.floor(10000 + Math.random() * 50000);
  const latency = +(0.02 + Math.random() * 0.12).toFixed(2);

  return {
    id: `pkt-${Date.now()}-${globalPacketCounter}-${Math.random().toString(36).substring(2, 6)}`,
    packetNum: globalPacketCounter,
    timestamp: timeStr,
    sourceIp: template.sourceIp,
    sourcePort: randomPort,
    destIp: template.destIp,
    destPort: template.destPort,
    geoOrigin: template.geoOrigin,
    asn: template.asn,
    protocol: template.protocol,
    layerId: template.layerId,
    layerName: LAYER_MAP[template.layerId]?.name || `Layer ${template.layerId}`,
    attackVector: template.attackVector,
    action: template.action,
    sizeBytes: template.sizeBytes + Math.floor(Math.random() * 128),
    latencyMs: latency,
    hexDump: template.hexDump,
    asciiDump: template.asciiDump,
    ruleId: template.ruleId,
    severity: template.severity,
  };
}

export const PacketLogStreamWidget: React.FC = () => {
  const [packets, setPackets] = useState<InterceptedPacket[]>(() => {
    // Initial batch of 12 recent intercepted packets
    const initial: InterceptedPacket[] = [];
    for (let i = 0; i < 12; i++) {
      initial.push(generatePacket());
    }
    return initial;
  });

  const [isStreaming, setIsStreaming] = useState(true);
  const [autoScroll, setAutoScroll] = useState(true);
  const [userScrolledUp, setUserScrolledUp] = useState(false);
  const [streamSpeed, setStreamSpeed] = useState<'normal' | 'fast' | 'slow'>('normal');
  const [layerFilter, setLayerFilter] = useState<number | 'ALL'>('ALL');
  const [actionFilter, setActionFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPacket, setSelectedPacket] = useState<InterceptedPacket | null>(null);
  const [copiedHexId, setCopiedHexId] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const streamBottomRef = useRef<HTMLDivElement | null>(null);

  // Interval speed mapping in ms
  const speedIntervalMs = useMemo(() => {
    if (streamSpeed === 'fast') return 600;
    if (streamSpeed === 'slow') return 2200;
    return 1200;
  }, [streamSpeed]);

  // Real-time packet emitter
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      const newPkt = generatePacket();
      setPackets((prev) => {
        // Keep buffer capped at 250 packets for memory sanity and high FPS
        const updated = [...prev, newPkt];
        if (updated.length > 250) {
          return updated.slice(updated.length - 250);
        }
        return updated;
      });
    }, speedIntervalMs);

    return () => clearInterval(interval);
  }, [isStreaming, speedIntervalMs]);

  // Auto-scrolling pinned behavior
  useEffect(() => {
    if (autoScroll && !userScrolledUp && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [packets, autoScroll, userScrolledUp]);

  // Detect user manual scroll to avoid intrusive snapping
  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const distanceToBottom = scrollHeight - (scrollTop + clientHeight);

    // If user is more than 60px away from bottom, consider user scrolled up
    if (distanceToBottom > 60) {
      setUserScrolledUp(true);
    } else {
      setUserScrolledUp(false);
    }
  };

  const resumeAutoScroll = () => {
    setUserScrolledUp(false);
    setAutoScroll(true);
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleCopyHex = (pkt: InterceptedPacket) => {
    navigator.clipboard?.writeText(`${pkt.hexDump}\nASCII: ${pkt.asciiDump}`);
    setCopiedHexId(pkt.id);
    setTimeout(() => setCopiedHexId(null), 2000);
  };

  // Filtered packets
  const filteredPackets = useMemo(() => {
    return packets.filter((p) => {
      if (layerFilter !== 'ALL' && p.layerId !== layerFilter) return false;
      if (actionFilter !== 'ALL' && p.action !== actionFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matches =
          p.sourceIp.toLowerCase().includes(query) ||
          p.attackVector.toLowerCase().includes(query) ||
          p.protocol.toLowerCase().includes(query) ||
          p.geoOrigin.toLowerCase().includes(query) ||
          p.ruleId.toLowerCase().includes(query) ||
          String(p.packetNum).includes(query);
        if (!matches) return false;
      }
      return true;
    });
  }, [packets, layerFilter, actionFilter, searchQuery]);

  // Summary stats
  const stats = useMemo(() => {
    let l1Count = 0;
    let l2Count = 0;
    let l3Count = 0;
    let l5Count = 0;
    let l6Count = 0;
    packets.forEach((p) => {
      if (p.layerId === 1) l1Count++;
      else if (p.layerId === 2) l2Count++;
      else if (p.layerId === 3) l3Count++;
      else if (p.layerId === 5) l5Count++;
      else if (p.layerId === 6) l6Count++;
    });
    return { l1Count, l2Count, l3Count, l5Count, l6Count, total: packets.length };
  }, [packets]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col font-mono text-xs">
      {/* 1. Header Toolbar */}
      <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Title & Live Indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              {isStreaming ? (
                <>
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
                </>
              ) : (
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500" />
              )}
            </span>
            <div className="flex items-center gap-1.5 text-white font-bold text-xs uppercase tracking-wider">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Packet Interception Stream</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-slate-400 border-l border-slate-800 pl-3">
            <span className="text-slate-500">INGRESS:</span>
            <span className="text-emerald-400 font-bold">100% CONTAINED</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400">{stats.total} IN BUFFER</span>
          </div>
        </div>

        {/* Right: Stream Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Stream Pause / Resume */}
          <button
            onClick={() => setIsStreaming((prev) => !prev)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              isStreaming
                ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20'
                : 'bg-amber-500/10 text-amber-300 border-amber-500/30 hover:bg-amber-500/20'
            }`}
            title={isStreaming ? 'Pause live stream ingestion' : 'Resume live stream ingestion'}
          >
            {isStreaming ? (
              <>
                <Pause className="w-3 h-3" /> LIVE STREAM
              </>
            ) : (
              <>
                <Play className="w-3 h-3" /> STREAM PAUSED
              </>
            )}
          </button>

          {/* Auto Scroll Toggle */}
          <button
            onClick={() => {
              if (!autoScroll) {
                resumeAutoScroll();
              } else {
                setAutoScroll(false);
              }
            }}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1.5 border transition cursor-pointer ${
              autoScroll && !userScrolledUp
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/20'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
            }`}
            title="Toggle pinned auto-scrolling to latest packet"
          >
            <ArrowDown className={`w-3 h-3 ${autoScroll && !userScrolledUp ? 'animate-bounce' : ''}`} />
            <span>AUTO-SCROLL: {autoScroll && !userScrolledUp ? 'ON' : 'PAUSED'}</span>
          </button>

          {/* Stream Speed Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
            <button
              onClick={() => setStreamSpeed('slow')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                streamSpeed === 'slow' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              0.5x
            </button>
            <button
              onClick={() => setStreamSpeed('normal')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                streamSpeed === 'normal' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              1.0x
            </button>
            <button
              onClick={() => setStreamSpeed('fast')}
              className={`px-2 py-0.5 rounded cursor-pointer transition ${
                streamSpeed === 'fast' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              2.0x
            </button>
          </div>

          {/* Clear Buffer */}
          <button
            onClick={() => setPackets([])}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition border border-transparent hover:border-rose-500/30 cursor-pointer"
            title="Clear stream buffer"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Filters & Search Bar */}
      <div className="bg-slate-950 px-4 py-2 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div className="flex flex-wrap items-center gap-2">
          {/* Layer Filter Dropdown */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">LAYER:</span>
            <select
              value={layerFilter}
              onChange={(e) => setLayerFilter(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))}
              aria-label="Filter packets by layer"
              className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Concentric Rings (1-6)</option>
              <option value="1">Layer 1: Vyuha Mukha (Perimeter)</option>
              <option value="2">Layer 2: Maya Vyuha (Honeypot Labyrinth)</option>
              <option value="3">Layer 3: Astra Vyuha (Neural Interceptor)</option>
              <option value="4">Layer 4: Setu Vyuha (Mesh Bridges)</option>
              <option value="5">Layer 5: Bandhana Vyuha (Rogue AI Cage)</option>
              <option value="6">Layer 6: Brahmastra Vyuha (Quantum Bastion)</option>
            </select>
          </div>

          {/* Action Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">ACTION:</span>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              aria-label="Filter packets by mitigation action"
              className="bg-slate-900 border border-slate-800 text-slate-300 rounded px-2 py-1 text-[11px] focus:outline-none focus:border-cyan-500 cursor-pointer"
            >
              <option value="ALL">All Actions</option>
              <option value="SINKHOLE_DROP">Sinkhole Drop (L1)</option>
              <option value="MAYA_HONEYPOT_SINK">Maya Honeypot Sink (L2)</option>
              <option value="NEURAL_DISSECT">Neural Dissection (L3)</option>
              <option value="MESH_REROUTE">Mesh Quarantine (L4)</option>
              <option value="HYPERVISOR_CAGE">Hypervisor Cage (L5)</option>
              <option value="LATTICE_DISSOLVE">Lattice Decoherence (L6)</option>
            </select>
          </div>
        </div>

        {/* Search input */}
        <div className="relative min-w-[200px] flex-1 sm:flex-initial">
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search IP, vector, protocol, rule..."
            className="w-full bg-slate-900 border border-slate-800 rounded pl-7 pr-2.5 py-1 text-[11px] text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* 3. Terminal Stream Viewport */}
      <div className="relative">
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="h-[340px] overflow-y-auto overflow-x-hidden p-3 space-y-1.5 bg-black/95 select-text scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent"
        >
          {filteredPackets.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-2">
              <Activity className="w-8 h-8 text-slate-700 animate-pulse" />
              <p className="text-xs">No intercepted packets match current active filters.</p>
              <button
                onClick={() => {
                  setLayerFilter('ALL');
                  setActionFilter('ALL');
                  setSearchQuery('');
                }}
                className="text-[11px] text-cyan-400 underline cursor-pointer"
              >
                Reset stream filters
              </button>
            </div>
          ) : (
            filteredPackets.map((pkt, idx) => {
              const layerConfig = LAYER_MAP[pkt.layerId] || LAYER_MAP[1];
              const actionMeta = ACTION_DESCRIPTIONS[pkt.action];
              const isSelected = selectedPacket?.id === pkt.id;

              return (
                <div
                  key={`${pkt.id}-${idx}`}
                  onClick={() => setSelectedPacket(isSelected ? null : pkt)}
                  className={`group px-3 py-2 rounded-lg border transition cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 border-cyan-500/80 shadow-md shadow-cyan-950/40'
                      : 'bg-slate-950/80 hover:bg-slate-900/60 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Top Line: Timestamp, Packet ID, Layer, Protocol, Ingress Route */}
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500 font-mono">[{pkt.timestamp}]</span>
                      <span className="text-slate-400 font-bold">#PKT-{pkt.packetNum}</span>
                      <span className={`font-semibold ${layerConfig.color}`}>
                        {layerConfig.tag}
                      </span>
                      <span className="text-slate-600">·</span>
                      <span className="text-cyan-300 font-bold">{pkt.protocol}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[10px] hidden sm:inline">
                        {pkt.geoOrigin} ({pkt.asn})
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${actionMeta.bgClass} ${actionMeta.textClass}`}
                      >
                        {actionMeta.label}
                      </span>
                    </div>
                  </div>

                  {/* Middle Line: IP flow, Threat Vector & Latency */}
                  <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-rose-400 font-semibold">{pkt.sourceIp}:{pkt.sourcePort}</span>
                      <span className="text-slate-600 font-bold">→</span>
                      <span className="text-emerald-400">{pkt.destIp}:{pkt.destPort}</span>
                      <span className="text-slate-600">|</span>
                      <span className="text-slate-200 font-medium">{pkt.attackVector}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-slate-500">
                      <span>{pkt.sizeBytes} bytes</span>
                      <span>·</span>
                      <span className="text-emerald-400 font-bold">{pkt.latencyMs}ms</span>
                    </div>
                  </div>

                  {/* Expanded Packet Deep-Dive View */}
                  {isSelected && (
                    <div
                      className="mt-2.5 pt-2.5 border-t border-slate-800 space-y-2 text-[11px] bg-black/60 p-3 rounded"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 text-cyan-400 font-bold">
                          <FileCode className="w-3.5 h-3.5" />
                          <span>PACKET INSPECTION &amp; TELEMETRY DISASSEMBLY</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-mono">RULE ID: {pkt.ruleId}</span>
                          <button
                            onClick={() => handleCopyHex(pkt)}
                            className="text-slate-400 hover:text-white flex items-center gap-1 text-[10px] bg-slate-900 border border-slate-800 px-2 py-0.5 rounded cursor-pointer"
                          >
                            {copiedHexId === pkt.id ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" /> Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" /> Copy Hex
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                            Raw Packet Hex Signature
                          </span>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 text-cyan-300/90 font-mono text-[11px] break-all leading-relaxed">
                            {pkt.hexDump}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-slate-500 uppercase tracking-wider block mb-1">
                            ASCII Payload Reconstruction
                          </span>
                          <div className="bg-slate-950 p-2 rounded border border-slate-800 text-amber-300/90 font-mono text-[11px] break-all leading-relaxed">
                            {pkt.asciiDump}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between text-[10px] text-slate-400 pt-1">
                        <div>
                          <span className="text-slate-500">Target Shield:</span> {pkt.layerName}
                        </div>
                        <div>
                          <span className="text-slate-500">Core Impact:</span>{' '}
                          <span className="text-emerald-400 font-bold">0.00% (Absolute Zero-Day Barrier)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={streamBottomRef} />
        </div>

        {/* Floating "Scroll to latest" button if user scrolled up */}
        {userScrolledUp && (
          <div className="absolute bottom-3 right-4 z-10 animate-fade-in">
            <button
              onClick={resumeAutoScroll}
              className="bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-indigo-950/80 flex items-center gap-1.5 transition cursor-pointer border border-indigo-400/40"
            >
              <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
              <span>Resume Auto-Scroll</span>
            </button>
          </div>
        )}
      </div>

      {/* 4. Stream Telemetry Status Footer */}
      <div className="bg-slate-900/90 px-4 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-[11px]">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-slate-500">Interception Tally:</span>
            <span className="text-slate-200 font-bold">{stats.total} pkts</span>
          </div>
          <span className="text-slate-700">|</span>
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-cyan-400">L1 Drops: {stats.l1Count}</span>
            <span className="text-amber-400">L2 Traps: {stats.l2Count}</span>
            <span className="text-rose-400">L3 Neural: {stats.l3Count}</span>
            <span className="text-purple-400">L5 Caged: {stats.l5Count}</span>
            <span className="text-indigo-400">L6 Quantum: {stats.l6Count}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-slate-400 text-[10px]">
          <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
          <span>Brahmanda Core Sanctum: Impervious</span>
        </div>
      </div>
    </div>
  );
};
