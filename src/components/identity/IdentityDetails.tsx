import React from 'react';
import { useIdentities } from '@/web5/use-identities';

interface IdentityDetailsProps {
  onBack: () => void;
}

const IdentityDetails: React.FC<IdentityDetailsProps> = ({ onBack }) => {
  const { selectedIdentity } = useIdentities();

  if (!selectedIdentity) {
    return (
      <div className="h-full flex flex-col bg-surface-light dark:bg-surface-dark">
        <div className="flex-grow flex items-center justify-center">
          <p className="text-text-light-secondary dark:text-text-dark-secondary">No identity selected</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-surface-light dark:bg-surface-dark">
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-black/50 to-transparent z-10">
          <button 
            onClick={onBack} 
            className="m-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 md:hidden"
          >
            ← Back
          </button>
        </div>
        <img 
          src={selectedIdentity.bannerUrl} 
          alt={`${selectedIdentity.name}'s banner`}
          className="w-full h-48 object-cover"
        />
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 z-20">
          <img 
            src={selectedIdentity.avatarUrl} 
            alt={`${selectedIdentity.name}'s avatar`} 
            className="w-32 h-32 rounded-full border-4 border-surface-light dark:border-surface-dark"
          />
        </div>
      </div>
      
      <div className="flex-grow p-6 pt-20 overflow-y-auto">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary-500">{selectedIdentity.name}</h2>
          <p className="text-text-light-secondary dark:text-text-dark-secondary">ID: {selectedIdentity.didUri}</p>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-primary-500">Protocols</h3>
          {selectedIdentity.protocols.length > 0 ? (
            <ul className="list-disc list-inside text-text-light-secondary dark:text-text-dark-secondary">
              {selectedIdentity.protocols.map((protocol, index) => (
                <li key={index}>{protocol}</li>
              ))}
            </ul>
          ) : (
            <p className="text-text-light-secondary dark:text-text-dark-secondary">No protocols added yet.</p>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-primary-500">Permissions</h3>
          {selectedIdentity.permissions.length > 0 ? (
            <ul className="list-disc list-inside text-text-light-secondary dark:text-text-dark-secondary">
              {selectedIdentity.permissions.map((permission, index) => (
                <li key={index}>{permission}</li>
              ))}
            </ul>
          ) : (
            <p className="text-text-light-secondary dark:text-text-dark-secondary">No permissions assigned yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default IdentityDetails;
