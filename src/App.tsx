import { useState } from 'react';
import IdentityList from '@/components/identity/IdentityList';
import IdentityDetails from '@/components/identity/IdentityDetails';
import { Identity } from './types';

function App() {
  const [selectedIdentity, setSelectedIdentity] = useState<Identity | null>(null);

  return (
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary flex flex-col md:flex-row">
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
  );
}

export default App;
