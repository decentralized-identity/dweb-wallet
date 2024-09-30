import React, { useCallback, useEffect, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, Dialog, DialogTitle, DialogContent, Button } from '@mui/material';
import { useIdentities, useProfile } from '@/contexts/Context';
import IdentityCard from '@/components/identity/IdentityCard';
import { Outlet, useNavigate } from 'react-router-dom';
import SidebarSpeedDial from '@/components/SidebarSpeedDial';
import { CameraAlt, PersonAddAlt1 } from '@mui/icons-material';
import { Download } from 'lucide-react';
import { PortableIdentity } from '@web5/agent';
import { Identity } from '@/contexts/IdentitiesContext';
import { ProfileProvider } from '@/contexts/ProfileContext';

const drawerWidth = 400; // Wider drawer for identity cards
export const topBarHeight = 64; // Standard AppBar height

const Desktop: React.FC = () => {
  const navigate = useNavigate();
  const { identities, selectedIdentity, selectIdentity, importIdentity } = useIdentities();
  const [ isDragging, setIsDragging ] = useState(false);
  const [ droppedFiles, setDroppedFiles ] = useState<File[]>([]);

  const handleDragLeave = useCallback((e: DragEvent) =>  {
    console.log('drag leave');
    e.stopPropagation();
    e.preventDefault();

    if (isDragging) {
      setIsDragging(false);
    }
  }, [setIsDragging]);

  const handleDrop = useCallback((e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const filesArray = Array.from(e.dataTransfer.files);
      setDroppedFiles(filesArray as File[]);
      e.dataTransfer.clearData();
    }
  }, [setDroppedFiles]);

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.stopPropagation();
    e.preventDefault();

    if (isDragging) return;

    setIsDragging(true);
  }, [isDragging, setIsDragging]);

  useEffect(() => {
    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragenter', handleDragEnter);
    };
  }, [ ]);

  useEffect(() => {
    const loadIdentities = async () => {
      if (isDragging) return;
      const uniqueIdentities = new Map<string, PortableIdentity>();
      const identities = await Promise.all(droppedFiles.map(async f => JSON.parse(await f.text()) as PortableIdentity));
      identities.forEach(i => uniqueIdentities.set(i.portableDid.uri, i));
      await importIdentity(window.location.origin, ...Array.from(uniqueIdentities.values())); 
      setDroppedFiles([]);
    }

    if (droppedFiles.length > 0) {
      loadIdentities();
    }
  }, [ droppedFiles, importIdentity ]);

  const handleIdentityClick = (identity: Identity) => {
    selectIdentity(identity.didUri);
    navigate(`/identity/${identity.didUri}`);
  };

  const actions = [
    { icon: <PersonAddAlt1 />, name: 'Create a new DID', handler: () => navigate('/identity/create') },
    { icon: <CameraAlt />, name: 'Scan QR code', handler: () => navigate('/identity/scan') },
    { icon: <Download />, name: 'Import a DID', handler: () => navigate('/identity/import') },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      {/* Top Bar */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Digital Identity Wallet
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main content area */}
      <Box sx={{ 
        display: 'flex', 
        flexGrow: 1, 
        pt: `${topBarHeight}px`, 
      }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              top: `${topBarHeight}px`,
              height: `calc(100% - ${topBarHeight}px`,
              overflowY: 'auto',
            },
          }}
        >
          <Box 
            sx={{ 
              p: 2, 
              height: '100%', 
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            }}
          >
            {identities.map((identity) => (
              <ProfileProvider key={identity.didUri} identity={identity}>
                <IdentityCard
                  key={identity.didUri}
                  identity={identity}
                  selected={selectedIdentity?.didUri === identity.didUri}
                  onClick={() => handleIdentityClick(identity)}
                  compact={true}
                />
              </ProfileProvider>
            ))}
          </Box>
        </Drawer>

        {/* Main content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            width: `calc(100% - ${drawerWidth}px)`,
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            position: 'relative',
          }}
        >
          <Outlet />
          <SidebarSpeedDial
            actions={actions}
            sx={{
              position: 'absolute',
              bottom: 15,
              right: 15,
            }}
          />
        </Box>
      </Box>

      {/* Drag and drop area */}
        <Dialog open={isDragging || droppedFiles.length > 0} onClose={() => setIsDragging(false)}>
          <DialogTitle>Import DIDs</DialogTitle>
          <DialogContent>
            {droppedFiles.length > 0 && (
              <Typography>Importing...</Typography>
            ) || (
              <Typography>Drop your DID files here to import</Typography>
            )}
          </DialogContent>
        </Dialog>
    </Box>
  );
};

export default Desktop;
