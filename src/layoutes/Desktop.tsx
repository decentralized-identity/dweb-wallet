import React, { useRef, useEffect } from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer } from '@mui/material';
import { useIdentities } from '@/contexts/Context';
import IdentityCard from '@/components/identity/IdentityCard';
import { Outlet, useNavigate } from 'react-router-dom';
import { Identity } from '@/types';
import SidebarSpeedDial from '@/components/SidebarSpeedDial';
import { CameraAlt, PersonAddAlt1 } from '@mui/icons-material';
import { Download } from 'lucide-react';

const drawerWidth = 400; // Wider drawer for identity cards
const topBarHeight = 64; // Standard AppBar height
const bottomBarHeight = 50; // Custom height for bottom bar

const Desktop: React.FC = () => {
  const navigate = useNavigate();
  const { identities, selectedIdentity, setSelectedIdentity } = useIdentities();
  const leftPaneRef = useRef<HTMLDivElement>(null);
  const rightPaneRef = useRef<HTMLDivElement>(null);

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
        pb: `${bottomBarHeight}px`
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
              height: `calc(100% - ${topBarHeight}px - ${bottomBarHeight}px)`,
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

      {/* Bottom Bar */}
      <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, height: bottomBarHeight }}>
        <Toolbar variant="dense">
          <Typography variant="body2">
            © 2024 Digital Identity Wallet
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Desktop;
