import React, { createContext, useEffect, useState } from "react";
import { useAgent } from "../web5/use-agent";
import { Identity } from "@/types";
import { BearerIdentity } from "@web5/agent";

const bearerIdentityToIdentity = (identity: BearerIdentity): Identity => {
  return {
    didUri: identity.did.uri,
    name: identity.metadata.name || '',
    avatarUrl: 'https://placehold.co/400',
    bannerUrl: 'https://placehold.co/1500x500',
    protocols: [],
    permissions: []
  }
}

interface IdentityContextProps {
  identities: Identity[];
  reloadIdentities: () => Promise<void>;
  selectedIdentity: Identity | undefined;
  setSelectedIdentity: (identity: Identity | undefined) => void;
}

export const IdentitiesContext = createContext<IdentityContextProps>({
  identities: [],
  reloadIdentities: async () => {},
  selectedIdentity: undefined,
  setSelectedIdentity: () => {}
});

export const IdentitiesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { agent } = useAgent();
  const [ loadingIdentities, setLoadingIdentities ] = useState<boolean>(false);
  const [ identities, setIdentities ] = useState<Identity[]>([]);
  const [ selectedIdentity, setSelectedIdentity ] = useState<Identity | undefined>();

  const loadIdentities = async () => {
    const identities = await agent?.identity.list() || [];
    console.log('identities', identities)
    setIdentities((identities.map(bearerIdentityToIdentity)));
  }

  // const createIdentity = async (name: string, walletHost: string) => {
  //   const identityInfo = { }
  // }

  useEffect(() => {

    const loadIdentities = async () => {
      setLoadingIdentities(true)
      const identities = await agent?.identity.list() || [];
      setIdentities((identities.map(bearerIdentityToIdentity)));
      setLoadingIdentities(false)
    }

    if (!loadingIdentities && identities.length === 0) {
      loadIdentities();
    }
  }, [ agent, identities, loadingIdentities, setLoadingIdentities ])

  return (
    <IdentitiesContext.Provider
      value={{
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
