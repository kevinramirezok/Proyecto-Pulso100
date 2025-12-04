import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { ProgressProvider } from './context/ProgressContext.jsx';
import { ScheduleProvider } from './context/ScheduleContext.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <ProgressProvider>
          <ScheduleProvider>
            <App />
          </ScheduleProvider>
        </ProgressProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>
);