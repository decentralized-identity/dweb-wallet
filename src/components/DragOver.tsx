import { useAgent, useIdentities } from "@/contexts/Context";
import { profileDefinition } from "@/lib/ProfileProtocol";
import { truncateDid } from "@/lib/utils";
import { CheckCircleOutline, Downloading, ErrorOutline, HighlightOff, Pending, PendingActions, PendingActionsOutlined, PendingActionsRounded, PendingRounded, X } from "@mui/icons-material";
import { Avatar, Box, Button, CircularProgress, Dialog, Typography } from "@mui/material";
import { PortableIdentity } from "@web5/agent";
import { Convert } from "@web5/common";
import React, { useCallback, useEffect, useMemo, useState } from "react";

const DragOver:React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ dragOver, setDragOver ] = useState(false);
  const [ identities, setIdentities ] = useState<PortableIdentity[]>([]);

  const handleDrag = useCallback((e:DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.isTrusted) {
      return;
    }

    if(e.type === 'dragleave') {
      setDragOver(false);
    } else if (!dragOver && (e.type === 'dragenter' || e.type === 'dragover')) {
      setDragOver(true);
    }
  }, [ dragOver ]);

  const handleDrop = useCallback((e:DragEvent) => {
    const files = e.dataTransfer?.files;
    if (files) {
      e.preventDefault();
      e.stopPropagation();

      Array.from(files).map((file) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
          if (!e.target?.result) return;
          const portableIdentity = JSON.parse(e.target.result as string) as PortableIdentity;
          setIdentities((identities) => [...identities, portableIdentity]);
        }
        reader.readAsText(file);
      });
    }
  }, [ identities ]);

  useEffect(() => {

    window.addEventListener('dragenter', handleDrag)
    window.addEventListener('dragover', handleDrag)
    window.addEventListener('dragleave', handleDrag);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter',handleDrag)
      window.removeEventListener('dragover',handleDrag)
      window.removeEventListener('dragleave',handleDrag);
      window.removeEventListener('drop',handleDrop);
    }
  }, []);

  return  <>
    {<Dialog open={dragOver}>
      <ImportIdentitiesDialog identities={identities} done={() => {
        setIdentities([]);
        setDragOver(false);
      }} />
    </Dialog>}
    {children}
  </>
};

const ImportIdentitiesDialog:React.FC<{ identities: PortableIdentity[], done: () => void }> = ({ identities, done }) => {
  const { agent } = useAgent();
  const { importIdentity, loadIdentities } = useIdentities();
  const [ status, setStatus ] = useState<Map<string, boolean>>(new Map());
  const [ importing, setImporting ] = useState(false);
  const [ doneImporting, setDoneImporting ] = useState(false);

  useEffect(() => {
    const loadIdentity = async (didUri: string) => {
      const agentIdentity = await agent!.identity.get({ didUri });
      if (agentIdentity) {
        // if identity already exists, don't load/process it
        return;
      }

      // set the status to false, this will change to true if the identity is imported
      status.set(didUri, false);
    }

    if (agent && identities.length > 0) {
      Promise.all(identities.map((identity) => loadIdentity(identity.metadata.uri)))
    }

  }, [ identities, agent ]);

  const importIdentities = useCallback(async () => {
    if (!agent) {
      throw new Error('Agent not initialized');
    }

    setImporting(true);
    try {
      await agent.sync.stopSync();

      for (const identity of identities.filter(identity => status.get(identity.metadata.uri) !== false)) {
        await importIdentity(window.location.origin, identity);
        status.set(identity.metadata.uri, true);
      }
      await agent.sync.sync('pull');

      agent.sync.startSync({ interval: '15s' })
      setStatus(new Map(status));
    } finally {
      setImporting(false);
      loadIdentities();
      setDoneImporting(true);
    }
  }, [ identities, status, agent ]);

  const getStatus = useCallback((id: string) => {
    return status.get(id);
  }, [ status, agent ]);

  const canImport = useMemo(() => {
    return !doneImporting && !importing && identities.length > 0
      && identities.filter(identity => status.get(identity.metadata.uri) === false).length > 0;
  }, [ identities, status, importing, doneImporting ]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'left',
      p: 5,
    }}>
      <Typography variant={"h4"} sx={{ mb: 2 }} >
        {identities.length === 0 ? 'Drop your identity files here' : 'Importing identities:'}
      </Typography>
      {identities.map((identity) => {
        const status = getStatus(identity.metadata.uri); 
        return <Box key={identity.metadata.uri} sx={{ display: 'flex', flexDirection: 'row', mb: 2 }}>
          <Avatar
            src={`https://dweb/${identity.metadata.uri}/read/protocols/${Convert.string(profileDefinition.protocol).toBase64Url()}/avatar`}
            onError={(e) => {
              console.log('avatar image error', e)
            }}
           />
          <Typography key={identity.metadata.uri} variant="body1" sx={{ ml:1, alignContent: 'center' }}>
            {truncateDid(identity.metadata.uri)}
          </Typography>
          <Box sx={{ ml: 1, mb: 1, alignSelf: 'end'  }}>
            {status === true ? <CheckCircleOutline /> : status === false && importing ? <CircularProgress /> :
              status === false ? null : <HighlightOff />}
          </Box>
        </Box>
      })}
      {canImport && (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 2 }}>
          <Button disabled={importing} sx={{ mr: 2 }} variant="contained" onClick={importIdentities}>Import</Button>
          <Button disabled={importing} variant="contained" onClick={done}>Clear</Button>
        </Box>
      ) || doneImporting && (
        <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 2 }}>
          <Button variant="contained" onClick={done}>Done</Button>
        </Box>
      ) || <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 2 }}>
        <Button variant="contained" onClick={done}>Close</Button>
      </Box>}
    </Box>
  )
}

export default DragOver;