import React, { useMemo } from 'react';
import { Identity } from '@/lib/types';
import { truncateDid } from '@/lib/utils';

export function generateGradient(byteString: string, inverse:boolean = false) {
  if (byteString.length < 32) {
    throw new Error("Input must be at least 32 bytes long.");
  }

  const colorNumber = 3;
  const colorSeparation = 60;
  const byteValues = Array.from(byteString, (char) => char.charCodeAt(0));
  const saturation = 80 + (byteValues[0] % 15); // Saturation between 85-100%
  const lightness = 45 + (byteValues[1] % 20); // Lightness between 50-70%
  const baseHue = (byteValues[2] * 1.4) % 360;

  // Generate three colors, skipping a colorSeparation distance on the color wheel
  const bands = Array.from({ length: colorNumber }).map((_, i) => {
    const hue = (baseHue + i * colorSeparation) % 360; // Adjust hue with offset
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }).join(', ');

  let gradientAngle = byteValues[3] % (inverse ? 30 : 180); // Initial angle range between 0-179 degrees

  // Shift the angle to fit within the left or right side constraints (45-135 and 225-315 degrees)
  gradientAngle = gradientAngle < 45 ? gradientAngle += 315 : gradientAngle > 135 ? gradientAngle += 90 : gradientAngle;

  return `linear-gradient(${gradientAngle}deg, ${bands})`;

}

const IdentityProfileCard: React.FC<{
  identity: Identity,
  rounded?: boolean;
}> = ({ identity, rounded = false }) => {

  const displayName = useMemo(() => {
    return identity.profile.social?.displayName;
  }, [ identity ]);

  const persona = useMemo(() => {
    return identity.persona;
  }, [ identity ]);

  const heroStyle = useMemo(() => {
    if (identity.profile.heroUrl) {
      return {
        backgroundPosition: 'center',
        backgroundImage: `url(${identity.profile.heroUrl})`,
        backgroundSize: 'cover',
      }
    } else {
      return {
        backgroundSize: 'cover',
        background: generateGradient(identity.didUri.split(':')[2]),
      }
    }
  }, [identity.profile.heroUrl, identity.didUri]);


  const roundedClasses = useMemo(() => {
    if (rounded) {
      return {
        containerDiv: 'rounded-lg',
        heroDiv: 'rounded-t-lg'
      }
    }

    return {}
  }, [ rounded ]);

  return (<>
    <section className={`sm:px-8 md:px-12 max-w-screen-lg mx-auto`}>
      <div className={`relative flex flex-col break-words bg-white w-full mb-6 shadow-xl ${roundedClasses['containerDiv']}`}>
        <div className={`relative flex h-44 ${roundedClasses['heroDiv']}`} style={heroStyle}>
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/70 to-primary hover:to-primary-800 hover:via-primary/90" />
          <div className="absolute top-0 left-0 flex items-end h-full flex-row">
            <div className="self-center ml-4 w-36 h-36 flex items-center rounded justify-center shadow-xl overflow-hidden border-8 border-white border-opacity-40">
              {identity.profile.avatarUrl ? (
                <img src={identity.profile.avatarUrl} />
              ) : (<div style={{
                background: generateGradient(identity.didUri.split(':')[2], true),
              }} className="relative bg-gray-300 w-full h-full flex items-center justify-center text-slate-200">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <div className="w-full h-full absolute opacity-60 bg-gradient-to-t from-gray-900 to-transparent"></div>
              </div>)}
            </div>
            <div className="px-4 pb-4">
              <div className="flex flex-row items-center mt-2">
                <h3 className="text-3xl font-semibold leading-normal text-background mb-2">
                  {displayName}{persona && <span className="text-sm italic text-background/40 ml-2">({persona})</span>}
                </h3>
              </div>
              <div className="flex">
              <span className="text-background">
                {truncateDid(identity.didUri)}
              </span>
              <div className="text-background/70 ml-3 cursor-pointer hover:text-background/40 transition-colors duration-200 tooltip-action" onClick={async (e) => {
                  const currentTarget = e.currentTarget;
                  await navigator.clipboard.writeText(identity.didUri);
                  currentTarget.classList.add('tooltip-active');
                  setTimeout(() => currentTarget.classList.remove('tooltip-active'), 1000);
                }}>
                  <span className="tooltip bg-background text-primary">Copied</span>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </>);
}

export default IdentityProfileCard;