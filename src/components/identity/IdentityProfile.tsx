import React, { useMemo, useState } from 'react';
import { Identity } from '@/lib/types';
import { DwnPermissionGrant, DwnProtocolDefinition } from '@web5/agent';
import { useNavigate } from 'react-router-dom';
import DialogBox from '../Layout/Dialog';
import { QRCodeCanvas } from 'qrcode.react';
import ProtocolList from '../ProtocolList';
import WalletsList from '../WalletsList';
import PermissionsList from '../PermissionsList';
import ProfileTabs from './ProfileTabs';
import ProfileDetails from './ProfileDetails';
import { useIdentities } from '@/contexts/Context';
import ProfileOptions from './ProfileOptions';
import { FolderArrowDownIcon, TrashIcon } from '@heroicons/react/16/solid';
import { DialogTitle } from '@headlessui/react';
import Button from '../Button';
import { CircularProgress } from '@mui/material';

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

const IdentityProfile: React.FC<{
  identity: Identity,
  contain?: boolean;
  rounded?: boolean;
  protocols?: DwnProtocolDefinition[];
  permissions?: DwnPermissionGrant[];
  wallets?: string[];
  showInactiveTabs?: boolean;
}> = ({ identity, contain = false, rounded = false, protocols, permissions, wallets, showInactiveTabs = true }) => {
  const navigate = useNavigate();
  const { identities, exportIdentity, deleteIdentity } = useIdentities();
  const [ showQR, setShowQR ] = useState(false);
  const [ showBackup, setShowBackup ] = useState(false);
  const [ backupLoading, setBackupLoading ] = useState(false);
  const [ showDelete, setShowDelete ] = useState(false);
  const [ deleteLoading, setDeleteLoading ] = useState(false);

  const managedIdentity = useMemo(() => {
    return identities.some(i => i.didUri === identity.didUri);
  }, [ identity, identities ]);

  const displayName = useMemo(() => {
    return identity.profile.social?.displayName;
  }, [ identity ]);

  const tagline = useMemo(() => {
    return identity.profile.social?.tagline;
  }, [ identity ]);

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

  const containClasses = useMemo(() => {
    return contain ? '' : '-mt-28';
  }, [ contain ]);

  const roundedClasses = useMemo(() => {
    if (rounded) {
      return {
        containerDiv: 'rounded-lg',
        heroDiv: 'rounded-t-lg'
      }
    }

    return {}
  }, [ rounded ]);

  const onEditProfile = () => {
    navigate(`/identity/edit/${identity.didUri}`);
  }

  const handleDownloadIdentity = async (didUri: string) => {
    setBackupLoading(true);
    try {
      const exportedIdenity = await exportIdentity(didUri);
      const blob = new Blob([JSON.stringify(exportedIdenity)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${didUri}.json`;
      a.click();
      URL.revokeObjectURL(url);
      setShowBackup(false);
    } finally {
      setBackupLoading(false);
    }
  }

  const handleDeleteIdentity = async (didUri: string) => {
    setDeleteLoading(true);
    try {
      await deleteIdentity(didUri);
      setShowDelete(false);
    } finally {
      setDeleteLoading(false);
    }
  }

  return (<>
    {!contain && <section className="relative block h-96">
      <div
        className="absolute top-0 w-full h-full"
        style={heroStyle}
      >
        <span id="blackOverlay" className="w-full h-full absolute opacity-60 bg-gradient-to-t from-gray-900 to-transparent"></span>
      </div>
    </section>}
    <section className={`relative ${containClasses} sm:px-8 md:px-12 max-w-screen-lg mx-auto`}>
      <div className={`flex flex-col break-words bg-white w-full mb-6 shadow-xl ${roundedClasses['containerDiv']}`}>
        {contain && <div className={`flex h-64 ${roundedClasses['heroDiv']}`} style={heroStyle}></div>}
        <div className="flex justify-between relative ml-5">
          <div className="relative -mt-16 w-36 h-36 flex items-center rounded justify-center shadow-xl overflow-hidden border-8 border-gray-900 border-opacity-40">
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
          {managedIdentity && <ProfileOptions onEdit={onEditProfile} onDelete={() => setShowDelete(true)} onBackup={() => setShowBackup(true)} />}
        </div>
        <div className="text-left mt-2 mx-8">
          <div className="flex flex-row items-center mt-1">
            <h3 className="text-3xl font-semibold leading-normal text-slate-700 mb-2">
              {displayName}
            </h3>
            <div className="text-slate-400 ml-3 cursor-pointer hover:text-slate-600 transition-colors duration-200">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
              </svg>
            </div>
            <div className="text-slate-400 ml-1 cursor-pointer hover:text-slate-600 transition-colors duration-200" onClick={() => setShowQR(true)}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z" />
              </svg>
            </div>
            <DialogBox open={showQR} setOpen={setShowQR}>
              <div className="flex flex-col items-center">
                <QRCodeCanvas
                  fgColor='#111827'
                  className="m-5 rounded"
                  value={identity.didUri}
                  size={256}
                  level="Q"
                  imageSettings={{
                    src: identity.profile.avatarUrl || '',
                    height: 67,
                    width: 67,
                    excavate: true,
                  }}
                />
              </div>
            </DialogBox>
          </div>
          <div className="mb-2 text-slate-600 px-1">
            {tagline}
          </div>
        </div>
        <ProfileTabs showInactive={showInactiveTabs} sections={[{
            title: 'Profile',
            children: <ProfileDetails identity={identity} /> 
          },{
            title: 'Connections',
            children: protocols && permissions && <PermissionsList protocols={protocols} permissions={permissions} />
          }, {
            title: 'Protocols',
            children: protocols && <ProtocolList definitions={protocols} />
          }, {
            title: 'Wallets',
            children: wallets && <WalletsList wallets={wallets} />
          }]} />
      </div>
    </section>

    <DialogBox open={showBackup} setOpen={setShowBackup}>
      <DialogTitle as="h3" className="divide-y-2 divide-dotted divide-slate-900 flex flex-col px-3">
        <span className="pl-3 font-bold text-gray-900">Backup Identity</span>
        <span className="mt-1"></span>
      </DialogTitle>
      {!backupLoading && <div className="flex items-center mt-4">
        <div className="h-14 w-14 mx-2 flex">
          <FolderArrowDownIcon className="text-gray-900" />
        </div>
        <div className="p-2 text-gray-900">This will download a file containing the DID including the <b><i>private key material</i></b> of this identity.</div>
      </div>}
      {backupLoading && <div className="flex items-center mt-4">
        <CircularProgress />
      </div>}
      <div className="mt-4 flex gap-2 justify-end">
        <Button disabled={backupLoading} onClick={() => handleDownloadIdentity(identity.didUri)}>Backup</Button>
        <Button color='secondary' disabled={backupLoading} onClick={() => setShowBackup(false)}>Cancel</Button>
      </div>
    </DialogBox>

    <DialogBox open={showDelete} setOpen={setShowDelete}>
      <DialogTitle as="h3" className="divide-y-2 divide-dotted divide-slate-900 flex flex-col px-3">
        <span className="pl-3 font-bold text-gray-900">Delete Identity</span>
        <span className="mt-1"></span>
      </DialogTitle>
      {!deleteLoading && <div className="flex items-center mt-4">
        <div className="h-14 w-14 mx-2 flex">
          <TrashIcon className="text-gray-900 text-red-500" />
        </div>
        <div className="p-2 text-gray-900">This will <b>PERMANENTLY DELETE</b> this identity including the <b><i>private key material</i></b>, please confirm.</div>
      </div>}
      {deleteLoading && <div className="flex items-center mt-4">
        <CircularProgress />
      </div>}
      <div className="mt-4 flex gap-2 justify-end">
        <Button color='error' disabled={deleteLoading} onClick={() => handleDeleteIdentity(identity.didUri)}>Delete</Button>
        <Button color='secondary' disabled={deleteLoading} onClick={() => setShowDelete(false)}>Cancel</Button>
      </div>
    </DialogBox>

  </>);
}

export default IdentityProfile;