import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppRoutes } from '@/app/router';
import { BobDialog } from '@/features/bob/BobDialog';
import { BobProvider } from '@/features/bob/BobProvider';

export function App() {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <BobProvider>
          <AppRoutes />
          <BobDialog />
        </BobProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
