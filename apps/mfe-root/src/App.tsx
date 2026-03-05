import React from 'react';

export const App: React.FC = () => {
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <header
        style={{
          padding: '1rem 2rem',
          background: '#2c3e50',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Call Center Platform</h1>
        <p
          style={{ margin: '0.5rem 0 0 0', fontSize: '0.875rem', opacity: 0.9 }}
        >
          Orquestrando Microfrontends via Single SPA
        </p>
      </header>

      {/* Navigation */}
      <nav
        style={{
          padding: '1rem 2rem',
          background: '#34495e',
          display: 'flex',
          gap: '1rem',
        }}
      >
        <a
          href="/call-center"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            background: 'rgba(52, 152, 219, 0.3)',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}
        >
          Call Center
        </a>
        <a
          href="/legacy"
          style={{
            color: 'white',
            textDecoration: 'none',
            padding: '0.5rem 1rem',
            background: 'rgba(149, 165, 166, 0.3)',
            borderRadius: '4px',
            transition: 'background 0.2s',
          }}
        >
          Legacy
        </a>
      </nav>

      {/* Main Content Area */}
      <main style={{ padding: '2rem' }}>
        {/* MFE Shell - Sempre montado (gerencia estado global) */}
        <div id="mfe-shell"></div>

        {/* MFE Call Center - Montado quando activeWhen corresponder */}
        <div id="mfe-call-center"></div>

        {/* MFE Call Center Legacy - Montado quando activeWhen corresponder */}
        <div id="mfe-call-center-legacy"></div>
      </main>

      {/* Footer */}
      <footer
        style={{
          padding: '1rem 2rem',
          background: '#ecf0f1',
          color: '#7f8c8d',
          textAlign: 'center',
          fontSize: '0.875rem',
          marginTop: '2rem',
        }}
      >
        <p style={{ margin: 0 }}>
          Microfrontend Architecture • Single SPA • React 18 • TypeScript 5
        </p>
      </footer>
    </div>
  );
};

export default App;
