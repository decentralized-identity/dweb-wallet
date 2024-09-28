import React, { useState } from 'react';
import { Card, CardContent, CardMedia, Typography, Avatar, Box, styled, Tooltip, ClickAwayListener, useTheme } from '@mui/material';
import { Identity } from '@/types';
import { truncateDid } from '@/lib/utils';
import { CopyIcon } from 'lucide-react';

interface IdentityCardProps {
  identity: Identity;
  selected: boolean;
  onClick: () => void;
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
  transition: theme.transitions.create(['background-color', 'box-shadow'], {
    duration: theme.transitions.duration.short,
  }),
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
}));

const IdentityCard: React.FC<IdentityCardProps> = ({ identity, selected, onClick }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const theme = useTheme();

  const handleCopyDid = (event: React.MouseEvent) => {
    event.stopPropagation();
    navigator.clipboard.writeText(identity.didUri);
    setTooltipOpen(true);
    setTimeout(() => setTooltipOpen(false), 1500);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
  };

  return (
    <StyledCard 
      onClick={onClick}
      raised={selected}
      sx={{ 
        cursor: selected ? 'default' : 'pointer',
        bgcolor: selected ? 'action.selected' : 'background.paper',
      }}
    >
      <CardMedia
        component="img"
        height="140"
        sx={{ opacity: selected ? 0.5 : 1 }}
        image={identity.bannerUrl}
        alt={`${identity.name}'s banner`}
      />
      <AvatarWrapper>
        <Avatar 
          src={identity.avatarUrl} 
          alt={identity.name}
          sx={{ 
            width: 56, 
            height: 56, 
            border: selected ? `3px solid ${theme.palette.primary.main}` : '2px solid white'
          }}
        >
          {identity.name.charAt(0).toUpperCase()}
        </Avatar>
      </AvatarWrapper>
      <CardContent>
        <Typography variant="h6" component="div">
          {identity.name}
        </Typography>
        {identity.displayName && (
          <Typography variant="body2">
            {identity.displayName}
          </Typography>
        )}
        <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center' }}>
          {truncateDid(identity.didUri, 50)}
          {selected && <ClickAwayListener onClickAway={handleTooltipClose}>
            <Tooltip
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 2 }}
              placement="right"
              onClose={handleTooltipClose}
              open={tooltipOpen}
              title="Copied!"
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
              <Box component="span" sx={{ ml: 0.5, cursor: 'pointer' }}>
                <CopyIcon size={12} onClick={handleCopyDid} />
              </Box>
            </Tooltip>
          </ClickAwayListener>}
        </Typography>
      </CardContent>
    </StyledCard>
  );
};

export default IdentityCard;
