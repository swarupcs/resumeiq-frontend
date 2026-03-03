import './App.css';

import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './app/store.js';
import { Loader2 } from 'lucide-react';

import { ThemeProvider } from './context/ThemeProvider.jsx';
import AppRoutes from './routes/AppRoutes.jsx';


const queryClient = new QueryClient();

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
            <AppRoutes />
            <Toaster
              position='top-center'
              richColors
              toastOptions={{
                style: {
                  fontFamily: 'var(--font-body)',
                  borderRadius: '12px',
                  border: '1px solid var(--border)',
                  // background: 'var(--card)',
                  // color: 'var(--foreground)',
                },
              }}
            />
          </QueryClientProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
