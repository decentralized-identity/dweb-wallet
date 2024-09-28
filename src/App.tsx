import { Route, Routes, useNavigate } from 'react-router-dom';
import { AgentProvider } from '@/contexts/AgentContext';
import { IdentitiesProvider } from '@/contexts/IdentitiesContext';
import { BackupSeedProvider } from '@/contexts/BackupSeedContext';

import { activatePolyfills } from '@web5/browser';
import Desktop from './layoutes/Desktop';
import IdentityDetails from './components/identity/IdentityDetails';
import AddIdentityModal from './components/identity/AddIdentityModal';

activatePolyfills();

function App() {
  const navigate = useNavigate();

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
            <Route path="/" element={<Desktop />}>
              <Route index element={<div />} />
              <Route path="identity/:didUri" element={<IdentityDetails />} />
              <Route path="identity/create" element={<AddIdentityModal />} />
            </Route>
          </Routes>
        </IdentitiesProvider>
      </AgentProvider>
    </BackupSeedProvider>
  );
}

export default App;
