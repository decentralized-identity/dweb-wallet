import React, { useEffect, useMemo, useState } from "react";
import { PermissionGrant } from "@web5/api";
import { truncateDid } from "@/lib/utils";
import { DwnPermissionGrant, DwnProtocolDefinition } from "@web5/agent";
import { useAgent } from "@/contexts/Context";
import ProtocolPermissionScope from "./ProtocolPermissionScope";

const PermissionsList: React.FC<{ protocols: DwnProtocolDefinition[], permissions: DwnPermissionGrant[] }> = ({ permissions, protocols }) => {
  const { agent } = useAgent();
  const [ loaded, setLoaded ] = useState(false);
  const [ loading, setLoading ] = useState(false);
  const [ granteeGrants, setGranteeGrants ] = useState<Map<string, Map<string, PermissionGrant[]>>>(new Map());
  const [limit, setLimit] = useState(5);

  const grantees = useMemo(() => {
    return Array.from(granteeGrants.keys());
  }, [ granteeGrants ]);

  useEffect(() => {
    setLoaded(false);
  }, [ permissions ]);

  useEffect(() => {
    const loadPermissions = () => {
      setLoading(true);
      try {
        const granteeGrants = permissions.reduce((acc, permission) => {
          const protocolGrants = acc.get(permission.grantee) || new Map();
          const scopedProtocol = permission.scope.protocol || 'none';
          const grants = protocolGrants.get(scopedProtocol) || [];
          protocolGrants.set(scopedProtocol, [ ...grants, permission ]);
          acc.set(permission.grantee, protocolGrants);
          return acc;
        }, new Map<string, Map<string, PermissionGrant[]>>());

        setGranteeGrants(granteeGrants);
        setLoaded(true);
      } catch(error) {
        console.log('Failed to load permissions', error);
      } finally {
        setLoading(false);
      }
    }

    if (agent && !loading && !loaded) {
      loadPermissions();
    }

  }, [ agent, permissions, protocols, loading, loaded ]);

  const loadedGrantees = useMemo(() => {
    return Array.from(granteeGrants.keys()).slice(0, limit);
  }, [ grantees, limit ]);

  return (<div className="mt-10 flex flex-wrap justify-center w-full w-9/12 mx-auto text-center">
    <div className="w-full px-4 divide-y-2 divide-dotted divide-slate-300 mb-10">
      <div className="text-xl text-left pl-4">
        App Permissions
      </div>
      <div className="pl-3">
        <div className="mt-5">
          {loading && <span>Loading...</span>}
          {!loading && loadedGrantees.map((grantee) => {
            const grants = granteeGrants.get(grantee);
            const grantProtocols = grants && grants.size > 0 ? [ ...grants.keys() ].map((protocol) => protocol) : [];
            return (
              <div key={grantee}>
                <div>
                  <span>App Instance ID: </span>
                  <span>{truncateDid(grantee)}</span>
                </div>
                <div className="flex flex-row mb-20">
                  {grantProtocols.map(protocol => {
                    const definition = protocols.find(p => p.protocol === protocol);
                    if (definition) {
                      const permissions = grants!.get(protocol) || [];
                      const scopes = permissions.map(scope => scope.scope)
                      return <ProtocolPermissionScope 
                        key={protocol}
                        definition={definition}
                        scopes={scopes}
                      />
                    } else if(protocol === 'none') {
                      const permissions = grants!.get(protocol) || [];
                      return <li key={protocol}>
                        <span>Unrestricted</span>
                        {permissions.map(permission => <span>{JSON.stringify(permission.scope)}</span>)}
                      </li>
                    }
                  })}
                </div>
              </div>
            )
          })}
        </div>
        {loadedGrantees.length < grantees.length && <div className="flex items-center justify-around">
          <div
                onClick={() => setLimit(limit + 5)}
                className="bg-background active:bg-gray-600 uppercase text-white font-bold hover:shadow-md shadow text-xs px-4 py-2 rounded outline-none focus:outline-none sm:mr-2 mb-1 ease-linear transition-all duration-150 cursor-pointer"
          > Show More </div>
        </div>}
      </div>
    </div>
  </div>);
}

export default PermissionsList;