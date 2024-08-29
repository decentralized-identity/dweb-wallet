import React, { useState } from 'react';
import { useIdentities } from '@/contexts/Identities';
import { Identity } from '@/types';

interface AddIdentityModalProps {
  onClose: () => void;
  onAdd: (identity: Identity) => void;
}

const AddIdentityModal: React.FC<AddIdentityModalProps> = ({ onClose, onAdd }) => {
  const { createIdentity, uploadAvatar, uploadBanner } = useIdentities();
  const [ step, setStep ] = useState(1);
  const [ didUri, setDidUri ] = useState<string | undefined>();
  const [ loading, setLoading ] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    dwnEndpoint: '',
    avatar: null as File | null,
    banner: null as File | null,
  });

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const didUri = await createIdentity(formData.name, formData.dwnEndpoint, window.location.origin);
    setDidUri(didUri);
    setStep(2);
    setLoading(false);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!didUri) {
      throw new Error('DidUri is undefined');
    }

    const avatarUrl = formData.avatar ? await uploadAvatar(didUri, formData.avatar) : undefined;
    const bannerUrl = formData.banner ? await uploadBanner(didUri, formData.banner) : undefined;

    onAdd({
      name: formData.name,
      didUri,
      avatarUrl,
      bannerUrl
    }); 

    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({ ...formData, [name]: files[0] });
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-primary-500">Add New Identity</h2>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleStep1Submit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dwnEndpoint" className="block text-sm font-medium mb-1">DWN Endpoint</label>
              <input
                type="text"
                id="dwnEndpoint"
                name="dwnEndpoint"
                value={formData.dwnEndpoint}
                onChange={handleInputChange}
                className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
                required
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200"
                disabled={loading}
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit}>
            <div className="mb-4">
              <label htmlFor="avatar" className="block text-sm font-medium mb-1">Avatar Image</label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="banner" className="block text-sm font-medium mb-1">Banner Image</label>
              <input
                type="file"
                id="banner"
                name="banner"
                onChange={handleFileChange}
                accept="image/*"
                className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
              >
                Back
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors duration-200"
              >
                Add Identity
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AddIdentityModal;
