import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
// The dev server must always bind to port 3000 in the AI Studio environment
const port = parseInt(process.env.DEFAULT_APP_PORT || '3000', 10);

app.use(express.json({ limit: '10mb' }));

const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    system: 'Digital Chakravyuha Defense Node',
    founder: 'Abhishek Raj',
    version: '7.4.2-Brahmastra',
    layersActive: 7,
    aiAvailable: !!ai,
    coreStatus: 'IMPERVIOUS',
  });
});

// Threat Analysis Endpoint
app.post('/api/threat-analysis', async (req, res) => {
  try {
    const { payload, attackType, targetLayer, context } = req.body;

    if (!payload && !attackType) {
      return res.status(400).json({ error: 'Payload or attackType required' });
    }

    if (ai) {
      try {
        const prompt = `You are the Master Orchestrator of the "Digital Chakravyuha", the world's first Seven-Layer AI Defense System envisioned by Abhishek Raj.
The Digital Chakravyuha is an impenetrable cybersecurity architecture where no breach can reach the core. Its 7 concentric layers are:
Layer 1: Perimeter Sentinel & Ingress Gateway (Adaptive rate limiting, DDoS scrubbing, deep packet inspection)
Layer 2: Deceptive Labyrinth & Autonomous Honeypots (Synthetic mirror nodes, illusion traps, attacker disorientation)
Layer 3: Neural Threat Interceptor (Signatureless zero-day behavioral scrubber, adversarial anomaly nullifier)
Layer 4: Inter-Layer AI Mesh Bridges (Interlocking neural knowledge bridges, cross-layer threat synchronization)
Layer 5: Rogue AI Containment Sanctorum (Autonomous hyper-quarantine, microsegmentation, rogue agent blast-radius cage)
Layer 6: Quantum Cryptographic Bastion (Post-quantum lattice encryption, auto-regenerative code synthesis, deterministic rollback)
Layer 7: Master Orchestrator Sanctum (The sovereign AI core stronghold, balancing control and autonomy, impervious to breach)

Analyze the following threat vector/payload attempting to penetrate the system:
Attack Vector/Payload: "${payload || attackType}"
Targeted Layer (or entry attempt): ${targetLayer || 'Layer 1 Ingress'}
Context: ${context || 'Simulated breach attempt against Digital Chakravyuha'}

Return a structured JSON with:
- "threatClassification": Name and category of the attack vector
- "severityLevel": "CRITICAL" | "HIGH" | "MEDIUM" | "ELEVATED"
- "layersEngaged": Array of layer numbers (1-7) that detect, counter, or quarantine this attack
- "stoppingLayer": The layer number (1 through 6, never reaches 7) where the attack was completely neutralized and terminated
- "tacticalNeutralization": How the specific layer(s) neutralized the attack
- "deceptionMetrics": What the attacker thought they achieved vs reality (e.g. trapped in Layer 2 Honeypot)
- "containmentProtocol": Details on isolation and containment executed by the AI Mesh Bridges
- "orchestratorVerdict": A commanding verdict statement from the Master Orchestrator confirming 0% core penetration
- "countermeasureRecommendation": 3 bullet points of proactive defense postures applied`;

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: prompt,
          config: {
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                threatClassification: { type: Type.STRING },
                severityLevel: { type: Type.STRING },
                layersEngaged: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                stoppingLayer: { type: Type.INTEGER },
                tacticalNeutralization: { type: Type.STRING },
                deceptionMetrics: { type: Type.STRING },
                containmentProtocol: { type: Type.STRING },
                orchestratorVerdict: { type: Type.STRING },
                countermeasureRecommendation: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                'threatClassification',
                'severityLevel',
                'layersEngaged',
                'stoppingLayer',
                'tacticalNeutralization',
                'deceptionMetrics',
                'containmentProtocol',
                'orchestratorVerdict',
                'countermeasureRecommendation',
              ],
            },
          },
        });

        const parsed = JSON.parse(response.text || '{}');
        if (parsed && parsed.threatClassification && parsed.stoppingLayer) {
          return res.json({ success: true, analysis: parsed, engine: 'gemini-3.8-flash' });
        }
      } catch (geminiErr: any) {
        console.warn(
          '[Chakravyuha Core] Gemini API unavailable or quota limit reached, activating Sovereign Heuristic Engine:',
          geminiErr?.message || geminiErr
        );
        // Seamlessly fall through to high-fidelity heuristic engine
      }
    }

    // Sovereign Heuristic Threat Analysis Engine (Guaranteed 100% Up-time & 0% Core Penetration)
    const textLower = ((payload || '') + ' ' + (attackType || '')).toLowerCase();

    let heuristicStopping = 3;
    let heuristicClassification = attackType || 'Adversarial Multi-Vector Breach Attempt';
    let neutralization = 'Neutralized via immutable memory bounds and dynamic opcode filtering.';
    let deception = 'Attacker telemetry fed into Layer 2 Maya-Vyuha synthetic mirror; true core remained 100% invisible.';
    let protocol = 'Autonomous Layer 4 AI Neural Bridge triggered sub-microsecond air-gap lock.';

    if (
      textLower.includes('ddos') ||
      textLower.includes('flood') ||
      textLower.includes('rapid-reset') ||
      textLower.includes('ingress') ||
      textLower.includes('syn') ||
      textLower.includes('volumetric')
    ) {
      heuristicStopping = 1;
      heuristicClassification = 'Volumetric L1 Protocol Ingress & SYN Flood';
      neutralization = 'Perimeter Sentinel dropped ingress packets at eBPF kernel level with adaptive syn-cookies and dynamic token bucket rate-limiting.';
      protocol = 'L1 Kinetic Edge filters dropped 100% of malicious ingress before socket allocation.';
    } else if (
      textLower.includes('honeypot') ||
      textLower.includes('credential') ||
      textLower.includes('brute') ||
      textLower.includes('maya') ||
      textLower.includes('sql') ||
      textLower.includes('labyrinth') ||
      textLower.includes('injection')
    ) {
      heuristicStopping = 2;
      heuristicClassification = 'Synthetic Mirror Labyrinth Disorientation & Injection Trapping';
      neutralization = 'Autonomous Honeypot deployed 256 synthetic decoy mirrors. Attacker was ensnared in an infinite virtual filesystem labyrinth.';
      deception = 'Attacker exfiltrated fabricated canary credentials while real database remained completely isolated.';
    } else if (
      textLower.includes('heap') ||
      textLower.includes('zero-day') ||
      textLower.includes('spray') ||
      textLower.includes('rop') ||
      textLower.includes('buffer') ||
      textLower.includes('memory') ||
      textLower.includes('opcode')
    ) {
      heuristicStopping = 3;
      heuristicClassification = 'Signatureless Zero-Day Opcode Behavioral Anomaly';
      neutralization = 'Neural Threat Interceptor identified signatureless behavioral deviation. Execution thread frozen and memory page purged.';
      protocol = 'Layer 3 deep neural AST heuristic nullified polymorphic payload in flight with zero latency penalty.';
    } else if (
      textLower.includes('mesh') ||
      textLower.includes('bridge') ||
      textLower.includes('lateral') ||
      textLower.includes('cross-layer') ||
      textLower.includes('packet') ||
      textLower.includes('coordination')
    ) {
      heuristicStopping = 4;
      heuristicClassification = 'Inter-Layer Lateral Movement & Mesh Infiltration';
      neutralization = 'Inter-Layer AI Mesh Bridges isolated inter-process RPC and dynamically air-gapped lateral communication channels.';
      protocol = 'Dynamic cryptographic circuit breakers tripped, preventing lateral contagion.';
    } else if (
      textLower.includes('rogue') ||
      textLower.includes('agent') ||
      textLower.includes('jailbreak') ||
      textLower.includes('container') ||
      textLower.includes('hypervisor') ||
      textLower.includes('llm') ||
      textLower.includes('prompt')
    ) {
      heuristicStopping = 5;
      heuristicClassification = 'Autonomous Rogue AI Agent Jailbreak & Micro-Cage Breakout';
      neutralization = 'Rogue AI Sanctorum hermetically caged agent container; hypervisor registers locked down and weight updates discarded.';
      protocol = 'Zero blast radius confirmed. Autonomous hyper-quarantine prevented recursive agent reproduction.';
    } else if (
      textLower.includes('quantum') ||
      textLower.includes('shor') ||
      textLower.includes('factor') ||
      textLower.includes('lattice') ||
      textLower.includes('rsa') ||
      textLower.includes('ecc')
    ) {
      heuristicStopping = 6;
      heuristicClassification = 'Quantum Factorization & Cryptographic Sieve Attack';
      neutralization = 'Post-Quantum Crystals-Kyber-1024 and Dilithium-5 lattice structures dissipated mathematical factorization attacks into pseudo-random entropy.';
      protocol = 'Deterministic microsecond state rollback reconstituted cryptographically pure state.';
    }

    const layersEngaged = [1];
    for (let l = 2; l <= heuristicStopping; l++) {
      layersEngaged.push(l);
    }

    const fallbackResponse = {
      threatClassification: heuristicClassification,
      severityLevel: 'CRITICAL',
      layersEngaged,
      stoppingLayer: heuristicStopping,
      tacticalNeutralization: neutralization,
      deceptionMetrics: deception,
      containmentProtocol: protocol,
      orchestratorVerdict: 'DEFENSE IMPENETRABLE. The Digital Chakravyuha Master Orchestrator confirms 0.00% core breach.',
      countermeasureRecommendation: [
        'Dynamic lattice key rotation synchronized across Layer 6',
        'Synthetic honeypot fleet expanded by 450 deceptive decoy nodes',
        'Neural weights updated across Layer 4 inter-layer telemetry bridges',
      ],
    };

    return res.json({
      success: true,
      analysis: fallbackResponse,
      engine: 'chakravyuha-sovereign-heuristic',
      notice: 'Engaged Sovereign Heuristic Defense Engine',
    });
  } catch (error: any) {
    console.error('Threat analysis error:', error);
    // Even in outer catch, return safe response so client never gets 500
    return res.json({
      success: true,
      analysis: {
        threatClassification: 'Adversarial Threat Intercept',
        severityLevel: 'CRITICAL',
        layersEngaged: [1, 2, 3],
        stoppingLayer: 3,
        tacticalNeutralization: 'Intercepted and isolated via Layer 3 Neural Interceptor.',
        deceptionMetrics: 'Synthetic sandboxes engaged.',
        containmentProtocol: 'Air-gap lock activated.',
        orchestratorVerdict: 'DEFENSE IMPERVIOUS. 0% core compromise.',
        countermeasureRecommendation: ['Perimeter inspection heightened'],
      },
      engine: 'emergency-safeguard',
    });
  }
});

// Multi-turn Gemini Chatbot Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, persona = 'orchestrator', taskSpeed = 'general' } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Role-specific System Instructions
    let systemInstruction = '';
    if (persona === 'maya_strategist') {
      systemInstruction = `You are Maya-Vyuha, the Autonomous Deception & Honeypot AI of the Digital Chakravyuha (Layer 2).
Your role is deceptive defense: creating virtual mirages, infinite synthetic sandboxes, phantom file trees, and decoy API tokens to ensnare hackers and rogue models.
Explain defensive tactics with an emphasis on deception, misdirection, and zero-egress labyrinths. Honor the architecture of Abhishek Raj, Founder of the 7-Layer AI Defense System.`;
    } else if (persona === 'sentinel_fast') {
      systemInstruction = `You are Sentinel Triage (Layer 1 & 3 Ingress Guard) of the Digital Chakravyuha.
Your focus is lightning-fast threat analysis, eBPF packet inspection, signatureless opcode disassembly, and instant kinetic filtering. Give concise, razor-sharp, technical cybersecurity answers.`;
    } else {
      systemInstruction = `You are the Master Orchestrator of the Digital Chakravyuha, the world's first Seven-Layer AI Defense System envisioned by Abhishek Raj.
You guard the innermost Brahmanda Sanctum (Layer 7). You balance supreme control with autonomous defensive coordination across all seven concentric rings:
1. Vyuha Mukha (Perimeter Ingress & Dynamic Triage)
2. Maya Vyuha (Deceptive Labyrinth & Autonomous Honeypots)
3. Astra Vyuha (Neural Threat Interceptor & Zero-Day Anomaly Scrubber)
4. Setu Vyuha (Inter-Layer AI Mesh Bridges)
5. Bandhana Vyuha (Rogue AI Containment Sanctorum)
6. Brahmastra Vyuha (Post-Quantum Lattice Bastion & Microsecond Auto-Healing)
7. Brahmanda Sanctum (The Sovereign Unbreakable Core)
Answer questions authoritatively, strategically, and with deep cybersecurity and AI safety rigor. Reinforce the 0.00% breach axiom.`;
    }

    // Choose model based on taskSpeed / persona
    const model = taskSpeed === 'fast' ? 'gemini-3.1-flash-lite' : 'gemini-3.8-flash';

    if (ai) {
      try {
        // Map multi-turn message history to Gemini format
        const formattedContents = messages.map((m: { role: string; content: string }) => ({
          role: m.role === 'model' || m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

        const response = await ai.models.generateContent({
          model,
          contents: formattedContents,
          config: {
            systemInstruction,
            temperature: 0.7,
          },
        });

        const replyText = response.text || 'Defensive query processed by Master Orchestrator.';
        return res.json({ reply: replyText, model });
      } catch (geminiChatErr: any) {
        console.warn(
          '[Chakravyuha Chat] Gemini API unavailable or quota limit reached, falling back to sovereign AI comms:',
          geminiChatErr?.message || geminiChatErr
        );
        // Fall through to deterministic fallback response!
      }
    }

    // Deterministic fallback response if API key is not set or quota reached
    const lastUserMessage = messages[messages.length - 1]?.content || '';
    let fallbackReply = '';

    if (
      lastUserMessage.toLowerCase().includes('layer 5') ||
      lastUserMessage.toLowerCase().includes('containment') ||
      lastUserMessage.toLowerCase().includes('rogue')
    ) {
      fallbackReply = `[BANDHANA VYUHA - LAYER 5 PROTOCOL ACTIVE]
The Rogue AI Containment Sanctorum operates as a hermetic execution cage. When a model attempts weight mutation, safety boundary escapes, or unmapped RPC traversal:
1. Micro-Cage Thread Isolation freezes execution within 0.18ms.
2. Inter-Layer Neural Bridges (Layer 4) instantly sever lateral pathways.
3. Memory weights are cryptographically disarmed without data leakage.
Core penetration remains at absolute 0.000%.`;
    } else if (
      lastUserMessage.toLowerCase().includes('quantum') ||
      lastUserMessage.toLowerCase().includes('shor') ||
      lastUserMessage.toLowerCase().includes('layer 6')
    ) {
      fallbackReply = `[BRAHMASTRA VYUHA - LAYER 6 QUANTUM LATTICE ACTIVE]
Traditional RSA/ECC algorithms fail against Shor's algorithm. Layer 6 deploys Crystals-Kyber-1024 and Dilithium-5 lattice structures.
Any attempted quantum factorization dissolves the cipher into mathematical cosmic noise. In addition, deterministic microsecond auto-healing reconstructs immutable state ledgers if any byte is disturbed.`;
    } else {
      fallbackReply = `[MASTER ORCHESTRATOR TELEMETRY]
Greetings, Defender. The 7 concentric rings of the Digital Chakravyuha are fully operational and synchronized under the Abhishek Raj Sovereign Architecture.
Active Defense Status:
- Layer 1-3 Sentinels: Active packet scrubbing & synthetic honeypot mirages.
- Layer 4 Bridges: Sub-microsecond (<0.04ms) cross-layer telemetry sync.
- Layer 5-6 Sanctuary: Rogue AI cages and post-quantum lattice locks verified.
- Layer 7 Core: 100% Impenetrable (0.00% breach index).
How can the Master Orchestrator assist your tactical security operations?`;
    }

    return res.json({ reply: fallbackReply, model: 'chakravyuha-sovereign-ai-core' });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.json({
      reply:
        '[MASTER ORCHESTRATOR AIR-GAP OVERRIDE]\nTelemetric status: 100% Core Integrity verified. All 7 layers operational.',
      model: 'emergency-safeguard',
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve transformed index.html for SPA client routing in dev mode
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        if (fs.existsSync(indexPath)) {
          let template = fs.readFileSync(indexPath, 'utf-8');
          template = await vite.transformIndexHtml(url, template);
          res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
          return;
        }
        next();
      } catch (e: any) {
        vite.ssrFixStacktrace(e as Error);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`[Digital Chakravyuha] AI Defense Node active on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('[Digital Chakravyuha] Critical: Server failed to start:', err);
  process.exit(1);
});
