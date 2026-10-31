export interface LayerInfo {
  id: number;
  sanskritName: string;
  name: string;
  tagline: string;
  color: string;
  glowColor: string;
  accentHex: string;
  threatsNeutralized: string[];
  coreMechanism: string;
  containmentProtocol: string;
  bridgesConnection: string;
  activeNodes: number;
  integrity: number; // percentage
  status: 'OPTIMAL' | 'ACTIVE_SCRUB' | 'HONEY_TRAPPING' | 'LOCKED';
  mythologicalParallel: string;
  technicalSpecs: {
    latency: string;
    throughput: string;
    entropy: string;
    defenseAlgorithm: string;
  };
}

export interface AttackVector {
  id: string;
  title: string;
  category: 'Rogue AI' | 'DDoS' | 'Zero-Day' | 'Quantum' | 'Supply Chain' | 'Adversarial Prompt';
  severity: 'CRITICAL' | 'HIGH' | 'MAXIMUM' | 'EXTREME';
  description: string;
  payloadSample: string;
  expectedStoppingLayer: number;
  defaultNeutralization: string;
}

export interface SimulationResult {
  threatClassification: string;
  severityLevel: string;
  layersEngaged: number[];
  stoppingLayer: number;
  tacticalNeutralization: string;
  deceptionMetrics: string;
  containmentProtocol: string;
  orchestratorVerdict: string;
  countermeasureRecommendation: string[];
  executionTimeMs: number;
  timestamp: string;
  attackerPayload: string;
}

export interface LiveThreatEvent {
  id: string;
  timestamp: string;
  originGeo: string;
  ip: string;
  attackType: string;
  stoppedAtLayer: number;
  layerName: string;
  actionTaken: string;
  status: 'BLOCKED' | 'HONEYPOT_TRAPPED' | 'CONTAINED' | 'DISINTEGRATED';
}

export type DefenseStance = 'STANDARD' | 'GARUDA' | 'BRAHMASTRA' | 'ABHIMANYU';

export interface UserProfile {
  userId: string;
  email: string;
  displayName: string;
  photoURL?: string;
  defenseStance: DefenseStance;
  securityScore: number;
  quantumEncryptionEnabled: boolean;
  honeypotMirrorsCount: number;
  autoScrubIntervalMinutes?: number;
  createdAt: string;
  updatedAt: string;
}

export interface SecurityLogItem {
  id: string;
  userId: string;
  threatClassification: string;
  severityLevel: 'CRITICAL' | 'HIGH' | 'MAXIMUM' | 'EXTREME';
  stoppingLayer: number;
  attackerPayload: string;
  tacticalNeutralization: string;
  coreBreached: boolean;
  createdAt: string;
}

export interface CustomRuleItem {
  id: string;
  userId: string;
  ruleName: string;
  targetLayer: number;
  action: 'DROP_AND_DISINTEGRATE' | 'REDIRECT_TO_HONEYPOT' | 'QUARANTINE_THREAD' | 'SCRAMBLE_LATTICE';
  patternMatch: string;
  enabled: boolean;
  createdAt: string;
}

export interface SecurityAlert {
  id: string;
  timestamp: string;
  threatClassification: string;
  severityLevel: 'CRITICAL' | 'HIGH' | 'MAXIMUM' | 'EXTREME';
  stoppingLayer: number;
  layerName: string;
  attackerPayload: string;
  tacticalNeutralization: string;
  orchestratorVerdict: string;
  coreBreached: false;
  acknowledged: boolean;
  isPinned?: boolean;
}
