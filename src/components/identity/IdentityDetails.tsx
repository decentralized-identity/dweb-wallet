import React from 'react';
import { Identity } from '@/types';

interface IdentityDetailsProps {
  identity: Identity;
  onBack: () => void;
}

const IdentityDetails: React.FC<IdentityDetailsProps> = ({ identity, onBack }) => {
  return (
    <div className="p-6 h-full flex flex-col">
      <button 
        onClick={onBack} 
        className="md:hidden mb-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors duration-200 self-start"
      >
        ← Back to List
      </button>
      
      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-md p-6 flex-grow">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-primary-600 flex items-center justify-center text-white text-3xl font-bold mr-6">
            {identity.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary-500 mb-1">{identity.name}</h2>
            <p className="text-text-light-secondary dark:text-text-dark-secondary">ID: {identity.id}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary-500">Personal Information</h3>
            <p><strong>Email:</strong> {identity.name.toLowerCase().replace(' ', '.')}@example.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Location:</strong> New York, NY</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-primary-500">Account Details</h3>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Member Since:</strong> January 1, 2023</p>
            <p><strong>Last Login:</strong> 2 hours ago</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2 text-primary-500">Recent Activity</h3>
          <ul className="list-disc list-inside text-text-light-secondary dark:text-text-dark-secondary">
            <li>Updated profile picture</li>
            <li>Changed password</li>
            <li>Logged in from new device</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default IdentityDetails;
