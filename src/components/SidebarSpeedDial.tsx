import React from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import { CameraAlt, Download, PersonAddAlt1 } from '@mui/icons-material';

const actions = [
  { icon: <PersonAddAlt1 />, name: 'Create a new DID' },
  { icon: <CameraAlt />, name: 'Scan QR code' },
  { icon: <Download />, name: 'Import a DID' },
];

const SidebarSpeedDial: React.FC<{ sx?: React.CSSProperties }> = ({ sx }) => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial with persistent tooltips"
      sx={sx}
      icon={<SpeedDialIcon />}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          tooltipOpen
          sx={{
            '& .MuiSpeedDialAction-staticTooltipLabel': {
              maxWidth: 'none',
              whiteSpace: 'nowrap',
            },
          }}
        />
      ))}
    </SpeedDial>
  );
}

export default SidebarSpeedDial;
