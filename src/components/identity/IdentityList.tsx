import { useMemo, useState } from "react";
import { Button } from "../ui/button";
import NewIdentity from "./NewIdentity";
import { useIdentities } from "@/web5/use-identities";
import { Checkbox } from "../ui/checkbox";
import { useAgent } from "@/web5/use-agent";

const IdentityList: React.FC = () => {
  const { agent } = useAgent();
  const { identities, reloadIdentities } = useIdentities();
  const [ newIdentity, setNewIdentity ] = useState<boolean>(false);
  const [ checkedSet, setCheckedSet ] = useState<Set<string>>(new Set());

  const done = () => {
    setNewIdentity(false);
  }

  const deleteIdentities = async () => {
    if (!agent) {
      throw new Error('No agent is set');
    };

    for (const did of checkedSet) {
      try {
        await agent.did.delete({ didUri: did, deleteKey: true });
      } catch(error) {
        console.info('unable to delete did', error)
      }

      try {
        await agent.identity.delete({ didUri: did })
      } catch(error) {
        console.info('unable to delete identity', error)
      }

      checkedSet.delete(did);
    }

    reloadIdentities()
  }

  const identitiesList = useMemo(() => {
    const toggleChecked = (did: string) => {
      if (checkedSet.has(did)) {
        checkedSet.delete(did);
      } else {
        checkedSet.add(did);
      }

      setCheckedSet(new Set([...checkedSet]));
    }

    return identities.map(identity => {
      return <div key={identity.did.uri}>{identity.metadata.name}@{identity.did.uri}<Checkbox
        checked={checkedSet.has(identity.did.uri)}
        onClick={() => toggleChecked(identity.did.uri)}
      /></div>
    })
  }, [ checkedSet, identities ]);
  
  return (<>
    {!newIdentity ? (<>
      <div>Identities</div>
      {identitiesList}
      <Button onClick={() => setNewIdentity(true)}>New Identity</Button>
      {checkedSet.size > 0 && <Button onClick={deleteIdentities}>Delete</Button>}
    </>) : (<>
      <NewIdentity done={done} />
      <Button onClick={() => setNewIdentity(false)}>Cancel</Button>
    </>)}
  </>)
}

export default IdentityList;