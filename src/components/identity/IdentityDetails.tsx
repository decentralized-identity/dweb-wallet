import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdentities, useProtocols } from '@/contexts/Context';
import { QRCodeCanvas} from 'qrcode.react';
import Grid from '@mui/material/Grid2';
import {
  Box, Typography, Avatar, Paper, Divider, Chip, IconButton,
  useTheme, alpha, styled, List, ListItem, ListItemText,
  ListItemIcon, Menu, MenuItem, Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ClickAwayListener
} from '@mui/material';
import {
  Edit, Delete, GetApp, ContentCopy, QrCode2,
  Lock, Public, Language, MoreVert,
  Person2Outlined,
} from '@mui/icons-material';

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
  const { identities, selectedIdentity, setSelectedIdentity, deleteIdentity, exportIdentity } = useIdentities();
  const [ confirmDelete, setConfirmDelete ] = useState(false);
  const [ backupDialogOpen, setBackupDialogOpen ] = useState(false);
  const [ showQrCode, setShowQrCode ] = useState(false);
  const { listProtocols, loadProtocols } = useProtocols();
  const navigate = useNavigate();
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [protocols, setProtocols] = useState<any[]>([]);
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const [copyTooltipText, setCopyTooltipText] = useState("Copy DID");

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

  const handleBackup = async () => {
    if (selectedIdentity) {
      await exportIdentity(selectedIdentity.didUri);
      setBackupDialogOpen(false);
    }
  }

  const handleCopyDid = () => {
    navigator.clipboard.writeText(selectedIdentity.didUri);
    setCopyTooltipText("Copied!");
    setCopyTooltipOpen(true);
    setTimeout(() => {
      setCopyTooltipText("Copy DID");
      setCopyTooltipOpen(false);
    }, 1500);
  };

  const handleTooltipClose = () => {
    setCopyTooltipOpen(false);
    setCopyTooltipText("Copy DID");
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', px: 3 }}>
        <Paper elevation={3} sx={{ mt: 3, mb: 4 }}>
          <Box sx={{ position: 'relative', height: 300 }}>
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
                  {selectedIdentity.displayName} ({selectedIdentity.persona})
                </Typography>
              )}
            </Box>
            <IconButton onClick={handleMenuOpen} sx={{ color: 'common.white' }}>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>{selectedIdentity.tagline}</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person2Outlined sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {selectedIdentity.didUri}
                </Typography>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <Tooltip
                    title={copyTooltipText}
                    open={copyTooltipOpen}
                    onClose={handleTooltipClose}
                    disableFocusListener
                    disableHoverListener
                    disableTouchListener
                  >
                    <IconButton size="small" onClick={handleCopyDid}>
                      <ContentCopy fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ClickAwayListener>
                <Tooltip title="Show QR Code">
                  <IconButton size="small" onClick={() => setShowQrCode(true)}>
                    <QrCode2 fontSize="small" />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
            {selectedIdentity.dwnEndpoints && (
              <Grid size={{ xs: 12, sm: 6  }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
                  {selectedIdentity.dwnEndpoints.map(endpoint => (
                      <Box key={endpoint} sx={{ display: 'flex', alignItems: 'center' }}>
                        <Language sx={{ mr: 1 }} />
                        <Typography variant="body2">{endpoint}</Typography>
                    </Box>
                  ))}
                </Box>
              </Grid>
            )}
          </Grid>
          {selectedIdentity.bio && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">{selectedIdentity.bio}</Typography>
            </>
          )}
        </Box>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 1200, margin: '0 auto', px: 3 }}>
        <Grid container spacing={3}>
          {/* Permissions section */}
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

          {/* Protocols section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
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

          {/* Wallets section */}
          <Grid size={{ xs: 12, md: 6 }}>
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
        <MenuItem onClick={() => setBackupDialogOpen(true)}>
          <ListItemIcon><GetApp fontSize="small" /></ListItemIcon>
          <ListItemText>Backup Identity</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => setConfirmDelete(true)} sx={{ color: theme.palette.error.main }}>
          <ListItemIcon><Delete fontSize="small" sx={{ color: theme.palette.error.main }} /></ListItemIcon>
          <ListItemText>Delete Identity</ListItemText>
        </MenuItem>
      </Menu>

      {confirmDelete && (
        <Dialog open={confirmDelete} onClose={() => setConfirmDelete(false)}>
          <DialogTitle>Delete Identity</DialogTitle>
          <DialogContent>Are you sure you want to delete this identity?</DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDelete(false)}>Cancel</Button>
            <Button onClick={handleDelete} sx={{ color: theme.palette.error.main }}>Delete</Button>
          </DialogActions>
        </Dialog>
      )}

      {backupDialogOpen && (
        <Dialog open={backupDialogOpen} onClose={() => setBackupDialogOpen(false)}>
          <DialogTitle>Backup Identity</DialogTitle>
          <DialogContent>
            <Box>
              Back up your identity to a file. This contains your private key information.
            </Box>
            <Typography variant="body2" sx={{ mt: 2 }}>{selectedIdentity.didUri}</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleBackup}>Download File</Button>
            <Button onClick={() => setBackupDialogOpen(false)} sx={{ color: theme.palette.error.main }}>Cancel</Button>
          </DialogActions>
        </Dialog>
      )}

      {showQrCode && 
        <Dialog open={showQrCode} onClose={() => setShowQrCode(false)} >
          <DialogTitle sx={{ textAlign: 'center' }}>Scan QR Code</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <QRCodeCanvas
                value={selectedIdentity.didUri}
                size={256}
                bgColor={'#FFFFFF'}
                fgColor={'#000000'}
                level="Q"
                imageSettings={{
                  src: selectedIdentity.avatarUrl || '',
                  height: 67,
                  width: 67,
                  excavate: true,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ textAlign: 'center' }}>{selectedIdentity.didUri}</Typography>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Scan the QR code to resolve this identity. 
            </Typography>
            <Button onClick={() => setShowQrCode(false)} sx={{ mt: 2, display: 'block', margin: '0 auto' }}>Close</Button>
          </DialogContent>
        </Dialog>
      }
    </Box>
  );
};

export default IdentityDetails;