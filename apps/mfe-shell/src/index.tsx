import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';
import { AppStateProvider } from './app-state/providers/AppStateProvider';
import './style.css';

const RootApp: React.FC = () => (
  <AppStateProvider>
    <App />
  </AppStateProvider>
);

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: RootApp,
  errorBoundary: (error: Error) => (
    <div>
      <h1>MFE Shell Error</h1>
      <pre>{error.message}</pre>
    </div>
  ),
  domElementGetter: () => document.getElementById('mfe-shell') as HTMLElement,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
export { RootApp };
