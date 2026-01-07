'use client';

import Script from 'next/script';
import { useEffect } from 'react';

export default function VLibrasWidget() {
  useEffect(() => {
    // Função para inicializar o widget após o script carregar
    const initVLibras = () => {
      // @ts-ignore
      if (window.VLibras) {
        // @ts-ignore
        new window.VLibras.Widget('https://vlibras.gov.br/app');
      }
    };

    // Se o script já carregou, inicializa imediatamente
    // @ts-ignore
    if (window.VLibras) {
      initVLibras();
    }
  }, []);

  return (
    <>
      <Script
        src="https://vlibras.gov.br/app/vlibras-plugin.js"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-ignore
          if (window.VLibras) {
            // @ts-ignore
            new window.VLibras.Widget('https://vlibras.gov.br/app');
          }
        }}
      />
      <div vw="true" className="enabled">
        <div vw-access-button="true" className="active"></div>
        <div vw-plugin-wrapper="true">
          <div className="vw-plugin-top-wrapper"></div>
        </div>
      </div>
    </>
  );
}
