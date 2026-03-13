/**
 * MFE Registry Configuration
 *
 * Este arquivo gerencia o registro dinâmico de Microfrontends baseado em
 * variáveis de ambiente. Permite adicionar/remover MFEs sem modificação de código.
 */

/**
 * Interface que define a estrutura de um MFE registrado
 */
export interface MFEConfig {
  name: string; // Nome único do MFE (ex: '@call-center-platform/mfe-call-center')
  url: string; // URL da aplicação em desenvolvimento ou nome do pacote em prod
  path: string; // Rota(s) que ativam este MFE
  domElement: string; // ID do elemento DOM onde MFE será montado
  enabled: boolean; // Se está habilitado
  alwaysActive?: boolean; // Se deve estar sempre ativo (como shell)
}

/**
 * Lê configurações de MFEs das variáveis de ambiente
 *
 * Procura por padrões como:
 * VITE_MFE_[NOME]_URL
 * VITE_MFE_[NOME]_PATH
 * VITE_MFE_[NOME]_DOM_ELEMENT
 * VITE_MFE_[NOME]_ENABLED
 */
export function loadMFEConfigFromEnv(): Record<string, MFEConfig> {
  const mfeConfigs: Record<string, MFEConfig> = {};

  // Extrair nomes únicos de MFEs das variáveis de ambiente
  const mfeNames = new Set<string>();

  Object.keys(import.meta.env).forEach((key) => {
    const match = key.match(
      /^VITE_MFE_([A-Z_]+)_(URL|PATH|DOM_ELEMENT|ENABLED|ALWAYS_ACTIVE)$/
    );
    if (match) {
      mfeNames.add(match[1]);
    }
  });

  // Construir configuração para cada MFE
  mfeNames.forEach((mfeName) => {
    const url = import.meta.env[`VITE_MFE_${mfeName}_URL`];
    const path = import.meta.env[`VITE_MFE_${mfeName}_PATH`];
    const domElement = import.meta.env[`VITE_MFE_${mfeName}_DOM_ELEMENT`];
    const enabledStr = import.meta.env[`VITE_MFE_${mfeName}_ENABLED`];
    const alwaysActiveStr = import.meta.env[
      `VITE_MFE_${mfeName}_ALWAYS_ACTIVE`
    ];

    // Validar configuração obrigatória
    if (!url || !path || !domElement) {
      console.warn(`⚠️ MFE ${mfeName} tem configuração incompleta. Pulando...`);
      return;
    }

    // Por padrão, MFEs estão habilitados (enabled pode ser undefined)
    const enabled = enabledStr === 'false' ? false : true;
    const alwaysActive = alwaysActiveStr === 'true' ? true : false;

    // Mapear nome da variável para nome de pacote (@call-center-platform/mfe-*)
    const packageName = `@call-center-platform/mfe-${mfeName
      .toLowerCase()
      .replace(/_/g, '-')}`;

    mfeConfigs[packageName] = {
      name: packageName,
      url,
      path,
      domElement,
      enabled,
      alwaysActive,
    };

    if (import.meta.env.VITE_DEBUG_MFE_LOADING) {
      console.log(`✓ MFE carregado: ${packageName}`, {
        url,
        path,
        domElement,
        enabled,
        alwaysActive,
      });
    }
  });

  return mfeConfigs;
}

/**
 * Valida ordem de ativação: shell deve ser sempre ativo
 */
export function validateMFERegistry(
  mfeConfigs: Record<string, MFEConfig>
): void {
  const shellMfe = Object.values(mfeConfigs).find(
    (config) => config.alwaysActive || config.name.includes('shell')
  );

  if (!shellMfe) {
    console.warn(
      '⚠️ Aviso: Nenhum MFE configurado como sempre ativo (shell). Isso pode causar comportamento inesperado.'
    );
  }
}

/**
 * Log formatado das configurações carregadas
 */
export function logMFERegistry(mfeConfigs: Record<string, MFEConfig>): void {
  const registeredMFEs = Object.values(mfeConfigs).filter((c) => c.enabled);

  console.log('');
  console.log(
    '═══════════════════════════════════════════════════════════════'
  );
  console.log('🔧 MFE REGISTRY - Microfrontends Registrados');
  console.log(
    '═══════════════════════════════════════════════════════════════'
  );

  registeredMFEs.forEach((config) => {
    const activeIndicator = config.alwaysActive ? '⭐' : '📦';
    console.log(`${activeIndicator} ${config.name}`);
    console.log(`   URL:        ${config.url}`);
    console.log(`   Rota:       ${config.path}`);
    console.log(`   DOM:        #${config.domElement}`);
    console.log(`   Sempre Ativo: ${config.alwaysActive ? 'Sim' : 'Não'}`);
    console.log('');
  });

  console.log(`Total de MFEs: ${registeredMFEs.length}`);
  console.log(
    '═══════════════════════════════════════════════════════════════'
  );
  console.log('');
}
