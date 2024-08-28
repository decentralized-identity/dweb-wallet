import { DwnInterface, DwnPermissionScope, DwnProtocolDefinition } from '@web5/agent';
import { useEffect, useMemo, useState } from 'react';
import React from 'react';

const WebConnect: React.FC = () => {
  const [ permissionRequests, setPermissionRequests ] = useState<Map<string, DwnPermissionScope[]>>(new Map());

  const requests = useMemo(() => {
    return Array.from(permissionRequests.entries()).map(([protocol, scopes]) => {
      return {
        protocol,
        scopes: scopes
      }
    })

  }, [ permissionRequests ]);

  useEffect(() => {
    window.addEventListener("message", (event) => {
      const eventRequests = event.data as {
        requests: DwnPermissionScope[];
        definition: DwnProtocolDefinition;
      }[]

      eventRequests.forEach(({ requests, definition }) => {
        permissionRequests.set(definition.protocol, requests);
      });

      setPermissionRequests(new Map(permissionRequests));
    }, false);
  });

  const getRequestLabels =  (scopes: DwnPermissionScope[]): string => {
    const labels: string[] = [];
    scopes.forEach(scope => {
      const interfaceMethod = scope.interface + scope.method;
      switch(interfaceMethod) {
        case DwnInterface.RecordsQuery:
          labels.push('query');
          break;
        case DwnInterface.RecordsWrite:
          labels.push('write');
          break;
        case DwnInterface.RecordsDelete:
          labels.push('delete');
          break;
        case DwnInterface.RecordsSubscribe:
          labels.push('subscribe');
          break;
        default:
          labels.push('unknown');
      }
    });

    const messagesQuery = scopes.find(scope => scope.interface+scope.method === DwnInterface.MessagesQuery);
    const messagesRead = scopes.find(scope => scope.interface+scope.method === DwnInterface.MessagesRead);
    const messagesSubscribe = scopes.find(scope => scope.interface+scope.method === DwnInterface.MessagesSubscribe);

    if (messagesRead && (messagesQuery || messagesSubscribe)) {
      labels.push('sync');
    }

    return labels.join(', ');
  }

  return (
    <div>
      <h1>Wallet Connect</h1>
      <div>
        {requests.length === 0 ? (
          <div className="spinner-loader">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        ) : requests.map(request => {
          return (<div>
            <h2>{request.protocol}</h2>
            <p>{getRequestLabels(request.scopes)}</p>
          </div>)
        })}
      </div>
    </div>
  )
}

export default WebConnect;