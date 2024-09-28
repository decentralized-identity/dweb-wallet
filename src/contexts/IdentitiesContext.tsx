import React, { createContext, useEffect, useState } from "react";
import { Identity } from "@/types";
import { Web5 } from "@web5/api";
import { useAgent } from "./Context";
import { profileDefinition } from "./protocols";
import { DwnInterface, getDwnServiceEndpointUrls, PortableIdentity } from "@web5/agent";
import { PortableDid } from "@web5/dids";

interface IdentityContextProps {
  identities: Identity[];
  selectedIdentity: Identity | undefined;
  getDid: (didUri: string, withPrivate?: boolean) => Promise<PortableDid | undefined>;
  reloadIdentities: () => Promise<void>;
  setSelectedIdentity: (identity: Identity | undefined) => void;
  createIdentity: (params: CreateIdentityParams) => Promise<string | undefined>;
  deleteIdentity: (didUri: string) => Promise<void>;
  uploadAvatar: (didUri: string, avatar: File | Blob) => Promise<string | undefined>;
  uploadBanner: (didUri: string, banner: File | Blob) => Promise<string | undefined>;
  getIdentity: (didUri: string) => Promise<Identity | undefined>;
  exportIdentity: (didUri: string) => Promise<void>;
  importIdentity: (...identities: PortableIdentity[]) => Promise<void>;
}

export const IdentitiesContext = createContext<IdentityContextProps>({
  identities: [],
  selectedIdentity: undefined,
  reloadIdentities: async () => {},
  setSelectedIdentity: () => {},
  createIdentity: async () => undefined,
  deleteIdentity: async () => {},
  uploadAvatar: async () => undefined,
  uploadBanner: async () => undefined,
  getIdentity: async () => undefined,
  exportIdentity: async () => undefined,
  importIdentity: async () => {},
  getDid: async () => undefined,
});

export interface CreateIdentityParams {
  persona: string;
  name: string;
  displayName: string;
  tagline: string;
  bio: string;
  dwnEndpoints: string[];
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

      for (const entry of entries!) {
        const { reply: { status: readStatus } } = await agent.dwn.processRequest({
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
      }
    }

    const identities = await agent?.identity.list() || [];
    const parsedIdentities = await Promise.all(identities.map(identity => getIdentity(identity.did.uri)));
    setIdentities(parsedIdentities.filter(identity => identity !== undefined) as Identity[]);
    setLoadingIdentities(false);
  }

  const createIdentity = async ({ persona, name, displayName, tagline, bio, dwnEndpoints, walletHost }: CreateIdentityParams) => {
    if (agent) {
      const identity = await agent.identity.create({
        store     : true,
        didMethod : 'dht',
        didOptions: {
          services: [
            {
              id              : 'dwn',
              type            : 'DecentralizedWebNode',
              serviceEndpoint : dwnEndpoints,
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
      ]} });

      const localStorageIdentities = localStorage.getItem('identities');
      if (localStorageIdentities) {
        const parsedIdentities = JSON.parse(localStorageIdentities) as string[];
        parsedIdentities.push(identity.did.uri);
        localStorage.setItem('identities', JSON.stringify(parsedIdentities));
      } else {
        localStorage.setItem('identities', JSON.stringify([ identity.did.uri ]));
      }

      const web5 = new Web5({ agent, connectedDid: identity.did.uri });

      // configure the profile protocol
      const { status: configureProfileStatus, protocol } = await web5.dwn.protocols.configure({
        message: {
          definition: profileDefinition
        }
      });
      
      if (configureProfileStatus.code !== 202) {
        throw new Error(`Failed to configure profile protocol: ${configureProfileStatus.detail}`);
      }

      const { status: protocolSendStatus } = await protocol!.send(identity.did.uri);
      if (protocolSendStatus.code !== 202) {
        console.info('failed to send profile protocol to remote', protocolSendStatus.detail);
      }

      // write the name into the profile protocol
      const { status: profileStatus, record: profileRecord } = await web5.dwn.records.create({
        data: { name },
        message: {
          published: true,
          protocol: profileDefinition.protocol,
          protocolPath: 'name',
          dataFormat: 'application/json',
        }
      });

      if (profileStatus.code !== 202) {
        throw new Error(`Failed to write name to profile: ${profileStatus.detail}`);
      }

      const { status: profileSendStatus } = await profileRecord!.send();
      if (profileSendStatus.code !== 202) {
        console.info('failed to send profile record to remote', profileSendStatus.detail);
      }

      // write to the social object in the profile protocol
      const { status: socialStatus, record: socialRecord } = await web5.dwn.records.create({
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

      if (socialStatus.code !== 202) {
        throw new Error(`Failed to write social to profile: ${socialStatus.detail}`);
      }

      const { status: socialSendStatus } = await socialRecord!.send();
      if (socialSendStatus.code !== 202) {
        console.info('failed to send social record to remote', socialSendStatus.detail);
      }

      // write the wallet Url
      const { status: walletStatus, record: walletRecord } = await web5.dwn.records.create({
        data: { webWallets: [ walletHost ] },
        message: {
          published: true,
          protocol: profileDefinition.protocol,
          protocolPath: 'connect',
          dataFormat: 'application/json',
        }
      });

      if (walletStatus.code !== 202) {
        throw new Error(`Failed to write wallet to profile: ${walletStatus.detail}`);
      }

      const { status: walletSendStatus } = await walletRecord!.send();
      if (walletSendStatus.code !== 202) {
        console.info('failed to send wallet record to remote', walletSendStatus.detail);
      }

      return identity.did.uri;
    }
  }

  const uploadAvatar = async (didUri: string, avatar: File | Blob) => {
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

      const { status: sendStatus } = await record.send();
      if (sendStatus.code !== 202) {
        console.info('failed to send avatar record to remote', sendStatus.detail);
      }

      return `https://dweb/${didUri}/records/${record.id}`;
    }
  }

  const uploadBanner = async (didUri: string, banner: File | Blob) => {
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

      const { status: sendStatus } = await record.send();
      if (sendStatus.code !== 202) {
        console.info('failed to send banner record to remote', sendStatus.detail);
      }

      return `https://dweb/${didUri}/records/${record.id}`;
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

      const avatarUrl = avatarRecords && avatarRecords.length > 0 ? `https://dweb/${didUri}/records/${avatarRecords[0].id}` : undefined;

      const { records: bannerRecords } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: profileDefinition.protocol,
            protocolPath: 'hero',
          }
        }
      });

      const bannerUrl = bannerRecords && bannerRecords.length > 0 ? `https://dweb/${didUri}/records/${bannerRecords[0].id}` : undefined;

      const { records: socialRecords } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: profileDefinition.protocol,
            protocolPath: 'social',
            dataFormat: 'application/json',
          }
        }
      });

      const { records: walletRecords, status } = await web5.dwn.records.query({
        message: {
          filter: {
            protocol: profileDefinition.protocol,
            protocolPath: 'connect',
            dataFormat: 'application/json',
          }
        }
      });

      const wallets = status.code === 200 && walletRecords?.length ? await walletRecords![0].data.json() : { webWallets: [] };

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

      const dwnEndpoints = await getDwnServiceEndpointUrls(didUri, agent.did);

      return {
        persona,
        didUri,
        name: name || '',
        displayName,
        tagline,
        bio,
        avatarUrl,
        bannerUrl,
        dwnEndpoints,
        webWallets: wallets.webWallets,
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

  const importIdentity = async (...identities: PortableIdentity[]) => {
    if (agent) {
      identities.forEach(async identity => {
        try {
        const exists = await agent.identity.get({ didUri: identity.portableDid.uri });
        if (exists) {
          throw new Error("Identity already exists");
        }

        const importedIdentity = await agent.identity.import({ portableIdentity: identity });
        await agent.identity.manage({ portableIdentity: await importedIdentity.export() });
        await agent.sync.registerIdentity({ did: importedIdentity.did.uri });

        const localStorageIdentities = localStorage.getItem('identities');
        if (localStorageIdentities) {
          const parsedIdentities = JSON.parse(localStorageIdentities) as string[];
          parsedIdentities.push(importedIdentity.did.uri);
          localStorage.setItem('identities', JSON.stringify(parsedIdentities));
        } else {
          localStorage.setItem('identities', JSON.stringify([ importedIdentity.did.uri ]));
        }
      } catch(error:any) {
        console.error('could not import identity', identity.portableDid.uri, error);
      }
    });

      await loadIdentities();
    }
  }

  const exportIdentity = async (didUri: string) => {
    const identity = await agent?.identity.get({ didUri });
    if (!identity) {
      throw new Error("Identity not found");
    }

    const portableIdentity = await identity.export();

    const blob = new Blob([
      JSON.stringify(portableIdentity, null, 2)
    ], {
      type: "application/json",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${didUri.replace(/:/g, '+')}.json`;
    document.body.append(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const getDid = async (didUri: string, withPrivate: boolean = false) => {
    if (agent) {
      const did = await agent.did.get({ didUri, tenant: didUri });
      if (!did) return undefined;
      const portableDid = await did.export();
      if (!withPrivate) {
        // return the did without the private key
        return {
          uri: portableDid.uri,
          document: portableDid.document,
          metadata: portableDid.metadata
        }
      }

      return portableDid;
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
        reloadIdentities: loadIdentities,
        exportIdentity,
        importIdentity,
        getDid
      }}
    >
      {children}
    </IdentitiesContext.Provider>
  );
};
