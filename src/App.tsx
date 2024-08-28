import { useState, useEffect } from 'react';
import IdentityList from '@/components/identity/IdentityList';
import IdentityDetails from '@/components/identity/IdentityDetails';
import TopBar from '@/components/TopBar';
import BottomBar from '@/components/BottomBar';
import { Identity } from '@/types';

function App() {
  const [identities, setIdentities] = useState<Identity[]>([
    {
      id: 1,
      name: 'John Doe',
      avatarUrl: 'https://placehold.co/300x300/E03A3E/FFFFFF.png?text=JD',
      bannerUrl: 'https://placehold.co/1200x400/4A90E2/FFFFFF.png?text=John+Doe+Banner',
      protocols: ['Ethereum', 'Bitcoin'],
      permissions: ['Read', 'Write', 'Execute']
    },
    {
      id: 2,
      name: 'Jane Smith',
      avatarUrl: 'https://placehold.co/400x400/4A90E2/FFFFFF.png?text=JS',
      bannerUrl: 'https://placehold.co/1200x400/E03A3E/FFFFFF.png?text=Jane+Smith+Banner',
      protocols: ['Polkadot', 'Cardano'],
      permissions: ['Read', 'Write']
    },
    {
      id: 3,
      name: 'Alice Johnson',
      avatarUrl: 'https://placehold.co/400x400/34A853/FFFFFF.png?text=AJ',
      bannerUrl: 'https://placehold.co/1200x400/FBBC05/FFFFFF.png?text=Alice+Johnson+Banner',
      protocols: ['Solana', 'Avalanche'],
      permissions: ['Read']
    }
  ]);

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

  const handleAddIdentity = (newIdentity: Omit<Identity, 'id'>) => {
    const id = Math.max(0, ...identities.map(i => i.id)) + 1;
    setIdentities([...identities, { ...newIdentity, id }]);
  };

  return (
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary flex flex-col">
      <TopBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        <div className={`md:w-3/10 ${selectedIdentity ? 'hidden md:block' : 'block'} bg-surface-light dark:bg-surface-dark overflow-y-auto`}>
          <IdentityList 
            identities={identities}
            onSelectIdentity={setSelectedIdentity} 
            selectedIdentity={selectedIdentity}
            onAddIdentity={handleAddIdentity}
          />
        </div>
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
