import React from 'react';
import { SpeedDial, SpeedDialIcon, SpeedDialAction } from '@mui/material';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

const actions = [
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];

const SidebarSpeedDial: React.FC = () => {
  return (
    <SpeedDial
      ariaLabel="SpeedDial with persistent tooltips"
      sx={{ position: 'absolute', top: 16, right: 16 }}
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
  );
}

export default SidebarSpeedDial;
