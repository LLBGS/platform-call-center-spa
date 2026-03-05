import { registerApplication, start } from 'single-spa';
import {
  loadMFEConfigFromEnv,
  logMFERegistry,
  validateMFERegistry,
  type MFEConfig,
} from './mfe-registry.config';

type SystemJsLoader = {
  import: (moduleName: string) => Promise<unknown>;
};

// Configuração de ambiente
const isDevelopment = import.meta.env.DEV;

/**
 * Função helper para carregar MFEs em desenvolvimento ou produção
 *
 * Em desenvolvimento: usa import() dinâmico do Vite
 * Em produção: usa SystemJS para carregar módulos publicados
 */
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

/**
 * Converte string de caminho em função activeWhen
 * Exemplo: '/call-center' → function que retorna true quando pathname começa com '/call-center'
 */
const createActiveWhenFunction = (path: string) => {
  if (path === '/') {
    // Shell é sempre ativo
    return () => true;
  }

  if (path.includes('|')) {
    // Múltiplas rotas separadas por |
    const paths = path.split('|').map((p) => p.trim());
    return (location: Location) =>
      paths.some(
        (p) => location.pathname === p || location.pathname.startsWith(p)
      );
  }

  // Rota única
  return (location: Location) =>
    location.pathname === path || location.pathname.startsWith(path);
};

/**
 * REGISTRO DINÂMICO DE MFEs
 *
 * Carrega todas as configurações de MFEs do arquivo .env
 * Permite adicionar/remover MFEs sem modificar este código
 */

// Carregar configurações dos MFEs das variáveis de ambiente
const mfeConfigs = loadMFEConfigFromEnv();

// Validar registry (avisos sobre configuração)
validateMFERegistry(mfeConfigs);

// Registrar cada MFE configurado
Object.values(mfeConfigs).forEach((config: MFEConfig) => {
  if (!config.enabled) {
    console.log(`⊘ MFE desabilitado: ${config.name}`);
    return;
  }

  // Single-SPA v4 - Usar 3 parâmetros (name, app, activeWhen)
  registerApplication(
    config.name,
    loadMFE(config.name, config.url),
    createActiveWhenFunction(config.path)
  );
});

// Iniciar Single SPA
start({
  urlRerouteOnly: true,
});

// Log das configurações
logMFERegistry(mfeConfigs);

console.log('✅ Single SPA Root Config initialized');
