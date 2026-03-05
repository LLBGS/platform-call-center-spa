import React from 'react';
import { useGlobalStore } from './store/globalStore';

export const App: React.FC = () => {
  const state = useGlobalStore();

  return (
    <div>
      <h1>MFE Shell Application</h1>
      <p>Global State & Feature Toggles Manager</p>
      <div
        style={{ marginTop: '20px', padding: '10px', background: '#f0f0f0' }}
      >
        <h3>Global State:</h3>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
};

export default App;
