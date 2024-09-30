import React, { useEffect, useMemo, useState } from 'react';
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
  left: '50%',
  bottom: 0,
  transform: 'translate(-50%, 50%)',
  zIndex: theme.zIndex.appBar,
}));

const PublicIdentityCard: React.FC<Props> = ({ did }) => {
  const profileProtocolB64 = Convert.string(profileDefinition.protocol).toBase64Url();
  const [ displayName, setDisplayName ] = useState<string>('');

  useEffect(() => {
    const fetchSocial = async () => {
      const social = await fetch(`https://dweb/${did}/read/protocols/${profileProtocolB64}/social`);
      const socialData = await social.json();
      setDisplayName(socialData.displayName);
    };

    fetchSocial();
  }, [did]);

  const bannerUrl = useMemo(() => {
    return `https://dweb/${did}/read/protocols/${profileProtocolB64}/hero`;
  }, [did]);

  const avatarUrl = useMemo(() => {
    return `https://dweb/${did}/read/protocols/${profileProtocolB64}/avatar`;
  }, [did]);
  
  return (
    <StyledCard sx={{ mx: 1, }}> {/* Increased bottom margin to accommodate avatar */}
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="100"
          image={bannerUrl}
          alt={`${did}'s banner`}
          sx={{
            borderRadius: '12px 12px 0 0', // Rounded corners only at the top
          }}
        />
        <AvatarWrapper>
          <Avatar 
            src={avatarUrl} 
            alt={`${ displayName || did}'s avatar`}
            sx={{ 
              width: 60, 
              height: 60, 
              border: '4px solid white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}
          />
        </AvatarWrapper>
      </Box>
      <CardContent sx={{ pt: 3 }}>
        <Typography variant="h6" component="div" align="center" sx={{ mt: 1 }}>
          {displayName || truncateDid(did, 45)}
        </Typography>
        { displayName && <Typography variant="caption" display="block" align="center">
          {did}
        </Typography>}
      </CardContent>
    </StyledCard>
  );
}

export default PublicIdentityCard;