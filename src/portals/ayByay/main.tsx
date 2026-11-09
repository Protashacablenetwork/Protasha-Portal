import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AyByayPortal } from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AyByayPortal />
    </ErrorBoundary>
  </StrictMode>,
);
