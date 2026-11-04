import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './app/App';
import './index.css';
import { useSqlStore } from './stores/useSqlStore';
import { useMissionStore } from './stores/useMissionStore';
import { useUserStore } from './stores/useUserStore';
import { useWorldStore } from './stores/useWorldStore';

// Expose stores for automated testing and e2e validation
if (typeof window !== 'undefined') {
  (window as any).__queryquest = {
    useSqlStore,
    useMissionStore,
    useUserStore,
    useWorldStore,
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
