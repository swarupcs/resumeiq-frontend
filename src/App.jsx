import './App.css';

import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './app/store.js';
import { Loader2 } from 'lucide-react';
import AppRoutes from './AppRoutes.jsx';

const queryClient = new QueryClient(); // ✅ outside component

function App() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className='min-h-screen bg-background flex items-center justify-center'>
            <Loader2 className='h-8 w-8 animate-spin text-primary' />
          </div>
        }
        persistor={persistor}
      >
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
          <Toaster position='top-center' richColors />
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;
