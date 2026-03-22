import './App.css';

import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './app/store.js';
import { Loader2 } from 'lucide-react';

import { ThemeProvider } from './context/ThemeProvider.jsx';
import AppRoutes from './routes/AppRoutes.jsx';
import { useSessionRestore } from './hooks/auth/useSessionRestore.js';

const queryClient = new QueryClient();

// Phase 2 — Fix 2: Session restore.
// Placed in a child component (SessionGate) so it has access to the Redux store
// via useSelector — hooks can't be called before the Provider wraps the tree.
const SessionGate = ({ children }) => {
  useSessionRestore();
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className='min-h-screen bg-background flex items-center justify-center'>
            <div className='relative'>
              <div className='absolute inset-0 rounded-full bg-primary/20 blur-xl animate-pulse' />
              <Loader2 className='h-10 w-10 animate-spin text-primary relative z-10' />
            </div>
          </div>
        }
        persistor={persistor}
      >
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            {/* SessionGate must be inside Provider+PersistGate so it can read Redux */}
            <SessionGate>
              <AppRoutes />
              <Toaster
                position='top-center'
                richColors
                toastOptions={{
                  style: {
                    fontFamily: 'var(--font-body)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  },
                }}
              />
            </SessionGate>
          </QueryClientProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
