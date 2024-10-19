import { DwnPermissionScope, DwnProtocolDefinition } from "@web5/agent";
import React from "react";
import Chip from "./Chip";

const ProtocolPermissionScope:React.FC<{ definition: DwnProtocolDefinition, scopes: DwnPermissionScope[] }> = ({ definition, scopes }) => {
  const formatScopes = (scopes: DwnPermissionScope[]) => {
    const sync = scopes.some(scope => scope.interface === 'Messages' && scope.method === 'Read') &&
                 scopes.some(scope => scope.interface === 'Messages' && scope.method === 'Query');

    const records = scopes.filter(scope => scope.interface === 'Records').map(scope => scope.method);

    return { sync, records };
  };

  const { sync, records } = formatScopes(scopes);

  const syncIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>

  const lockIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
  </svg>;

  const publicIcon = <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
  <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 0 1-1.161.886l-.143.048a1.107 1.107 0 0 0-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 0 1-1.652.928l-.679-.906a1.125 1.125 0 0 0-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 0 0-8.862 12.872M12.75 3.031a9 9 0 0 1 6.69 14.036m0 0-.177-.529A2.25 2.25 0 0 0 17.128 15H16.5l-.324-.324a1.453 1.453 0 0 0-2.328.377l-.036.073a1.586 1.586 0 0 1-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 0 1-5.276 3.67m0 0a9 9 0 0 1-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25" />
  </svg>


  return <li className="flex flex-col m-2">
    <div className="flex flex-row items-center mb-1">
      <span className="h-5 w-5 mr-2">{definition.published ? publicIcon : lockIcon}</span>
      <div className="flex flex-col">
        <span className="text-sm text-slate-700">{definition.protocol}</span>
        <span className="italic text-xs text-slate-400">{definition.published ? 'Published' : 'Private'}</span>
      </div>
    </div>
    <div className="flex flex-wrap">
      {records.map((method) => <Chip key={method} label={method} size="small" /> )}
      {sync && <Chip icon={syncIcon} label="Sync" size="small" />}
    </div>
  </li>
}

export default ProtocolPermissionScope;