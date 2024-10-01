import React  from 'react';
import IdentityCard from '@/components/identity/IdentityCard';
import { useIdentities } from '@/contexts/Context';
import { PageContainer } from '@toolpad/core';
import { useNavigate } from 'react-router-dom';

const IdentitiesListPage: React.FC = () => {
  const { identities } = useIdentities();
  const navigate = useNavigate();

  return (<PageContainer breadCrumbs={[]}>
    {identities.map((identity) => (
      <IdentityCard
        key={identity.didUri}
        identity={identity}
        onClick={() => navigate(`/identity/${identity.didUri}`)}
        compact={true}
      />
    ))}
  </PageContainer>)
}


export default IdentitiesListPage;