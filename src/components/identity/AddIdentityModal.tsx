import React, { useState } from 'react';
import { Identity } from '@/types';

interface AddIdentityModalProps {
  onClose: () => void;
  onAdd: (identity: Omit<Identity, 'id'>) => void;
}

const AddIdentityModal: React.FC<AddIdentityModalProps> = ({ onClose, onAdd }) => {
  const [name, setName] = useState('New User');
  const [avatarUrl, setAvatarUrl] = useState('https://placehold.co/400x400/4A90E2/FFFFFF.png?text=NU');
  const [bannerUrl, setBannerUrl] = useState('https://placehold.co/1200x400/34A853/FFFFFF.png?text=New+User+Banner');
  const [protocols, setProtocols] = useState('Ethereum, Bitcoin');
  const [permissions, setPermissions] = useState('Read, Write');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd({
        name: name.trim(),
        avatarUrl: avatarUrl.trim(),
        bannerUrl: bannerUrl.trim(),
        protocols: protocols.split(',').map(p => p.trim()).filter(p => p !== ''),
        permissions: permissions.split(',').map(p => p.trim()).filter(p => p !== '')
      });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-background-light dark:bg-background-dark rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4 text-primary-500">Add New Identity</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="avatarUrl" className="block text-sm font-medium mb-1">Avatar URL</label>
            <input
              type="url"
              id="avatarUrl"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="bannerUrl" className="block text-sm font-medium mb-1">Banner URL</label>
            <input
              type="url"
              id="bannerUrl"
              value={bannerUrl}
              onChange={(e) => setBannerUrl(e.target.value)}
              className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="protocols" className="block text-sm font-medium mb-1">Protocols (comma-separated)</label>
            <input
              type="text"
              id="protocols"
              value={protocols}
              onChange={(e) => setProtocols(e.target.value)}
              className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="permissions" className="block text-sm font-medium mb-1">Permissions (comma-separated)</label>
            <input
              type="text"
              id="permissions"
              value={permissions}
              onChange={(e) => setPermissions(e.target.value)}
              className="w-full p-2 border rounded-md bg-surface-light dark:bg-surface-dark"
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
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddIdentityModal;
