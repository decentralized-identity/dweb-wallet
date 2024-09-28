import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddIdentity: React.FC = () => {
  const [name, setName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement actual identity creation logic
    console.log('Creating identity:', name);
    // Navigate back to the list after creation
    navigate('/');
  };

  return (
    <div>
      <h2>Add New Identity</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">
            Identity Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter identity name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <button
            type="submit"
          >
            Create Identity
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddIdentity;
