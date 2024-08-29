import { AgentProvider } from '@/contexts/AgentContext';
import { IdentitiesProvider } from '@/contexts/IdentitiesContext';
import Home from '@/pages/Home';
import { activatePolyfills } from '@web5/api';
import { BackupSeedProvider } from './contexts/BackupSeedContext';

activatePolyfills();

function App() {

  return (
    <AgentProvider>
      <BackupSeedProvider>
        <IdentitiesProvider>
          <Home />
      </IdentitiesProvider>
      </BackupSeedProvider>
    </AgentProvider>
  );
}

export default App;
