import React, { useState } from 'react';
import { Identity } from '@/types';
import AddIdentityModal from './AddIdentityModal';
import { useIdentities } from '@/web5/use-identities';
import { truncateDid } from '@/lib/utils';

interface IdentityListProps {
  onAddIdentity: (identity: Omit<Identity, 'id'>) => void;
}

const IdentityList: React.FC<IdentityListProps> = ({ onAddIdentity }) => {
  const { selectedIdentity, setSelectedIdentity } = useIdentities()
  const [ isAddModalOpen, setIsAddModalOpen ] = useState(false);
  const { identities } = useIdentities();

  const select = (identity: Identity) => {
    if (selectedIdentity?.didUri === identity.didUri) {
      setSelectedIdentity(undefined);
    } else {
      setSelectedIdentity(identity);
    }
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-text-light-secondary dark:text-text-dark-secondary">Identities</h2>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200 text-sm"
        >
          Add New
        </button>
      </div>
      <ul className="space-y-2">
        {identities.map((identity) => (
          <li 
            key={identity.didUri} 
            className={`
              cursor-pointer p-3 rounded-lg transition-all duration-200
              ${selectedIdentity?.didUri === identity.didUri 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'hover:bg-surface-light dark:hover:bg-surface-dark hover:shadow-md'
              }
            `}
            onClick={() => select(identity)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold mr-3">
                {identity.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{identity.name}</p>
                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                  ID: {truncateDid(identity.didUri)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {isAddModalOpen && (
        <AddIdentityModal
          onClose={() => setIsAddModalOpen(false)}
          onAdd={onAddIdentity}
        />
      )}
    </div>
  );
}

export default IdentityList;
