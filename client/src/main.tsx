import React from 'react'
import ReactDOM from 'react-dom/client'
import './global.css'
import { BrowserRouter as Router } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import Auth0ProviderWithNavigate from './auth/Auth0ProviderWithNavigate'
import { Toaster as ReactHotToastToaster } from 'react-hot-toast'
import { Toaster as SonnerToaster } from 'sonner'
import { QueryClient, QueryClientProvider } from "react-query"


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
     <QueryClientProvider client = {queryClient}>
      <Auth0ProviderWithNavigate>
      <AppRoutes />
      <SonnerToaster visibleToasts={1} position='top-right' richColors />
      </Auth0ProviderWithNavigate>
      </QueryClientProvider>
    </Router>
    <ReactHotToastToaster />
  </React.StrictMode>,
)
