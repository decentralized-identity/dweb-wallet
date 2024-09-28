import React, { useEffect, useMemo, useState } from 'react';
import { useIdentities } from '@/contexts/Context';
import {
  Button,
  TextField,
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Divider,
  IconButton,
} from '@mui/material';
import Grid from '@mui/material/Grid2'; // Updated import for Grid2
import { PlusIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

const AddIdentityPage: React.FC<{ edit?: boolean }> = ({ edit = false }) => {
  const { didUri } = useParams();
  const navigate = useNavigate();
  const { createIdentity, uploadAvatar, uploadBanner, selectedIdentity, setSelectedIdentity, identities } = useIdentities();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);


  const [formData, setFormData] = useState({
    persona: '',
    name: '',
    displayName: '',
    tagline: '',
    bio: '',
    dwnEndpoints: ['https://dwn.tbddev.org/latest'],
    avatar: null as File | Blob | null,
    banner: null as File | Blob | null,
  });

  useEffect(() => {

    const loadIdentityForm = async () => {
      if (!selectedIdentity) return;

        let avatar: File | Blob | null = null;
        if (selectedIdentity.avatarUrl) {
          avatar = await fetch(selectedIdentity.avatarUrl).then(r => r.blob());
        }

        let banner: File | Blob | null = null;
        if (selectedIdentity.bannerUrl) {
          banner = await fetch(selectedIdentity.bannerUrl).then(r => r.blob());
        }
  
        setFormData({
          persona: selectedIdentity.persona,
          name: selectedIdentity.name,
          displayName: selectedIdentity.displayName,
          tagline: selectedIdentity.tagline,
          bio: selectedIdentity.bio,
          dwnEndpoints: selectedIdentity.dwnEndpoints,
          avatar,
          banner,
        })
    }

    if (edit && selectedIdentity) {
      console.log('loading identity form');
      loadIdentityForm();
    }

    if (!selectedIdentity) {
      const identity = identities.find(identity => identity.didUri === didUri);
      if (identity) {
        setSelectedIdentity(identity);
      }
    }
  
  }, [ edit, selectedIdentity, didUri, identities ])

  const submitDisabled = useMemo(() => {
    return formData.persona === '' || formData.name === '' || formData.displayName === '' || formData.dwnEndpoints.length === 0;
  }, [formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const didUri = await createIdentity({
        persona: formData.persona,
        name: formData.name,
        displayName: formData.displayName,
        tagline: formData.tagline,  
        bio: formData.bio,
        dwnEndpoints: formData.dwnEndpoints,
        walletHost: window.location.origin,
      });

      if (!didUri) {
        throw new Error('Failed to create identity');
      }

      if (formData.avatar) {
        await uploadAvatar(didUri, formData.avatar);
      }

      if (formData.banner) {
        await uploadBanner(didUri, formData.banner);
      }

      navigate(`/identity/${didUri}`);
    } catch (error) {
      console.error('Error creating identity:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, [name]: file });

      const reader = new FileReader();
      reader.onloadend = () => {
        if (name === 'avatar') {
          setAvatarPreview(reader.result as string);
        } else if (name === 'banner') {
          setBannerPreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearBanner = (e: React.MouseEvent) => {
    if (formData.banner) {
      e.preventDefault();
      setBannerPreview(null);
      setFormData({ ...formData, banner: null });
    }
  }

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh'}}>
        <Typography variant="h4" component="h1" gutterBottom>
          {edit ? 'Edit Identity' : 'Add a New Identity'}
        </Typography>
        <Divider sx={{ mb: 4 }} />
        <form onSubmit={handleSubmit}>
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height={400}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  label="Persona"
                  name="persona"
                  value={formData.persona}
                  onChange={handleInputChange}
                  placeholder="Social, Professional, Gaming, etc."
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  label="Display Name"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleInputChange}
                  placeholder="Display Name"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }} sx={{ display: 'flex', alignItems: 'center' }}>
                <Box position="relative" mr={2} sx={{ width: 60, height: 60 }}>
                  <Avatar
                    src={avatarPreview || undefined}
                    sx={{ width: 60, height: 60 }}
                  />
                  <IconButton
                    component="label"
                    sx={{
                      position: 'absolute',
                      right: 10,
                      bottom: 10,
                      opacity: 0.5,
                      backgroundColor: 'background.paper',
                      '&:hover': { backgroundColor: 'background.default' },
                    }}
                  >
                    <PlusIcon />
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      width={20}
                      name="avatar"
                    />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  name="name"
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  label="Tagline"
                  name="tagline"
                  value={formData.tagline}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <TextField
                  fullWidth
                  label="Bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  multiline
                  rows={4}
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                {formData.dwnEndpoints.map((dwnEndpoint, index) => (
                  <Box>
                    <TextField
                      key={dwnEndpoint}
                      fullWidth
                    label="DWN Endpoint"
                    name="dwnEndpoint"
                    value={dwnEndpoint}
                    onChange={handleInputChange}
                      required
                    />
                    <Button
                      variant="outlined"
                      onClick={() => formData.dwnEndpoints.splice(index, 1)}
                    >
                      Remove
                    </Button>
                  </Box>
                ))}
                <Button
                  variant="outlined"
                  onClick={() => formData.dwnEndpoints.push('https://dwn.tbddev.org/latest')}
                >
                  Add Endpoint
                </Button>
              </Grid>
              {bannerPreview && (
                <Grid size={12}>
                  <Box display="flex" flexDirection="column" alignItems="left">
                    <Typography variant="subtitle2">Banner Preview:</Typography>
                    <Box
                      sx={{
                        width: '100%',
                        maxWidth: 680,
                        height: 100,
                        borderRadius: 2,
                        overflow: 'hidden',
                        border: '1px solid',
                        borderColor: 'divider',
                      }}
                    >
                      <img 
                        src={bannerPreview} 
                        alt="Banner preview" 
                        style={{ width: '100%', height: 'auto', maxHeight: 100, objectFit: 'cover' }} 
                      />
                    </Box>
                  </Box>
                </Grid>
              )}
              <Grid size={{ xs: 12, sm: 8 }}>
                {<Box display="flex" alignItems="center">
                  <Button
                    variant="outlined"
                    component="label"
                    onClick={handleClearBanner}
                  >
                    {bannerPreview ? 'Clear Banner' : 'Upload Banner'}
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      name="banner"
                    />
                  </Button>
                </Box>}
              </Grid>
              <Box mt={4}>
                <Button
                  type="submit"
                  disabled={loading || submitDisabled}
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Add Identity
                </Button>
              </Box>
            </Grid>
          )}
        </form>
    </Box>
  );
};

export default AddIdentityPage;