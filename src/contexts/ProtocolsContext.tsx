import React, { createContext, useState } from "react";
import { useAgent } from "./Context";
import { DwnInterface, DwnProtocolDefinition } from "@web5/agent";

interface ProtocolContextProps {
  listProtocols: (didUri: string) => DwnProtocolDefinition[];
  loadProtocols: (didUri: string) => Promise<void>;
}

export const ProtocolsContext = createContext<ProtocolContextProps>({
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

  return (
    <ProtocolsContext.Provider
      value={{
        listProtocols,
        loadProtocols
      }}
    >
      {children}
    </ProtocolsContext.Provider>
  );
};