import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Loader2 } from 'lucide-react';
import { Toaster } from 'sonner';
import store, { persistor } from '@/app/store';
import { ThemeProvider } from '@/context/ThemeContext';
import AppRoutes from '@/routes/AppRoutes';
import { useSessionRestore } from '@/hooks/auth/useSessionRestore';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2,
    },
  },
});

// SessionGate must be inside Provider so it can access the Redux store
const SessionGate = ({ children }: { children: React.ReactNode }) => {
  useSessionRestore();
  return <>{children}</>;
};

const PersistLoader = () => (
  <div className='min-h-screen bg-background flex items-center justify-center'>
    <Loader2 className='h-10 w-10 animate-spin text-primary' />
  </div>
);

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={<PersistLoader />} persistor={persistor}>
        <ThemeProvider>
          <QueryClientProvider client={queryClient}>
            <SessionGate>
              <AppRoutes />
              <Toaster
                position='top-center'
                richColors
                toastOptions={{
                  style: {
                    fontFamily: 'var(--font-body)',
                    borderRadius: '12px',
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
