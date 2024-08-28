import React, { createContext, useContext, useState } from "react";
import { useAgent } from "../web5/use-agent";
import { DwnInterface, DwnProtocolDefinition } from "@web5/agent";

interface ProtocolContextProps {
  addProtocol: (didUri: string, protocolUrl: string, isPublished: boolean) => Promise<void>;
  listProtocols: (didUri: string) => DwnProtocolDefinition[];
  loadProtocols: (didUri: string) => Promise<void>;
}

export const ProtocolsContext = createContext<ProtocolContextProps>({
  addProtocol: async () => {},
  listProtocols: () => [],
  loadProtocols: async () => {}
});

export const ProtocolsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agent } = useAgent();
  const [ protocolsMap, setProtocolsMap ] = useState<Map<string, DwnProtocolDefinition[]>>(new Map());

  const listProtocols = (didUri: string) => {
    return protocolsMap.get(didUri) || []
  }

  const loadProtocols = async (didUri: string) => {
    const { reply : { status, entries: protocols }} = await agent!.dwn.processRequest({
      author: didUri,
      target: didUri,
      messageType: DwnInterface.ProtocolsQuery,
      messageParams: {}
    });

    if (status.code !== 200) {
      console.info(`Failed to load protocols for ${didUri}: ${status.detail}`);
      return;
    }

    const protocolDescriptors = (protocols || []).map(protocol => protocol.descriptor.definition)
    protocolsMap.set(didUri, protocolDescriptors);
    setProtocolsMap(new Map(protocolsMap))
  }

  // this is for testing purposes
  const addProtocol = async (didUri: string, protocolUrl: string, isPublished: boolean) => {
    const { reply } = await agent!.dwn.processRequest({
      author: didUri,
      target: didUri,
      messageType: DwnInterface.ProtocolsConfigure,
      messageParams: {
        definition: {
          protocol: protocolUrl,
          published: isPublished,
          types: {
            foo: {},
            bar: {}
          },
          structure: {
            foo: {
              $actions: [{
                who: 'anyone',
                can: ['create', 'read', 'update', 'delete']
              }],
              bar: {
                $actions: [{
                  who: 'author',
                  of: 'bar',
                  can: ['create', 'read', 'update', 'delete']
                }]
              }
            }
          }
        }
      }
    });

    if (reply.status.code === 202) {
      await loadProtocols(didUri)
    } else {
      console.error('Failed to add protocol', reply.status);
    }
  }

  return (
    <ProtocolsContext.Provider
      value={{
        addProtocol,
        listProtocols,
        loadProtocols
      }}
    >
      {children}
    </ProtocolsContext.Provider>
  );
};


export const useProtocols = () => {
  const context = useContext(ProtocolsContext);
  if (!context) {
    throw new Error("useProtocol must be used within a ProtocolsProvider");
  }

  const {
    addProtocol,
    listProtocols,
    loadProtocols
  } = context;

  return {
    addProtocol,
    listProtocols,
    loadProtocols
  };
};

