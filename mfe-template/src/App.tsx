import type { User } from '@call-center-platform/shared-types';
import { Button } from '@call-center-platform/shared-ui';
import { formatDate } from '@call-center-platform/shared-utils';
import React from 'react';

const App: React.FC = () => {
  const [count, setCount] = React.useState(0);

  // Exemplo usando tipos compartilhados
  const exampleUser: User = {
    id: '1',
    name: 'João Silva',
    email: 'joao@example.com',
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'system-ui, sans-serif' }}>
      <h2>🎉 MFE {Nome}</h2>

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: '#f0f0f0',
          borderRadius: '4px',
        }}
      >
        <h3>Bem-vindo!</h3>
        <p>Este é um novo Microfrontend integrado à plataforma.</p>

        <div style={{ marginTop: '1rem' }}>
          <label>
            Contador: <strong>{count}</strong>
          </label>
          <br />
          <Button onClick={() => setCount(count + 1)}>Incrementar</Button>
        </div>

        <div style={{ marginTop: '1rem', fontSize: '0.875rem', color: '#666' }}>
          <p>
            <strong>Usuário de exemplo:</strong> {exampleUser.name} (
            {exampleUser.email})
          </p>
          <p>
            <strong>Data formatada:</strong> {formatDate(new Date())}
          </p>
        </div>
      </div>

      <div style={{ marginTop: '2rem', fontSize: '0.875rem', color: '#999' }}>
        <h4>Resources Usados:</h4>
        <ul>
          <li>
            ✅ Componentes compartilhados (@call-center-platform/shared-ui)
          </li>
          <li>
            ✅ Utilitários compartilhados (@call-center-platform/shared-utils)
          </li>
          <li>✅ Types compartilhados (@call-center-platform/shared-types)</li>
          <li>✅ Single SPA para microfrontend</li>
          <li>✅ React 18 com TypeScript</li>
        </ul>
      </div>
    </div>
  );
};

export default App;
