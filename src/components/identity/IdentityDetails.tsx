import React, { useEffect, useState } from 'react';
import { useIdentities } from '@/web5/use-identities';
import { useProtocols } from '@/contexts/ProtocolsContext';

interface IdentityDetailsProps {
  onBack: () => void;
}

const IdentityDetails: React.FC<IdentityDetailsProps> = ({ onBack }) => {
  const { selectedIdentity } = useIdentities();
  const { addProtocol, listProtocols, loadProtocols } = useProtocols();
  const [protocolUrl, setProtocolUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddProtocol, setShowAddProtocol] = useState(false);

  const handleAddProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adding protocol', selectedIdentity?.didUri, protocolUrl, isPublished);
    if (selectedIdentity && protocolUrl) {
      setIsLoading(true);
      try {
        await addProtocol(selectedIdentity.didUri, protocolUrl, isPublished);
        setProtocolUrl('');
        setIsPublished(false);
        setShowAddProtocol(false);
      } catch (error) {
        console.error('Error adding protocol:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if (selectedIdentity) {
      loadProtocols(selectedIdentity.didUri);
    }
  }, [ selectedIdentity, loadProtocols ])

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
          <div className="flex items-center">
            <h3 className="text-lg font-semibold text-primary-500">Protocols</h3>
            <button
              onClick={() => setShowAddProtocol(!showAddProtocol)}
              className="ml-2 text-primary-500 hover:text-primary-600 transition-colors duration-200"
              aria-label="Add protocol"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
          {listProtocols(selectedIdentity.didUri).length > 0 ? (
            <ul className="mt-2 list-disc list-inside text-text-light-secondary dark:text-text-dark-secondary">
              {listProtocols(selectedIdentity.didUri).map((protocol, index) => (
                <li key={index}>
                  {protocol.protocol}
                  {!protocol.published && (
                    <span className="ml-2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-text-light-secondary dark:text-text-dark-secondary">No protocols added yet.</p>
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

        {showAddProtocol && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4 text-primary-500">Add a Protocol</h3>
              <form onSubmit={handleAddProtocol} className="space-y-4">
                <div>
                  <label htmlFor="protocolUrl" className="block text-sm font-medium text-text-light-secondary dark:text-text-dark-secondary">
                    Protocol URL
                  </label>
                  <input
                    type="text"
                    id="protocolUrl"
                    value={protocolUrl}
                    onChange={(e) => setProtocolUrl(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                    placeholder="https://example.com/protocol"
                    required
                    disabled={isLoading}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    id="isPublished"
                    type="checkbox"
                    checked={isPublished}
                    onChange={(e) => setIsPublished(e.target.checked)}
                    className="h-4 w-4 text-primary-500 focus:ring-primary-500 border-gray-300 rounded"
                    disabled={isLoading}
                  />
                  <label htmlFor="isPublished" className="ml-2 block text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    Published
                  </label>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProtocol(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors duration-200"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Adding...
                      </span>
                    ) : (
                      'Add Protocol'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default IdentityDetails;
