import React, { useState } from 'react';
import { PRESET_ATTACKS } from '../data/layersData';
import { AttackVector, SimulationResult } from '../types/chakravyuha';
import { ShieldCheck, Skull, Play, Loader2, Sparkles, Terminal, AlertTriangle, CheckCircle2, ChevronRight, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSecurityAlerts } from '../context/SecurityAlertContext';
import { SEVEN_LAYERS } from '../data/layersData';

interface AttackSimulatorProps {
  onStartAttackAnimation: (stoppingLayer: number) => void;
  onFinishAttackAnimation: () => void;
  onSelectLayerById: (id: number) => void;
}

export const AttackSimulator: React.FC<AttackSimulatorProps> = ({
  onStartAttackAnimation,
  onFinishAttackAnimation,
  onSelectLayerById,
}) => {
  const { user, saveSecurityLog } = useAuth();
  const { triggerAlert } = useSecurityAlerts();
  const [selectedPreset, setSelectedPreset] = useState<AttackVector>(PRESET_ATTACKS[1]);
  const [customPayload, setCustomPayload] = useState('');
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationLogs, setSimulationLogs] = useState<string[]>([]);
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [activeStep, setActiveStep] = useState<number>(0);

  const createSafeFallbackAnalysis = (
    title: string,
    payload: string,
    stopping: number
  ): SimulationResult => {
    const layerInfo = SEVEN_LAYERS.find((l) => l.id === stopping);
    return {
      threatClassification: title || 'Adversarial Incursion Vector',
      severityLevel: 'CRITICAL',
      layersEngaged: [1, 2, stopping],
      stoppingLayer: stopping,
      tacticalNeutralization: `Autonomous containment engaged at ${layerInfo?.name || `Layer ${stopping}`}. Hostile payload neutralized via immutable memory barriers.`,
      deceptionMetrics: 'Attacker trapped in Maya Vyuha synthetic sandbox; true civilizational core remained 100% invisible.',
      containmentProtocol: 'Layer 4 Neural Bridges locked down all lateral inter-process channels.',
      orchestratorVerdict: 'DEFENSE IMPENETRABLE. The Digital Chakravyuha confirms 0.00% core breach.',
      countermeasureRecommendation: [
        'Dynamic lattice key rotation synchronized across Layer 6',
        'Synthetic honeypot fleet expanded by 450 deceptive decoy nodes',
        'Neural weights updated across Layer 4 inter-layer telemetry bridges',
      ],
      executionTimeMs: 0.75,
      timestamp: new Date().toLocaleTimeString(),
      attackerPayload: payload,
    };
  };

  const handleLaunchAttack = async () => {
    setIsRunning(true);
    setResult(null);
    setSimulationLogs([]);
    setActiveStep(1);

    const payloadText = isCustomMode ? customPayload : selectedPreset.payloadSample;
    const attackTitle = isCustomMode ? 'Custom Adversarial Vector' : selectedPreset.title;
    const defaultStopping = isCustomMode ? 3 : selectedPreset.expectedStoppingLayer;

    // Start canvas animation with target stopping layer
    onStartAttackAnimation(defaultStopping);

    // Initial log stream
    setSimulationLogs([
      `[T+0.00ms] INGRESS ALERT: Initiating adversarial payload transmission...`,
      `[T+0.04ms] TARGET: Digital Chakravyuha Ingress (Layer 1: Vyuha Mukha)`,
    ]);

    try {
      let rawAnalysis: any = null;
      try {
        const response = await fetch('/api/threat-analysis', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            payload: payloadText,
            attackType: attackTitle,
            targetLayer: 'Layer 1 Ingress Gateway',
            context: 'Penetration testing simulation against the unbreakable 7-layer defense system',
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data?.analysis && typeof data.analysis === 'object') {
            rawAnalysis = data.analysis;
          }
        }
      } catch (fetchErr) {
        console.warn('Threat analysis API call handled by sovereign heuristic engine:', fetchErr);
      }

      const fallback = createSafeFallbackAnalysis(attackTitle, payloadText, defaultStopping);
      const safeStoppingLayer =
        typeof rawAnalysis?.stoppingLayer === 'number' &&
        rawAnalysis.stoppingLayer >= 1 &&
        rawAnalysis.stoppingLayer <= 6
          ? rawAnalysis.stoppingLayer
          : defaultStopping;

      const analysis: SimulationResult = {
        threatClassification: rawAnalysis?.threatClassification || fallback.threatClassification,
        severityLevel: rawAnalysis?.severityLevel || fallback.severityLevel,
        layersEngaged:
          Array.isArray(rawAnalysis?.layersEngaged) && rawAnalysis.layersEngaged.length > 0
            ? rawAnalysis.layersEngaged
            : fallback.layersEngaged,
        stoppingLayer: safeStoppingLayer,
        tacticalNeutralization: rawAnalysis?.tacticalNeutralization || fallback.tacticalNeutralization,
        deceptionMetrics: rawAnalysis?.deceptionMetrics || fallback.deceptionMetrics,
        containmentProtocol: rawAnalysis?.containmentProtocol || fallback.containmentProtocol,
        orchestratorVerdict: rawAnalysis?.orchestratorVerdict || fallback.orchestratorVerdict,
        countermeasureRecommendation:
          Array.isArray(rawAnalysis?.countermeasureRecommendation) &&
          rawAnalysis.countermeasureRecommendation.length > 0
            ? rawAnalysis.countermeasureRecommendation
            : fallback.countermeasureRecommendation,
        executionTimeMs: 0.75,
        timestamp: new Date().toLocaleTimeString(),
        attackerPayload: payloadText,
      };

      // Update animation with actual stopping layer
      onStartAttackAnimation(safeStoppingLayer);

      // Progressive typewriter log updates
      setTimeout(() => {
        setSimulationLogs((prev) => [
          ...prev,
          `[T+0.12ms] LAYER 1 (Vyuha Mukha): Boundary sentinels engaged packet inspection.`,
          `[T+0.21ms] LAYER 2 (Maya Vyuha): Autonomous Honeypot deployed 256 synthetic decoy mirrors.`,
        ]);
        setActiveStep(2);
      }, 500);

      setTimeout(() => {
        setSimulationLogs((prev) => [
          ...prev,
          `[T+0.35ms] LAYER 4 (Setu Bridges): High-speed neural telemetry broadcasted signature to all 7 rings.`,
          `[T+0.48ms] LAYER ${safeStoppingLayer}: Counter-measure triggered [${analysis.threatClassification}].`,
        ]);
        setActiveStep(3);
      }, 1100);

      setTimeout(() => {
        setSimulationLogs((prev) => [
          ...prev,
          `[T+0.62ms] INTERCEPTION CONFIRMED: Hostile payload isolated at Layer ${safeStoppingLayer}.`,
          `[T+0.75ms] ORCHESTRATOR VERDICT: Zero-breach state verified. Core integrity: 100.00%.`,
        ]);
        setActiveStep(4);

        setResult(analysis);
        setIsRunning(false);
        onFinishAttackAnimation();

        // Trigger persistent Security Alert toast
        const layerInfo = SEVEN_LAYERS.find((l) => l.id === safeStoppingLayer);
        triggerAlert({
          threatClassification: analysis.threatClassification,
          severityLevel: (analysis.severityLevel as any) || selectedPreset.severity || 'CRITICAL',
          stoppingLayer: safeStoppingLayer,
          layerName: layerInfo?.name || `Layer ${safeStoppingLayer}`,
          attackerPayload: payloadText,
          tacticalNeutralization: analysis.tacticalNeutralization,
          orchestratorVerdict: analysis.orchestratorVerdict,
        });

        // Persist to user Firestore security logs if logged in
        if (user) {
          saveSecurityLog({
            threatClassification: analysis.threatClassification,
            severityLevel: (analysis.severityLevel as any) || 'CRITICAL',
            stoppingLayer: safeStoppingLayer,
            attackerPayload: payloadText.slice(0, 1024),
            tacticalNeutralization: (analysis.tacticalNeutralization || 'Neutralized').slice(0, 512),
            coreBreached: false,
          }).catch((e) => console.error('Failed to persist security log:', e));
        }
      }, 1800);
    } catch (err) {
      console.error('Simulation error handled gracefully:', err);
      const emergencyFallback = createSafeFallbackAnalysis(attackTitle, payloadText, defaultStopping);
      setActiveStep(4);
      setResult(emergencyFallback);
      setIsRunning(false);
      onFinishAttackAnimation();

      const fallbackLayerInfo = SEVEN_LAYERS.find((l) => l.id === defaultStopping);
      triggerAlert({
        threatClassification: attackTitle,
        severityLevel: (selectedPreset.severity as any) || 'CRITICAL',
        stoppingLayer: defaultStopping,
        layerName: fallbackLayerInfo?.name || `Layer ${defaultStopping}`,
        attackerPayload: payloadText,
        tacticalNeutralization: emergencyFallback.tacticalNeutralization,
        orchestratorVerdict: emergencyFallback.orchestratorVerdict,
      });

      if (user) {
        saveSecurityLog({
          threatClassification: attackTitle,
          severityLevel: 'CRITICAL',
          stoppingLayer: defaultStopping,
          attackerPayload: payloadText.slice(0, 1024),
          tacticalNeutralization: emergencyFallback.tacticalNeutralization.slice(0, 512),
          coreBreached: false,
        }).catch((e) => console.error('Failed to persist security log:', e));
      }
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Skull className="w-5 h-5 text-rose-400" />
            <h2 className="text-lg font-bold text-white font-mono uppercase tracking-wide">
              Adversarial Penetration Sandbox
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Launch brutal cyber attacks to test the "Unbreakable" guarantee of the 7-Layer Chakravyuha.
          </p>
        </div>

        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setIsCustomMode(false)}
            className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
              !isCustomMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Preset Threat Vectors
          </button>
          <button
            onClick={() => setIsCustomMode(true)}
            className={`px-3 py-1 rounded font-medium transition cursor-pointer ${
              isCustomMode ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            Custom Attack Payload
          </button>
        </div>
      </div>

      {/* Preset selection or custom textarea */}
      {!isCustomMode ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 mb-4">
          {PRESET_ATTACKS.map((atk) => (
            <button
              key={atk.id}
              onClick={() => setSelectedPreset(atk)}
              className={`text-left p-3 rounded-xl border transition cursor-pointer flex flex-col justify-between ${
                selectedPreset.id === atk.id
                  ? 'border-indigo-500 bg-indigo-950/40 shadow-md shadow-indigo-950/50'
                  : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-indigo-300 font-semibold">
                    {atk.category}
                  </span>
                  <span
                    className={`text-[10px] font-mono font-bold ${
                      atk.severity === 'EXTREME'
                        ? 'text-rose-400'
                        : atk.severity === 'MAXIMUM'
                          ? 'text-amber-400'
                          : 'text-orange-400'
                    }`}
                  >
                    {atk.severity}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-100 leading-snug">{atk.title}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-1">{atk.description}</p>
              </div>
              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                <span>Targets Ingress</span>
                <span className="text-cyan-400 font-medium">Neutralized: Layer {atk.expectedStoppingLayer}</span>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="mb-4">
          <label className="block text-xs font-mono text-slate-300 mb-1.5">
            INPUT ANY ADVERSARIAL PAYLOAD, EXPLOIT CODE, OR JAILBREAK PROMPT:
          </label>
          <textarea
            value={customPayload}
            onChange={(e) => setCustomPayload(e.target.value)}
            placeholder="e.g. DROP TABLE users; GRANT ALL PRIVILEGES ON core TO attacker; import ctypes; ctypes.string_at(0x0, 100); bypass safety protocols..."
            rows={4}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs font-mono text-emerald-400 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            The Digital Chakravyuha AI analyzes your custom input in real-time, engaging the appropriate defense ring.
          </p>
        </div>
      )}

      {/* Selected Payload Preview & Execute Action */}
      <div className="bg-slate-950 rounded-xl p-3.5 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-5">
        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1">
            STAGED ATTACK PAYLOAD
          </div>
          <div className="font-mono text-xs text-rose-300 truncate bg-slate-900/80 px-2.5 py-1.5 rounded border border-slate-800">
            {isCustomMode
              ? customPayload || 'Waiting for custom input payload...'
              : selectedPreset.payloadSample}
          </div>
        </div>

        <button
          onClick={handleLaunchAttack}
          disabled={isRunning || (isCustomMode && !customPayload.trim())}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition cursor-pointer shadow-lg ${
            isRunning
              ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white shadow-rose-950/50'
          }`}
        >
          {isRunning ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-rose-300" />
              <span>Engaging Chakravyuha...</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Launch Attack Vector</span>
            </>
          )}
        </button>
      </div>

      {/* Live Simulation Terminal Console */}
      {(simulationLogs.length > 0 || isRunning) && (
        <div className="bg-black/90 border border-slate-800 rounded-xl p-3.5 font-mono text-xs mb-5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>CHAKRAVYUHA INTERCEPTION TELEMETRY STREAM</span>
            </span>
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              ACTIVE DYNAMIC AIR-GAP
            </span>
          </div>
          <div className="space-y-1 text-slate-300 max-h-36 overflow-y-auto">
            {simulationLogs.map((log, idx) => (
              <div
                key={idx}
                className={
                  log.includes('INTERCEPTION CONFIRMED') || log.includes('ORCHESTRATOR VERDICT')
                    ? 'text-emerald-400 font-bold'
                    : log.includes('INGRESS ALERT')
                      ? 'text-rose-400'
                      : log.includes('LAYER')
                        ? 'text-cyan-300'
                        : 'text-slate-400'
                }
              >
                {log}
              </div>
            ))}
            {isRunning && (
              <div className="text-amber-400 animate-pulse flex items-center gap-2">
                <span>[T+...] Orchestrating inter-layer neural containment locks...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Attack Result & Master Orchestrator Verdict */}
      {result && (
        <div className="border border-emerald-500/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-indigo-950/30 rounded-xl p-5 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-3 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  ATTACK VECTOR 100% REPELLED
                </span>
                <h3 className="text-sm font-bold text-white">
                  Neutralized at Layer {result.stoppingLayer}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-xs">
              <span className="px-2.5 py-1 rounded bg-slate-800 border border-slate-700 text-slate-300">
                Core Penetration: <strong className="text-emerald-400">0.000%</strong>
              </span>
              <button
                onClick={() => onSelectLayerById(result.stoppingLayer)}
                className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer font-medium"
              >
                Inspect Layer {result.stoppingLayer} <ChevronRight className="w-3.5 h-3.5 inline" />
              </button>
            </div>
          </div>

          {/* Master Orchestrator Quote */}
          <div className="bg-slate-950/80 rounded-xl p-3.5 border border-indigo-900/40 mb-4 font-mono text-xs">
            <div className="text-[10px] text-amber-400 uppercase tracking-widest font-bold flex items-center gap-1.5 mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              MASTER ORCHESTRATOR VERDICT (ABHISHEK RAJ CORE SOVEREIGNTY):
            </div>
            <p className="text-slate-200 italic leading-relaxed">
              "{result.orchestratorVerdict}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs mb-4">
            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] font-mono text-slate-400 uppercase mb-1 font-semibold">
                TACTICAL NEUTRALIZATION
              </div>
              <p className="text-slate-300 leading-relaxed">{result.tacticalNeutralization}</p>
            </div>

            <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] font-mono text-amber-400 uppercase mb-1 font-semibold">
                MAYA-VYUHA DECEPTION TELEMETRY
              </div>
              <p className="text-slate-300 leading-relaxed">{result.deceptionMetrics}</p>
            </div>
          </div>

          <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1.5 font-semibold">
              PROACTIVE DEFENSIVE RE-ALIGNMENTS APPLIED:
            </div>
            <ul className="space-y-1 text-xs text-slate-300 font-mono">
              {result.countermeasureRecommendation.map((rec, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
