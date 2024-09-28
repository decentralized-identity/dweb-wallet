import React, { useMemo, useState } from 'react';
import { useIdentities } from '@/contexts/Context';

interface AddIdentityModalProps {
  onClose: () => void;
}

const AddIdentityModal: React.FC<AddIdentityModalProps> = ({ onClose }) => {
  const { createIdentity, uploadAvatar, uploadBanner } = useIdentities();
  const [ step, setStep ] = useState(1);
  const [ didUri, setDidUri ] = useState<string | undefined>();
  const [ loading, setLoading ] = useState(false);

  const [formData, setFormData] = useState({
    persona: '',
    name: '',
    displayName: '',
    tagline: '',
    bio: '',
    dwnEndpoint: 'https://dwn.tbddev.org/latest',
    avatar: null as File | null,
    banner: null as File | null,
  });

  const submitDisabled = useMemo(() => {
    return formData.persona === '' || formData.name === '' || formData.displayName === '' || formData.dwnEndpoint === '';
  }, [formData ]);

  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const didUri = await createIdentity({
      persona: formData.persona,
      name: formData.name,
      displayName: formData.displayName,
      tagline: formData.tagline,  
      bio: formData.bio,
      dwnEndpoint: formData.dwnEndpoint,
      walletHost: window.location.origin,
    });
    setDidUri(didUri);
    setStep(2);
    setLoading(false);
  };

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!didUri) {
      throw new Error('DidUri is undefined');
    }

    if (formData.avatar) {
      await uploadAvatar(didUri, formData.avatar);
    }

    if (formData.banner) {
      await uploadBanner(didUri, formData.banner);
    }

    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
      <div>
        <h2>Add New Identity</h2>
        {loading ? (
          <div>
            <div className="animate-spin"></div>
          </div>
        ) : step === 1 ? (
          <form onSubmit={handleStep1Submit}>
            <div>
              <label htmlFor="name">Persona</label>
              <input
                type="text"
                id="persona"
                name="persona"
                value={formData.persona}
                onChange={handleInputChange}
                placeholder="Social, Professional, Gaming, etc."
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                required
              />
            </div>
            <div>
              <label htmlFor="displayName">Display Name</label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                placeholder="What people call you"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="tagline">Tagline</label>
              <input
                type="text"
                id="tagline"
                name="tagline"
                placeholder="What you do"
                value={formData.tagline}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                name="bio"
                placeholder="Tell us about yourself"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="dwnEndpoint">DWN Endpoint</label>
              <input
                type="text"
                id="dwnEndpoint"
                name="dwnEndpoint"
                value={formData.dwnEndpoint}
                onChange={handleInputChange}
                required
              />
            </div>
            <div>
              <button
                type="button"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || submitDisabled}
              >
                Next
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleStep2Submit}>
            <div>
              <label htmlFor="avatar">Avatar Image</label>
              <input
                type="file"
                id="avatar"
                name="avatar"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="banner">Banner Image</label>
              <input
                type="file"
                id="banner"
                name="banner"
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="submit"
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
