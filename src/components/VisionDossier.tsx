import React from 'react';
import { X, ExternalLink, Shield, Cpu, Sparkles, BookOpen, Layers, Award, Radio } from 'lucide-react';

interface VisionDossierProps {
  onClose: () => void;
}

export const VisionDossier: React.FC<VisionDossierProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative text-slate-100">
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-amber-600 via-rose-700 to-indigo-900 relative rounded-t-2xl">
          <div className="flex items-start justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white font-mono text-xs font-bold uppercase tracking-wider backdrop-blur-sm flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-amber-300" /> FOUNDER'S ARCHITECTURAL DOSSIER
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight font-mono">
                The Digital Chakravyuha
              </h2>
              <p className="text-xs text-amber-200 mt-1 font-mono">
                A Vision by Abhishek Raj — Creator & Founder of the World's First Seven-Layer AI Defense System
              </p>
            </div>

            <button
              onClick={onClose}
              className="text-slate-300 hover:text-white p-1.5 rounded-lg bg-black/30 hover:bg-black/50 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-6 text-xs text-slate-300 leading-relaxed">
          {/* Article Link Box */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div>
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase tracking-wider">
                ORIGINAL MANIFESTO SOURCE
              </span>
              <h4 className="text-sm font-bold text-white mt-0.5">
                The Digital Chakravyuha: A Vision by Abhishek Raj
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Published on DigitalChakravyuha WordPress
              </p>
            </div>
            <a
              href="https://digitalchakravyuha.wordpress.com/the-digital-chakravyuha-a-vision-by-abhishek-raj-creator-and-founder-of-the-worlds-first-seven-layer-ai-defense-system/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/50 text-amber-300 font-mono font-bold text-xs uppercase tracking-wider transition shrink-0"
            >
              <span>Visit Official Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Section 1: The Core Thesis */}
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              1. The Seven-Layer AI Cybersecurity Architecture
            </h3>
            <p className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              The Digital Chakravyuha is conceptualized as a seven-layer, AI-powered cybersecurity architecture designed to safeguard the digital core where critical data and human intelligence reside. Each of the seven layers acts as a defensive barrier, built to detect, filter, isolate, and neutralize malicious activity before it can ever reach the core. Unlike traditional linear perimeter firewalls that crack under single point-of-failure breaches, the Chakravyuha operates as an interlocking, revolving labyrinth.
            </p>
          </div>

          {/* Section 2: AI Containment System */}
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-rose-400" />
              2. The World's First AI Containment System
            </h3>
            <p className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              Abhishek Raj formulated the Digital Chakravyuha not just for external hacker defense, but as a proper <strong>AI containment system</strong>. With the rise of autonomous and self-evolving AI entities, the risk of rogue AI models attempting privilege escapes, weight mutations, or lateral containment breaches poses an existential cybersecurity threat. The Digital Chakravyuha surrounds volatile intelligence with concentric microsegmentation rings that disarm adversarial AI in nanoseconds.
            </p>
          </div>

          {/* Section 3: The Inter-Layer Bridges */}
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Radio className="w-4 h-4 text-indigo-400" />
              3. Connecting Neural Bridges
            </h3>
            <p className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              A foundational pillar of Abhishek Raj's architecture is the presence of <strong>inter-layer bridges</strong>. These bridges facilitate seamless bi-directional communication and collective intelligence sharing between defensive layers. When an anomaly is touched in Layer 1 (Perimeter) or ensnared in Layer 2 (Maya Deception Honeypots), the bridges synchronize telemetry instantly across the entire grid, dynamically restructuring all interior rings to guarantee that zero breach reaches the interior.
            </p>
          </div>

          {/* Section 4: The Master Orchestrator */}
          <div>
            <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              4. The Formidable Stronghold & Master Orchestrator
            </h3>
            <p className="bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              The innermost 7th layer is described by Abhishek Raj as a <strong>formidable stronghold</strong> housing the most advanced AI construct—the <em>Master Orchestrator</em>. The Master Orchestrator balances supreme control and tactical autonomy, orchestrating the six outer rings with mathematical precision while keeping the core intelligence completely air-gapped and unbreakable.
            </p>
          </div>

          {/* Section 5: Ancient Mahabharata Wisdom */}
          <div className="bg-indigo-950/30 border border-indigo-800/40 rounded-xl p-4">
            <h4 className="font-mono text-indigo-300 font-bold uppercase text-xs mb-1 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-400" />
              The Mahabharata Strategic Parallel
            </h4>
            <p className="italic text-slate-300">
              "In ancient Indian warfare, the Chakravyuha (circular wheel formation) was legendary because once an adversary entered, the concentric revolving walls of warriors closed behind them, disorienting their senses and absorbing every attack. In Abhishek Raj's Digital Chakravyuha, this geometric defense is revived with artificial neural networks, synthetic honeypot mirages, post-quantum cryptography, and autonomous quarantine cages. It is built so that no adversary can break it."
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 rounded-b-2xl flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-500">
            Digital Chakravyuha Architectural Whitepaper • Abhishek Raj
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition cursor-pointer"
          >
            Close Dossier
          </button>
        </div>
      </div>
    </div>
  );
};
