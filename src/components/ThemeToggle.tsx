import { useTheme } from '@/contexts/Context';
import React from 'react';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};

export default ThemeToggle;
