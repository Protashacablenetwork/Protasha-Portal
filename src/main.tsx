import React, { Component, ErrorInfo, ReactNode, Suspense, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  clearTrackFromCurrentUrl,
  extractTrackTicketIdFromLocation
} from './components/TicketTrackingHelpers';
import { GlobalFeedbackHost } from './components/GlobalFeedbackHost';
import { Language } from './types';
import { safeStorage } from './utils/safeStorage';
import './index.css';

import App from './App.tsx';

const loadPublicTicketTracker = () =>
  import('./components/PublicTicketTracker').then((m) => ({ default: m.PublicTicketTracker }));

const PublicTicketTracker = React.lazy(loadPublicTicketTracker);

// Self-heal once if a lazy chunk fails to load transiently on mobile networks or right after deploy
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event: Event) => {
    try {
      const retryKey = 'protyasha_chunk_reload_at';
      const last = Number(sessionStorage.getItem(retryKey) || '0');
      if (Date.now() - last > 15000) {
        sessionStorage.setItem(retryKey, String(Date.now()));
        event.preventDefault();
        window.location.reload();
      }
    } catch {}
  });
}

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[React ErrorBoundary Caught Error]:', error, errorInfo);
    // Ensure splash screen is hidden if error happens during mount
    document.body.classList.add('app-ready');
  }

  private handleReset = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f8fafc',
          padding: '24px',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '480px',
            width: '100%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e2e8f0',
            textAlign: 'center'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              backgroundColor: '#fee2e2',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#dc2626',
              fontSize: '28px'
            }}>
              ⚠️
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', marginBottom: '12px' }}>
              সিস্টেম চালু করতে সমস্যা হয়েছে
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', marginBottom: '20px' }}>
              অ্যাপটি লোড করার সময় সাময়িক একটি ত্রুটি ঘটেছে। নিচের বোতামে ক্লিক করে আবার চেষ্টা করুন।
            </p>
            {this.state.error && (
              <div style={{
                backgroundColor: '#f1f5f9',
                borderRadius: '12px',
                padding: '12px',
                fontSize: '12px',
                color: '#334155',
                textAlign: 'left',
                marginBottom: '24px',
                overflowX: 'auto',
                fontFamily: 'monospace'
              }}>
                {this.state.error.message || String(this.state.error)}
              </div>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{
                  backgroundColor: '#e52e2e',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '14px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                পুনরায় চেষ্টা করুন
              </button>
              <button
                onClick={this.handleReset}
                style={{
                  backgroundColor: '#f1f5f9',
                  color: '#475569',
                  border: '1px solid #cbd5e1',
                  padding: '12px 20px',
                  borderRadius: '14px',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                ক্যাশ রিমুভ ও রিলোড
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const RootRouter: React.FC = () => {
  const [standaloneTrackId, setStandaloneTrackId] = useState<string | null>(() =>
    extractTrackTicketIdFromLocation()
  );

  useEffect(() => {
    const syncFromUrl = () => {
      const nextId = extractTrackTicketIdFromLocation();
      if (nextId) {
        setStandaloneTrackId(nextId);
      }
    };
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  if (standaloneTrackId) {
    const savedLang = (safeStorage.getItem('protyasha_lang') as Language) || 'bn';
    return (
      <Suspense fallback={null}>
        <PublicTicketTracker
          ticketId={standaloneTrackId}
          lang={savedLang}
          onExitToApp={() => {
            clearTrackFromCurrentUrl();
            setStandaloneTrackId(null);
          }}
        />
      </Suspense>
    );
  }

  return (
    <Suspense fallback={null}>
      <App />
    </Suspense>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <ErrorBoundary>
      <RootRouter />
      <GlobalFeedbackHost />
    </ErrorBoundary>
  );
}
