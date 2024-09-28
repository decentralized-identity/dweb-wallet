import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdentities, useProtocols } from '@/contexts/Context';
import Grid from '@mui/material/Grid2';
import {
  Box, Typography, Avatar, Paper, Divider, Chip, IconButton,
  useTheme, alpha, styled, List, ListItem, ListItemText,
  ListItemIcon, Menu, MenuItem, Tooltip
} from '@mui/material';
import {
  Edit, Delete, GetApp, ContentCopy, QrCode2,
  Lock, Public, Language, Work, School, LocationOn, MoreVert
} from '@mui/icons-material';
import { truncateDid } from '@/lib/utils';

const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0)} 0%, ${alpha(theme.palette.common.black, 0.7)} 100%)`,
}));

const IdentityDetails: React.FC = () => {
  const { didUri } = useParams();
  const { identities, selectedIdentity, setSelectedIdentity, deleteIdentity } = useIdentities();
  const { listProtocols, loadProtocols } = useProtocols();
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [protocols, setProtocols] = useState<any[]>([]);

  useEffect(() => {
    if (identities && didUri && selectedIdentity?.didUri !== didUri) {
      const identity = identities.find(identity => identity.didUri === didUri);
      if (identity) {
        setSelectedIdentity(identity);
      }
    }
  }, [didUri, identities, selectedIdentity, setSelectedIdentity]);

  useEffect(() => {
    if (selectedIdentity) {
      loadProtocols(selectedIdentity.didUri).then(() => {
        setProtocols(listProtocols(selectedIdentity.didUri));
      });
    }
  }, [selectedIdentity, loadProtocols, listProtocols]);

  if (!selectedIdentity) return null;

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    if (selectedIdentity) {
      await deleteIdentity(selectedIdentity.didUri);
      navigate('/');
    }
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Paper elevation={0} sx={{ position: 'relative', height: 300, borderRadius: 0 }}>
        <Box
          component="img"
          src={selectedIdentity.bannerUrl}
          alt={`${selectedIdentity.name}'s banner`}
          sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <BannerOverlay />
        <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', alignItems: 'flex-end' }}>
          <Avatar
            src={selectedIdentity.avatarUrl}
            alt={selectedIdentity.name}
            sx={{ width: 120, height: 120, border: `4px solid ${theme.palette.background.paper}`, mr: 2 }}
          >
            {selectedIdentity.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" sx={{ color: 'common.white', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
              {selectedIdentity.name}
            </Typography>
            {selectedIdentity.displayName && (
              <Typography variant="subtitle1" sx={{ color: 'common.white', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                {selectedIdentity.displayName}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleMenuOpen} sx={{ color: 'common.white' }}>
            <MoreVert />
          </IconButton>
        </Box>
      </Paper>

      <Box sx={{ maxWidth: 1200 }}>
        <Grid container spacing={3}>
          <Grid size={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="body1">{selectedIdentity.tagline}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <Typography variant="caption" sx={{ mr: 1 }}>
                  {truncateDid(selectedIdentity.didUri, 30)}
                </Typography>
                <Tooltip title="Copy DID">
                  <IconButton size="small" onClick={() => navigator.clipboard.writeText(selectedIdentity.didUri)}>
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Show QR Code">
                  <IconButton size="small">
                    <QrCode2 fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Permissions</Typography>
              <Divider sx={{ mb: 2 }} />
              {selectedIdentity.permissions && selectedIdentity.permissions.length > 0 ? (
                <Box>
                  {selectedIdentity.permissions.map((permission, index) => (
                    <Chip key={index} label={permission} sx={{ mr: 1, mb: 1 }} />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2">No permissions assigned yet.</Typography>
              )}
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 6 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%', mb: 10 }}>
              <Typography variant="h6" gutterBottom>Protocols</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {protocols.map((protocol, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {protocol.published ? <Public fontSize="small" /> : <Lock fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText primary={protocol.protocol} secondary={protocol.published ? 'Published' : 'Private'} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 6 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Wallets</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {selectedIdentity.webWallets.map((wallet, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={wallet} />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 6 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Education</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon><School /></ListItemIcon>
                  <ListItemText primary="Bachelor's in Computer Science" secondary="University of Technology, 2015-2019" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><School /></ListItemIcon>
                  <ListItemText primary="Master's in Artificial Intelligence" secondary="Tech Institute, 2019-2021" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }} sx={{ mb: 6 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Work Experience</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                <ListItem>
                  <ListItemIcon><Work /></ListItemIcon>
                  <ListItemText primary="Senior Developer" secondary="Tech Corp, 2021-Present" />
                </ListItem>
                <ListItem>
                  <ListItemIcon><Work /></ListItemIcon>
                  <ListItemText primary="Junior Developer" secondary="StartUp Inc, 2019-2021" />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          <Grid size={12}>
            <Paper elevation={1} sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Additional Information</Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Language sx={{ mr: 1 }} />
                    <Typography>Languages: English, Spanish, French</Typography>
                  </Box>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <LocationOn sx={{ mr: 1 }} />
                    <Typography>Location: San Francisco, CA</Typography>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => { handleMenuClose(); navigate(`/identity/edit/${selectedIdentity.didUri}`); }}>
          <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
          <ListItemText>Edit Identity</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon><GetApp fontSize="small" /></ListItemIcon>
          <ListItemText>Backup Identity</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon><Delete fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
          <ListItemText>Delete Identity</ListItemText>
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default IdentityDetails;