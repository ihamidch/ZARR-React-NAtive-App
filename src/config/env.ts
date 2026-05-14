import Constants from 'expo-constants';
import { Platform } from 'react-native';

const fromExpoConfig =
  (Constants?.expoConfig?.extra as { apiBaseUrl?: string } | undefined)
    ?.apiBaseUrl ||
  (Constants?.manifestExtra as { apiBaseUrl?: string } | undefined)
    ?.apiBaseUrl ||
  'https://backend-two-weld-46.vercel.app';

function deriveHostFromExpo(): string | null {
  const candidates: Array<string | undefined> = [
    (Constants?.expoConfig as any)?.hostUri,
    (Constants as any)?.expoGoConfig?.hostUri,
    (Constants?.manifest as any)?.debuggerHost,
    (Constants?.manifest as any)?.hostUri,
  ];
  for (const c of candidates) {
    if (typeof c === 'string' && c.length > 0) {
      const host = c.split(':')[0];
      if (host && host !== 'localhost') return host;
    }
  }
  return null;
}

const PORT = 5000;

function defaultBaseUrl(): string {
  const host = deriveHostFromExpo();
  if (host) return `http://${host}:${PORT}`;
  if (Platform.OS === 'android') return `http://10.0.2.2:${PORT}`;
  return `http://localhost:${PORT}`;
}

export const API_BASE_URL: string =
  (typeof fromExpoConfig === 'string' && fromExpoConfig) || defaultBaseUrl();
