import React, { createContext, useEffect, useState } from "react";
import { Identity } from "@/types";
import { Web5 } from "@web5/api";
import { useAgent } from "./Context";
import { profileDefinition, walletDefinition } from "./protocols";
import { DwnInterface } from "@web5/agent";

interface IdentityContextProps {
  identities: Identity[];
  reloadIdentities: () => Promise<void>;
  selectedIdentity: Identity | undefined;
  setSelectedIdentity: (identity: Identity | undefined) => void;
  createIdentity: (params: CreateIdentityParams) => Promise<string | undefined>;
  deleteIdentity: (didUri: string) => Promise<void>;
  uploadAvatar: (didUri: string, avatar: File) => Promise<string | undefined>;
  uploadBanner: (didUri: string, banner: File) => Promise<string | undefined>;
  getIdentity: (didUri: string) => Promise<Identity | undefined>;
}

export const IdentitiesContext = createContext<IdentityContextProps>({
  identities: [],
  reloadIdentities: async () => {},
  selectedIdentity: undefined,
  setSelectedIdentity: () => {},
  createIdentity: async () => undefined,
  deleteIdentity: async () => {},
  uploadAvatar: async () => undefined,
  uploadBanner: async () => undefined,
  getIdentity: async () => undefined
});

export interface CreateIdentityParams {
  persona: string;
  name: string;
  displayName: string;
  tagline: string;
  bio: string;
  dwnEndpoint: string;
  walletHost: string;
}

export const IdentitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agent } = useAgent();
  const [ loadingIdentities, setLoadingIdentities ] = useState<boolean>(false);
  const [ identities, setIdentities ] = useState<Identity[]>([]);
  const [ selectedIdentity, setSelectedIdentity ] = useState<Identity | undefined>();
  const [ gotMessages, setGotMessages ] = useState<boolean>(false);

  const loadIdentities = async () => {
    if (loadingIdentities) return;

    setLoadingIdentities(true);

    if (agent && !gotMessages) {
      const agentDid = agent.agentDid.uri;
      const { reply: { status, entries } } = await agent.dwn.processRequest({
        target: agentDid,
        author: agentDid,
        messageType: DwnInterface.MessagesQuery,
        messageParams: {
          filters: []
        }
      });
      setGotMessages(true);
      if (status.code !== 200) {
        throw new Error(`Failed to get messages: ${status.detail}`);
      }

      console.log('got messages', entries?.length);
      for (const entry of entries!) {
        const { reply: { status: readStatus, entry: readEntry } } = await agent.dwn.processRequest({
          target: agentDid,
          author: agentDid,
          messageType: DwnInterface.MessagesRead,
          messageParams: {
            messageCid: entry,
          }
        });
        if (readStatus.code !== 200) {
          console.log('error reading message', readStatus.detail);
          continue;
        }
        console.log('read entry', readEntry?.message.descriptor);
      }
    }


    const identities = await agent?.identity.list() || [];
    const parsedIdentities = await Promise.all(identities.map(identity => getIdentity(identity.did.uri)));
    setIdentities(parsedIdentities.filter(identity => identity !== undefined) as Identity[]);
    setLoadingIdentities(false);
  }

  const createIdentity = async ({ persona, name, displayName, tagline, bio, dwnEndpoint, walletHost }: CreateIdentityParams) => {
    if (agent) {
      const identity = await agent.identity.create({
        store     : true,
        didMethod : 'dht',
        didOptions: {
          services: [
            {
              id              : 'dwn',
              type            : 'DecentralizedWebNode',
              serviceEndpoint : [ dwnEndpoint ],
              enc             : '#enc',
              sig             : '#sig',
            }
          ],
          verificationMethods: [
            {
              algorithm : 'Ed25519',
              id        : 'sig',
              purposes  : ['assertionMethod', 'authentication']
            },
            {
              algorithm : 'secp256k1',
              id        : 'enc',
              purposes  : ['keyAgreement']
            }
          ]
        },
        metadata: { name: persona }
      });

      await agent.identity.manage({ portableIdentity: await identity.export() });
      await agent.sync.registerIdentity({ did: identity.did.uri, options: { protocols: [
        profileDefinition.protocol,
        walletDefinition.protocol,
      ]} });

      const web5 = new Web5({ agent, connectedDid: identity.did.uri });

      // configure the profile protocol
      const { status: configureProfileStatus } = await web5.dwn.protocols.configure({
        message: {
          definition: profileDefinition
        }
      });
      
      if (configureProfileStatus.code !== 202) {
        throw new Error(`Failed to configure profile protocol: ${configureProfileStatus.detail}`);
      }

      // configure the wallet protocol
      const { status: configureWalletStatus } = await web5.dwn.protocols.configure({
        message: {
          definition: walletDefinition
        }
      });

      if (configureWalletStatus.code !== 202) {
        throw new Error(`Failed to configure wallet protocol: ${configureWalletStatus.detail}`);
      }

      // write the name into the profile protocol
      const { status: writeProfileStatus } = await web5.dwn.records.create({
        data: { name },
        message: {
          published: true,
          protocol: profileDefinition.protocol,
          protocolPath: 'name',
          dataFormat: 'application/json',
        }
      });

      if (writeProfileStatus.code !== 202) {
        throw new Error(`Failed to write profile: ${writeProfileStatus.detail}`);
      }

      // write to the social object in the profile protocol
      const { status: writeSocialStatus } = await web5.dwn.records.create({
        data: {
          displayName,
          tagline,
          bio,
          apps: {}
        },
        message: {
          published: true,
          protocol: profileDefinition.protocol,
          protocolPath: 'social',
          dataFormat: 'application/json',
        }
      });

      if (writeSocialStatus.code !== 202) {
        throw new Error(`Failed to write social: ${writeSocialStatus.detail}`);
      }

      // write the wallet Url
      const { status: writeWalletStatus } = await web5.dwn.records.create({
        data: { walletUrl: walletHost },
        message: {
          published: true,
          protocol: walletDefinition.protocol,
          protocolPath: 'webWallet',
          schema: walletDefinition.types.webWallet.schema,
          dataFormat: 'application/json',
        }
      });

      if (writeWalletStatus.code !== 202) {
        throw new Error(`Failed to write wallet: ${writeWalletStatus.detail}`);
      }

      return identity.did.uri;
    }
  }

  const uploadAvatar = async (didUri: string, avatar: File) => {
    if (agent) {
      const web5 = new Web5({ agent, connectedDid: didUri });

      const { status, record } = await web5.dwn.records.create({
        data: new Blob([avatar], { type: avatar.type }),
        message: {
          published: true,
          protocol: profileDefinition.protocol,
          protocolPath: 'avatar',
          dataFormat: avatar.type,
        }
      });

      if (status.code !== 202 || !record) {
        throw new Error(`Failed to upload avatar: ${status.detail}`);
      }

      return `http://dweb/${didUri}/records/${record.id}`;
    }
  }

  const uploadBanner = async (didUri: string, banner: File) => {
    if (agent) {
      const web5 = new Web5({ agent, connectedDid: didUri });

      const { status, record } = await web5.dwn.records.create({
        data: new Blob([banner], { type: banner.type }),
        message: {
          published: true,
          protocol: profileDefinition.protocol,
          protocolPath: 'hero',
          dataFormat: banner.type,
        }
      });

      if (status.code !== 202 || !record) {
        throw new Error(`Failed to upload banner: ${status.detail}`);
      }

      return `http://dweb/${didUri}/records/${record.id}`;
    }
  }

  const getIdentity = async (didUri: string): Promise<Identity | undefined> => {
    if (agent) {
      const web5 = new Web5({ agent, connectedDid: didUri });
      const { records: nameRecords } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: profileDefinition.protocol,
            protocolPath: 'name',
            dataFormat: 'application/json',
          }
        }
      });

      let name = '';

      try {
        if (nameRecords && nameRecords.length > 0) {
          ({ name } = await nameRecords![0].data.json());
        } 
      } catch(error) {
        console.info('could not parse name records', error);
      }

      const identity = await agent.identity.get({ didUri })
      const persona = identity?.metadata.name || 'Unknown Persona';

      const { records: avatarRecords } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: profileDefinition.protocol,
            protocolPath: 'avatar',
          }
        }
      });

      const avatarUrl = avatarRecords && avatarRecords.length > 0 ? `http://dweb/${didUri}/records/${avatarRecords[0].id}` : undefined;

      const { records: bannerRecords } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: profileDefinition.protocol,
            protocolPath: 'hero',
          }
        }
      });

      const bannerUrl = bannerRecords && bannerRecords.length > 0 ? `http://dweb/${didUri}/records/${bannerRecords[0].id}` : undefined;

      const { records: socialRecords } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: profileDefinition.protocol,
            protocolPath: 'social',
            dataFormat: 'application/json',
          }
        }
      });

      let displayName = '';
      let tagline = '';
      let bio = '';

      try {
        if (socialRecords && socialRecords.length > 0) {
          ({ displayName, tagline, bio } = await socialRecords![0].data.json());
        }
      } catch(error) {
        console.error('could not parse social records', error);
      }

      
      return {
        persona,
        didUri,
        name: name || '',
        displayName,
        tagline,
        bio,
        avatarUrl,
        bannerUrl
      } 
    }
  }
  
  const deleteIdentity = async (didUri: string) => {
    if (agent) {
      await agent.identity.delete({ tenant: agent.agentDid.uri, didUri });

      try {
        await agent.did.delete({ didUri });
      } catch(error) {
        console.error('could not delete identity', error);
      }

    }
  }

  useEffect(() => {
    loadIdentities();
  })

  return (
    <IdentitiesContext.Provider
      value={{
        getIdentity,
        uploadAvatar,
        uploadBanner,
        createIdentity,
        deleteIdentity,
        identities,
        selectedIdentity,
        setSelectedIdentity,
        reloadIdentities: loadIdentities
      }}
    >
      {children}
    </IdentitiesContext.Provider>
  );
};
