import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useIdentities, useProtocols } from '@/contexts/Context';
import {
  Box,
  Typography,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Paper,
  Divider,
  useTheme,
  Tooltip,
  ClickAwayListener,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Add,
  Lock,
  Delete,
  Backup,
  Link as LinkIcon,
  ContentCopy,
  QrCode2,
} from '@mui/icons-material';
import { QRCodeSVG } from 'qrcode.react';

const IdentityDetails: React.FC = () => {
  const { didUri } = useParams();
  const navigate = useNavigate();
  const { identities, deleteIdentity, exportIdentity } = useIdentities();
  const { listProtocols, loadProtocols } = useProtocols();
  const [ editWallets, setEditWallets ] = useState<string[]>([]);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [copyTooltipOpen, setCopyTooltipOpen] = useState(false);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [qrImageUrl, setQrImageUrl] = useState<string | null>(null);

  const selectedIdentity = identities.find(identity => identity.didUri === didUri);

  const theme = useTheme();

  const handleBack = () => {
    navigate('/identities');
  };

  const handleDeleteIdentity = async () => {
    if (selectedIdentity) {
      try {
        await deleteIdentity(selectedIdentity.didUri);
        handleBack();
      } catch (error) {
        console.error('Error deleting identity:', error);
      }
    }
  };

  const handleCopyDid = () => {
    navigator.clipboard.writeText(selectedIdentity!.didUri);
    setCopyTooltipOpen(true);
    setTimeout(() => setCopyTooltipOpen(false), 1500);
  };

  const handleTooltipClose = () => {
    setCopyTooltipOpen(false);
  };

  const handleQrCodeClick = () => {
    setQrDialogOpen(true);
  };

  const protocols = useMemo(() => {
    if (!selectedIdentity) return [];
    return listProtocols(selectedIdentity.didUri);
  }, [selectedIdentity]);

  useEffect(() => {
    if (selectedIdentity) {
      loadProtocols(selectedIdentity.didUri);
    }
  }, [selectedIdentity, loadProtocols]);

  const selectedPermissions = useMemo(() => {
    return selectedIdentity?.permissions || [];
  }, [selectedIdentity]);

  useEffect(() => {
    if (selectedIdentity && qrDialogOpen) {
      if (selectedIdentity.avatarUrl) {
        // If there's an avatar URL, use it directly
        setQrImageUrl(selectedIdentity.avatarUrl);
      } else {
        // If no avatar, create a canvas with the first letter
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#000000';
          ctx.beginPath();
          ctx.arc(50, 50, 50, 0, Math.PI * 2, true);
          ctx.fill();
          ctx.fillStyle = '#FFFFFF';
          ctx.font = '50px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(selectedIdentity.name.charAt(0).toUpperCase(), 50, 50);
          setQrImageUrl(canvas.toDataURL());
        }
      }
    }
  }, [selectedIdentity, qrDialogOpen]);

  if (!selectedIdentity) {
    return <Typography>Identity not found</Typography>;
  }

  return (
    <Box>
      <Box sx={{ mb: 2 }}>
        <IconButton onClick={handleBack} aria-label="back">
          <ArrowBack />
        </IconButton>
      </Box>

      <Paper elevation={3} sx={{ mb: 4, overflow: 'hidden' }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            component="img"
            src={selectedIdentity.bannerUrl}
            alt={`${selectedIdentity.name}'s banner`}
            sx={{ width: '100%', height: 200, objectFit: 'cover' }}
          />
          <Avatar
            src={selectedIdentity.avatarUrl}
            alt={`${selectedIdentity.name}'s avatar`}
            sx={{
              width: 120,
              height: 120,
              position: 'absolute',
              bottom: -60,
              left: 24,
              border: `4px solid ${theme.palette.background.paper}`,
              boxShadow: theme.shadows[3],
            }}
          >
            {selectedIdentity.name.charAt(0).toUpperCase()}
          </Avatar>
        </Box>

        <Box sx={{ mt: 8, p: 3 }}>
          <Typography variant="h4">{selectedIdentity.name}</Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {selectedIdentity.displayName}
          </Typography>
          {selectedIdentity.tagline && (
            <Typography variant="body1" sx={{ mt: 1 }}>
              {selectedIdentity.tagline}
            </Typography>
          )}
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Typography variant="caption" sx={{ mr: 1 }}>
              ID: {selectedIdentity.didUri}
            </Typography>
            <IconButton
              size="small"
              onClick={handleQrCodeClick}
              aria-label="show QR code"
              sx={{ p: 0.5, mr: 0.5 }}
            >
              <QrCode2 fontSize="small" sx={{ width: 16, height: 16 }} />
            </IconButton>
            <ClickAwayListener onClickAway={handleTooltipClose}>
              <Tooltip
                title={copyTooltipOpen ? "Copied!" : "Copy to clipboard"}
                placement="right"
                open={copyTooltipOpen}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                PopperProps={{
                  modifiers: [
                    {
                      name: 'offset',
                      options: {
                        offset: [0, -10],
                      },
                    },
                  ],
                }}
              >
                <IconButton
                  size="small"
                  onClick={handleCopyDid}
                  aria-label="copy DID"
                  sx={{ p: 0.5 }}
                >
                  <ContentCopy fontSize="small" sx={{ width: 16, height: 16 }} />
                </IconButton>
              </Tooltip>
            </ClickAwayListener>
          </Box>
        </Box>
      </Paper>

      {selectedIdentity.bio && (
        <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>Bio</Typography>
          <Typography variant="body1">{selectedIdentity.bio}</Typography>
        </Paper>
      )}

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <LinkIcon sx={{ mr: 1 }} />
          <Typography variant="h6">Protocols</Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {protocols.length > 0 ? (
          <List disablePadding>
            {protocols.map((protocol, index) => (
              <ListItem key={index} disablePadding>
                <ListItemText 
                  primary={protocol.protocol} 
                  secondary={protocol.published ? 'Published' : 'Private'}
                />
                {!protocol.published && (
                  <Lock fontSize="small" color="action" />
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">No protocols added yet.</Typography>
        )}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Wallets</Typography>
          <IconButton
            disabled={editWallets.length > 0}
            onClick={() => setEditWallets(selectedIdentity.webWallets)}
            aria-label="Edit wallets"
            size="small"
            sx={{ ml: 'auto' }}
          >
            <Edit />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {!editWallets.length && (
          <List disablePadding>
            {selectedIdentity.webWallets.map((wallet) => (
              <ListItem key={wallet} disablePadding>
                <ListItemText primary={wallet} />
              </ListItem>
            ))}
          </List>
        )}
        {editWallets.length > 0 && (
          <Box>
            {editWallets.map((wallet, index) => (
              <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  value={wallet}
                  fullWidth
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={() => setEditWallets(editWallets.filter(w => w !== wallet))}
                >
                  Remove
                </Button>
              </Box>
            ))}
            <Button
              variant="outlined"
              startIcon={<Add />}
              onClick={() => setEditWallets([...editWallets, ''])}
              sx={{ mt: 1 }}
            >
              Add
            </Button>
            <Box sx={{ mt: 2 }}>
              <Button variant="contained" onClick={() => setEditWallets([])} sx={{ mr: 1 }}>
                Save
              </Button>
              <Button variant="outlined" onClick={() => setEditWallets([])}>
                Cancel
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Permissions</Typography>
        <Divider sx={{ mb: 2 }} />
        {selectedPermissions.length > 0 ? (
          <Box>
            {selectedPermissions.map((permission, index) => (
              <Chip key={index} label={permission} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No permissions assigned yet.</Typography>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          variant="outlined"
          startIcon={<Backup />}
          onClick={() => exportIdentity(selectedIdentity.didUri)}
        >
          Backup
        </Button>
        <Button
          variant="outlined"
          color="error"
          startIcon={<Delete />}
          onClick={() => setShowDeleteConfirmation(true)}
        >
          Delete Identity
        </Button>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteConfirmation}
        onClose={() => setShowDeleteConfirmation(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this identity? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteConfirmation(false)}>
            Cancel
          </Button>
          <Button onClick={handleDeleteIdentity} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* QR Code Dialog */}
      <Dialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)}>
        <DialogTitle sx={{ textAlign: 'center', pb: 0 }}>QR Code for {selectedIdentity.name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
            <QRCodeSVG
              value={selectedIdentity.didUri}
              size={300}
              imageSettings={{
                src: qrImageUrl || '',
                x: undefined,
                y: undefined,
                height: 75,
                width: 75,
                excavate: true,
              }}
            />
          </Box>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Scan this QR code to share the DID
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setQrDialogOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default IdentityDetails;