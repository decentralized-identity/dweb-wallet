import React from 'react';

interface TopBarProps {
  toggleDarkMode: () => void;
  isDarkMode: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleDarkMode, isDarkMode }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-primary-500">nSecure Wallet</h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200"
      >
        {isDarkMode ? '☀️' : '🌙'}
      </button>
    </div>
  );
};

export default TopBar;
