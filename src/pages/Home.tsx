import BottomBar from "@/components/BottomBar";
import IdentityDetails from "@/components/identity/IdentityDetails";
import IdentityList from "@/components/identity/IdentityList";
import TopBar from "@/components/TopBar";
import { Identity } from "@/types";
import { useAgent } from "@/web5/use-agent";
import { useIdentities } from "@/web5/use-identities";
import { useEffect, useState } from "react";

const Home: React.FC = () => {
  const { initialized, initialize, unlock, isConnected, isConnecting, isInitializing } = useAgent();
  const [password, setPassword] = useState('');
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { selectedIdentity, setSelectedIdentity } = useIdentities();

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
    console.log('newIdentity', newIdentity);
    // const id = Math.max(0, ...identities.map(i => i.id)) + 1;
    // setIdentities([...identities, { ...newIdentity, id }]);
  };

  const handleAgentSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialized) {
      const phrase = await initialize(password);
      if (phrase) setSeedPhrase(phrase);
    } else {
      await unlock(password);
    }
  };

  if (isInitializing || isConnecting) {
    return (
      <div className="h-screen w-full bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-text-light-primary dark:text-text-dark-primary">
            {isInitializing ? "Initializing..." : "Connecting..."}
          </p>
        </div>
      </div>
    );
  }

  if (!initialized || !isConnected) {
    return (
      <div className="h-screen w-full bg-background-light dark:bg-background-dark flex items-center justify-center">
        <form onSubmit={handleAgentSetup} className="p-8 bg-surface-light dark:bg-surface-dark rounded-lg shadow-md">
          <h2 className="text-2xl mb-4 text-text-light-primary dark:text-text-dark-primary">
            {initialized ? "Unlock Agent" : "Initialize Agent"}
          </h2>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={initialized ? "Enter password to unlock" : "Set new password"}
            className="w-full p-2 mb-4 border rounded"
          />
          <button 
            type="submit" 
            className="w-full p-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-md shadow-md transition duration-300 ease-in-out"
            onClick={handleAgentSetup}
          >
            {initialized ? "Unlock" : "Initialize"}
          </button>
          {seedPhrase && (
            <div className="mt-4">
              <p className="mb-2 text-text-light-secondary dark:text-text-dark-secondary">Please copy your seed phrase:</p>
              <textarea 
                readOnly 
                value={seedPhrase} 
                className="w-full p-2 border rounded bg-surface-light dark:bg-surface-dark text-text-light-primary dark:text-text-dark-primary"
                rows={3}
              />
            </div>
          )}
        </form>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary flex flex-col">
    <TopBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
    <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
      <div className={`md:w-3/10 ${selectedIdentity ? 'hidden md:block' : 'block'} bg-surface-light dark:bg-surface-dark overflow-y-auto`}>
        <IdentityList 
          onAddIdentity={handleAddIdentity}
        />
      </div>
      <div className={`flex-grow ${selectedIdentity ? 'block' : 'hidden md:block'} overflow-y-auto`}>
        {selectedIdentity ? (
          <IdentityDetails 
            onBack={() => setSelectedIdentity(undefined)}
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

export default Home;