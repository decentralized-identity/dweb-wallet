import React, { useEffect, useMemo, useState } from 'react';
import { generateGradient, truncateDid } from '@/lib/utils';
import { useAgent } from '@/contexts/Context';
import { Identity } from '@/lib/types';
import { loadProfileFromDidUri } from '@/contexts/IdentitiesContext';
import CircleProgress from '../CircleProgress';

const IdentityProfileCard: React.FC<{
  didUri: string;
  onClick?: () => void;
}> = ({ didUri, onClick }) => {
  const { agent } = useAgent();
  const [ identity, setIdentity ] = useState<Identity | null>(null);

  useEffect(() => {
    const loadIdentity = async (didUri: string) => {
      const profile = await loadProfileFromDidUri(agent!, didUri);
      setIdentity(profile);
    }

    if (agent && (!identity || identity.didUri !== didUri)) {
      loadIdentity(didUri);
    }
  }, [ didUri ]);


  const displayName = useMemo(() => identity?.profile.social?.displayName, [identity]);
  const persona = useMemo(() => identity?.persona, [identity]);

  const heroStyle = useMemo(() => {
    if (identity?.profile.heroUrl) {
      return {
        backgroundPosition: 'center',
        backgroundImage: `url(${identity.profile.heroUrl})`,
        backgroundSize: 'cover',
      };
    } else {
      return {
        backgroundSize: 'cover',
        background: generateGradient(didUri.split(':')[2]),
      };
    }
  }, [ identity ]);

  const hoverStyle = useMemo(() => {
    if(onClick) {
      return `group-hover:from-primary-800/90 group-hover:via-primary/80`;
    }

    return '';
  },  [ onClick ]);

  const clickHandler = () => {
    if(onClick) {
      onClick();
    }
  }

  return (
    <section className={`group ${ hoverStyle ? 'cursor-pointer' : 'cursor-default' } relative sm:px-8 md:px-12 max-w-screen-lg mx-auto`} onClick={clickHandler}>
      {identity && <div className={`relative flex break-words w-full mb-6 shadow-xl h-44`} style={heroStyle}>
        <span className={`w-full h-full absolute bg-gradient-to-t from-primary-900/90 to-transparent via-primary/90 ${hoverStyle}`}></span>
        <div className="relative self-center ml-4 w-36 h-36 flex items-center rounded justify-center shadow-xl overflow-hidden border-8 border-white border-opacity-40">
          {identity.profile.avatarUrl ? (
            <img src={identity.profile.avatarUrl} alt="Avatar" />
          ) : (
            <div
              style={{ background: generateGradient(identity.didUri.split(':')[2], true) }}
              className="relative bg-gray-300 w-full h-full flex items-center justify-center text-slate-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <div className="w-full h-full absolute opacity-60 bg-gradient-to-t from-gray-900 to-transparent"></div>
            </div>
          )}
        </div>
        <div className="relative self-end px-4 pb-4">
          <h3 className="text-3xl font-semibold leading-normal text-background mb-2">
            {displayName}
            {persona && <span className="text-sm italic text-background/40 ml-2">({persona})</span>}
          </h3>
          <div className="flex">
            <span className="text-background">{truncateDid(identity.didUri)}</span>
            <div
              className="text-background/70 ml-3 cursor-pointer hover:text-background/40 transition-colors duration-200 tooltip-action"
              onClick={async (e) => {
                const currentTarget = e.currentTarget;
                await navigator.clipboard.writeText(identity.didUri);
                currentTarget.classList.add('tooltip-active');
                setTimeout(() => currentTarget.classList.remove('tooltip-active'), 1000);
              }}
            >
              <span className="tooltip bg-background text-primary">Copied</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
              </svg>
            </div>
          </div>
        </div>
      </div>}
      {!identity && <div className='relative flex w-full h-44'>
        <CircleProgress size='medium' />
      </div>}
    </section>
  );
};

export default IdentityProfileCard;