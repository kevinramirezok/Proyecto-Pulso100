import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(() => {

    return localStorage.getItem('pulso-theme') || 'dark';

  });

  useEffect(() => {

    document.documentElement.classList.remove('dark', 'light', 'night');

    document.documentElement.classList.add(theme);

    localStorage.setItem('pulso-theme', theme);

  }, [theme]);

  const toggleTheme = () => {

    setTheme((prev) => {

      if (prev === 'dark') return 'light';

      if (prev === 'light') return 'night';

      return 'dark';

    });

  };

  return (

    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>

      {children}

    </ThemeContext.Provider>

  );

};

export const useTheme = () => {

  const context = useContext(ThemeContext);

  if (!context) throw new Error('useTheme debe usarse dentro de ThemeProvider');

  return context;

};