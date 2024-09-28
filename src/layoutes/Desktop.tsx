import React, { useRef, useEffect, useState } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer } from '@mui/material';
import { useIdentities } from '@/contexts/Context';
import IdentityCard from '@/components/identity/IdentityCard';
import { Outlet, useNavigate } from 'react-router-dom';
import { Identity } from '@/types';
import SidebarSpeedDial from '@/components/SidebarSpeedDial';
import { CameraAlt, PersonAddAlt1 } from '@mui/icons-material';
import { Download } from 'lucide-react';
import { PortableIdentity } from '@web5/agent';

const drawerWidth = 400; // Wider drawer for identity cards
const topBarHeight = 64; // Standard AppBar height

const Desktop: React.FC = () => {
  const navigate = useNavigate();
  const { identities, selectedIdentity, setSelectedIdentity, importIdentity } = useIdentities();
  const [ isDragging, setIsDragging ] = useState(false);
  const [ droppedFiles, setDroppedFiles ] = useState<File[]>([]);

  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadIdentities = async () => {
      const uniqueIdentities = new Map<string, PortableIdentity>();
      const identities = await Promise.all(droppedFiles.map(async f => JSON.parse(await f.text()) as PortableIdentity));
      identities.forEach(i => uniqueIdentities.set(i.portableDid.uri, i));
      await importIdentity(...Array.from(uniqueIdentities.values())); 
      setDroppedFiles([]);
    }

    if (droppedFiles.length > 0) {
      loadIdentities();
    }
  }, [ droppedFiles, importIdentity ]);

  useEffect(() => {
    // Handlers for the drag events
    const handleDragEnter = (e: DragEvent) => {
      console.log('handleDragEnter');
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragOver = (e: DragEvent) => {
      console.log('handleDragOver');
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e: DragEvent) => {
      console.log('handleDragLeave');
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();


      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        setDroppedFiles(filesArray as File[]);
        e.dataTransfer.clearData();
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    }
  }, [])

  useEffect(() => {
    const preventPropagation = (e: WheelEvent) => {
      e.stopPropagation();
    };

    const leftPane = leftPaneRef.current;
    const rightPane = rightPaneRef.current;

    if (leftPane) leftPane.addEventListener('wheel', preventPropagation);
    if (rightPane) rightPane.addEventListener('wheel', preventPropagation);

    return () => {
      if (leftPane) leftPane.removeEventListener('wheel', preventPropagation);
      if (rightPane) rightPane.removeEventListener('wheel', preventPropagation);
    };
  }, []);

  const handleIdentityClick = (identity: Identity) => {
    setSelectedIdentity(identity);
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
            ref={leftPaneRef}
            sx={{ 
              p: 2, 
              height: '100%', 
              overflowY: 'auto',
              overscrollBehavior: 'contain',
            }}
          >
            {identities.map((identity) => (
              <IdentityCard
                key={identity.didUri}
                identity={identity}
                selected={selectedIdentity?.didUri === identity.didUri}
                onClick={() => handleIdentityClick(identity)}
                compact={true}
              />
            ))}
          </Box>
        </Drawer>

        {/* Main content */}
        <Box 
          ref={rightPaneRef}
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
      {isDragging && (
        <Box 
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: (theme) => theme.zIndex.drawer + 1,
          }}
        />
      )}
    </Box>
  );
};

export default Desktop;
