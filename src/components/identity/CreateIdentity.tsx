import { useIdentities } from '@/contexts/Identities';
import React, { useState } from 'react';

interface IdentityFormData {
  name: string;
  dwnEndpoint: string;
  avatar?: File;
  banner?: File;
}

const CreateIdentity: React.FC = () => {
  const { createIdentity, uploadAvatar, uploadBanner } = useIdentities();
  const [didUri, setDidUri] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState<IdentityFormData>({
    name: '',
    dwnEndpoint: '',
  });

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const didUri = await createIdentity(formData.name, formData.dwnEndpoint, window.location.origin);
    if (!didUri) {
      setLoading(false);
      throw new Error('Failed to create identity');
    }

    setDidUri(didUri);
    setStep(2);
    setLoading(false);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    if (formData.avatar) {
      await uploadAvatar(didUri, formData.avatar);
    }
    if (formData.banner) {
      await uploadBanner(didUri, formData.banner);
    }
    setLoading(false);
    
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
    <div>
      <h2>Create New Identity</h2>
      {loading ? (
        <div>Loading...</div>
      ) : step === 1 ? (
        <form onSubmit={handleStep1Submit}>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Name"
            required
          />
          <input
            type="text"
            name="dwnEndpoint"
            value={formData.dwnEndpoint}
            onChange={handleInputChange}
            placeholder="DWN Endpoint"
            required
          />
          <button type="submit" disabled={loading}>Next</button>
        </form>
      ) : (
        <form onSubmit={handleStep2Submit}>
          <input
            type="file"
            name="avatar"
            onChange={handleFileChange}
            accept="image/*"
          />
          <input
            type="file"
            name="banner"
            onChange={handleFileChange}
            accept="image/*"
          />
          <button type="submit" disabled={loading}>Create Identity</button>
        </form>
      )}
    </div>
  );
};

export default CreateIdentity;
