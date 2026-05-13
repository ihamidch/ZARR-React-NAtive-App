import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  ApiUser,
  TOKEN_KEY,
  authApi,
  extractError,
} from '../services/api';

const USER_KEY = 'zarr:auth_user';

type AuthState = {
  user: ApiUser | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (input: {
    name: string;
    email: string;
    password: string;
    phone?: string;
  }) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (input: { name?: string; phone?: string }) => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const persistSession = useCallback(
    async (next: { user: ApiUser; token: string }) => {
      setUser(next.user);
      setToken(next.token);
      await AsyncStorage.multiSet([
        [TOKEN_KEY, next.token],
        [USER_KEY, JSON.stringify(next.user)],
      ]);
    },
    [],
  );

  const clearSession = useCallback(async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const [[, storedToken], [, storedUser]] =
          await AsyncStorage.multiGet([TOKEN_KEY, USER_KEY]);
        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
            } catch {
              // ignore corrupt entry
            }
          }
          try {
            const { user: fresh } = await authApi.me();
            setUser(fresh);
            await AsyncStorage.setItem(USER_KEY, JSON.stringify(fresh));
          } catch {
            // token may be expired or backend offline — keep cached user
          }
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await authApi.login({ email, password });
        await persistSession(res);
      } catch (err) {
        throw new Error(extractError(err).message);
      }
    },
    [persistSession],
  );

  const signUp = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      phone?: string;
    }) => {
      try {
        const res = await authApi.register(input);
        await persistSession(res);
      } catch (err) {
        throw new Error(extractError(err).message);
      }
    },
    [persistSession],
  );

  const signOut = useCallback(async () => {
    await clearSession();
  }, [clearSession]);

  const updateProfile = useCallback(
    async (input: { name?: string; phone?: string }) => {
      try {
        const { user: updated } = await authApi.updateMe(input);
        setUser(updated);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(updated));
      } catch (err) {
        throw new Error(extractError(err).message);
      }
    },
    [],
  );

  const refresh = useCallback(async () => {
    try {
      const { user: fresh } = await authApi.me();
      setUser(fresh);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(fresh));
    } catch {
      // silent
    }
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      user,
      token,
      isLoading,
      isAuthenticated: Boolean(token && user),
      signIn,
      signUp,
      signOut,
      updateProfile,
      refresh,
    }),
    [user, token, isLoading, signIn, signUp, signOut, updateProfile, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthState => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
