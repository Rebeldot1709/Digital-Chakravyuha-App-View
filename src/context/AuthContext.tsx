import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  collection,
  onSnapshot,
  deleteDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType, testConnection } from '../firebase';
import { UserProfile, SecurityLogItem, CustomRuleItem, DefenseStance } from '../types/chakravyuha';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  securityLogs: SecurityLogItem[];
  customRules: CustomRuleItem[];
  loading: boolean;
  authError: string | null;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateDefenseProfile: (updates: Partial<UserProfile>) => Promise<void>;
  saveSecurityLog: (log: Omit<SecurityLogItem, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  addCustomRule: (rule: Omit<CustomRuleItem, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  toggleCustomRule: (ruleId: string, currentStatus: boolean) => Promise<void>;
  deleteCustomRule: (ruleId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [securityLogs, setSecurityLogs] = useState<SecurityLogItem[]>([]);
  const [customRules, setCustomRules] = useState<CustomRuleItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Test connection on boot
  useEffect(() => {
    testConnection();
  }, []);

  // Listen to auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthError(null);

      if (currentUser) {
        // Fetch or initialize user profile in Firestore
        const userDocRef = doc(db, 'users', currentUser.uid);
        try {
          const snap = await getDoc(userDocRef);
          if (snap.exists()) {
            setProfile(snap.data() as UserProfile);
          } else {
            // Initialize default profile
            const now = new Date().toISOString();
            const initialProfile: UserProfile = {
              userId: currentUser.uid,
              email: currentUser.email || 'user@digitalchakravyuha.node',
              displayName: currentUser.displayName || 'Sovereign Defender',
              photoURL: currentUser.photoURL || '',
              defenseStance: 'STANDARD',
              securityScore: 100,
              quantumEncryptionEnabled: true,
              honeypotMirrorsCount: 256,
              autoScrubIntervalMinutes: 5,
              createdAt: now,
              updatedAt: now,
            };

            await setDoc(userDocRef, initialProfile);
            setProfile(initialProfile);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.GET, `users/${currentUser.uid}`);
        }
      } else {
        setProfile(null);
        setSecurityLogs([]);
        setCustomRules([]);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Real-time snapshot listeners for profile and subcollections when user is logged in
  useEffect(() => {
    if (!user) return;

    // 1. Profile listener
    const userDocRef = doc(db, 'users', user.uid);
    const unsubProfile = onSnapshot(
      userDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, `users/${user.uid}`);
      }
    );

    // 2. Security Logs subcollection listener
    const logsColRef = collection(db, 'users', user.uid, 'securityLogs');
    const logsQuery = query(logsColRef, orderBy('createdAt', 'desc'), limit(50));
    const unsubLogs = onSnapshot(
      logsQuery,
      (snapshot) => {
        const logs: SecurityLogItem[] = [];
        snapshot.forEach((d) => logs.push(d.data() as SecurityLogItem));
        setSecurityLogs(logs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/securityLogs`);
      }
    );

    // 3. Custom Rules subcollection listener
    const rulesColRef = collection(db, 'users', user.uid, 'customRules');
    const rulesQuery = query(rulesColRef, orderBy('createdAt', 'desc'), limit(30));
    const unsubRules = onSnapshot(
      rulesQuery,
      (snapshot) => {
        const rules: CustomRuleItem[] = [];
        snapshot.forEach((d) => rules.push(d.data() as CustomRuleItem));
        setCustomRules(rules);
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, `users/${user.uid}/customRules`);
      }
    );

    return () => {
      unsubProfile();
      unsubLogs();
      unsubRules();
    };
  }, [user]);

  const signInWithGoogle = async () => {
    try {
      setAuthError(null);
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google sign-in error:', err);
      setAuthError(err?.message || 'Google sign-in failed');
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setProfile(null);
      setSecurityLogs([]);
      setCustomRules([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const updateDefenseProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) return;
    const userDocRef = doc(db, 'users', user.uid);
    const updatedData: UserProfile = {
      ...profile,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    try {
      await updateDoc(userDocRef, updatedData as any);
      setProfile(updatedData);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    }
  };

  const saveSecurityLog = async (logData: Omit<SecurityLogItem, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const logId = `log_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const logDocRef = doc(db, 'users', user.uid, 'securityLogs', logId);
    const fullLog: SecurityLogItem = {
      ...logData,
      id: logId,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(logDocRef, fullLog);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/securityLogs/${logId}`);
    }
  };

  const addCustomRule = async (ruleData: Omit<CustomRuleItem, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;
    const ruleId = `rule_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
    const ruleDocRef = doc(db, 'users', user.uid, 'customRules', ruleId);
    const fullRule: CustomRuleItem = {
      ...ruleData,
      id: ruleId,
      userId: user.uid,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(ruleDocRef, fullRule);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/customRules/${ruleId}`);
    }
  };

  const toggleCustomRule = async (ruleId: string, currentStatus: boolean) => {
    if (!user) return;
    const ruleDocRef = doc(db, 'users', user.uid, 'customRules', ruleId);
    try {
      await updateDoc(ruleDocRef, { enabled: !currentStatus });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}/customRules/${ruleId}`);
    }
  };

  const deleteCustomRule = async (ruleId: string) => {
    if (!user) return;
    const ruleDocRef = doc(db, 'users', user.uid, 'customRules', ruleId);
    try {
      await deleteDoc(ruleDocRef);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${user.uid}/customRules/${ruleId}`);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        securityLogs,
        customRules,
        loading,
        authError,
        signInWithGoogle,
        logout,
        updateDefenseProfile,
        saveSecurityLog,
        addCustomRule,
        toggleCustomRule,
        deleteCustomRule,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
