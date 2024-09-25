import { Route, Routes } from 'react-router-dom';
import { AgentProvider } from '@/contexts/AgentContext';
import { IdentitiesProvider } from '@/contexts/IdentitiesContext';
import { BackupSeedProvider } from '@/contexts/BackupSeedContext';

import Home from '@/pages/Home';
import DWebConnect from '@/pages/DwebConnect';
import { activatePolyfills } from '@web5/browser';

activatePolyfills();

function App() {

  window.addEventListener('message', async e => {
    const { type, did } = e.data;
    if (type === 'dweb-connect-support-request') {
      let supported = false;
      const localStorageIdentities = localStorage.getItem('identities');
      if (localStorageIdentities) {
        const parsedIdentities = JSON.parse(localStorageIdentities) as string[];
        supported = parsedIdentities.includes(did);
      }

      window.parent.postMessage({
        type: 'dweb-connect-support-response',
        supported
      }, e.origin);
    }
  });

  return (
    <BackupSeedProvider>
      <AgentProvider>
        <IdentitiesProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dweb-connect/*" element={<DWebConnect />} />
          </Routes>
        </IdentitiesProvider>
      </AgentProvider>
    </BackupSeedProvider>
  );
}

export default App;
