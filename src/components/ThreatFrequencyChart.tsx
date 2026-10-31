import React, { useState, useEffect, useMemo } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import {
  Activity,
  TrendingUp,
  ShieldCheck,
  Zap,
  Clock,
  Layers,
  Flame,
  Radio,
} from 'lucide-react';

interface HourlyThreatPoint {
  hour: string; // e.g. "14:00"
  timeLabel: string; // e.g. "14:00 (-10h)"
  total: number;
  perimeterL1: number;
  deceptionL2: number;
  neuralL3L4: number;
  criticalZeroDay: number;
  containmentRate: number;
}

// Generates realistic 24-hour telemetry based on current time
const generate24hTelemetry = (): HourlyThreatPoint[] => {
  const currentHour = new Date().getHours();
  const points: HourlyThreatPoint[] = [];

  for (let i = 23; i >= 0; i--) {
    const targetHour = (currentHour - i + 24) % 24;
    const hourFormatted = `${String(targetHour).padStart(2, '0')}:00`;
    const label = i === 0 ? 'Now' : i === 23 ? '24h ago' : hourFormatted;

    // Diurnal variation + pseudo-random peaks
    const diurnalFactor = Math.sin(((targetHour - 4) / 24) * 2 * Math.PI) * 0.35 + 1; // Peaks around afternoon/night
    const spike = (targetHour === 3 || targetHour === 15 || targetHour === 21) ? 1.4 : 1.0;
    
    const baseTotal = Math.floor((2800 + Math.random() * 950) * diurnalFactor * spike);
    const perimeterL1 = Math.floor(baseTotal * (0.52 + Math.random() * 0.08));
    const deceptionL2 = Math.floor(baseTotal * (0.24 + Math.random() * 0.05));
    const neuralL3L4 = Math.floor(baseTotal * (0.16 + Math.random() * 0.04));
    const criticalZeroDay = Math.max(12, baseTotal - perimeterL1 - deceptionL2 - neuralL3L4);

    points.push({
      hour: hourFormatted,
      timeLabel: label,
      total: baseTotal,
      perimeterL1,
      deceptionL2,
      neuralL3L4,
      criticalZeroDay,
      containmentRate: 100,
    });
  }

  return points;
};

// Custom Cyber Tooltip Component for Recharts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data: HourlyThreatPoint = payload[0]?.payload;
    if (!data) return null;

    return (
      <div className="bg-slate-950/95 border border-indigo-500/50 rounded-xl p-3 shadow-2xl backdrop-blur-md font-mono text-xs text-slate-200 min-w-[240px]">
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
          <div className="flex items-center gap-1.5 text-indigo-300 font-bold">
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span>Time: {data.hour} ({data.timeLabel})</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40 font-bold">
            100% CONTAINED
          </span>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm">
            <span className="text-slate-400 font-medium">Total Interceptions:</span>
            <span className="text-cyan-300 font-bold">{data.total.toLocaleString()}</span>
          </div>

          <div className="pt-1.5 border-t border-slate-900 space-y-1 text-[11px]">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                L1 Perimeter Sentinels:
              </span>
              <span className="text-slate-200">{data.perimeterL1.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                L2 Maya Honeypot Traps:
              </span>
              <span className="text-slate-200">{data.deceptionL2.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-indigo-400" />
                L3-L4 Neural & Mesh:
              </span>
              <span className="text-slate-200">{data.neuralL3L4.toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-rose-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Critical / Zero-Day Opcode:
              </span>
              <span className="text-rose-300 font-bold">{data.criticalZeroDay.toLocaleString()}</span>
            </div>
          </div>

          <div className="pt-2 mt-1 border-t border-slate-800/80 text-[10px] text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Digital Chakravyuha Core: 0 Breaches</span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export const ThreatFrequencyChart: React.FC = () => {
  const [data, setData] = useState<HourlyThreatPoint[]>(() => generate24hTelemetry());
  const [viewMode, setViewMode] = useState<'TOTAL' | 'BREAKDOWN' | 'CRITICAL'>('TOTAL');
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);

  // Live simulation: dynamically increment current hour frequency
  useEffect(() => {
    if (!isLiveUpdating) return;

    const interval = setInterval(() => {
      setData((prevData) => {
        if (!prevData.length) return prevData;
        const lastIdx = prevData.length - 1;
        const last = prevData[lastIdx];
        const addedThreats = Math.floor(Math.random() * 6) + 2;
        const addedPerimeter = Math.floor(addedThreats * 0.6);
        const addedDeception = Math.floor(addedThreats * 0.25);
        const addedNeural = addedThreats - addedPerimeter - addedDeception;

        const updatedLast: HourlyThreatPoint = {
          ...last,
          total: last.total + addedThreats,
          perimeterL1: last.perimeterL1 + addedPerimeter,
          deceptionL2: last.deceptionL2 + addedDeception,
          neuralL3L4: last.neuralL3L4 + addedNeural,
        };

        const updated = [...prevData];
        updated[lastIdx] = updatedLast;
        return updated;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [isLiveUpdating]);

  // Aggregate 24h stats
  const metrics = useMemo(() => {
    const total24h = data.reduce((acc, curr) => acc + curr.total, 0);
    const maxHour = data.reduce(
      (max, curr) => (curr.total > max.total ? curr : max),
      data[0] || { total: 0, hour: '--' }
    );
    const avgPerHour = Math.round(total24h / (data.length || 1));
    const criticalTotal = data.reduce((acc, curr) => acc + curr.criticalZeroDay, 0);
    const currentRatePerMin = Math.round((data[data.length - 1]?.total || 3000) / 60);

    return {
      total24h,
      peakHour: maxHour.hour,
      peakValue: maxHour.total,
      avgPerHour,
      criticalTotal,
      currentRatePerMin,
    };
  }, [data]);

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header and Quick Stats */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wide">
                  24-Hour Threat Interception Frequency
                </h3>
                <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-950/80 text-cyan-400 border border-indigo-700/50">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  RECHARTS ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Hourly volume of adversarial incursions repelled before reaching Layer 7 Sovereign Core.
              </p>
            </div>
          </div>
        </div>

        {/* View Mode Controls */}
        <div className="flex flex-wrap items-center gap-2 self-stretch lg:self-auto">
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => setViewMode('TOTAL')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                viewMode === 'TOTAL'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Aggregate Volume
            </button>
            <button
              onClick={() => setViewMode('BREAKDOWN')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                viewMode === 'BREAKDOWN'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Multi-Layer Defense
            </button>
            <button
              onClick={() => setViewMode('CRITICAL')}
              className={`px-3 py-1 rounded-lg transition cursor-pointer font-bold ${
                viewMode === 'CRITICAL'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Zero-Day &amp; Critical
            </button>
          </div>

          <button
            onClick={() => setIsLiveUpdating((prev) => !prev)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-mono border flex items-center gap-1.5 cursor-pointer transition ${
              isLiveUpdating
                ? 'bg-emerald-950/60 border-emerald-700/50 text-emerald-400'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title={isLiveUpdating ? 'Pause live telemetry ticks' : 'Resume live telemetry ticks'}
          >
            <Radio className={`w-3.5 h-3.5 ${isLiveUpdating ? 'text-emerald-400 animate-pulse' : 'text-slate-500'}`} />
            <span className="text-[11px] font-bold">{isLiveUpdating ? 'Live Ticks' : 'Paused'}</span>
          </button>
        </div>
      </div>

      {/* 24-Hour Telemetry Stat Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>24h Neutralized</span>
          </div>
          <div className="text-lg font-bold text-cyan-300 mt-1">
            {metrics.total24h.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>100% Repelled</span>
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Peak Ingress Hour</span>
          </div>
          <div className="text-lg font-bold text-amber-300 mt-1">
            {metrics.peakValue.toLocaleString()}{' '}
            <span className="text-xs text-slate-400 font-normal">/hr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Recorded at {metrics.peakHour} UTC
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Zap className="w-3.5 h-3.5 text-indigo-400" />
            <span>Average Velocity</span>
          </div>
          <div className="text-lg font-bold text-indigo-300 mt-1">
            ~{metrics.avgPerHour.toLocaleString()}{' '}
            <span className="text-xs text-slate-400 font-normal">/hr</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Rolling rate: ~{metrics.currentRatePerMin}/min
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-3">
          <div className="text-[11px] text-slate-400 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-rose-400" />
            <span>Zero-Day Intercepts</span>
          </div>
          <div className="text-lg font-bold text-rose-300 mt-1">
            {metrics.criticalTotal.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
            <span>0 Layer 7 Breaches</span>
          </div>
        </div>
      </div>

      {/* Main Recharts Line Chart */}
      <div className="w-full h-72 sm:h-80 pt-2 pb-1 bg-slate-950/60 rounded-xl border border-slate-800/70 p-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 15, right: 15, left: -10, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="timeLabel"
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              fontFamily="monospace"
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              tickFormatter={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : `${v}`)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{
                paddingTop: '8px',
                fontSize: '11px',
                fontFamily: 'monospace',
              }}
            />

            {/* Total Volume Line */}
            {(viewMode === 'TOTAL' || viewMode === 'BREAKDOWN') && (
              <Line
                type="monotone"
                dataKey="total"
                name="Total Interceptions"
                stroke="#06b6d4"
                strokeWidth={2.5}
                dot={{ r: 2, fill: '#06b6d4', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#38bdf8', stroke: '#082f49', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}

            {/* Breakdown Multi-Lines */}
            {viewMode === 'BREAKDOWN' && (
              <>
                <Line
                  type="monotone"
                  dataKey="perimeterL1"
                  name="L1 Perimeter Sentinel"
                  stroke="#38bdf8"
                  strokeWidth={1.8}
                  strokeDasharray="4 4"
                  dot={false}
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="deceptionL2"
                  name="L2 Maya Deception"
                  stroke="#f59e0b"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={true}
                />
                <Line
                  type="monotone"
                  dataKey="neuralL3L4"
                  name="L3-L4 Neural & Mesh"
                  stroke="#a855f7"
                  strokeWidth={1.8}
                  dot={false}
                  isAnimationActive={true}
                />
              </>
            )}

            {/* Critical Zero-Day Line */}
            {(viewMode === 'TOTAL' || viewMode === 'BREAKDOWN' || viewMode === 'CRITICAL') && (
              <Line
                type="monotone"
                dataKey="criticalZeroDay"
                name="Critical Zero-Day Neutralized"
                stroke="#f43f5e"
                strokeWidth={viewMode === 'CRITICAL' ? 2.5 : 1.5}
                dot={viewMode === 'CRITICAL' ? { r: 3, fill: '#f43f5e' } : false}
                activeDot={{ r: 6, fill: '#fb7185', stroke: '#4c0519', strokeWidth: 2 }}
                isAnimationActive={true}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer insight */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-[11px] font-mono text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>Real-time rolling window: 24 distinct hourly interception clusters</span>
        </div>
        <div className="text-slate-500">
          Normalized via Digital Chakravyuha Telemetry Sieve
        </div>
      </div>
    </div>
  );
};
