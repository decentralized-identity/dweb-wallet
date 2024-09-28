import React from 'react';
import ShieldIcon from './ShieldIcon';

interface TopBarProps {
  toggleDarkMode?: () => void;
  isDarkMode?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ toggleDarkMode, isDarkMode = false }) => {
  return (
    <div>
      <div>
        <ShieldIcon />
        <h1>nSecure Wallet</h1>
      </div>
      {toggleDarkMode && (
        <button
          onClick={toggleDarkMode}
      >
        {isDarkMode ? '☀️' : '🌙'}
        </button>
      )}
    </div>
  );
};

export default TopBar;
