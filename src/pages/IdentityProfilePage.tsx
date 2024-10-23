import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import IdentityProfile from '@/components/identity/IdentityProfile';
import { useIdentities } from '@/contexts/Context';
import { CircularProgress } from '@mui/material';

const IdentityProfilePage: React.FC = () => {
  const { didUri } = useParams();
  const { selectedIdentity, protocols, permissions, wallets, dwnEndpoints, selectIdentity } = useIdentities();

  useEffect(() => {
    selectIdentity(didUri);
  });

  return (<>
   {selectedIdentity && <IdentityProfile
      identity={selectedIdentity}
      protocols={protocols}
      permissions={permissions}
      endpoints={dwnEndpoints}
      wallets={wallets}
    /> || <div className="absolute w-full h-full flex flex-col items-center justify-center">
      <CircularProgress />
    </div>}
  </>)
}

export default IdentityProfilePage;