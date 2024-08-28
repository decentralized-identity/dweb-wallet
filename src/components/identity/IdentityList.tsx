import React from 'react';
import { Identity } from '@/types';

interface IdentityListProps {
  onSelectIdentity: (identity: Identity) => void;
  selectedIdentity: Identity | null;
}

const IdentityList: React.FC<IdentityListProps> = ({ onSelectIdentity, selectedIdentity }) => {
  const identities: Identity[] = [
    { id: 1, name: 'Identity 1' },
    { id: 2, name: 'Identity 2' },
    { id: 3, name: 'Identity 3' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-6 text-primary-500">Identities</h2>
      <ul className="space-y-2">
        {identities.map((identity) => (
          <li 
            key={identity.id} 
            className={`cursor-pointer p-3 rounded-lg transition-colors duration-200 ${
              selectedIdentity?.id === identity.id 
                ? 'bg-primary-500 text-white' 
                : 'hover:bg-primary-500 hover:text-white'
            }`}
            onClick={() => onSelectIdentity(identity)}
          >
            {identity.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default IdentityList;
