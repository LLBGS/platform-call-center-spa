# 💡 Exemplos Práticos

## 1. Usar Global State em um MFE

```typescript
// apps/mfe-call-center/src/components/Dashboard.tsx
import { useGlobalStore } from '@call-center-platform/mfe-shell';
import { formatDate } from '@call-center-platform/shared-utils';

export const Dashboard = () => {
  const { currentUser, isDarkMode, setCurrentUser } = useGlobalStore();

  return (
    <div style={{ background: isDarkMode ? '#1a1a1a' : '#fff' }}>
      <h1>Dashboard</h1>
      {currentUser && (
        <p>Bem-vindo, {currentUser.name}!</p>
      )}
      <p>Data: {formatDate(new Date())}</p>
      <button onClick={() => setCurrentUser(null)}>
        Logout
      </button>
    </div>
  );
};
```

## 2. Criar um Novo Componente Compartilhado

```typescript
// packages/shared-ui/src/Badge.tsx
import React from 'react';

export interface BadgeProps {
  label: string;
  color?: 'green' | 'red' | 'blue';
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({ 
  label, 
  color = 'blue',
  size = 'md'
}) => {
  const colors = {
    green: '#4ade80',
    red: '#f87171',
    blue: '#3b82f6',
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '12px' },
    md: { padding: '4px 12px', fontSize: '14px' },
    lg: { padding: '6px 16px', fontSize: '16px' },
  };

  return (
    <span style={{
      display: 'inline-block',
      background: colors[color],
      color: '#fff',
      borderRadius: '20px',
      ...sizes[size],
    }}>
      {label}
    </span>
  );
};
```

Depois exportar:

```typescript
// packages/shared-ui/src/index.ts
export { Button } from './Button';
export { Badge } from './Badge';
export type { BadgeProps } from './Badge';
```

Usar em qualquer MFE:

```typescript
import { Badge } from '@call-center-platform/shared-ui';

<Badge label="Active" color="green" size="lg" />
```

## 3. Adicionar Tipo Compartilhado

```typescript
// packages/shared-types/src/index.ts
export interface Call {
  id: string;
  customerId: string;
  agentId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'waiting' | 'active' | 'completed' | 'missed';
  notes?: string;
}

export interface CallCenter {
  id: string;
  name: string;
  location: string;
  activeAgents: number;
  totalAgents: number;
}
```

Usar:

```typescript
import type { Call, CallCenter } from '@call-center-platform/shared-types';

const currentCall: Call = {
  id: 'call-123',
  customerId: 'cust-456',
  agentId: 'agent-789',
  startTime: new Date(),
  status: 'active',
};

const callCenter: CallCenter = {
  id: 'cc-001',
  name: 'São Paulo',
  location: 'SP',
  activeAgents: 25,
  totalAgents: 50,
};
```

## 4. Integração com Firebase (MFE Shell)

```typescript
// apps/mfe-shell/src/services/firebase.ts
import { initializeApp } from 'firebase/app';
import { getRemoteConfig, getValue } from 'firebase/remote-config';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  // ... mais config
};

const app = initializeApp(firebaseConfig);
const remoteConfig = getRemoteConfig(app);

export const getFeatureToggle = async (key: string): Promise<boolean> => {
  try {
    const value = getValue(remoteConfig, key);
    return value.asBoolean();
  } catch (error) {
    console.error(`Erro ao obter feature toggle ${key}:`, error);
    return false;
  }
};

export const initFirebaseRemoteConfig = async () => {
  try {
    remoteConfig.settings.minimumFetchIntervalMillis = 3600000;
    await remoteConfig.fetchAndActivate();
  } catch (error) {
    console.error('Erro ao inicializar Remote Config:', error);
  }
};
```

Usar em MFE:

```typescript
import { useGlobalStore } from '@call-center-platform/mfe-shell';
import { getFeatureToggle } from './services/firebase';

export const FeatureComponent = () => {
  const { featureToggles, setFeatureToggle } = useGlobalStore();

  React.useEffect(() => {
    const loadFeatures = async () => {
      const newCallCenterEnabled = await getFeatureToggle('new_call_center');
      setFeatureToggle('new_call_center', newCallCenterEnabled);
    };
    loadFeatures();
  }, []);

  if (!featureToggles['new_call_center']) {
    return <LegacyCallCenter />;
  }

  return <NewCallCenter />;
};
```

## 5. Testar um Utility

```typescript
// packages/shared-utils/src/formatDate.test.ts
import { describe, it, expect } from 'vitest';
import { formatDate, formatTime } from './index';

describe('Date Utils', () => {
  it('should format date in pt-BR locale', () => {
    const date = new Date('2024-03-05T15:30:00');
    expect(formatDate(date)).toBe('05/03/2024');
  });

  it('should format time in pt-BR locale', () => {
    const date = new Date('2024-03-05T15:30:45');
    const time = formatTime(date);
    expect(time).toContain('15:30:45');
  });

  it('should handle different dates', () => {
    expect(formatDate(new Date('2024-01-01'))).toBe('01/01/2024');
    expect(formatDate(new Date('2024-12-31'))).toBe('31/12/2024');
  });
});
```

Rodar com:
```bash
yarn workspace @call-center-platform/shared-utils test
```

## 6. Hook Customizado para Feature Toggle

```typescript
// apps/mfe-shell/src/hooks/useFeatureToggle.ts
import { useGlobalStore } from '../store/globalStore';
import { useEffect } from 'react';
import { getFeatureToggle } from '../services/firebase';

export const useFeatureToggle = (featureKey: string): boolean => {
  const { featureToggles, setFeatureToggle } = useGlobalStore();

  useEffect(() => {
    if (!(featureKey in featureToggles)) {
      const loadFeature = async () => {
        const enabled = await getFeatureToggle(featureKey);
        setFeatureToggle(featureKey, enabled);
      };
      loadFeature();
    }
  }, [featureKey, featureToggles, setFeatureToggle]);

  return featureToggles[featureKey] ?? false;
};
```

Usar:

```typescript
import { useFeatureToggle } from '@call-center-platform/mfe-shell';

export const CallCenterApp = () => {
  const hasNewUI = useFeatureToggle('new_call_center_ui');

  return hasNewUI ? <NewUI /> : <LegacyUI />;
};
```

## 7. Estrutura de Componente MFE Completo

```typescript
// apps/mfe-call-center/src/components/CallQueue.tsx
import React, { useState, useEffect } from 'react';
import { useGlobalStore } from '@call-center-platform/mfe-shell';
import { Badge, Button } from '@call-center-platform/shared-ui';
import type { Call } from '@call-center-platform/shared-types';
import { formatTime } from '@call-center-platform/shared-utils';

export const CallQueue: React.FC = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const { currentUser } = useGlobalStore();

  useEffect(() => {
    // Simular carregamento de chamadas
    const mockCalls: Call[] = [
      {
        id: '1',
        customerId: 'cust-001',
        startTime: new Date(),
        status: 'waiting',
      },
      {
        id: '2',
        customerId: 'cust-002',
        agentId: currentUser?.id,
        startTime: new Date(Date.now() - 300000),
        status: 'active',
      },
    ];
    setCalls(mockCalls);
  }, [currentUser]);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Fila de Atendimento</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Status</th>
            <th>Duração</th>
            <th>Ação</th>
          </tr>
        </thead>
        <tbody>
          {calls.map((call) => (
            <tr key={call.id}>
              <td>{call.id}</td>
              <td>{call.customerId}</td>
              <td>
                <Badge
                  label={call.status}
                  color={
                    call.status === 'active'
                      ? 'green'
                      : call.status === 'waiting'
                        ? 'blue'
                        : 'red'
                  }
                />
              </td>
              <td>{formatTime(call.startTime)}</td>
              <td>
                <Button>
                  {call.status === 'waiting' ? 'Atender' : 'Finalizar'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## 8. Configurar Variáveis de Ambiente

```bash
# .env.local
VITE_API_URL=http://localhost:3000
VITE_FIREBASE_API_KEY=xxxxx
VITE_FIREBASE_PROJECT_ID=xxxxx
```

Usar nos componentes:

```typescript
const apiUrl = import.meta.env.VITE_API_URL;

const response = await fetch(`${apiUrl}/calls`);
```

---

**Dúvidas?** Consulte `ARCHITECTURE.md` ou `DEVELOPMENT.md` para mais detalhes!
