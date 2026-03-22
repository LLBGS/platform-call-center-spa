export interface UnleashFrontendConfig {
  url: string;
  clientKey: string;
  appName: string;
  environment: string;
  timeoutMs: number;
  refreshInterval: number;
}

const DEFAULT_APP_NAME = 'mfe-shell';
const DEFAULT_ENVIRONMENT = 'development';
const DEFAULT_TIMEOUT_MS = 1000;
const DEFAULT_REFRESH_INTERVAL = 15;

const parsePositiveInteger = (
  value: string | undefined,
  fallback: number
): number => {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }

  return Math.floor(parsed);
};

const getTrimmedEnvValue = (value: string | undefined): string | null => {
  if (!value) {
    return null;
  }

  const normalized = value.trim();

  return normalized.length > 0 ? normalized : null;
};

export const getUnleashFrontendConfig = (): UnleashFrontendConfig | null => {
  const url =
    getTrimmedEnvValue(import.meta.env.VITE_UNLEASH_FRONTEND_API_URL) ??
    getTrimmedEnvValue(import.meta.env.VITE_UNLEASH_API_URL);

  const clientKey =
    getTrimmedEnvValue(import.meta.env.VITE_UNLEASH_FRONTEND_TOKEN) ??
    getTrimmedEnvValue(import.meta.env.VITE_UNLEASH_CLIENT_KEY);

  if (!url || !clientKey) {
    return null;
  }

  return {
    url,
    clientKey,
    appName:
      getTrimmedEnvValue(import.meta.env.VITE_UNLEASH_APP_NAME) ??
      DEFAULT_APP_NAME,
    environment:
      getTrimmedEnvValue(import.meta.env.VITE_UNLEASH_ENVIRONMENT) ??
      DEFAULT_ENVIRONMENT,
    timeoutMs: parsePositiveInteger(
      import.meta.env.VITE_UNLEASH_TIMEOUT_MS,
      DEFAULT_TIMEOUT_MS
    ),
    refreshInterval: parsePositiveInteger(
      import.meta.env.VITE_UNLEASH_REFRESH_INTERVAL,
      DEFAULT_REFRESH_INTERVAL
    ),
  };
};
