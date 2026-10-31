import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { AuthProvider } from './context/AuthContext';
import { SecurityAlertProvider } from './context/SecurityAlertContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <SecurityAlertProvider>
      <App />
    </SecurityAlertProvider>
  </AuthProvider>
);
