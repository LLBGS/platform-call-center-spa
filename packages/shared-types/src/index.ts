export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Call {
  id: string;
  customerId: string;
  agentId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'waiting' | 'active' | 'completed' | 'missed';
}

export interface FeatureToggle {
  key: string;
  enabled: boolean;
  description?: string;
}

export interface GlobalAppState {
  isDarkMode: boolean;
  currentUser: User | null;
  featureToggles: Record<string, boolean>;
}
