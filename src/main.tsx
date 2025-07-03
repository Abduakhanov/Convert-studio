import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import MiniConverter from './components/MiniConverter.tsx';
import './index.css';

// Toggle between full app and mini converter
const isDemoMode = new URLSearchParams(window.location.search).has('demo');

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isDemoMode ? <MiniConverter /> : <App />}
  </StrictMode>
);