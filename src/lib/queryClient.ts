import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          30 * 1000,  // data fresh for 30 seconds
      gcTime:             5  * 60 * 1000, // cache for 5 minutes
      retry:              1,
      refetchOnWindowFocus: false,    // disable for enterprise apps
    },
    mutations: {
      retry: 0,
    },
  },
})