import React  from 'react';
import { useIdentities } from '@/contexts/Context';
import { useNavigate } from 'react-router-dom';
import IdentityProfileCard from '@/components/identity/IdentityProfileCard';
import Button from '@/components/Button';

const IdentitiesListPage: React.FC = () => {
  const { identities } = useIdentities();
  const navigate = useNavigate();

  return (<div className="pt-12">
    {identities.length === 0 && <div className="flex items-end gap-1 mt-2">
      <span>No identities found.</span> <Button variant='contained' onClick={() => navigate('/identities/create')}>Create one</Button>
    </div>}
    {identities.map((identity) => (
      <IdentityProfileCard
        key={identity.didUri}
        identity={identity}
        onClick={() => navigate(`/identity/${identity.didUri}`)}
        // compact={true}
      />
    ))}
  </div>)
}


export default IdentitiesListPage;