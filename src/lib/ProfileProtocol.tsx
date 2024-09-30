import { Web5Agent } from "@web5/agent";

import { profileDefinition } from "@/contexts/protocols";
import Web5Helper from "./Web5Helper";
import { SocialData } from "@/contexts/ProfileContext";

const ProfileProtocol = (didUri: string, agent: Web5Agent) => {
  const web5Helper = Web5Helper(didUri, agent);

  const setRecordData = async (path: string, dataFormat: string, data: any) => {
    const record = await web5Helper.getRecord(profileDefinition.protocol, path);
    return record ?
      await web5Helper.updateRecord(record, dataFormat, data) :
      await web5Helper.createRecord(profileDefinition.protocol, path, dataFormat, data);
  }

  const getSocial = async (): Promise<SocialData | undefined> => {
    const record = await web5Helper.getRecord(profileDefinition.protocol, 'social');
    return record ? record.data.json() : undefined;
  }

  const getAvatar = async (): Promise<Blob | undefined> => {
    const attachment = await web5Helper.getRecord(profileDefinition.protocol, 'avatar');
    return attachment ? attachment.data.blob() : undefined;
  }

  const getHero = async (): Promise<Blob | undefined> => {
    const attachment = await web5Helper.getRecord(profileDefinition.protocol, 'hero');
    return attachment ? attachment.data.blob() : undefined;
  }

  const setSocial = async (social: SocialData) => {
    return setRecordData('social', 'application/json', social);
  }

  const setAvatar = async (avatar: Blob) => {
    return setRecordData('avatar', avatar.type, avatar);
  }

  const setHero = async (hero: Blob) => {
    return setRecordData('hero', hero.type, hero);
  }

  return {
    getSocial,
    getAvatar,
    getHero,
    setSocial,
    setAvatar,
    setHero,
  }
}

export default ProfileProtocol;