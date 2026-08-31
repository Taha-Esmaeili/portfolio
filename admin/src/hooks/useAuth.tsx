import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { RepoInfo } from '../api/github';

const PIN_HASH_KEY = 'portfolio-admin-pin-hash';
const TOKEN_KEY = 'portfolio-admin-token';
const REPO_KEY = 'portfolio-admin-repo';

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

  // Restore session (for the current browser tab) and stored PIN hash.
  // The token lives in sessionStorage: convenient on refresh, but gone
  // once the tab closes — a deliberate security/convenience tradeoff.
  useEffect(() => {
    try {
      const storedToken = sessionStorage.getItem(TOKEN_KEY);
      const storedRepo = sessionStorage.getItem(REPO_KEY);
      if (storedToken && storedRepo) {
        setToken(storedToken);
        setRepoInfo(JSON.parse(storedRepo));
      }
      const storedPin = localStorage.getItem(PIN_HASH_KEY);
      if (storedPin) {
        setPinHash(storedPin);
        setHasPin(true);
      }
    } catch {
      // Storage unavailable; treat as a fresh session
    }
  }, []);

  const login = useCallback((newToken: string, newRepoInfo: RepoInfo) => {
    setToken(newToken);
    setRepoInfo(newRepoInfo);
    setIsPinVerified(false);
    try {
      sessionStorage.setItem(TOKEN_KEY, newToken);
      sessionStorage.setItem(REPO_KEY, JSON.stringify(newRepoInfo));
    } catch {
      // non-fatal
    }
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
    try {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(REPO_KEY);
    } catch {
      // non-fatal
    }
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