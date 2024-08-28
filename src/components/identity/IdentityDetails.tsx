import React from 'react';
import { Identity } from '@/types';

interface IdentityDetailsProps {
  identity: Identity;
  onBack: () => void;
}

const IdentityDetails: React.FC<IdentityDetailsProps> = ({ identity, onBack }) => {
  return (
    <div className="p-4">
      <button 
        onClick={onBack} 
        className="lg:hidden mb-4 px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 transition-colors duration-200"
      >
        Back to List
      </button>
      <h2 className="text-2xl font-bold mb-4 text-primary-500">{identity.name}</h2>
      <p className="text-text-light-secondary dark:text-text-dark-secondary">Details for {identity.name}</p>
    </div>
  );
}

export default IdentityDetails;
