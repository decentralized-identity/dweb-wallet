import BottomBar from "@/components/BottomBar";
import IdentityDetails from "@/components/identity/IdentityDetails";
import IdentityList from "@/components/identity/IdentityList";
import TopBar from "@/components/TopBar";
import { useAgent, useBackupSeed, useIdentities } from "@/contexts/Context";
import { ProtocolsProvider } from "@/contexts/ProtocolsContext";
import { useEffect, useState } from "react";
import BackupSeedPhrase from "@/components/BackupSeedPhrase";
import SeedPhraseInput from "@/components/SeedPhraseInput";
import { Input } from "@/components/ui/input";

const Home: React.FC = () => {
  const { initialized, initialize, unlock, isConnected, isConnecting, isInitializing, recover } = useAgent();
  const [ password, setPassword ] = useState('');
  const [ dwnEndpoint, setDwnEndpoint ] = useState('https://dwn.tbddev.org/latest')
  const [ recoveryPhrase, setRecoveryPhrase ] = useState('');
  const [ isDarkMode, setIsDarkMode ] = useState(false);
  const { selectedIdentity, setSelectedIdentity } = useIdentities();
  const { showSeedScreen, setBackupSeed } = useBackupSeed();

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

  const handleRecoveryPhraseChange = (phrase: string) => {
    setRecoveryPhrase(phrase);
  }

  const handleAgentSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialized && recoveryPhrase && password) {
      await recover(recoveryPhrase.trim(), password, dwnEndpoint);
      setBackupSeed(recoveryPhrase.trim());
    } else if (!initialized && password) {
      const recoveryPhrase = await initialize(password, dwnEndpoint);
      if (recoveryPhrase) {
        setBackupSeed(recoveryPhrase);
      }
    } else if (initialized && password) {
      await unlock(password);
    }
  };

  if (isInitializing || isConnecting) {
    return (
      <div className="h-screen w-full bg-red-50 dark:bg-red-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-red-800 dark:text-red-200">
            {isInitializing ? "Initializing..." : "Connecting..."}
          </p>
        </div>
      </div>
    );
  }

  if (!initialized || !isConnected) {
    return (
      <div className="h-screen w-full bg-red-50 dark:bg-red-900 flex items-center justify-center">
        <div className="p-8 bg-white dark:bg-red-800 rounded-lg shadow-md">
          <h2 className="text-2xl mb-4 text-red-800 dark:text-red-100">
            {initialized ? "Unlock Agent" : "Initialize Agent"}
          </h2>
          {!initialized && (
            <div className="mb-4">
              <SeedPhraseInput
                value={recoveryPhrase}
                onChange={handleRecoveryPhraseChange}
              />
              <Input
                placeholder="DWN Endpoint"
                value={dwnEndpoint}
                onChange={(e) => setDwnEndpoint(e.target.value)}
              />
            </div>
          )}
          <form onSubmit={handleAgentSetup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={initialized ? "Enter password to unlock" : "Set new password"}
              className="w-full p-2 mb-4 border border-red-300 rounded text-red-800 dark:text-red-100 bg-red-50 dark:bg-red-700 focus:ring-2 focus:ring-red-500 focus:border-transparent"
            />
            <button 
              type="submit" 
              className="w-full p-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md shadow-md transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!initialized && !password}
            >
              {initialized ? "Unlock" : recoveryPhrase ? "Recover" : "Generate"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary flex flex-col">
      <TopBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      {showSeedScreen && <BackupSeedPhrase />}
      {!showSeedScreen && (
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className={`md:w-3/10 ${selectedIdentity ? 'hidden md:block' : 'block'} bg-surface-light dark:bg-surface-dark overflow-y-auto`}>
          <IdentityList />
        </div>
        <div className={`flex-grow ${selectedIdentity ? 'block' : 'hidden md:block'} overflow-y-auto`}>
          {selectedIdentity ? (
            <ProtocolsProvider>
              <IdentityDetails 
                onBack={() => setSelectedIdentity(undefined)}
              />
            </ProtocolsProvider>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary">Select an identity to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
      <BottomBar />
    </div>
  );
}

export default Home;