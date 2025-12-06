import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ScheduleProvider } from './context/ScheduleContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ScheduleProvider>
          <App />
        </ScheduleProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);