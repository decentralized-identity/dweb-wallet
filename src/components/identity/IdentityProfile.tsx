import React, { useMemo } from 'react';
import { Identity } from '@/lib/types';
import { DwnPermissionGrant, DwnProtocolDefinition } from '@web5/agent';
import { useNavigate } from 'react-router-dom';

export function generateGradient(byteString: string) {
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

  let gradientAngle = byteValues[3] % 180; // Initial angle range between 0-179 degrees

  // Shift the angle to fit within the left or right side constraints (45-135 and 225-315 degrees)
  gradientAngle = gradientAngle < 45 ? gradientAngle += 315 : gradientAngle > 135 ? gradientAngle += 90 : gradientAngle;

  return `linear-gradient(${gradientAngle}deg, ${bands})`;

}


const IdentityProfile: React.FC<{
  identity: Identity,
  protocols: DwnProtocolDefinition[],
  permissions: DwnPermissionGrant[]
}> = ({ identity, protocols, permissions }) => {

  const navigate = useNavigate();

  const grantees = useMemo(() => {
    return [...(permissions.reduce((acc, permission) => {
      if (!acc.has(permission.grantee)) {
        acc.add(permission.grantee);
      }

      return acc;
    }, new Set<string>()))];
  }, [ permissions ]);


  const heroStyle = useMemo(() => {
    if (identity.profile.heroUrl) {
      return {
        backgroundPosition: 'bottom',
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

  return (
    <main className="h-full">
      <section className="relative block h-96">
        <div
          className="absolute top-0 w-full h-full bg-center bg-cover"
          style={heroStyle}
        >
          <span id="blackOverlay" className="w-full h-full absolute opacity-50 bg-black"></span>
        </div>
      </section>
      <section className="relative bg-blueGray-200 -mt-48 sm:px-8 md:px-12 max-w-screen-lg mx-auto">
        <div className="flex flex-col break-words bg-white w-full mb-6 shadow-xl rounded-lg">
          <div className="flex flex-wrap justify-center">
            <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
              <div className="relative -mt-16 w-32 h-32 flex items-center justify-center rounded-full shadow-xl bg-white overflow-hidden border-4 border-slate-300">
                {identity.profile.avatarUrl ? (
                  <img src={identity.profile.avatarUrl} />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0ZM3 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 019.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                </svg>
              )}
              </div>
            </div>
            <div className="w-full lg:w-4/12 px-4 lg:order-3 md:text-right md:self-center">
              <button onClick={() => navigate(`/identity/edit/${identity.didUri}`)} className="bg-slate-500 active:bg-slate-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150" type="button">
                Edit Profile
              </button>
            </div>
            <div className="w-full lg:w-4/12 px-4 lg:order-1">
              <div className="flex justify-center py-4 lg:pt-4 pt-8">
                <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-600">{protocols.length}</span><span className="text-sm text-slate-400">Protocols</span>
                </div>
                {grantees.length > 0 && <div className="mr-4 p-3 text-center">
                  <span className="text-xl font-bold block uppercase tracking-wide text-slate-600">{grantees.length}</span><span className="text-sm text-slate-400">Grantees</span>
                </div>}
              </div>
            </div>
          </div>
          <div className="text-center mt-5">
            <h3 className="text-4xl font-semibold leading-normal mb-2 text-slate-700 mb-2">
              {identity.profile.social?.displayName}
            </h3>
            <div className="mb-2 text-slate-600 mt-2">
              {identity.profile.social?.tagline}
            </div>
            <div className="mt-5 flex flex-row mx-auto justify-center flex-wrap px-4">
              <div className="mb-2 text-slate-400 sm:text-sm break-all">
                {identity.didUri}
              </div>
              <div className="text-slate-200 ml-2">
                <i className="fas fa-copy text-lg text-slate-400 cursor-pointer hover:text-slate-600 transition-colors duration-200"></i>
              </div>
              <div className="mb-2 text-slate-200 ml-2">
                <i className="fas fa-qrcode text-lg text-slate-400 cursor-pointer hover:text-slate-600 transition-colors duration-200"></i>
              </div>
            </div>
          </div>
          <div className="mt-1 py-10 border-t border-slate-300 text-center">
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-9/12 px-4">
                <p className="mb-4 text-lg leading-relaxed text-slate-700">
                  {identity.profile.social?.bio}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default IdentityProfile;