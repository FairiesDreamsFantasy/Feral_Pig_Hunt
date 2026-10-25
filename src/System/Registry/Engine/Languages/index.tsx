/**
 * System/Registry/Engine/Languages/index.tsx
 * Holds global active computer programming language settings, compiler bridges, and serialization types.
 */

export type SupportLanguageName =
  | 'Assembly'
  | 'C'
  | 'CPP'
  | 'CSharp'
  | 'Web_Assembly'
  | 'Basic'
  | 'XML'
  | 'CSV'
  | 'PHP'
  | 'SQL'
  | 'MySQL'
  | 'Rust'
  | 'R'
  | 'GO'
  | 'Cotlin'
  | 'Swift'
  | '3-DJS'
  | 'XL';

export interface LanguageRegistrySettings {
  activeLanguageBinding: SupportLanguageName;
  compileFlags: string;
  sourceTargetFolder: string;
  autoFormatOnExport: boolean;
  obfuscationEnabled: boolean;
}

export const DEFAULT_LANGUAGE_REGISTRY_SETTINGS: LanguageRegistrySettings = {
  activeLanguageBinding: 'Assembly',
  compileFlags: '-O3 -Wall -fomit-frame-pointer',
  sourceTargetFolder: 'src/System/Engine/Languages/',
  autoFormatOnExport: true,
  obfuscationEnabled: false,
};

let currentLanguageConfig: LanguageRegistrySettings = { ...DEFAULT_LANGUAGE_REGISTRY_SETTINGS };

export function getLanguageRegistryConfig(): LanguageRegistrySettings {
  return currentLanguageConfig;
}

export function updateLanguageRegistryConfig(newConfig: Partial<LanguageRegistrySettings>): LanguageRegistrySettings {
  currentLanguageConfig = { ...currentLanguageConfig, ...newConfig };
  
  // Dynamic default compile/transpilation flags mapping based on target language
  switch (currentLanguageConfig.activeLanguageBinding) {
    case 'Assembly':
      currentLanguageConfig.compileFlags = 'nasm -f elf64';
      break;
    case 'C':
      currentLanguageConfig.compileFlags = 'gcc -O3 -std=c11';
      break;
    case 'CPP':
      currentLanguageConfig.compileFlags = 'g++ -O3 -std=c++20';
      break;
    case 'Rust':
      currentLanguageConfig.compileFlags = 'cargo build --release';
      break;
    case 'GO':
      currentLanguageConfig.compileFlags = 'go build -ldflags "-s -w"';
      break;
    case 'Cotlin':
      currentLanguageConfig.compileFlags = 'kotlinc -include-runtime -d';
      break;
    case 'Swift':
      currentLanguageConfig.compileFlags = 'swiftc -O';
      break;
    default:
      currentLanguageConfig.compileFlags = '--no-compile (Script/Format Mode)';
  }

  return currentLanguageConfig;
}

export default {
  DEFAULT_LANGUAGE_REGISTRY_SETTINGS,
  getLanguageRegistryConfig,
  updateLanguageRegistryConfig,
};
