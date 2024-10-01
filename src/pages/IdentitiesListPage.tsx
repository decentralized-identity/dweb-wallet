import IdentityCard from '@/components/identity/IdentityCard';
import { useIdentities } from '@/contexts/Context';
import { Container } from '@mui/material';
import React  from 'react';
import { useNavigate } from 'react-router-dom';

const IdentitiesListPage: React.FC = () => {
  const { identities } = useIdentities();
  const navigate = useNavigate();

  return (<Container>
    {identities.map((identity) => (
      <IdentityCard
        key={identity.didUri}
        identity={identity}
        onClick={() => navigate(`/identity/${identity.didUri}`)}
        compact={true}
      />
    ))}
  </Container>)
}


export default IdentitiesListPage;