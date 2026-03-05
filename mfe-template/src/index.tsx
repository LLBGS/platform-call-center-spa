import React from 'react';
import ReactDOM from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient: ReactDOM,
  rootComponent: App,
  errorBoundary(error: Error, errorInfo: unknown, props: unknown) {
    console.error('Erro no MFE {nome}:', error, errorInfo);
    return (
      <div style={{ padding: '2rem', color: 'red' }}>
        <h2>❌ Erro ao carregar MFE {nome}</h2>
        <p>{error.message}</p>
      </div>
    );
  },
  domElementGetter: () => {
    const element = document.getElementById('mfe-{nome}');
    if (!element) {
      throw new Error('DOM element #mfe-{nome} não encontrado');
    }
    return element;
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
