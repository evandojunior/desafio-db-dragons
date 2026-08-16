const FALLBACK_API_BASE_URL = 'https://5c4b2a47aa8ee500142b4887.mockapi.io/api/v1';

export const env = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? FALLBACK_API_BASE_URL,
} as const;
