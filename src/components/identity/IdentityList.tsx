import React, { useState } from 'react';
import { Identity } from '@/types';
import AddIdentityModal from './AddIdentityModal';

interface IdentityListProps {
  identities: Identity[];
  onSelectIdentity: (identity: Identity) => void;
  selectedIdentity: Identity | null;
  onAddIdentity: (identity: Omit<Identity, 'id'>) => void;
}

const IdentityList: React.FC<IdentityListProps> = ({ identities, onSelectIdentity, selectedIdentity, onAddIdentity }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

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
            key={identity.id} 
            className={`
              cursor-pointer p-3 rounded-lg transition-all duration-200
              ${selectedIdentity?.id === identity.id 
                ? 'bg-primary-500 text-white shadow-md' 
                : 'hover:bg-surface-light dark:hover:bg-surface-dark hover:shadow-md'
              }
            `}
            onClick={() => onSelectIdentity(identity)}
          >
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold mr-3">
                {identity.name.charAt(0)}
              </div>
              <div>
                <p className="font-semibold">{identity.name}</p>
                <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary">
                  ID: {identity.id}
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
