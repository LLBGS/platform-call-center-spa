import type {
  FeatureToggle,
  FeatureToggleSnapshot,
} from '@call-center-platform/shared-types';
import { UnleashClient } from 'unleash-proxy-client';

import type { UnleashFrontendConfig } from '../config/unleashConfig';

import type { FeatureToggleAdapter } from './featureToggleAdapter';

type UnleashToggle = {
  name?: string;
  enabled?: boolean;
};

export class UnleashFeatureToggleAdapter implements FeatureToggleAdapter {
  private readonly client: UnleashClient;

  private started = false;

  private readyPromise: Promise<void> | null = null;

  constructor(private readonly config: UnleashFrontendConfig) {
    this.client = new UnleashClient({
      url: config.url,
      clientKey: config.clientKey,
      appName: config.appName,
      environment: config.environment,
      refreshInterval: config.refreshInterval,
    });
  }

  async setUserIdContext(userId: string | null): Promise<void> {
    await this.ensureReady();

    if (!userId) {
      await Promise.resolve(this.client.removeContextField('userId'));
      return;
    }

    await Promise.resolve(this.client.updateContext({ userId }));
  }

  async getAll(): Promise<FeatureToggleSnapshot> {
    await this.ensureReady();

    const toggles = this.client.getAllToggles();

    const snapshot = toggles.reduce<FeatureToggleSnapshot>(
      (snapshot, toggle) => {
        const currentToggle = toggle as UnleashToggle;

        if (typeof currentToggle.name === 'string') {
          snapshot[currentToggle.name] = currentToggle.enabled ?? false;
        }

        return snapshot;
      },
      {}
    );

    console.info('[mfe-shell][unleash] snapshot', {
      featureKey: 'componente-allow-list',
      featureValue: snapshot['componente-allow-list'] ?? null,
      keys: Object.keys(snapshot),
    });

    return snapshot;
  }

  async getByKey(key: string): Promise<boolean> {
    await this.ensureReady();

    return this.client.isEnabled(key);
  }

  async list(): Promise<FeatureToggle[]> {
    const snapshot = await this.getAll();

    return Object.entries(snapshot).map(([key, enabled]) => ({
      key,
      enabled,
    }));
  }

  stop(): void {
    if (!this.started) {
      return;
    }

    this.client.stop();
    this.started = false;
    this.readyPromise = null;
  }

  private async ensureReady(): Promise<void> {
    if (!this.started) {
      this.client.start();
      this.started = true;
    }

    if (!this.readyPromise) {
      this.readyPromise = this.waitForReady();
    }

    await this.readyPromise;
  }

  private waitForReady(): Promise<void> {
    if (this.client.isReady()) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const timeoutId = window.setTimeout(() => {
        this.cleanupListeners(handleReady, handleError);
        reject(
          new Error(
            `Unleash frontend nao ficou pronto em ${this.config.timeoutMs}ms.`
          )
        );
      }, this.config.timeoutMs);

      const handleReady = (): void => {
        window.clearTimeout(timeoutId);
        this.cleanupListeners(handleReady, handleError);
        resolve();
      };

      const handleError = (error?: unknown): void => {
        window.clearTimeout(timeoutId);
        this.cleanupListeners(handleReady, handleError);
        reject(error instanceof Error ? error : new Error('Erro no Unleash.'));
      };

      this.client.on('ready', handleReady);
      this.client.on('error', handleError);
    });
  }

  private cleanupListeners(
    handleReady: () => void,
    handleError: (error?: unknown) => void
  ): void {
    this.client.off('ready', handleReady);
    this.client.off('error', handleError);
  }
}
