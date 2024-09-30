import { createContext, useEffect, useMemo, useState } from "react";
import { Convert } from "@web5/common";

import Web5Helper from "@/lib/Web5Helper";

import { useAgent } from "./Context";
import { profileDefinition } from "./protocols";
import { Identity } from "./IdentitiesContext";

export type ProfileData = {
  social?: SocialData;
  avatar?: Blob;
  hero?: Blob;
}

export type SocialData = {
  displayName: string;
  tagline: string;
  bio: string;
  apps: Record<string, string>;
}

interface ProfileContextProps {
  social?: SocialData;
  avatar?: Blob;
  avatarUrl?: string;
  hero?: Blob;
  heroUrl?: string;
  setSocial: (social: SocialData) => Promise<void>;
  setAvatar: (avatar: Blob) => Promise<void>;
  setHero: (hero: Blob) => Promise<void>;
}

export const ProfileContext = createContext<ProfileContextProps>({
  setSocial: async () => {},
  setAvatar: async () => {},
  setHero: async () => {},
});

export const ProfileProvider: React.FC<{ identity: Identity, children: React.ReactNode }> = ({ identity, children }) => {
  const { agent } = useAgent();
  const [ avatar, setAvatarState ] = useState<Blob | undefined>(undefined);
  const [ hero, setHeroState ] = useState<Blob | undefined>(undefined);
  const [ social, setSocialState ] = useState<SocialData | undefined>(undefined);

  const didUri = useMemo(() => {
    return identity.didUri;
  }, [ identity ]);

  const web5Helper = useMemo(() => {
    if (agent && didUri) {
      return Web5Helper(didUri, agent)
    }
  }, [ agent, didUri ]);

  useEffect(() => {
    const loadSocial = async () => {
      const record = await web5Helper?.getRecord(profileDefinition.protocol, 'social');
      if (record) {
        const social = await record.data.json() as SocialData;
        setSocialState(social);
      }
    }

    if (web5Helper && !social) {
      loadSocial(); 
    }
  }, [ web5Helper, social ]);

  useEffect(() => {
    const loadAvatar = async () => {
      const record = await web5Helper?.getRecord(profileDefinition.protocol, 'avatar');
      if (record) {
        const avatar = await record.data.blob();
        setAvatarState(avatar);
      }
    }

    if (web5Helper && !avatar) {
      loadAvatar();
    }
  }, [ web5Helper, avatar ]);

  useEffect(() => {
    const loadHero = async () => {
      const record = await web5Helper?.getRecord(profileDefinition.protocol, 'hero');
      if (record) {
        const hero = await record.data.blob();
        setHeroState(hero);
      }
    }

    if (web5Helper && !hero) {
      loadHero();
    }
  }, [ web5Helper, hero ]);

  const setRecordData = async (path: string, dataFormat: string, data: any) => {
    if (!web5Helper) return;

    const record = await web5Helper.getRecord(profileDefinition.protocol, path);
    return record ?
      await web5Helper.updateRecord(record, dataFormat, data) :
      await web5Helper.createRecord(profileDefinition.protocol, path, dataFormat, data);
  }

  const setSocial = async (social: SocialData) => {
    if (web5Helper) {
      const record = await setRecordData('social', 'application/json', social);
      if (record) {
        setSocialState(social);
      }
    }
  }

  const setAvatar = async (avatar: Blob) => {
    if (web5Helper) {
      const record = await setRecordData('avatar', avatar.type, avatar);
      if (record) {
        setAvatarState(avatar);
      }
    }
  }

  const setHero = async (hero: Blob) => {
    if (web5Helper) {
      const record = await setRecordData('hero', hero.type, hero);
      if (record) {
        setHeroState(hero);
      }
    }
  }

  const avatarUrl = useMemo(() => {
    return `https://dweb/${didUri}/read/protocols/${Convert.string(profileDefinition.protocol).toBase64Url()}/avatar`
  }, [ didUri ]);

  const heroUrl = useMemo(() => {
    return `https://dweb/${didUri}/read/protocols/${Convert.string(profileDefinition.protocol).toBase64Url()}/hero`
  }, [ didUri ]);

  return (
    <ProfileContext.Provider value={{
      social,
      avatar,
      hero,
      avatarUrl,
      heroUrl,
      setSocial,
      setAvatar,
      setHero
    }}>
      {children}
    </ProfileContext.Provider>
  )
}