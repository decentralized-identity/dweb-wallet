import React, { useState } from 'react';
import { useBackupSeed } from '../contexts/Context';

const BackupSeedPhrase: React.FC = () => {
  const { backupSeed } = useBackupSeed();
  const [isBlurred, setIsBlurred] = useState(true);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);

  const toggleBlur = () => setIsBlurred(!isBlurred);

  const copyToClipboard = () => {
    if (backupSeed) {
      navigator.clipboard.writeText(backupSeed);
      alert('Seed phrase copied to clipboard!');
    }
  };

  const deleteSeedPhrase = () => {
    setShowDeleteWarning(false);
    window.dispatchEvent(new Event('storage'));
  };

  if (!backupSeed) {
    return <p className="text-center mt-8">No backup seed phrase exists.</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-background-light dark:bg-background-dark">
      <div className="flex-grow flex flex-col justify-center items-center p-6">
        <div className="w-full max-w-2xl bg-surface-light dark:bg-surface-dark rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-4 text-center text-text-light-primary dark:text-text-dark-primary">Backup Seed Phrase</h2>
          <div className={`p-4 bg-gray-100 dark:bg-gray-700 rounded mb-4 ${isBlurred ? 'blur-sm' : ''}`}>
            {backupSeed.split(' ').map((word, index) => (
              <span key={index} className="inline-block m-1 p-2 bg-white dark:bg-gray-600 rounded text-text-light-primary dark:text-text-dark-primary">
                {word}
              </span>
            ))}
          </div>
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={toggleBlur}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
            >
              {isBlurred ? 'Reveal' : 'Blur'} Phrase
            </button>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 transition-colors"
            >
              Copy Phrase
            </button>
            <button
              onClick={() => setShowDeleteWarning(true)}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
            >
              Delete Phrase
            </button>
          </div>
          {showDeleteWarning && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-900 rounded">
              <p className="text-red-700 dark:text-red-200 mb-2">Are you sure you want to delete the seed phrase?</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDeleteWarning(false)}
                  className="px-3 py-1 bg-gray-300 dark:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={deleteSeedPhrase}
                  className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BackupSeedPhrase;
