import PublicIdentityCard from '@/components/identity/PublicIdentityCard';
import { useAgent } from '@/contexts/Context';
import { toastError } from '@/lib/utils';
import { ConnectPermissionRequest, DwnInterface, DwnPermissionScope, DwnProtocolDefinition, Oidc, Web5Agent } from '@web5/agent';
import { DidJwk } from '@web5/dids';
import React, { useMemo, useState } from 'react';

const PermissionRequest: React.FC<{ permissions: ConnectPermissionRequest[] }> = ({ permissions }) => {
  const formatScopes = (scopes: DwnPermissionScope[]) => {
    const sync = scopes.some(scope => scope.interface === 'Messages' && scope.method === 'Read') &&
                 scopes.some(scope => scope.interface === 'Messages' && scope.method === 'Query');

    const records = scopes.filter(scope => scope.interface === 'Records').map(scope => scope.method);

    return { sync, records };
  };

  return (
    <div>
      {permissions.map(permission => {
        const { sync, records } = formatScopes(permission.permissionScopes);
        return (
          <div key={permission.protocolDefinition.protocol}>
            <h3>
              {permission.protocolDefinition.protocol}
            </h3>
            <div>
              {records.map(method => (
                <span key={method}>{method}</span>
              ))}
              {sync && (
                <span>Sync</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const DWebConnect: React.FC = () => {
  const { agent, initialized } = useAgent();
  const [ isCreatingDelegate, setIsCreatingDelegate ] = useState<boolean>(false);
  const [ returningGrants, setReturningGrants ] = useState<boolean>(false);

  const [ origin, setOrigin ] = useState<string>();
  const [ did, setDid ] = useState<string>();
  const [ permissions, setPermissions ] = useState<ConnectPermissionRequest[]>([]);

  const connecting = useMemo(() => {
    return isCreatingDelegate || returningGrants;
  }, [ isCreatingDelegate, returningGrants ]);


  window.addEventListener('message', async e => {
    const { type, did, permissions } = e.data;
    if (type === 'dweb-connect-authorization-request') {
      if (!window?.opener?.closed) {
        setOrigin(e.origin);
        setDid(did);
        setPermissions(permissions);
      } else {
        window.close();
      }
    }
  });

  window.opener?.postMessage({ type: 'dweb-connect-loaded' }, '*');


  const handleAgentSetup = async () => {

    if (!origin || !did || !initialized || !agent) {
      toastError('Not ready');
      throw new Error('Not ready');
    }

    try {
      setIsCreatingDelegate(true);
      const delegateBearerDid = await DidJwk.create();
      const delegatePortableDid = await delegateBearerDid.export();

      // TODO: roll back permissions and protocol configurations if an error occurs. Need a way to delete protocols to achieve this.
      const delegateGrantPromises = permissions.map(permissionRequest => {
        return new Promise(async (resolve) => {
          const { protocolDefinition, permissionScopes } = permissionRequest;
    
          // We validate that all permission scopes match the protocol uri of the protocol definition they are provided with.
          const grantsMatchProtocolUri = permissionScopes.every(scope => 'protocol' in scope && scope.protocol === protocolDefinition.protocol);
          if (!grantsMatchProtocolUri) {
            throw new Error('All permission scopes must match the protocol uri they are provided with.');
          }

          await prepareProtocol(did, agent, protocolDefinition);
          const permissionGrants = await Oidc.createPermissionGrants(
            did,
            delegateBearerDid,
            agent,
            permissionScopes
          );
  
          resolve(permissionGrants);
        });
      });

      const grants = (await Promise.all(delegateGrantPromises)).flat();

      setIsCreatingDelegate(false);
      setReturningGrants(true);

      window.opener.postMessage({
        type: 'dweb-connect-authorization-response',
        delegateDid: delegatePortableDid,
        grants
      }, origin);

    } catch(error: any) {
      toastError(error.message);
      setReturningGrants(false);
    } finally {
      setReturningGrants(false);
      window.close();
    }
  }

  const handleDeny = () => {
    window.opener.postMessage({
      type: 'dweb-connect-authorization-response',
    }, origin);
    window.close();
  };

  return (
    <div>
        <div>
        {did && <PublicIdentityCard did={did} />}
        {!connecting && origin && did && permissions.length && (
          <div>
            <div>
              <div>
                <p>{origin}</p>
              </div>
              <p>is requesting permissions from</p>
              <div>
                <p>{did}</p>
              </div>
            </div>
            <PermissionRequest permissions={permissions} />
            <div>
              <button
                onClick={handleDeny}
              >
                Deny
              </button>
              <button
                onClick={handleAgentSetup}
              >
                Approve
              </button>
            </div>
          </div>
        )}
        {connecting && <div>
          {isCreatingDelegate && <p>Creating delegate...</p>}
          {returningGrants && <p>Returning grants...</p>}
        </div>}
      </div>
    </div>
  );
};

/**
 * Installs the protocol required by the Client on the Provider if it doesn't already exist.
 */
async function prepareProtocol(
  selectedDid: string,
  agent: Web5Agent,
  protocolDefinition: DwnProtocolDefinition
): Promise<void> {

  const queryMessage = await agent.processDwnRequest({
    author        : selectedDid,
    messageType   : DwnInterface.ProtocolsQuery,
    target        : selectedDid,
    messageParams : { filter: { protocol: protocolDefinition.protocol } },
  });

  if ( queryMessage.reply.status.code !== 200) {
    // if the query failed, throw an error
    throw new Error(
      `Could not fetch protocol: ${queryMessage.reply.status.detail}`
    );
  } else if (queryMessage.reply.entries === undefined || queryMessage.reply.entries.length === 0) {

    // send the protocol definition to the remote DWN first, if it passes we can process it locally
    const { reply: sendReply, message: configureMessage } = await agent.sendDwnRequest({
      author        : selectedDid,
      target        : selectedDid,
      messageType   : DwnInterface.ProtocolsConfigure,
      messageParams : { definition: protocolDefinition },
    });

    // check if the message was sent successfully, if the remote returns 409 the message may have come through already via sync
    if (sendReply.status.code !== 202 && sendReply.status.code !== 409) {
      throw new Error(`Could not send protocol: ${sendReply.status.detail}`);
    }

    // process the protocol locally, we don't have to check if it exists as this is just a convenience over waiting for sync.
    await agent.processDwnRequest({
      author      : selectedDid,
      target      : selectedDid,
      messageType : DwnInterface.ProtocolsConfigure,
      rawMessage  : configureMessage
    });

  } else {

    // the protocol already exists, let's make sure it exists on the remote DWN as the requesting app will need it
    const configureMessage = queryMessage.reply.entries![0];
    const { reply: sendReply } = await agent.sendDwnRequest({
      author      : selectedDid,
      target      : selectedDid,
      messageType : DwnInterface.ProtocolsConfigure,
      rawMessage  : configureMessage,
    });

    if (sendReply.status.code !== 202 && sendReply.status.code !== 409) {
      throw new Error(`Could not send protocol: ${sendReply.status.detail}`);
    }
  }
}

export default DWebConnect;