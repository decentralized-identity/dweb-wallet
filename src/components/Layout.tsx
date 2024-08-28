import React from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full flex flex-col">
      <nav className="bg-surface-light dark:bg-surface-dark p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-primary-500 font-bold text-xl">
            WALLET
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Link
              to="/add"
              className="px-4 py-2 rounded-full text-sm font-medium text-text-light-primary dark:text-text-dark-primary bg-primary-500 hover:bg-primary-600"
            >
              Add Identity
            </Link>
          </div>
        </div>
      </nav>
      <main className="flex-grow">{children}</main>
    </div>
  );
};

export default Layout;
