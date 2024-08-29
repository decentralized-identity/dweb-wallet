import React, { useState } from 'react';
import { Identity } from '@/types';
import AddIdentityModal from './AddIdentityModal';
import { truncateDid } from '@/lib/utils';
import { useIdentities } from '@/contexts/Context';

interface IdentityListProps {
  onAddIdentity: (identity: Omit<Identity, 'id'>) => void;
}

const IdentityList: React.FC<IdentityListProps> = ({ onAddIdentity }) => {
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
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-bold shadow-md">
                {identity.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-lg text-primary-700 dark:text-primary-300">{identity.name}</p>
                  <p className="text-xs bg-surface-light dark:bg-surface-dark px-2 py-1 rounded-full text-text-light-secondary dark:text-text-dark-secondary">
                    ID: {truncateDid(identity.didUri)}
                  </p>
                </div>
                {identity.displayName.length > 0 && (
                  <h3 className="text-sm text-text-light-secondary dark:text-text-dark-secondary font-medium mt-1">
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
          onAdd={onAddIdentity}
          onClose={() => {
            setIsAddModalOpen(false)
          }}
        />
      )}
    </div>
  );
}

export default IdentityList;
