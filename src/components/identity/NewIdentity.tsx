import React, { useState } from "react";
import { Input } from "../Input";
import { Button } from "../ui/button";
import { useAgent } from "@/web5/use-agent";
import { useIdentities } from "@/web5/use-identities";
import { IdentityCreateParams } from "@web5/agent";

const NewIdentity: React.FC<{ done: () => void }> = ({ done }) => {
  const { agent } = useAgent();
  const { reloadIdentities } = useIdentities();
  const [name, setName] = useState('')
  const [server, setServer] = useState('http://localhost:3000');

  const identityProps = (server: string, name: string): IdentityCreateParams => {
    return {
      store: true,
      didMethod: 'dht',
      didOptions: {
        services: [
          {
            id              : 'dwn',
            type            : 'DecentralizedWebNode',
            serviceEndpoint : server,
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
      metadata: {
        name
      }
    }
  }

  const createIdentity = async () => {
    try {
      const props = identityProps(server, name);
      const identity = await agent!.identity.create(props);
      await agent!.identity.manage({ portableIdentity: await identity!.export() });
    } catch (error) {
      console.log('error creating identity', error);
    }

    reloadIdentities();
    done();
  }

  return (<>
  <div>
    <span>Name</span>
    <Input
      type="text"
      id="name"
      value={name}
      onChange={(e) => setName(e.target.value)}
    />
  </div>
  <div>
    <span>Node</span>
    <Input
      type="text"
      id="node"
      value={server}
      onChange={(e) => setServer(e.target.value)}
    />
  </div>
  <Button disabled={!agent} onClick={() => createIdentity()}>Create</Button>
  </>);
}

export default NewIdentity;