import { AgentProvider } from '@/contexts/AgentContext';
import { IdentitiesProvider } from '@/contexts/IdentitiesContext';
import { BackupSeedProvider } from '@/contexts/BackupSeedContext';

import Home from '@/pages/Home';
import { activatePolyfills } from './web-features';

activatePolyfills();

function App() {

  return (
    <BackupSeedProvider>
      <AgentProvider>
        <IdentitiesProvider>
          <Home />
        </IdentitiesProvider>
      </AgentProvider>
    </BackupSeedProvider>
  );
}

export default App;
