/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ChakravyuhaCanvas } from './components/ChakravyuhaCanvas';
import { LayersGrid } from './components/LayersGrid';
import { AttackSimulator } from './components/AttackSimulator';
import { TerminalSandbox } from './components/TerminalSandbox';
import { PacketLogStreamWidget } from './components/PacketLogStreamWidget';
import { ThreatIntelligenceFeed } from './components/ThreatIntelligenceFeed';
import { UserSecurityPanel } from './components/UserSecurityPanel';
import { GeminiChatbot } from './components/GeminiChatbot';
import { SecurityAlertToast } from './components/SecurityAlertToast';
import { SecurityAlertDrawer } from './components/SecurityAlertDrawer';
import { LayerDetailModal } from './components/LayerDetailModal';
import { VisionDossier } from './components/VisionDossier';
import { DefenseReportModal } from './components/DefenseReportModal';
import { SEVEN_LAYERS } from './data/layersData';
import { LayerInfo, DefenseStance } from './types/chakravyuha';
import { useAuth } from './context/AuthContext';
import {
  ShieldCheck,
  Cpu,
  Radio,
  Lock,
  Layers,
  Terminal,
  Activity,
  Globe,
  Award,
  Sparkles,
  ExternalLink,
  UserCheck,
  LogIn,
  Bot,
} from 'lucide-react';

export default function App() {
  const { user, profile, updateDefenseProfile, signInWithGoogle } = useAuth();
  const [layers, setLayers] = useState<LayerInfo[]>(SEVEN_LAYERS);
  const [selectedLayer, setSelectedLayer] = useState<LayerInfo | null>(null);
  const [currentStance, setCurrentStance] = useState<DefenseStance>('STANDARD');
  const [activeTab, setActiveTab] = useState<
    'SANDBOX' | 'TERMINAL' | 'FEED' | 'BLUEPRINT' | 'MY_NODE' | 'CHATBOT'
  >('SANDBOX');
  const [isVisionOpen, setIsVisionOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Sync stance with profile when profile loads
  useEffect(() => {
    if (profile?.defenseStance) {
      setCurrentStance(profile.defenseStance);
    }
  }, [profile?.defenseStance]);

  const handleStanceChange = (stance: DefenseStance) => {
    setCurrentStance(stance);
    if (user && profile) {
      updateDefenseProfile({ defenseStance: stance }).catch(console.error);
    }
  };

  // Animation state for canvas when attacks occur
  const [animatingAttack, setAnimatingAttack] = useState<{
    active: boolean;
    currentLayer: number;
    stoppingLayer: number;
    status: 'IN_FLIGHT' | 'INTERCEPTED' | 'NEUTRALIZED';
  } | null>(null);

  const handleSelectLayer = (layer: LayerInfo) => {
    setSelectedLayer(layer);
  };

  const handleSelectLayerById = (id: number) => {
    const layer = layers.find((l) => l.id === id);
    if (layer) {
      setSelectedLayer(layer);
    }
  };

  const handleTriggerScrub = (layerId: number) => {
    setLayers((prev) =>
      prev.map((l) =>
        l.id === layerId ? { ...l, integrity: 100, status: 'OPTIMAL' } : l
      )
    );
  };

  const handleStartAttackAnimation = (stoppingLayer: number) => {
    setAnimatingAttack({
      active: true,
      currentLayer: 1,
      stoppingLayer,
      status: 'IN_FLIGHT',
    });
  };

  const handleFinishAttackAnimation = () => {
    // Keep visualization visible briefly
    setTimeout(() => {
      setAnimatingAttack((prev) => (prev ? { ...prev, active: false } : null));
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Header */}
      <Header
        currentStance={currentStance}
        onStanceChange={handleStanceChange}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenVision={() => setIsVisionOpen(true)}
        onOpenUserPanel={() => setActiveTab('MY_NODE')}
        activeThreatCount={14}
      />

      {/* Real-time Defense Metrics Banner */}
      <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>CORE PENETRATION: <strong>0.000000%</strong></span>
            </div>
            <div className="text-slate-400">
              CONCENTRIC RINGS: <strong className="text-white">7/7 LOCKED</strong>
            </div>
            <div className="text-slate-400">
              INTER-LAYER BRIDGE LATENCY: <strong className="text-cyan-400">&lt;0.04 ms</strong>
            </div>
            <div className="text-slate-400">
              USER SECURITY SHIELD:{' '}
              {user ? (
                <strong className="text-emerald-400">BOUND &amp; ENCRYPTED</strong>
              ) : (
                <button
                  onClick={signInWithGoogle}
                  className="text-amber-400 underline underline-offset-2 hover:text-amber-300 font-bold cursor-pointer"
                >
                  SIGN IN TO PERSIST NODE
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400">SOVEREIGN ARCHITECT:</span>
            <button
              onClick={() => setIsVisionOpen(true)}
              className="text-amber-400 hover:text-amber-300 font-bold underline underline-offset-2 cursor-pointer flex items-center gap-1"
            >
              Abhishek Raj <Sparkles className="w-3 h-3 text-amber-400 inline" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Command Center Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-6">
        {/* Top Hero Grid: 7-Layer Radar Visualizer + Layer Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Interactive Radar Canvas */}
          <div className="lg:col-span-6 bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-2xl flex flex-col items-center justify-center">
            <div className="w-full flex items-center justify-between mb-2 px-2">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
                  Live Chakravyuha Radar (7 Concentric Rings)
                </h3>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 font-bold">
                IMPERVIOUS STATE
              </span>
            </div>

            <ChakravyuhaCanvas
              layers={layers}
              selectedLayerId={selectedLayer?.id || null}
              onSelectLayer={handleSelectLayer}
              animatingAttack={animatingAttack}
            />

            <div className="w-full mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] font-mono text-slate-400 px-2">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan-400" /> Outer Sentinels (L1-3)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-indigo-400" /> Neural Bridges (L4)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-400" /> AI Containment (L5-6)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Sovereign Core (L7)
              </span>
            </div>
          </div>

          {/* Right Column: 7 Concentric Rings Directory & Technical Overview */}
          <div className="lg:col-span-6 space-y-4">
            <LayersGrid
              layers={layers}
              selectedLayerId={selectedLayer?.id || null}
              onSelectLayer={handleSelectLayer}
            />

            {/* Quick Context Card */}
            <div className="bg-gradient-to-br from-indigo-950/40 via-slate-900 to-slate-900 border border-indigo-900/40 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wide">
                    Why the Digital Chakravyuha is Unbreakable
                  </h4>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Traditional security assumes perimeter defense. The Digital Chakravyuha assumes an attacker
                    will try to breach; once inside, <strong>Maya Vyuha</strong> feeds them synthetic illusions,{' '}
                    <strong>Astra Vyuha</strong> neutralizes zero-day opcodes, <strong>Setu Bridges</strong> synchronize
                    containment, and <strong>Bandhana Vyuha</strong> cages rogue AI agents with zero blast radius.
                  </p>
                  <div className="mt-2.5 flex items-center gap-3">
                    <button
                      onClick={() => setIsVisionOpen(true)}
                      className="text-xs font-mono text-cyan-400 hover:text-cyan-300 underline underline-offset-2 cursor-pointer font-medium"
                    >
                      Read Abhishek Raj's Vision Dossier →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lower Interactive Command Workspace */}
        <div className="space-y-4">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-2">
            <button
              onClick={() => setActiveTab('SANDBOX')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'SANDBOX'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span>Penetration Sandbox (Try to Break It)</span>
            </button>

            <button
              onClick={() => setActiveTab('CHATBOT')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'CHATBOT'
                  ? 'bg-gradient-to-r from-indigo-600 via-rose-600 to-amber-600 text-white shadow-lg shadow-indigo-950/60 ring-1 ring-amber-400/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Bot className="w-4 h-4 text-amber-400" />
              <span>AI Defense Comms (Gemini Chat)</span>
            </button>

            <button
              onClick={() => setActiveTab('FEED')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'FEED'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Global Threat Feed</span>
            </button>

            <button
              onClick={() => setActiveTab('MY_NODE')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'MY_NODE'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>My Defense Node (Firebase Auth &amp; DB)</span>
            </button>

            <button
              onClick={() => setActiveTab('TERMINAL')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'TERMINAL'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span>Maya Honey-Trap Terminal</span>
            </button>

            <button
              onClick={() => setActiveTab('BLUEPRINT')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer ${
                activeTab === 'BLUEPRINT'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-950/60'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Layers className="w-4 h-4 text-purple-400" />
              <span>Architecture Blueprint</span>
            </button>
          </div>

          {/* Tab Content Display */}
          {activeTab === 'SANDBOX' && (
            <AttackSimulator
              onStartAttackAnimation={handleStartAttackAnimation}
              onFinishAttackAnimation={handleFinishAttackAnimation}
              onSelectLayerById={handleSelectLayerById}
            />
          )}

          {activeTab === 'CHATBOT' && <GeminiChatbot />}

          {activeTab === 'FEED' && <ThreatIntelligenceFeed />}

          {activeTab === 'MY_NODE' && <UserSecurityPanel />}

          {activeTab === 'TERMINAL' && (
            <div className="space-y-6">
              <TerminalSandbox />
              <PacketLogStreamWidget />
            </div>
          )}

          {activeTab === 'BLUEPRINT' && (
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h3 className="text-base font-bold text-white font-mono uppercase tracking-wide">
                    Digital Chakravyuha Architectural Hierarchy
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    Full mechanical breakdown of the world's first seven-layer AI containment & defense system.
                  </p>
                </div>
                <button
                  onClick={() => setIsVisionOpen(true)}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Award className="w-3.5 h-3.5" /> Founder's Whitepaper
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {layers.map((l) => (
                  <div
                    key={l.id}
                    onClick={() => setSelectedLayer(l)}
                    className="bg-slate-950 border border-slate-800 hover:border-indigo-500/60 p-4 rounded-xl cursor-pointer transition flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-400 font-bold">
                          LAYER {l.id}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{l.sanskritName}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{l.name}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-2">{l.tagline}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[11px] font-mono text-slate-500">
                      <span>{l.activeNodes.toLocaleString()} nodes</span>
                      <span className="text-emerald-400 font-medium">100% Intact</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-4 py-6 mt-12 text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-slate-300 font-bold">DIGITAL CHAKRAVYUHA</span> — World's First Seven-Layer AI Defense System
            <div className="text-[11px] text-slate-500 mt-0.5">
              Architected on the vision of Abhishek Raj • Zero Breach Axiom Guaranteed
            </div>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <a
              href="https://digitalchakravyuha.wordpress.com/the-digital-chakravyuha-a-vision-by-abhishek-raj-creator-and-founder-of-the-worlds-first-seven-layer-ai-defense-system/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1"
            >
              <span>WordPress Vision Post</span>
              <ExternalLink className="w-3 h-3 inline" />
            </a>
            <button
              onClick={() => setIsReportOpen(true)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Audit Certificate
            </button>
            <button
              onClick={() => setIsVisionOpen(true)}
              className="text-slate-400 hover:text-slate-200 cursor-pointer"
            >
              Founder Dossier
            </button>
          </div>
        </div>
      </footer>

      {/* Layer Detail Modal */}
      <LayerDetailModal
        layer={selectedLayer}
        onClose={() => setSelectedLayer(null)}
        onTriggerScrub={handleTriggerScrub}
      />

      {/* Founder's Vision Modal */}
      {isVisionOpen && <VisionDossier onClose={() => setIsVisionOpen(false)} />}

      {/* Defense Security Audit Certificate Modal */}
      {isReportOpen && <DefenseReportModal onClose={() => setIsReportOpen(false)} />}

      {/* Persistent Security Alert Toast Stack */}
      <SecurityAlertToast onInspectLayer={handleSelectLayerById} />

      {/* Security Alert Vault History Drawer */}
      <SecurityAlertDrawer onInspectLayer={handleSelectLayerById} />
    </div>
  );
}
