import PublicIdentityCard from '@/components/identity/PublicIdentityCard';
import TopBar from '@/components/TopBar';
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
    <div className="space-y-2 mt-4">
      {permissions.map(permission => {
        const { sync, records } = formatScopes(permission.permissionScopes);
        return (
          <div key={permission.protocolDefinition.protocol} className="bg-primary/10 dark:bg-primary/20 p-2 rounded-lg">
            <h3 className="text-xs font-semibold mb-1 text-primary dark:text-primary-dark">
              {permission.protocolDefinition.protocol}
            </h3>
            <div className="text-xs flex flex-wrap gap-1 text-text-light-secondary dark:text-text-dark-secondary">
              {records.map(method => (
                <span key={method} className="bg-secondary/20 px-1 rounded">{method}</span>
              ))}
              {sync && (
                <span className="bg-secondary/20 px-1 rounded text-secondary dark:text-secondary-dark">Sync</span>
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
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary flex flex-col">
      <TopBar />
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
        {did && <PublicIdentityCard did={did} />}
        {!connecting && origin && did && permissions.length && (
          <div className="flex-1 p-4 flex flex-col">
            <div className="mt-4 flex flex-col items-center space-y-3">
              <div className="w-full max-w-md px-4 py-2 bg-primary/10 dark:bg-primary/20 rounded-lg border border-primary/30 dark:border-primary/40">
                <p className="font-semibold text-sm text-center text-primary dark:text-primary-dark">{origin}</p>
              </div>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">is requesting permissions from</p>
              <div className="w-full max-w-md px-4 py-2 bg-secondary/10 dark:bg-secondary/20 rounded-lg border border-secondary/30 dark:border-secondary/40">
                <p className="font-semibold text-sm text-center text-secondary dark:text-secondary-dark truncate">{did}</p>
              </div>
            </div>
            <PermissionRequest permissions={permissions} />
            <div className="mt-auto flex justify-center space-x-4 p-4">
              <button
                onClick={handleDeny}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Deny
              </button>
              <button
                onClick={handleAgentSetup}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
              >
                Approve
              </button>
            </div>
          </div>
        )}
        {connecting && <div className="flex-1 p-4 flex flex-col">
          {isCreatingDelegate && <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Creating delegate...</p>}
          {returningGrants && <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">Returning grants...</p>}
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