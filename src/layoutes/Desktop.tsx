import React from 'react';
import { Box, AppBar, Toolbar, Typography, Drawer, List, SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { useIdentities } from '@/contexts/Context';
import IdentityCard from '@/components/identity/IdentityCard';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import { Outlet, useNavigate } from 'react-router-dom';
import { Identity } from '@/types';

const drawerWidth = 400; // Wider drawer for identity cards
const topBarHeight = 64; // Standard AppBar height
const bottomBarHeight = 50; // Custom height for bottom bar

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

const Desktop: React.FC = () => {
  const { identities, selectedIdentity, setSelectedIdentity } = useIdentities();
  const navigate = useNavigate();

  const handleIdentityClick = (identity: Identity) => {
    setSelectedIdentity(identity);
    navigate(`/identity/${identity.didUri}`);
  };

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
      <Box sx={{ display: 'flex', flexGrow: 1, pt: `${topBarHeight}px`, pb: `${bottomBarHeight}px` }}>
        {/* Sidebar */}
        <Drawer
          variant="permanent"
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: { 
              width: drawerWidth, 
              boxSizing: 'border-box',
              height: `calc(100% - ${topBarHeight}px - ${bottomBarHeight}px)`,
              top: `${topBarHeight}px`,
            },
          }}
        >
          <Box sx={{ overflow: 'auto', p: 2, height: '100%', position: 'relative' }}>
            <List>
              {identities.map((identity) => (
                <IdentityCard
                  key={identity.didUri}
                  identity={identity}
                  selected={selectedIdentity?.didUri === identity.didUri}
                  onClick={() => handleIdentityClick(identity)}
                />
              ))}
            </List>
            
            {/* SpeedDial component */}
            <SpeedDial
              ariaLabel="SpeedDial with persistent tooltips"
              sx={{ position: 'absolute', bottom: 16, right: 16 }}
              icon={<SpeedDialIcon />}
            >
              {actions.map((action) => (
                <SpeedDialAction
                  key={action.name}
                  icon={action.icon}
                  tooltipTitle={action.name}
                  tooltipOpen
                />
              ))}
            </SpeedDial>
          </Box>
        </Drawer>

        {/* Main content */}
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: `calc(100% - ${drawerWidth}px)`,
            overflow: 'auto',
            height: `calc(100vh - ${topBarHeight}px - ${bottomBarHeight}px)`,
          }}
        >
          <Outlet />
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
