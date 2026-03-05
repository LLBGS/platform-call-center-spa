import React from 'react';
import ReactDOMClient from 'react-dom/client';
import singleSpaReact from 'single-spa-react';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOMClient,
  rootComponent: App,
  errorBoundary: (error: Error) => (
    <div>
      <h1>MFE Error</h1>
      <pre>{error.message}</pre>
    </div>
  ),
  domElementGetter: () =>
    document.getElementById('mfe-call-center') as HTMLElement,
});

export const bootstrap = lifecycles.bootstrap;
export const mount = lifecycles.mount;
export const unmount = lifecycles.unmount;
