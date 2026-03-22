import type {
  FeatureToggle,
  FeatureToggleSnapshot,
} from '@call-center-platform/shared-types';

import type { FeatureToggleAdapter } from './featureToggleAdapter';

interface StoppableFeatureToggleAdapter extends FeatureToggleAdapter {
  stop?: () => void;
}

export class HybridFeatureToggleAdapter implements FeatureToggleAdapter {
  private hasLoggedFallback = false;

  constructor(
    private readonly remoteAdapter: FeatureToggleAdapter,
    private readonly fallbackAdapter: FeatureToggleAdapter
  ) {}

  async setUserIdContext(userId: string | null): Promise<void> {
    await this.tryRemote(
      async () => {
        if (this.remoteAdapter.setUserIdContext) {
          await this.remoteAdapter.setUserIdContext(userId);
        }
      },
      async () => {
        if (this.fallbackAdapter.setUserIdContext) {
          await this.fallbackAdapter.setUserIdContext(userId);
        }
      }
    );
  }

  async getAll(): Promise<FeatureToggleSnapshot> {
    try {
      const snapshot = await this.remoteAdapter.getAll();

      console.info('[mfe-shell][feature-source]', {
        source: 'unleash',
        featureKey: 'componente-allow-list',
        featureValue: snapshot['componente-allow-list'] ?? null,
        keys: Object.keys(snapshot),
      });

      return snapshot;
    } catch (error) {
      this.logFallback(error);
      const fallbackSnapshot = await this.fallbackAdapter.getAll();

      console.info('[mfe-shell][feature-source]', {
        source: 'local-fallback',
        featureKey: 'componente-allow-list',
        featureValue: fallbackSnapshot['componente-allow-list'] ?? null,
        keys: Object.keys(fallbackSnapshot),
      });

      return fallbackSnapshot;
    }
  }

  async getByKey(key: string): Promise<boolean> {
    return this.tryRemote(
      () => this.remoteAdapter.getByKey(key),
      () => this.fallbackAdapter.getByKey(key)
    );
  }

  async list(): Promise<FeatureToggle[]> {
    return this.tryRemote(
      () => this.remoteAdapter.list(),
      () => this.fallbackAdapter.list()
    );
  }

  stop(): void {
    const remote = this.remoteAdapter as StoppableFeatureToggleAdapter;

    remote.stop?.();
  }

  private async tryRemote<T>(
    remoteCall: () => Promise<T>,
    fallbackCall: () => Promise<T>
  ): Promise<T> {
    try {
      return await remoteCall();
    } catch (error) {
      this.logFallback(error);
      return fallbackCall();
    }
  }

  private logFallback(error: unknown): void {
    if (this.hasLoggedFallback) {
      return;
    }

    this.hasLoggedFallback = true;
    console.warn(
      'Unleash indisponivel. Aplicando fallback local de feature toggles.',
      error
    );
  }
}
