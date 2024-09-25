import React from 'react';
import ShieldIcon from './ShieldIcon';

interface TopBarProps {
  toggleDarkMode?: () => void;
  isDarkMode?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleDarkMode, isDarkMode = false }) => {
  return (
    <div className="bg-surface-light dark:bg-surface-dark p-4 flex justify-between items-center">
      <div className="flex items-center">
        <ShieldIcon className="w-12 h-12 mr-2 text-primary-500" />
        <h1 className="text-3xl font-bold text-primary-500">nSecure Wallet</h1>
      </div>
      {toggleDarkMode && (
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full bg-primary-500 text-white hover:bg-primary-600 transition-colors duration-200"
      >
        {isDarkMode ? '☀️' : '🌙'}
        </button>
      )}
    </div>
  );
};

export default TopBar;
