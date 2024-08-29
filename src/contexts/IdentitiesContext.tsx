import React, { createContext, useEffect, useState } from "react";
import { useAgent } from "./Agent";
import { Identity } from "@/types";
import { DwnProtocolDefinition } from "@web5/agent";
import { Web5 } from "@web5/api";

export const walletDefinition: DwnProtocolDefinition = {
  published: true,
  protocol: "https://areweweb5yet.com/protocols/wallet",
  types: {
    webWallet: {
      schema: "https://areweweb5yet.com/schemas/web-wallet",
      dataFormats: ['application/json']
    }
  },
  structure: {
    webWallet: {
    }
  }
}

export const profileDefinition: DwnProtocolDefinition = {
  published: true,
  protocol: "https://areweweb5yet.com/protocols/profile",
  types: {
    name: {
      dataFormats: ['application/json']
    },
    social: {
      dataFormats: ['application/json']
    },
    messaging: {
      dataFormats: ['application/json']
    },
    phone: {
      dataFormats: ['application/json']
    },
    address: {
      dataFormats: ['application/json']
    },
    career: {
      dataFormats: ['application/json']
    },
    payment: {
      dataFormats: ['application/json']
    },
    avatar: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    },
    hero: {
      dataFormats: ['image/gif', 'image/png', 'image/jpeg']
    }
  },
  structure: {
    name: {},
    social: {},
    career: {},
    avatar: {},
    hero: {},
    messaging: {},
    address: {},
    phone: {},
    payment: {}
  }
}

interface IdentityContextProps {
  identities: Identity[];
  reloadIdentities: () => Promise<void>;
  selectedIdentity: Identity | undefined;
  setSelectedIdentity: (identity: Identity | undefined) => void;
  createIdentity: (name: string, dwnEndpoint: string, walletHost: string) => Promise<string | undefined>;
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

export const IdentitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agent } = useAgent();
  const [ loadingIdentities, setLoadingIdentities ] = useState<boolean>(false);
  const [ identities, setIdentities ] = useState<Identity[]>([]);
  const [ selectedIdentity, setSelectedIdentity ] = useState<Identity | undefined>();

  const loadIdentities = async () => {
    if (loadingIdentities) return;

    setLoadingIdentities(true);
    const identities = await agent?.identity.list() || [];
    const parsedIdentities = await Promise.all(identities.map(identity => getIdentity(identity.did.uri)));
    setIdentities(parsedIdentities.filter(identity => identity !== undefined) as Identity[]);
    setLoadingIdentities(false);
  }

  const createIdentity = async (name: string, dwnEndpoint: string, walletHost: string) => {
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
        metadata: { name }
      });

      await agent.identity.manage({ portableIdentity: await identity.export() });
      await agent.sync.registerIdentity({ did: identity.did.uri });

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

      if (status.code !== 202) {
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

      if (status.code !== 202) {
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

      let name: string | undefined;
      try {
        if (nameRecords && nameRecords.length > 0) {
          ({ name } = await nameRecords![0].data.json());
        } else {
          throw new Error('No name record found');
        }

      } catch(error) {
        const identity = await agent.identity.get({ didUri })
        name = identity?.metadata.name;
      }

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

      return {
        didUri,
        name: name || '',
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
