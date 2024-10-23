import PublicIdentityCard from '@/components/identity/PublicIdentityCard';
import { TextField } from '@mui/material';
import { Did } from '@web5/dids';
import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PageContainer } from '@toolpad/core';
import { Convert } from '@web5/common';
import { profileDefinition } from '@/lib/ProfileProtocol';
import { Identity, SocialData } from '@/lib/types';
import { truncateDid } from '@/lib/utils';
import IdentityProfile from '@/components/identity/IdentityProfile';
import { DwnProtocolDefinition, getDwnServiceEndpointUrls } from '@web5/agent';
import { useAgent } from '@/contexts/Context';

const profileProtocolB64 = Convert.string(profileDefinition.protocol).toBase64Url();

const SearchIdentitiesPage: React.FC = () => {
  const { didUri } = useParams<{ didUri: string }>();
  const { agent } = useAgent();
  const navigate = useNavigate();

  const [ didInput, setDidInput ] = useState('');
  const [ did, setDid ] = useState('');
  const [ identity, setIdentity ] = useState<Identity>();
  const [ protocols, setProtocols ] = useState<DwnProtocolDefinition[]>([]);
  const [ endpoints, setEndpoints ] = useState<string[]>([]);

  useEffect(() => {
    const fetchSocial = async (did: string) => {
      const social = await fetch(`https://dweb/${did}/read/protocols/${profileProtocolB64}/social`);
      const socialData = await social.json();

      try {
        const protocols = await fetch(`https://dweb/${did}/query/protocols`);
        if (protocols.ok) {
          const protocolsResponse = await protocols.json() as { descriptor: { definition: DwnProtocolDefinition } }[];
          setProtocols(protocolsResponse.map(p => p.descriptor.definition));
        }
      } catch (error) {
        console.error('Failed to load identity protocols', error);
      }

      setIdentity({
        didUri: did,
        profile: {
          avatarUrl: `https://dweb/${did}/read/protocols/${profileProtocolB64}/avatar`,
          heroUrl: `https://dweb/${did}/read/protocols/${profileProtocolB64}/hero`,
          social: socialData as SocialData
        }
      });
    };

    const fetchEndpoints = async (did: string) => {
      const endpoints = await getDwnServiceEndpointUrls(did, agent!.did)
      setEndpoints(endpoints);
    }

    if (!identity && did) {
      fetchSocial(did);
      fetchEndpoints(did);
    }

  }, [ did, identity ]);

  useEffect(() => {
    if (didUri) {
      setDid(didUri);
      setDidInput(didUri);
    }
  }, [ didUri ]);

  const social = useMemo(() => {
    return identity ? identity.profile.social : undefined;
  }, [ identity ]);

  const title = useMemo(() => {
    return social ? social.displayName : did ? truncateDid(did) : 'Search';
  }, [ social, did ]);

  const path = useMemo(() => {
    return did ? `/search/${did}` : '/search';
  }, [ did ]);

  const breadCrumbs = did ? [{ title: 'Find DIDs', path: '/search' }, { title, path }]: [{ title: 'Find DIDs', path: '/search' }, { title, path }];

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    setDidInput(e.target.value);
    const did = Did.parse(e.target.value);
    if (did) {
      const didResolution = await fetch(`https://dweb/${did.uri}`);
      if (didResolution.ok) {
        const didResolutionData = await didResolution.json();
        if (didResolutionData.didDocument) {
          navigate(`/search/${did.uri}`);
          return;
        }
      }
    } 
    navigate('/search');
    setDid('');
  }

  return (<PageContainer title={title} breadcrumbs={breadCrumbs}>
    <TextField
      fullWidth
      label="Search for a DID"
      placeholder="did:web:example.com"
      name="did"
      value={didInput}
      onChange={handleInputChange}
    />
    <div className="mt-5">
      {identity && <IdentityProfile
        identity={identity}
        protocols={protocols}
        endpoints={endpoints}
        contain={true}
        rounded={true}
        showInactiveTabs={false}
      />}
    </div>
  </PageContainer>)
}

export default SearchIdentitiesPage;