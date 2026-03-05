import { registerApplication, start } from 'single-spa';

type SystemJsLoader = {
  import: (moduleName: string) => Promise<unknown>;
};

// Configuração de ambiente
const isDevelopment = import.meta.env.DEV;

// URLs dos microfrontends em desenvolvimento
const DEV_URLS = {
  shell: 'http://localhost:5174',
  callCenter: 'http://localhost:5175',
  callCenterLegacy: 'http://localhost:5176',
};

// Função helper para carregar MFEs em desenvolvimento
const loadMFE = (name: string, devUrl: string) => {
  if (isDevelopment) {
    // Em dev, Vite expõe ESM nativo; use import() em vez de System.import
    return () => import(/* @vite-ignore */ `${devUrl}/src/index.tsx`);
  }

  const system = (globalThis as typeof globalThis & { System?: SystemJsLoader })
    .System;

  // Em produção, carrega do build
  return () => {
    if (!system) {
      throw new Error('SystemJS não está disponível no ambiente de produção.');
    }

    return system.import(name);
  };
};

// Registrar MFE Shell - Sempre ativo (gerencia estado global)
registerApplication(
  '@call-center-platform/mfe-shell',
  loadMFE('@call-center-platform/mfe-shell', DEV_URLS.shell),
  () => true
);

// Registrar MFE Call Center - Nova interface
registerApplication(
  '@call-center-platform/mfe-call-center',
  loadMFE('@call-center-platform/mfe-call-center', DEV_URLS.callCenter),
  (location: Location) =>
    location.pathname === '/' || location.pathname.startsWith('/call-center')
);

// Registrar MFE Call Center Legacy - Interface legada
registerApplication(
  '@call-center-platform/mfe-call-center-legacy',
  loadMFE(
    '@call-center-platform/mfe-call-center-legacy',
    DEV_URLS.callCenterLegacy
  ),
  (location: Location) => location.pathname.startsWith('/legacy')
);

// Iniciar Single SPA
start({
  urlRerouteOnly: true,
});

console.log('🚀 Single SPA Root Config initialized');
console.log('📦 Registered applications:', [
  '@call-center-platform/mfe-shell',
  '@call-center-platform/mfe-call-center',
  '@call-center-platform/mfe-call-center-legacy',
]);
