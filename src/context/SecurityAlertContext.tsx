import React, { createContext, useContext, useState, useEffect } from 'react';
import { SecurityAlert } from '../types/chakravyuha';

interface SecurityAlertContextType {
  activeToasts: SecurityAlert[];
  alertHistory: SecurityAlert[];
  isDrawerOpen: boolean;
  setIsDrawerOpen: (open: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  triggerAlert: (
    alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'acknowledged' | 'coreBreached'>
  ) => void;
  dismissToast: (id: string) => void;
  togglePinToast: (id: string) => void;
  acknowledgeAlert: (id: string) => void;
  clearAllAlerts: () => void;
  unreadCount: number;
}

const SecurityAlertContext = createContext<SecurityAlertContextType | undefined>(undefined);

// Web Audio API cyber interception sound
function playCyberAlertSound() {
  try {
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();

    // First tone
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(880, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.12);

    gain1.gain.setValueAtTime(0.08, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.25);

    // Second resonant tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1320, ctx.currentTime + 0.08);
    osc2.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.22);

    gain2.gain.setValueAtTime(0.06, ctx.currentTime + 0.08);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.08);
    osc2.stop(ctx.currentTime + 0.3);
  } catch (e) {
    // AudioContext blocked by browser policy or unavailable
  }
}

export const SecurityAlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeToasts, setActiveToasts] = useState<SecurityAlert[]>([]);
  const [alertHistory, setAlertHistory] = useState<SecurityAlert[]>(() => {
    try {
      const stored = localStorage.getItem('chakravyuha_security_alerts');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync alert history to local storage
  useEffect(() => {
    try {
      localStorage.setItem('chakravyuha_security_alerts', JSON.stringify(alertHistory));
    } catch {}
  }, [alertHistory]);

  const triggerAlert = (
    alertData: Omit<SecurityAlert, 'id' | 'timestamp' | 'acknowledged' | 'coreBreached'>
  ) => {
    const alertId = `alert-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}-${Math.random().toString(36).substring(2, 6)}`;
    const now = new Date();
    const timestampStr = `${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}.${String(
      Math.floor(Math.random() * 900) + 100
    )}`;

    const newAlert: SecurityAlert = {
      ...alertData,
      id: alertId,
      timestamp: timestampStr,
      acknowledged: false,
      coreBreached: false,
      isPinned: true, // Persistent by default as requested
    };

    if (soundEnabled) {
      playCyberAlertSound();
    }

    // Add to active toast stack (keep max 3 active on screen simultaneously)
    setActiveToasts((prev) => {
      const withoutDup = prev.filter((t) => t.id !== alertId);
      return [newAlert, ...withoutDup.slice(0, 2)];
    });

    // Add to persistent history
    setAlertHistory((prev) => {
      const withoutDup = prev.filter((t) => t.id !== alertId);
      return [newAlert, ...withoutDup.slice(0, 99)];
    });
  };

  const dismissToast = (id: string) => {
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const togglePinToast = (id: string) => {
    setActiveToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isPinned: !t.isPinned } : t))
    );
  };

  const acknowledgeAlert = (id: string) => {
    setAlertHistory((prev) =>
      prev.map((a) => (a.id === id ? { ...a, acknowledged: true } : a))
    );
    setActiveToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const clearAllAlerts = () => {
    setActiveToasts([]);
    setAlertHistory([]);
  };

  const unreadCount = alertHistory.filter((a) => !a.acknowledged).length;

  return (
    <SecurityAlertContext.Provider
      value={{
        activeToasts,
        alertHistory,
        isDrawerOpen,
        setIsDrawerOpen,
        soundEnabled,
        setSoundEnabled,
        triggerAlert,
        dismissToast,
        togglePinToast,
        acknowledgeAlert,
        clearAllAlerts,
        unreadCount,
      }}
    >
      {children}
    </SecurityAlertContext.Provider>
  );
};

export const useSecurityAlerts = () => {
  const context = useContext(SecurityAlertContext);
  if (!context) {
    throw new Error('useSecurityAlerts must be used within a SecurityAlertProvider');
  }
  return context;
};
