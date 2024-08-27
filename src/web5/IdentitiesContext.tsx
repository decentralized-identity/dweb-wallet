import { BearerIdentity } from "@web5/agent";
import React, { createContext, useEffect, useState } from "react";
import { useAgent } from "./use-agent";

interface IdentityContextProps {
  identities: BearerIdentity[];
  reloadIdentities: () => Promise<void>;
}

export const Web5IdentitiesContext = createContext<IdentityContextProps>({
  identities: [],
  reloadIdentities: async () => {}
});

export const Web5IdentitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agent } = useAgent();
  const [ loadingIdentities, setLoadingIdentities ] = useState<boolean>(false);
  const [ identities, setIdentities ] = useState<BearerIdentity[]>([]);

  const loadIdentities = async () => {
    const identities = await agent?.identity.list();
    setIdentities(identities || []);
  }

  // const createIdentity = async (name: string, walletHost: string) => {
  //   const identityInfo = { }
  // }

  useEffect(() => {

    const loadIdentities = async () => {
      setLoadingIdentities(true)
      const identities = await agent?.identity.list();
      setIdentities(identities ?? []);
      setLoadingIdentities(false)
    }

    if (!loadingIdentities && identities.length === 0) {
      loadIdentities();
    }
  }, [ agent, identities, loadingIdentities, setLoadingIdentities ])

  return (
    <Web5IdentitiesContext.Provider
      value={{
        identities,
        reloadIdentities: loadIdentities
      }}
    >
      {children}
    </Web5IdentitiesContext.Provider>
  );
};
