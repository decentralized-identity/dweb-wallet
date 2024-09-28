import React, { useMemo, useState } from 'react';
import { useIdentities } from '@/contexts/Context';
import {
  Button,
  TextField,
  Box,
  Avatar,
  Typography,
  CircularProgress,
  Container,
  Divider,
} from '@mui/material';
import Grid from '@mui/material/Grid2'; // Updated import for Grid2

const AddIdentityPage: React.FC = () => {
  const { createIdentity, uploadAvatar, uploadBanner } = useIdentities();
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);

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
        dwnEndpoint: formData.dwnEndpoint,
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

      // Instead of closing, you might want to redirect or show a success message
      // For example:
      // router.push('/identities');
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

  return (
    <Box sx={{ bgcolor: 'background.default', minHeight: '100vh'}}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Identity
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
                <TextField
                  fullWidth
                  label="DWN Endpoint"
                  name="dwnEndpoint"
                  value={formData.dwnEndpoint}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={avatarPreview || undefined}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                  >
                    Upload Avatar
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      name="avatar"
                    />
                  </Button>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 8 }}>
                <Box display="flex" alignItems="center">
                  <Avatar
                    src={bannerPreview || undefined}
                    sx={{ width: 60, height: 60, mr: 2 }}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                  >
                    Upload Banner
                    <input
                      type="file"
                      hidden
                      accept="image/*"
                      onChange={handleFileChange}
                      name="banner"
                    />
                  </Button>
                </Box>
              </Grid>
              <Grid size={12}>
                <Typography variant="subtitle1">Banner Preview:</Typography>
                <img 
                  src={bannerPreview || undefined} 
                  alt="Banner preview" 
                  style={{ width: '100%', height: 'auto', maxHeight: 100, objectFit: 'cover' }} 
                />
              </Grid>
            </Grid>
          )}
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
        </form>
    </Box>
  );
};

export default AddIdentityPage;