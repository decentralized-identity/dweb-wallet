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
  Checkbox,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Paper,
} from '@mui/material';
import {
  ArrowBack,
  Edit,
  Add,
  Lock,
  Delete,
  Backup,
} from '@mui/icons-material';

const IdentityDetails: React.FC = () => {
  const { didUri } = useParams();
  const navigate = useNavigate();
  const { identities, deleteIdentity, exportIdentity } = useIdentities();
  const { addProtocol, listProtocols, loadProtocols } = useProtocols();
  const [ editWallets, setEditWallets ] = useState<string[]>([]);
  const [protocolUrl, setProtocolUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddProtocol, setShowAddProtocol] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const selectedIdentity = identities.find(identity => identity.didUri === didUri);

  const handleBack = () => {
    navigate('/identities');
  };

  const handleAddProtocol = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIdentity && protocolUrl) {
      setIsLoading(true);
      try {
        await addProtocol(selectedIdentity.didUri, protocolUrl, isPublished);
        setProtocolUrl('');
        setIsPublished(false);
        setShowAddProtocol(false);
      } catch (error) {
        console.error('Error adding protocol:', error);
      } finally {
        setIsLoading(false);
      }
    }
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

  useEffect(() => {
    if (selectedIdentity) {
      loadProtocols(selectedIdentity.didUri);
    }
  }, [selectedIdentity, loadProtocols]);

  const selectedPermissions = useMemo(() => {
    return selectedIdentity?.permissions || [];
  }, [selectedIdentity]);

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

      <Paper elevation={3} sx={{ mb: 4, position: 'relative', overflow: 'hidden' }}>
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
            border: '4px solid white',
          }}
        />
      </Paper>

      <Box sx={{ ml: 2, mb: 4 }}>
        <Typography variant="h4">{selectedIdentity.name}</Typography>
        <Typography variant="subtitle1">{selectedIdentity.displayName}</Typography>
        {selectedIdentity.tagline && (
          <Typography variant="body1" sx={{ mt: 1 }}>{selectedIdentity.tagline}</Typography>
        )}
        <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
          ID: {selectedIdentity.didUri}
        </Typography>
      </Box>

      {selectedIdentity.bio && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6">Bio</Typography>
          <Typography variant="body1">{selectedIdentity.bio}</Typography>
        </Box>
      )}

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Protocols</Typography>
          <IconButton
            onClick={() => setShowAddProtocol(!showAddProtocol)}
            aria-label="Add protocol"
            size="small"
            sx={{ ml: 1 }}
          >
            <Add />
          </IconButton>
        </Box>
        {listProtocols(selectedIdentity.didUri).length > 0 ? (
          <List>
            {listProtocols(selectedIdentity.didUri).map((protocol, index) => (
              <ListItem key={index}>
                <ListItemText primary={protocol.protocol} />
                {!protocol.published && (
                  <Lock fontSize="small" color="action" />
                )}
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2">No protocols added yet.</Typography>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Wallets</Typography>
          <IconButton
            disabled={editWallets.length > 0}
            onClick={() => setEditWallets(selectedIdentity.webWallets)}
            aria-label="Edit wallets"
            size="small"
            sx={{ ml: 1 }}
          >
            <Edit />
          </IconButton>
        </Box>
        {!editWallets.length && (
          <List>
            {selectedIdentity.webWallets.map((wallet) => (
              <ListItem key={wallet}>
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
      </Box>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Permissions</Typography>
        {selectedPermissions.length > 0 ? (
          <Box>
            {selectedPermissions.map((permission, index) => (
              <Chip key={index} label={permission} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
        ) : (
          <Typography variant="body2">No permissions assigned yet.</Typography>
        )}
      </Box>

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

      {/* Add Protocol Dialog */}
      <Dialog open={showAddProtocol} onClose={() => setShowAddProtocol(false)}>
        <DialogTitle>Add a Protocol</DialogTitle>
        <DialogContent>
          <form onSubmit={handleAddProtocol}>
            <TextField
              autoFocus
              margin="dense"
              id="protocolUrl"
              label="Protocol URL"
              type="text"
              fullWidth
              variant="outlined"
              value={protocolUrl}
              onChange={(e) => setProtocolUrl(e.target.value)}
              placeholder="https://example.com/protocol"
              required
              disabled={isLoading}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  disabled={isLoading}
                />
              }
              label="Published"
            />
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddProtocol(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleAddProtocol} disabled={isLoading}>
            {isLoading ? 'Adding...' : 'Add Protocol'}
          </Button>
        </DialogActions>
      </Dialog>

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
    </Box>
  );
};

export default IdentityDetails;