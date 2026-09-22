import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';
import App from './App.tsx';
import { AuthProvider } from '@/context/AuthContext';
import { HotelProvider } from '@/context/HotelContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <HotelProvider>
          <App />
          <ToastContainer position="bottom-right" autoClose={2500} />
        </HotelProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
