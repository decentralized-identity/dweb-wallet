import { useState, useEffect } from 'react';
import IdentityList from '@/components/identity/IdentityList';
import IdentityDetails from '@/components/identity/IdentityDetails';
import TopBar from '@/components/TopBar';
import BottomBar from '@/components/BottomBar';
import { Identity } from '@/types';

function App() {
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary flex flex-col">
      <TopBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {/* Left pane (list) */}
        <div className={`md:w-3/10 ${selectedIdentity ? 'hidden md:block' : 'block'} bg-surface-light dark:bg-surface-dark overflow-y-auto`}>
          <IdentityList 
            onSelectIdentity={setSelectedIdentity} 
            selectedIdentity={selectedIdentity}
          />
        </div>

        {/* Right pane (details) */}
        <div className={`flex-grow ${selectedIdentity ? 'block' : 'hidden md:block'} overflow-y-auto`}>
          {selectedIdentity ? (
            <IdentityDetails 
              identity={selectedIdentity} 
              onBack={() => setSelectedIdentity(null)}
            />
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary">Select an identity to view details</p>
            </div>
          )}
        </div>
      </div>
      <BottomBar />
    </div>
  );
}

export default App;
