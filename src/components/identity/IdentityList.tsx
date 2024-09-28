import React, { useState } from 'react';
import { Identity } from '@/types';
import AddIdentityModal from './AddIdentityModal';
import { truncateDid } from '@/lib/utils';
import { useIdentities } from '@/contexts/Context';



const IdentityList: React.FC = () => {
  const { selectedIdentity, setSelectedIdentity } = useIdentities();
  const [ isAddModalOpen, setIsAddModalOpen ] = useState(false);
  const { identities } = useIdentities();

  const select = async (identity: Identity) => {
    if (selectedIdentity?.didUri === identity.didUri) {
      setSelectedIdentity(undefined);
    } else {
      setSelectedIdentity(identity);
    }
  }

  return (
    <div>
      <div>
        <h2>Identities</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
        >
          Add New
        </button>
      </div>
      <ul>
        {identities.map((identity) => (
          <li 
            key={identity.didUri} 
            onClick={() => select(identity)}
          >
            <div>
              <div>
                {identity.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div>
                  <p>{identity.name}</p>
                  <p>
                    ID: {truncateDid(identity.didUri)}
                  </p>
                </div>
                {identity.displayName.length > 0 && (
                  <h3>
                    {identity.displayName}
                  </h3>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isAddModalOpen && (
        <AddIdentityModal
          onClose={() => {
            setIsAddModalOpen(false)
          }}
        />
      )}
    </div>
  );
}

export default IdentityList;
