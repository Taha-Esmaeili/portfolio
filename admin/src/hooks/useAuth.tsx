import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { RepoInfo } from '../api/github';

const PIN_HASH_KEY = 'portfolio-admin-pin-hash';

interface AuthContextType {
  token: string | null;
  repoInfo: RepoInfo | null;
  hasPin: boolean;
  isAuthenticated: boolean;
  isPinVerified: boolean;
  login: (token: string, repoInfo: RepoInfo) => void;
  verifyPin: (pin: string) => Promise<boolean>;
  logout: () => void;
  setPin: (pin: string) => Promise<void>;
}

async function hashPin(pin: string): Promise<string> {
  const data = new TextEncoder().encode(`portfolio-admin:${pin}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; branch: string } | null>(null);
  const [pinHash, setPinHash] = useState<string | null>(null);
  const [isPinVerified, setIsPinVerified] = useState(false);
  const [hasPin, setHasPin] = useState(false);

  // Load the stored PIN hash (if the user set one previously)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PIN_HASH_KEY);
      if (stored) {
        setPinHash(stored);
        setHasPin(true);
      }
    } catch {
      // localStorage unavailable; treat as first run
    }
  }, []);

  const login = useCallback((newToken: string, newRepoInfo: RepoInfo) => {
    setToken(newToken);
    setRepoInfo(newRepoInfo);
    setIsPinVerified(false);
  }, []);

  const verifyPin = useCallback(async (enteredPin: string) => {
    if (!pinHash) return false;
    const hashed = await hashPin(enteredPin);
    if (hashed === pinHash) {
      setIsPinVerified(true);
      return true;
    }
    return false;
  }, [pinHash]);

  const setPinHandler = useCallback(async (newPin: string) => {
    const hashed = await hashPin(newPin);
    try {
      localStorage.setItem(PIN_HASH_KEY, hashed);
    } catch {
      // non-fatal: PIN only persists for this session
    }
    setPinHash(hashed);
    setHasPin(true);
    setIsPinVerified(true);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRepoInfo(null);
    setIsPinVerified(false);
  }, []);

  const value = {
    token,
    repoInfo,
    hasPin,
    isAuthenticated: !!token && !!repoInfo,
    isPinVerified: isPinVerified,
    login,
    verifyPin,
    logout,
    setPin: setPinHandler,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}