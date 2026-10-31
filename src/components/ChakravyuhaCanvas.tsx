import React, { useEffect, useRef, useState } from 'react';
import { LayerInfo } from '../types/chakravyuha';

interface ChakravyuhaCanvasProps {
  layers: LayerInfo[];
  selectedLayerId: number | null;
  onSelectLayer: (layer: LayerInfo) => void;
  animatingAttack: {
    active: boolean;
    currentLayer: number;
    stoppingLayer: number;
    status: 'IN_FLIGHT' | 'INTERCEPTED' | 'NEUTRALIZED';
  } | null;
}

export const ChakravyuhaCanvas: React.FC<ChakravyuhaCanvasProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  animatingAttack,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoveredLayerId, setHoveredLayerId] = useState<number | null>(null);

  // Rotation angles for each of the 7 concentric rings
  const anglesRef = useRef<number[]>([0, 0, 0, 0, 0, 0, 0]);
  const rotationSpeeds = [0.003, -0.004, 0.005, -0.003, 0.006, -0.004, 0.002];

  // Particle beams across neural bridges
  const bridgeParticlesRef = useRef<
    Array<{
      fromRing: number;
      toRing: number;
      progress: number;
      speed: number;
      angle: number;
    }>
  >([]);

  useEffect(() => {
    // Initialize bridge particles
    const particles = [];
    for (let i = 0; i < 24; i++) {
      const ring = Math.floor(Math.random() * 6);
      particles.push({
        fromRing: ring,
        toRing: ring + 1,
        progress: Math.random(),
        speed: 0.008 + Math.random() * 0.012,
        angle: (Math.PI * 2 * i) / 24 + Math.random() * 0.2,
      });
    }
    bridgeParticlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const render = () => {
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(centerX, centerY) * 0.88;

      ctx.clearRect(0, 0, width, height);

      // Deep dark cyber background grid
      ctx.fillStyle = '#060a12';
      ctx.fillRect(0, 0, width, height);

      // Radial dark background glow
      const bgGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        20,
        centerX,
        centerY,
        maxRadius * 1.15
      );
      bgGrad.addColorStop(0, 'rgba(30, 27, 75, 0.4)');
      bgGrad.addColorStop(0.5, 'rgba(15, 23, 42, 0.6)');
      bgGrad.addColorStop(1, 'rgba(6, 10, 18, 0.95)');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Draw faint coordinate crosshairs & radar grid
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.15)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 6]);

      // Axes
      ctx.beginPath();
      ctx.moveTo(centerX - maxRadius * 1.1, centerY);
      ctx.lineTo(centerX + maxRadius * 1.1, centerY);
      ctx.moveTo(centerX, centerY - maxRadius * 1.1);
      ctx.lineTo(centerX, centerY + maxRadius * 1.1);
      ctx.stroke();

      // Diagonal crosshairs
      ctx.beginPath();
      const diagLen = maxRadius * 1.05;
      const cos45 = Math.cos(Math.PI / 4);
      ctx.moveTo(centerX - diagLen * cos45, centerY - diagLen * cos45);
      ctx.lineTo(centerX + diagLen * cos45, centerY + diagLen * cos45);
      ctx.moveTo(centerX - diagLen * cos45, centerY + diagLen * cos45);
      ctx.lineTo(centerX + diagLen * cos45, centerY - diagLen * cos45);
      ctx.stroke();
      ctx.setLineDash([]);

      // Ring radii from Layer 7 (innermost, r = 0.18*maxRadius) to Layer 1 (outermost, r = maxRadius)
      // Layer IDs: 1 (outer) to 7 (inner)
      const ringRadii: number[] = [];
      const ringSpacing = (maxRadius - maxRadius * 0.18) / 6;
      for (let i = 0; i < 7; i++) {
        // i = 0 is Layer 1 (outermost)
        ringRadii.push(maxRadius - i * ringSpacing);
      }

      // Update ring rotation angles
      for (let i = 0; i < 7; i++) {
        anglesRef.current[i] += rotationSpeeds[i];
      }

      // Draw Neural Bridges connecting concentric tiers (Layer 4 & adjacent layers)
      const bridgeCount = 12;
      for (let b = 0; b < bridgeCount; b++) {
        const baseAngle = (Math.PI * 2 * b) / bridgeCount + anglesRef.current[3] * 0.5;
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.12)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        const rOuter = ringRadii[0];
        const rInner = ringRadii[6];
        ctx.moveTo(centerX + Math.cos(baseAngle) * rInner, centerY + Math.sin(baseAngle) * rInner);
        ctx.lineTo(centerX + Math.cos(baseAngle) * rOuter, centerY + Math.sin(baseAngle) * rOuter);
        ctx.stroke();
      }

      // Draw Bridge Particles (Flowing intelligence packets)
      bridgeParticlesRef.current.forEach((p) => {
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.fromRing = Math.floor(Math.random() * 6);
          p.toRing = p.fromRing + 1;
        }
        const r1 = ringRadii[p.fromRing];
        const r2 = ringRadii[p.toRing];
        const curR = r1 + (r2 - r1) * p.progress;
        const px = centerX + Math.cos(p.angle) * curR;
        const py = centerY + Math.sin(p.angle) * curR;

        ctx.fillStyle = 'rgba(129, 140, 248, 0.7)';
        ctx.shadowColor = '#6366f1';
        ctx.shadowBlur = 6;
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // Draw the 7 Concentric Chakravyuha Rings
      // Render from outermost (Layer 1) to innermost (Layer 7)
      for (let layerIdx = 0; layerIdx < 7; layerIdx++) {
        const layerNumber = layerIdx + 1;
        const layer = layers.find((l) => l.id === layerNumber);
        const radius = ringRadii[layerIdx];
        const isHovered = hoveredLayerId === layerNumber;
        const isSelected = selectedLayerId === layerNumber;
        const angleOffset = anglesRef.current[layerIdx];

        // Is this layer under attack in animation?
        const isEngagedInAttack =
          animatingAttack &&
          animatingAttack.active &&
          layerNumber <= (animatingAttack.stoppingLayer || 1);

        // Ring base glow and styling
        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);

        if (isSelected) {
          ctx.strokeStyle = layer?.accentHex || '#38bdf8';
          ctx.lineWidth = 3.5;
          ctx.shadowColor = layer?.accentHex || '#38bdf8';
          ctx.shadowBlur = 18;
        } else if (isHovered) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 2.5;
          ctx.shadowColor = layer?.accentHex || '#38bdf8';
          ctx.shadowBlur = 14;
        } else if (isEngagedInAttack && layerNumber === animatingAttack.stoppingLayer) {
          // Pulse stopping barrier
          const pulse = Math.sin(Date.now() * 0.01) * 0.5 + 0.5;
          ctx.strokeStyle = layer?.accentHex || '#f43f5e';
          ctx.lineWidth = 3 + pulse * 3;
          ctx.shadowColor = layer?.accentHex || '#f43f5e';
          ctx.shadowBlur = 20 + pulse * 15;
        } else {
          ctx.strokeStyle = layer?.glowColor || 'rgba(56, 189, 248, 0.3)';
          ctx.lineWidth = 1.5;
          ctx.shadowColor = layer?.accentHex || '#38bdf8';
          ctx.shadowBlur = 4;
        }
        ctx.stroke();
        ctx.restore();

        // Draw segmented ancient Chakravyuha gate arcs along the ring
        const arcSegments = 6 + layerIdx * 2;
        const segmentGap = 0.12;
        const segmentLength = (Math.PI * 2) / arcSegments - segmentGap;

        for (let s = 0; s < arcSegments; s++) {
          const segStart = (Math.PI * 2 * s) / arcSegments + angleOffset;
          const segEnd = segStart + segmentLength;

          ctx.save();
          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, segStart, segEnd);
          ctx.strokeStyle = isSelected
            ? layer?.accentHex || '#38bdf8'
            : isHovered
              ? 'rgba(255, 255, 255, 0.85)'
              : layer?.accentHex || '#38bdf8';
          ctx.lineWidth = isSelected ? 4 : isHovered ? 3 : 2;
          ctx.shadowColor = layer?.accentHex || '#38bdf8';
          ctx.shadowBlur = isSelected ? 12 : 6;
          ctx.stroke();
          ctx.restore();

          // Defensive Sentinel Nodes at arc joints
          const nodeX = centerX + Math.cos(segStart) * radius;
          const nodeY = centerY + Math.sin(segStart) * radius;

          ctx.save();
          ctx.beginPath();
          ctx.arc(nodeX, nodeY, isSelected ? 4.5 : 3, 0, Math.PI * 2);
          ctx.fillStyle = isSelected
            ? '#ffffff'
            : layer?.accentHex || '#38bdf8';
          ctx.shadowColor = layer?.accentHex || '#38bdf8';
          ctx.shadowBlur = 10;
          ctx.fill();
          ctx.restore();
        }

        // Layer Label on the ring (aligned at dynamic top angle)
        const labelAngle = -Math.PI / 2 + (layerIdx * 0.15) - 0.4;
        const textX = centerX + Math.cos(labelAngle) * (radius - 10);
        const textY = centerY + Math.sin(labelAngle) * (radius - 10);

        ctx.save();
        ctx.font = '9px monospace';
        ctx.fillStyle = isSelected
          ? '#ffffff'
          : isHovered
            ? '#38bdf8'
            : 'rgba(148, 163, 184, 0.7)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(`L${layerNumber}`, textX, textY);
        ctx.restore();
      }

      // Draw the Inner Sanctum: Layer 7 (Brahmanda Sovereign Core)
      const coreRadius = ringRadii[6] * 0.85;
      const coreGrad = ctx.createRadialGradient(
        centerX,
        centerY,
        coreRadius * 0.1,
        centerX,
        centerY,
        coreRadius
      );
      coreGrad.addColorStop(0, '#f59e0b');
      coreGrad.addColorStop(0.4, '#dc2626');
      coreGrad.addColorStop(0.8, '#4f46e5');
      coreGrad.addColorStop(1, 'rgba(15, 23, 42, 0.9)');

      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
      ctx.fillStyle = coreGrad;
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 30;
      ctx.fill();

      // Rotating core protective runes/shield markings
      const coreRays = 8;
      const coreAngle = anglesRef.current[6] * 2;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1.5;
      for (let r = 0; r < coreRays; r++) {
        const rayA = coreAngle + (Math.PI * 2 * r) / coreRays;
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(rayA) * (coreRadius * 0.3), centerY + Math.sin(rayA) * (coreRadius * 0.3));
        ctx.lineTo(centerX + Math.cos(rayA) * (coreRadius * 0.9), centerY + Math.sin(rayA) * (coreRadius * 0.9));
        ctx.stroke();
      }

      // Central core emblem text
      ctx.font = 'bold 10px monospace';
      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#000000';
      ctx.shadowBlur = 6;
      ctx.fillText('CORE', centerX, centerY - 6);
      ctx.font = '8px monospace';
      ctx.fillStyle = '#34d399';
      ctx.fillText('100% LOCKED', centerX, centerY + 8);
      ctx.restore();

      // Draw Animated Attack Trajectory if attack simulation is active
      if (animatingAttack && animatingAttack.active) {
        const stopRingIdx = animatingAttack.stoppingLayer - 1;
        const targetRadius = ringRadii[stopRingIdx];
        const attackAngle = -Math.PI / 4; // Top-right approach vector

        // Ingress attack beam from outside toward the stopping ring
        const startR = maxRadius * 1.25;
        const curR = targetRadius;

        ctx.save();
        // Red adversary beam
        const attackGrad = ctx.createLinearGradient(
          centerX + Math.cos(attackAngle) * startR,
          centerY + Math.sin(attackAngle) * startR,
          centerX + Math.cos(attackAngle) * curR,
          centerY + Math.sin(attackAngle) * curR
        );
        attackGrad.addColorStop(0, 'rgba(239, 68, 68, 0.9)');
        attackGrad.addColorStop(0.7, 'rgba(249, 115, 22, 0.8)');
        attackGrad.addColorStop(1, 'rgba(255, 255, 255, 1)');

        ctx.strokeStyle = attackGrad;
        ctx.lineWidth = 4;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(centerX + Math.cos(attackAngle) * startR, centerY + Math.sin(attackAngle) * startR);
        ctx.lineTo(centerX + Math.cos(attackAngle) * curR, centerY + Math.sin(attackAngle) * curR);
        ctx.stroke();
        ctx.setLineDash([]);

        // Impact & Neutralization blast ripple at stopping layer
        const impactX = centerX + Math.cos(attackAngle) * curR;
        const impactY = centerY + Math.sin(attackAngle) * curR;

        const rippleRadius = 12 + Math.sin(Date.now() * 0.015) * 8;
        ctx.beginPath();
        ctx.arc(impactX, impactY, rippleRadius, 0, Math.PI * 2);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#38bdf8';
        ctx.shadowBlur = 20;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(impactX, impactY, 5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Banner near impact
        ctx.font = 'bold 11px monospace';
        ctx.fillStyle = '#38bdf8';
        ctx.textAlign = 'left';
        ctx.fillText(`NEUTRALIZED AT L${animatingAttack.stoppingLayer}`, impactX + 16, impactY - 10);
        ctx.font = '9px monospace';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('CORE PENETRATION: 0.00%', impactX + 16, impactY + 4);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [layers, selectedLayerId, hoveredLayerId, animatingAttack]);

  // Click & Hover handling to detect which ring was clicked
  const getLayerFromCoords = (clientX: number, clientY: number): number | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const x = (clientX - rect.left) * scaleX - canvas.width / 2;
    const y = (clientY - rect.top) * scaleY - canvas.height / 2;
    const dist = Math.sqrt(x * x + y * y);

    const maxRadius = Math.min(canvas.width / 2, canvas.height / 2) * 0.88;
    const ringSpacing = (maxRadius - maxRadius * 0.18) / 6;

    // Check inner core (Layer 7)
    if (dist <= maxRadius * 0.18 + ringSpacing * 0.4) {
      return 7;
    }

    // Check rings from 1 to 6
    for (let i = 0; i < 7; i++) {
      const ringRadius = maxRadius - i * ringSpacing;
      if (Math.abs(dist - ringRadius) < ringSpacing * 0.5) {
        return i + 1;
      }
    }

    return null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const layerId = getLayerFromCoords(e.clientX, e.clientY);
    setHoveredLayerId(layerId);
  };

  const handleMouseLeave = () => {
    setHoveredLayerId(null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const layerId = getLayerFromCoords(e.clientX, e.clientY);
    if (layerId) {
      const layer = layers.find((l) => l.id === layerId);
      if (layer) {
        onSelectLayer(layer);
      }
    }
  };

  return (
    <div className="relative w-full aspect-square max-w-[580px] mx-auto flex items-center justify-center p-2">
      <canvas
        ref={canvasRef}
        width={720}
        height={720}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="w-full h-full rounded-2xl cursor-pointer border border-cyan-900/40 shadow-2xl shadow-cyan-950/40 bg-slate-950"
      />

      {/* Floating Tactical Overlay HUD */}
      <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-300 pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>SEVEN-LAYER CHAKRAVYUHA RADAR</span>
      </div>

      <div className="absolute bottom-4 right-4 bg-slate-900/80 backdrop-blur-md border border-slate-700/60 rounded-lg px-3 py-1.5 text-xs font-mono text-slate-400 pointer-events-none">
        Click any concentric ring to inspect telemetry
      </div>
    </div>
  );
};
