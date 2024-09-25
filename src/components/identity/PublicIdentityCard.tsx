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
        className="w-full h-20 object-cover"
      />
      <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-10 z-20">
        <img 
          src={avatarUrl} 
          alt={`${did}'s avatar`} 
          className="w-20 h-20 rounded-full border-2 border-surface-light dark:border-surface-dark shadow-lg"
        />
      </div>
    </div>
  );
}

export default PublicIdentityCard;