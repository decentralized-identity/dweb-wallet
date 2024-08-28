import React from 'react';
import { Identity } from '@/types';

interface IdentityListProps {
  onSelectIdentity: (identity: Identity) => void;
  selectedIdentity: Identity | null;
}

const IdentityList: React.FC<IdentityListProps> = ({ onSelectIdentity, selectedIdentity }) => {
  const identities: Identity[] = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Alice Johnson' },
    { id: 4, name: 'Bob Williams' },
    { id: 5, name: 'Charlie Brown' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4 text-text-light-secondary dark:text-text-dark-secondary px-2">Identities</h2>
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
    </div>
  );
}

export default IdentityList;
