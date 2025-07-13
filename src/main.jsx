import React from 'react';
import ReactDOM from 'react-dom/client';
import './App.css';
import App from './App';

// Error boundary for better error handling
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          fontFamily: 'system-ui, sans-serif',
          textAlign: 'center',
          padding: '20px'
        }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>
            🚀 RecruitAI
          </h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '2rem', opacity: 0.9 }}>
            Something went wrong, but we're on it!
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '12px 24px',
              fontSize: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)'
            }}
          >
            Reload Application
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// Create root and render app
const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);

// Performance monitoring
if (typeof window !== 'undefined') {
  // Log performance metrics
  window.addEventListener('load', () => {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0];
      console.log('App Load Time:', perfData.loadEventEnd - perfData.fetchStart, 'ms');
    }
  });

  // Service worker registration for PWA capabilities
  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  }
}

