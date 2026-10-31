import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ShieldCheck, Crosshair, Zap, Eye, Layers, Activity } from 'lucide-react';
import { LiveThreatEvent } from '../types/chakravyuha';

export interface ThreatNode {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
  attackCount: number;
  severity: 'CRITICAL' | 'HIGH' | 'MAXIMUM' | 'EXTREME';
  primaryVector: string;
  targetLayer: number;
  stoppedCount: number;
}

export const GLOBAL_THREAT_HUBS: ThreatNode[] = [
  { id: 'fra', name: 'Frankfurt', country: 'Germany', lat: 50.1109, lng: 8.6821, attackCount: 14280, severity: 'HIGH', primaryVector: 'DNS Amplification', targetLayer: 1, stoppedCount: 14280 },
  { id: 'shen', name: 'Shenzhen', country: 'China', lat: 22.5431, lng: 114.0579, attackCount: 28410, severity: 'CRITICAL', primaryVector: 'APT Lateral Recon', targetLayer: 2, stoppedCount: 28410 },
  { id: 'res', name: 'Reston, VA', country: 'USA', lat: 38.9586, lng: -77.357, attackCount: 19850, severity: 'EXTREME', primaryVector: 'Zero-Day Heap Spray', targetLayer: 3, stoppedCount: 19850 },
  { id: 'sao', name: 'São Paulo', country: 'Brazil', lat: -23.5505, lng: -46.6333, attackCount: 8940, severity: 'MAXIMUM', primaryVector: 'Autonomous Model Weight Mutation', targetLayer: 5, stoppedCount: 8940 },
  { id: 'tok', name: 'Tokyo', country: 'Japan', lat: 35.6762, lng: 139.6503, attackCount: 11200, severity: 'EXTREME', primaryVector: 'Quantum Shor Factorization', targetLayer: 6, stoppedCount: 11200 },
  { id: 'lon', name: 'London', country: 'UK', lat: 51.5074, lng: -0.1278, attackCount: 16740, severity: 'HIGH', primaryVector: 'HTTP/3 Rapid-Reset Ingress', targetLayer: 1, stoppedCount: 16740 },
  { id: 'seo', name: 'Seoul', country: 'South Korea', lat: 37.5665, lng: 126.978, attackCount: 13580, severity: 'CRITICAL', primaryVector: 'Synthetic Credential Stuffing', targetLayer: 2, stoppedCount: 13580 },
  { id: 'syd', name: 'Sydney', country: 'Australia', lat: -33.8688, lng: 151.2093, attackCount: 7420, severity: 'HIGH', primaryVector: 'Memory Leak & Heap Exploit', targetLayer: 3, stoppedCount: 7420 },
  { id: 'tor', name: 'Toronto', country: 'Canada', lat: 43.6532, lng: -79.3832, attackCount: 9150, severity: 'CRITICAL', primaryVector: 'Multi-Agent Rogue Coordination', targetLayer: 4, stoppedCount: 9150 },
  { id: 'sin', name: 'Singapore', country: 'Singapore', lat: 1.3521, lng: 103.8198, attackCount: 18920, severity: 'MAXIMUM', primaryVector: 'Container Jailbreak Egress', targetLayer: 5, stoppedCount: 18920 },
  { id: 'mum', name: 'Mumbai', country: 'India', lat: 19.076, lng: 72.8777, attackCount: 22100, severity: 'HIGH', primaryVector: 'BGP Hijack & Border Siphon', targetLayer: 1, stoppedCount: 22100 },
  { id: 'dub', name: 'Dubai', country: 'UAE', lat: 25.2048, lng: 55.2708, attackCount: 8340, severity: 'HIGH', primaryVector: 'Reverse Shell Mirror Trap', targetLayer: 2, stoppedCount: 8340 },
  { id: 'mos', name: 'Moscow', country: 'Russia', lat: 55.7558, lng: 37.6173, attackCount: 31200, severity: 'EXTREME', primaryVector: 'Kernel ROP Execution Exploit', targetLayer: 3, stoppedCount: 31200 },
  { id: 'joh', name: 'Johannesburg', country: 'South Africa', lat: -26.2041, lng: 28.0473, attackCount: 6510, severity: 'HIGH', primaryVector: 'Botnet Scraping Sweep', targetLayer: 1, stoppedCount: 6510 },
];

// Simplified continent landmass polygons for world backdrop
const CONTINENT_LANDS: Array<[number, number][]> = [
  // North America
  [[-165, 65], [-140, 70], [-100, 72], [-70, 60], [-55, 48], [-75, 30], [-80, 25], [-90, 16], [-105, 20], [-120, 35], [-125, 48], [-140, 58], [-165, 65]],
  // South America
  [[-80, 10], [-60, 10], [-35, -5], [-40, -22], [-55, -35], [-70, -54], [-75, -45], [-70, -20], [-80, -2], [-80, 10]],
  // Europe
  [[-10, 36], [0, 44], [5, 52], [15, 56], [30, 60], [40, 55], [30, 42], [20, 38], [10, 37], [-10, 36]],
  // Asia
  [[40, 55], [60, 68], [100, 75], [140, 70], [170, 65], [140, 40], [120, 30], [105, 12], [80, 10], [70, 25], [50, 30], [40, 40], [40, 55]],
  // Africa
  [[-15, 30], [10, 35], [32, 30], [42, 12], [50, 10], [40, -10], [32, -30], [20, -34], [12, -20], [0, 5], [-15, 15], [-15, 30]],
  // Australia
  [[115, -22], [130, -12], [145, -15], [152, -28], [148, -38], [135, -36], [118, -32], [115, -22]],
];

interface ThreatGeoMapProps {
  latestEvent?: LiveThreatEvent | null;
}

export const ThreatGeoMap: React.FC<ThreatGeoMapProps> = ({ latestEvent }) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedHub, setSelectedHub] = useState<ThreatNode | null>(null);
  const [showBeams, setShowBeams] = useState(true);
  const [heatIntensity, setHeatIntensity] = useState<'STANDARD' | 'MAXIMUM'>('MAXIMUM');
  const [hubs, setHubs] = useState<ThreatNode[]>(GLOBAL_THREAT_HUBS);

  // Live attack ticker update
  useEffect(() => {
    const interval = setInterval(() => {
      setHubs((prev) =>
        prev.map((h) => {
          const delta = Math.floor(Math.random() * 8) + 1;
          return {
            ...h,
            attackCount: h.attackCount + delta,
            stoppedCount: h.stoppedCount + delta,
          };
        })
      );
    }, 2800);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const width = 840;
    const height = 440;

    // D3 Projection
    const projection = d3
      .geoNaturalEarth1()
      .scale(150)
      .translate([width / 2, height / 2 + 10]);

    const svg = d3.select(svgEl);
    svg.selectAll('*').remove();

    // Definitions for gradients & glowing filters
    const defs = svg.append('defs');

    // Cyber grid pattern
    const pattern = defs
      .append('pattern')
      .attr('id', 'cyber-grid')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');

    pattern
      .append('path')
      .attr('d', 'M 20 0 L 0 0 0 20')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(30, 41, 59, 0.4)')
      .attr('stroke-width', 0.8);

    // Filter for neon heat glow
    const filter = defs.append('filter').attr('id', 'neon-glow').attr('x', '-50%').attr('y', '-50%').attr('width', '200%').attr('height', '200%');
    filter.append('feGaussianBlur').attr('stdDeviation', 4).attr('result', 'coloredBlur');
    const feMerge = filter.append('feMerge');
    feMerge.append('feMergeNode').attr('in', 'coloredBlur');
    feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Central Citadel location (Digital Chakravyuha Sanctuary, represented centrally in coordinate space)
    const citadelCoords: [number, number] = [0, 20];
    const citadelPos = projection(citadelCoords) || [width / 2, height / 2];

    // Radial gradient for heatmap hot zones
    defs
      .append('radialGradient')
      .attr('id', 'heat-gradient-extreme')
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'rgba(239, 68, 68, 0.9)' },
        { offset: '40%', color: 'rgba(249, 115, 22, 0.5)' },
        { offset: '75%', color: 'rgba(234, 179, 8, 0.2)' },
        { offset: '100%', color: 'rgba(239, 68, 68, 0)' },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    defs
      .append('radialGradient')
      .attr('id', 'heat-gradient-high')
      .selectAll('stop')
      .data([
        { offset: '0%', color: 'rgba(245, 158, 11, 0.85)' },
        { offset: '50%', color: 'rgba(234, 179, 8, 0.4)' },
        { offset: '80%', color: 'rgba(56, 189, 248, 0.15)' },
        { offset: '100%', color: 'rgba(245, 158, 11, 0)' },
      ])
      .enter()
      .append('stop')
      .attr('offset', (d) => d.offset)
      .attr('stop-color', (d) => d.color);

    // Background deep ocean
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', '#050811');

    // Background cyber grid
    svg
      .append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#cyber-grid)');

    // Graticule lines (Latitude/Longitude)
    const graticule = d3.geoGraticule().step([30, 30]);
    const pathGenerator = d3.geoPath().projection(projection);

    svg
      .append('path')
      .datum(graticule)
      .attr('d', pathGenerator as any)
      .attr('fill', 'none')
      .attr('stroke', 'rgba(71, 85, 105, 0.15)')
      .attr('stroke-width', 0.6)
      .attr('stroke-dasharray', '2,4');

    // Render Continent Landmasses
    const continentsGroup = svg.append('g').attr('class', 'continents');

    CONTINENT_LANDS.forEach((poly) => {
      const geoPoly: any = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [poly],
        },
      };

      continentsGroup
        .append('path')
        .datum(geoPoly)
        .attr('d', pathGenerator as any)
        .attr('fill', '#0f172a')
        .attr('stroke', '#1e293b')
        .attr('stroke-width', 1.2)
        .attr('stroke-linejoin', 'round')
        .attr('opacity', 0.85);
    });

    // Heatmap density contours (D3 Heatmap Circles)
    const heatmapGroup = svg.append('g').attr('class', 'heatmap-layer');

    const maxCount = d3.max(hubs, (d) => d.attackCount) || 30000;
    const radiusScale = d3
      .scaleSqrt()
      .domain([5000, maxCount])
      .range(heatIntensity === 'MAXIMUM' ? [22, 58] : [14, 38]);

    hubs.forEach((hub) => {
      const coords = projection([hub.lng, hub.lat]);
      if (!coords) return;

      const r = radiusScale(hub.attackCount);
      const isExtreme = hub.severity === 'EXTREME' || hub.severity === 'CRITICAL';

      // Outer heat dissipation aura
      heatmapGroup
        .append('circle')
        .attr('cx', coords[0])
        .attr('cy', coords[1])
        .attr('r', r)
        .attr('fill', isExtreme ? 'url(#heat-gradient-extreme)' : 'url(#heat-gradient-high)')
        .attr('pointer-events', 'none')
        .attr('opacity', heatIntensity === 'MAXIMUM' ? 0.9 : 0.6);

      // Mid-tier pulse circle
      const pulseCircle = heatmapGroup
        .append('circle')
        .attr('cx', coords[0])
        .attr('cy', coords[1])
        .attr('r', r * 0.45)
        .attr('fill', isExtreme ? 'rgba(239, 68, 68, 0.25)' : 'rgba(245, 158, 11, 0.2)')
        .attr('stroke', isExtreme ? '#ef4444' : '#f59e0b')
        .attr('stroke-width', 0.8)
        .attr('pointer-events', 'none');

      // Animating expanding ring
      pulseCircle
        .append('animate')
        .attr('attributeName', 'r')
        .attr('values', `${r * 0.3};${r * 0.85};${r * 0.3}`)
        .attr('dur', `${2.5 + (hub.id.charCodeAt(0) % 3)}s`)
        .attr('repeatCount', 'indefinite');
    });

    // Interactive Hub Markers
    const hubsGroup = svg.append('g').attr('class', 'hubs-layer');

    hubs.forEach((hub) => {
      const coords = projection([hub.lng, hub.lat]);
      if (!coords) return;

      const g = hubsGroup
        .append('g')
        .attr('transform', `translate(${coords[0]}, ${coords[1]})`)
        .attr('cursor', 'pointer')
        .on('click', () => setSelectedHub(hub))
        .on('mouseenter', () => setSelectedHub(hub));

      // Core point
      g.append('circle')
        .attr('r', 4.5)
        .attr('fill', '#ffffff')
        .attr('stroke', hub.severity === 'EXTREME' ? '#f43f5e' : '#38bdf8')
        .attr('stroke-width', 2)
        .attr('filter', 'url(#neon-glow)');

      // Label text
      g.append('text')
        .attr('x', 7)
        .attr('y', 3)
        .text(hub.name)
        .attr('font-size', '8.5px')
        .attr('font-family', 'monospace')
        .attr('font-weight', 'bold')
        .attr('fill', '#94a3b8')
        .attr('pointer-events', 'none');
    });

    // Threat Trajectory Beams (Attacks shooting inward and getting stopped at the containment perimeter)
    if (showBeams) {
      const beamsGroup = svg.append('g').attr('class', 'beams-layer');

      hubs.forEach((hub, idx) => {
        const source = projection([hub.lng, hub.lat]);
        if (!source) return;

        // Curved Bézier path toward the Digital Chakravyuha citadel
        const midX = (source[0] + citadelPos[0]) / 2 + (idx % 2 === 0 ? 30 : -30);
        const midY = (source[1] + citadelPos[1]) / 2 - 25;

        const pathData = `M ${source[0]} ${source[1]} Q ${midX} ${midY} ${citadelPos[0]} ${citadelPos[1]}`;

        // Hostile beam arc (semi-transparent red/orange)
        beamsGroup
          .append('path')
          .attr('d', pathData)
          .attr('fill', 'none')
          .attr('stroke', 'rgba(239, 68, 68, 0.28)')
          .attr('stroke-width', 1.2)
          .attr('stroke-dasharray', '4,5')
          .attr('pointer-events', 'none');

        // Dynamic flowing particle along the curve
        const particle = beamsGroup
          .append('circle')
          .attr('r', 2.5)
          .attr('fill', '#f43f5e')
          .attr('filter', 'url(#neon-glow)');

        // Animate particle along path
        const pathElem = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        pathElem.setAttribute('d', pathData);
        const pathLength = pathElem.getTotalLength();

        let progress = (idx * 0.15) % 1;
        const speed = 0.005 + (idx % 4) * 0.002;

        const animateParticle = () => {
          progress += speed;
          if (progress > 0.88) {
            // Reaches containment perimeter, disarmed!
            progress = 0;
          }
          const pt = pathElem.getPointAtLength(progress * pathLength);
          particle.attr('cx', pt.x).attr('cy', pt.y);
          requestAnimationFrame(animateParticle);
        };
        requestAnimationFrame(animateParticle);
      });
    }

    // Central Digital Chakravyuha Citadel Sanctuary (The 7-Layer Core Stronghold)
    const citadelGroup = svg.append('g').attr('transform', `translate(${citadelPos[0]}, ${citadelPos[1]})`);

    // Outer Containment Shield Rings
    for (let ring = 1; ring <= 4; ring++) {
      citadelGroup
        .append('circle')
        .attr('r', ring * 9)
        .attr('fill', 'none')
        .attr('stroke', ring === 4 ? 'rgba(56, 189, 248, 0.8)' : 'rgba(99, 102, 241, 0.4)')
        .attr('stroke-width', ring === 4 ? 1.8 : 1)
        .attr('stroke-dasharray', `${ring * 4}, 4`);
    }

    // Glowing Central Stronghold Node
    citadelGroup
      .append('circle')
      .attr('r', 8)
      .attr('fill', '#f59e0b')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .attr('filter', 'url(#neon-glow)');

    citadelGroup
      .append('text')
      .attr('y', 20)
      .text('CHAKRAVYUHA CITADEL')
      .attr('text-anchor', 'middle')
      .attr('font-size', '8px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('fill', '#38bdf8');

    citadelGroup
      .append('text')
      .attr('y', 28)
      .text('0.00% BREACH')
      .attr('text-anchor', 'middle')
      .attr('font-size', '7px')
      .attr('font-family', 'monospace')
      .attr('font-weight', 'bold')
      .attr('fill', '#34d399');

  }, [hubs, showBeams, heatIntensity]);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 shadow-2xl relative overflow-hidden">
      {/* Map Header & Tactical Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Crosshair className="w-4 h-4 text-cyan-400 animate-spin-slow" />
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
              D3.js Live Cyber Threat Heatmap &amp; Impenetrable Containment Matrix
            </h3>
            <p className="text-[10px] font-mono text-slate-400">
              Visualizing global adversarial origins continuously neutralized by Abhishek Raj's 7-Layer Rings.
            </p>
          </div>
        </div>

        {/* Tactical Map Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setShowBeams(!showBeams)}
            className={`px-2.5 py-1 rounded text-[10px] font-bold transition cursor-pointer border ${
              showBeams
                ? 'bg-indigo-950 text-cyan-300 border-indigo-700/60'
                : 'bg-slate-900 text-slate-500 border-slate-800'
            }`}
          >
            {showBeams ? 'TRAJECTORIES: ON' : 'TRAJECTORIES: OFF'}
          </button>

          <button
            onClick={() => setHeatIntensity(heatIntensity === 'MAXIMUM' ? 'STANDARD' : 'MAXIMUM')}
            className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-amber-300 border border-slate-800 cursor-pointer"
          >
            HEAT INTENSITY: {heatIntensity}
          </button>
        </div>
      </div>

      {/* SVG Canvas Map Container */}
      <div className="relative w-full aspect-[21/11] max-h-[460px] overflow-hidden rounded-xl bg-slate-950 border border-slate-900">
        <svg
          ref={svgRef}
          viewBox="0 0 840 440"
          className="w-full h-full object-contain"
        />

        {/* Legend Overlay HUD */}
        <div className="absolute bottom-2.5 left-2.5 bg-slate-950/85 backdrop-blur-md border border-slate-800 rounded-lg p-2 font-mono text-[9.5px] text-slate-300 flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 inline-block shadow-sm shadow-red-500" />
            <span>Critical Hotspot</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block shadow-sm shadow-amber-400" />
            <span>High Intensity</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 inline-block shadow-sm shadow-cyan-400" />
            <span>Chakravyuha Core</span>
          </div>
          <div className="text-emerald-400 font-bold border-l border-slate-800 pl-2">
            CORE PENETRATION: 0.00%
          </div>
        </div>

        {/* Selected Hub Inspector Popover */}
        {selectedHub && (
          <div className="absolute top-2.5 right-2.5 bg-slate-900/95 backdrop-blur-md border border-indigo-500/50 rounded-xl p-3 max-w-xs shadow-2xl font-mono text-xs animate-in fade-in">
            <div className="flex items-center justify-between border-b border-slate-800 pb-1.5 mb-2">
              <span className="font-bold text-white text-xs">{selectedHub.name}, {selectedHub.country}</span>
              <button
                onClick={() => setSelectedHub(null)}
                className="text-slate-500 hover:text-white text-xs cursor-pointer ml-2"
              >
                ✕
              </button>
            </div>
            <div className="space-y-1 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Total Probes:</span>
                <span className="text-rose-400 font-bold">{selectedHub.attackCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Primary Vector:</span>
                <span className="text-amber-300 truncate max-w-[130px]">{selectedHub.primaryVector}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Stopped At:</span>
                <span className="text-cyan-400 font-bold">Layer {selectedHub.targetLayer}</span>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800 text-emerald-400 font-bold">
                <span>Containment:</span>
                <span>100% NEUTRALIZED</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
