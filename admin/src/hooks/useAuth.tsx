import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { RepoInfo } from '../api/github';

interface AuthContextType {
  token: string | null;
  repoInfo: RepoInfo | null;
  pin: string | null;
  isAuthenticated: boolean;
  isPinVerified: boolean;
  login: (token: string, repoInfo: RepoInfo) => void;
  verifyPin: (pin: string) => boolean;
  logout: () => void;
  setPin: (pin: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; branch: string } | null>(null);
  const [pin, setPin] = useState<string | null>(null);
  const [isPinVerified, setIsPinVerified] = useState(false);

  const login = useCallback((newToken: string, newRepoInfo: RepoInfo) => {
    setToken(newToken);
    setRepoInfo(newRepoInfo);
    setIsPinVerified(false);
  }, []);

  const verifyPin = useCallback((enteredPin: string) => {
    if (pin && enteredPin === pin) {
      setIsPinVerified(true);
      return true;
    }
    return false;
  }, [pin]);

  const setPinHandler = useCallback((newPin: string) => {
    setPin(newPin);
    setIsPinVerified(false);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setRepoInfo(null);
    setPin(null);
    setIsPinVerified(false);
  }, []);

  const value = {
    token,
    repoInfo,
    pin,
    isAuthenticated: !!token && !!repoInfo,
    isPinVerified: !pin || isPinVerified,
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