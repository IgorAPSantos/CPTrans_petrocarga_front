import 'react';

// Extensão das propriedades HTML para suportar atributos do VLibras
declare module 'react' {
  interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    vw?: string | boolean;
    'vw-access-button'?: string | boolean;
    'vw-plugin-wrapper'?: string | boolean;
  }
}
