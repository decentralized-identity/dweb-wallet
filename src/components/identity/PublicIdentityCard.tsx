import React, { useMemo } from 'react';
import { Convert } from '@web5/common';
import { profileDefinition } from '@/contexts/protocols';
import { Card, CardContent, CardMedia, Typography, Avatar, Box, styled } from '@mui/material';
import { truncateDid } from '@/lib/utils';

interface Props {
  did: string;
}

const StyledCard = styled(Card)(({ theme }) => ({
  position: 'relative',
  marginBottom: theme.spacing(2),
}));

const AvatarWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  left: theme.spacing(2),
}));

const PublicIdentityCard: React.FC<Props> = ({ did }) => {
  const profileProtocolB64 = Convert.string(profileDefinition.protocol).toBase64Url();

  const bannerUrl = useMemo(() => {
    return `https://dweb/${did}/read/protocols/${profileProtocolB64}/hero`;
  }, [did]);

  const avatarUrl = useMemo(() => {
    return `https://dweb/${did}/read/protocols/${profileProtocolB64}/avatar`;
  }, [did]);
  
  return (
    <StyledCard>
      <CardMedia
        component="img"
        height="140"
        image={bannerUrl}
        alt={`${did}'s banner`}
      />
      <AvatarWrapper>
        <Avatar 
          src={avatarUrl} 
          alt={`${did}'s avatar`}
          sx={{ 
            width: 56, 
            height: 56, 
            border: '2px solid white'
          }}
        />
      </AvatarWrapper>
      <CardContent>
        <Typography variant="h6" component="div">
          Public Identity
        </Typography>
        <Typography variant="caption">
          {truncateDid(did, 50)}
        </Typography>
      </CardContent>
    </StyledCard>
  );
}

export default PublicIdentityCard;