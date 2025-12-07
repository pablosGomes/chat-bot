import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configuração global do widget
window.CintiaWidget = {
  init: function(config = {}) {
    // Criar container para o widget se não existir
    let container = document.getElementById('cintia-widget-container');
    
    if (!container) {
      container = document.createElement('div');
      container.id = 'cintia-widget-container';
      document.body.appendChild(container);
    }

    // Aplicar configurações
    if (config.apiUrl) {
      window.__CINTIA_API_URL__ = config.apiUrl;
    }

    // Renderizar o widget
    const root = ReactDOM.createRoot(container);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );

    console.log('🤖 cint.ia widget inicializado!');
  },
  
  destroy: function() {
    const container = document.getElementById('cintia-widget-container');
    if (container) {
      container.remove();
    }
  }
};

// Auto-inicialização se o atributo data-auto-init estiver presente
document.addEventListener('DOMContentLoaded', () => {
  const script = document.querySelector('script[data-cintia-auto-init]');
  if (script) {
    const apiUrl = script.getAttribute('data-api-url');
    window.CintiaWidget.init({ apiUrl });
  }
});

