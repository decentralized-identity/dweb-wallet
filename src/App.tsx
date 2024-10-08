import { AgentProvider } from '@/contexts/AgentContext';
import { IdentitiesProvider } from '@/contexts/IdentitiesContext';
import { BackupSeedProvider } from '@/contexts/BackupSeedContext';

import { activatePolyfills } from '@web5/browser';
import { useEffect } from 'react';
// import Dashboard from './layoutes/Dshboard';
import { ProtocolsProvider } from './contexts/ProtocolsContext';
import { DragOverIdentitiesProvider } from '@/contexts/DragOverIdentities';
import { Routes, Route } from 'react-router-dom';
import SearchIdentitiesPage from './pages/SearchIdentitiesPage';
import AddOrEditIdentityPage from './pages/AddOrEditIdentityPage';
import ImportIdentityPage from './pages/ImportIdentityPage';
import IdentityDetailsPage from './pages/IdentityDetailsPage';
import IdentitiesListPage from './pages/IdentitiesListPage';
import AppConnect from './pages/AppConnect';
import DWebConnect from './pages/DwebConnect';
import TailwindLayout from './layoutes/TailwindDashboard';
import IdentityProfilePage from './pages/IdentityProfilePage';

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
        <ProtocolsProvider>
          <IdentitiesProvider>
            <DragOverIdentitiesProvider>
              <Routes>
                <Route element={<TailwindLayout />}>
                  <Route index element={<IdentitiesListPage />} />
                  <Route path="/search" element={<SearchIdentitiesPage />} />
                  <Route path= "/search/:didUri" element={<SearchIdentitiesPage />} />
                  <Route path="/identity/edit/:didUri" element={<AddOrEditIdentityPage edit />} />
                  <Route path="/identities/create" element={<AddOrEditIdentityPage />} />
                  <Route path="/identities/import" element={<ImportIdentityPage />} />
                  <Route path="/identity/:didUri" element={<IdentityProfilePage />} />
                  <Route path="/app-connect" element={<AppConnect />} />
                </Route>
                <Route path="/dweb-connect" element={<DWebConnect />} />
              </Routes>
            </DragOverIdentitiesProvider>
          </IdentitiesProvider>
        </ProtocolsProvider>
      </AgentProvider>
    </BackupSeedProvider>
  );
}

export default App;
