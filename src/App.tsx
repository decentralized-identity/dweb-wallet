import { Route, Routes } from 'react-router-dom';
import { AgentProvider } from '@/contexts/AgentContext';
import { IdentitiesProvider } from '@/contexts/IdentitiesContext';
import { BackupSeedProvider } from '@/contexts/BackupSeedContext';

import { activatePolyfills } from '@web5/browser';
import Desktop from './layoutes/Desktop';
import AddIdentity from './pages/AddIdentityPage';
import DWebConnect from './pages/DwebConnect';
import { useEffect } from 'react';
import IdentityDetailsPage from './pages/IdentityDetailsPage';

activatePolyfills();

function App() {

  useEffect(() => {
    const connectSupport = async (e: MessageEvent) => {
      const { type, did } = e.data;
      if (type === 'dweb-connect-support-request') {
        e.stopPropagation();
        e.preventDefault();

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
    }

    window.addEventListener('message', connectSupport);

    return () => {
      window.removeEventListener('message', connectSupport);
    };
  }, []);

  return (
    <BackupSeedProvider>
      <AgentProvider>
        <IdentitiesProvider>
          <Routes>
            <Route path="/" element={<Desktop />}>
              <Route index element={<div />} />
              <Route path="identity/:didUri" element={<IdentityDetailsPage />} />
              <Route path="identity/create" element={<AddIdentity />} />
              <Route path="identity/edit/:didUri" element={<AddIdentity edit />} />
            </Route>
            <Route path="/dweb-connect" element={<DWebConnect />} />
          </Routes>
        </IdentitiesProvider>
      </AgentProvider>
    </BackupSeedProvider>
  );
}

export default App;
