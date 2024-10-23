import { Did } from '@web5/dids';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Convert } from '@web5/common';
import { profileDefinition } from '@/lib/ProfileProtocol';
import { Identity, SocialData } from '@/lib/types';
import IdentityProfile from '@/components/identity/IdentityProfile';
import { DwnProtocolDefinition, getDwnServiceEndpointUrls } from '@web5/agent';
import { useAgent } from '@/contexts/Context';
import { Field, Fieldset, Input } from '@headlessui/react';

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

  return (<div>
    <section className={`relative sm:px-8 md:px-12 max-w-screen-lg mx-auto`}>
      <div className="mt-10 flex flex-col break-words bg-white w-full mb-10 shadow-xl">
        <div className="w-full p-4 divide-y-2 divide-dotted divide-slate-300 mb-2">
          <div className="text-xl text-left pl-4">
          Search for an Identity
          </div>
          <Fieldset>
            <Field className="w-full mt-5">
              <Input
                type='text'
                placeholder="did:web:example.com"
                name="did"
                value={didInput}
                onChange={handleInputChange}
                required={true}
                className={
                  'mt-1 block w-full rounded-lg border-none py-3 px-4 text-slate-700 outline outline-2 outline-slate-200 ' +
                  'focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-slate-700'
                }
              />
            </Field>
          </Fieldset>
        </div>
      </div>
    </section>
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
  </div>);
}

export default SearchIdentitiesPage;