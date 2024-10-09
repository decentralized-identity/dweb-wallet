import React, { useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import IdentityProfile from '@/components/identity/IdentityProfile';
import { useIdentities } from '@/contexts/Context';

const IdentityProfilePage: React.FC = () => {
  const { didUri } = useParams();
  const { selectedIdentity, protocols, permissions, wallets, selectIdentity } = useIdentities();

  useEffect(() => {
    if (didUri && didUri !== selectedIdentity?.didUri) {
      selectIdentity(didUri);
    }
  }, [didUri, selectedIdentity]);

  const identity = useMemo(() => {
    return selectedIdentity;
  }, [selectedIdentity]);

  return identity ? <IdentityProfile
    identity={identity}
    protocols={protocols}
    permissions={permissions}
    wallets={wallets}
  /> : <div>Loading...</div>;
}

export default IdentityProfilePage;