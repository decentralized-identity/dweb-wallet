import React, { useMemo } from 'react';
import { Convert } from '@web5/common';
import { profileDefinition } from '@/contexts/protocols';

interface Props {
  did: string;
}

const PublicIdentityCard: React.FC<Props> = ({ did }) => {

  const profileProtocolB64 = Convert.string(profileDefinition.protocol).toBase64Url();

  const bannerUrl = useMemo(() => {
    return `https://dweb/${did}/read/protocols/${profileProtocolB64}/hero`;
  }, [did]);

  const avatarUrl = useMemo(() => {
    return `https://dweb/${did}/read/protocols/${profileProtocolB64}/avatar`;
  }, [did]);
  
  return (
    <div className="relative">
      <img 
        src={bannerUrl} 
        alt={`${did}'s banner`}
      />
      <div>
        <img 
          src={avatarUrl} 
          alt={`${did}'s avatar`} 
        />
      </div>
    </div>
  );
}

export default PublicIdentityCard;