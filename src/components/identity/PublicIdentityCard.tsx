import React, { useState } from 'react';
import { Typography, Avatar, Box, styled, useTheme, alpha, Tooltip, ClickAwayListener, Paper, Divider, IconButton, List, Dialog, DialogTitle, DialogContent, Button} from '@mui/material';
import Grid from '@mui/material/Grid2';
import { SocialData } from '@/lib/types';
import { ContentCopy, Person2Outlined, QrCode2 } from '@mui/icons-material';
import { QRCodeCanvas } from 'qrcode.react';

interface Props {
  did: string;
  social?: SocialData
  heroUrl?: string;
  avatarUrl?: string;
}

const BannerOverlay = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(to bottom, ${alpha(theme.palette.common.black, 0)} 0%, ${alpha(theme.palette.common.black, 0.7)} 100%)`,
}));

const PublicIdentityCard: React.FC<Props> = ({ did, social, heroUrl, avatarUrl }) => {
  const theme = useTheme();
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  const handleCopyDid = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(did);
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 1500);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ maxWidth: 1200, margin: '0 auto', px: 3 }}>
        <Paper elevation={3} sx={{ mt: 3, mb: 4 }}>
          <Box sx={{ position: 'relative', height: 300 }}>
            <Box
              component="img"
              src={heroUrl}
              alt={`${social?.displayName || 'user'}'s banner`}
              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <BannerOverlay />
              <Box sx={{ position: 'absolute', bottom: 16, left: 16, right: 16, display: 'flex', alignItems: 'flex-end' }}>
              <Avatar
                src={avatarUrl}
                alt={social?.displayName || 'user'}
                sx={{ width: 120, height: 120, border: `4px solid ${theme.palette.background.paper}`, mr: 2 }}
            >
              {social?.displayName?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ flexGrow: 1 }}>
              {social?.displayName && (
                <Typography variant="subtitle1" sx={{ color: 'common.white', textShadow: '0 1px 2px rgba(0,0,0,0.6)' }}>
                  {social.displayName}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <Box sx={{ p: 3 }}>
          <Typography variant="body1" gutterBottom>{social?.tagline}</Typography>
          <Divider sx={{ my: 2 }} />
          <Grid container spacing={2}>
            <Grid size={12}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Person2Outlined sx={{ mr: 1 }} />
                <Typography variant="body2" sx={{ mr: 1 }}>
                  {did}
                </Typography>
                <ClickAwayListener onClickAway={handleTooltipClose}>
                  <Tooltip
                    title="Copy DID"
                    open={tooltipOpen}
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
          </Grid>
          {social?.bio && (
            <>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2">{social.bio}</Typography>
            </>
          )}
        </Box>
        </Paper>
      </Box>

      <Box sx={{ maxWidth: 1200, margin: '0 auto', px: 3 }}>
        <Grid container spacing={3}>
          {/* Protocols section */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Paper elevation={1} sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" gutterBottom>Protocols</Typography>
              <Divider sx={{ mb: 2 }} />
              <List>
                {/* {protocols.map((protocol, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {protocol.published ? <Public fontSize="small" /> : <Lock fontSize="small" />}
                    </ListItemIcon>
                    <ListItemText primary={protocol.protocol} secondary={protocol.published ? 'Published' : 'Private'} />
                  </ListItem>
                ))} */}
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {showQrCode && 
        <Dialog open={showQrCode} onClose={() => setShowQrCode(false)} >
          <DialogTitle sx={{ textAlign: 'center' }}>Scan QR Code</DialogTitle>
          <DialogContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
              <QRCodeCanvas
                value={did}
                size={256}
                bgColor={'#FFFFFF'}
                fgColor={'#000000'}
                level="Q"
                imageSettings={{
                  src: avatarUrl || '',
                  height: 67,
                  width: 67,
                  excavate: true,
                }}
              />
            </Box>
            <Typography variant="caption" sx={{ textAlign: 'center' }}>{did}</Typography>
            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Scan the QR code to resolve this identity. 
            </Typography>
            <Button onClick={() => setShowQrCode(false)} sx={{ mt: 2, display: 'block', margin: '0 auto' }}>Close</Button>
          </DialogContent>
        </Dialog>
      }
    </Box>
  );
}

export default PublicIdentityCard;