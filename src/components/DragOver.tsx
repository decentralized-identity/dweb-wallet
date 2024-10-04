import { useIdentities } from "@/contexts/Context";
import { CheckCircleOutline, Pending, PendingActions, PendingActionsRounded, PendingRounded } from "@mui/icons-material";
import { Box, Button, CircularProgress, Dialog, Typography } from "@mui/material";
import { PortableIdentity } from "@web5/agent";
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
    {dragOver && <Dialog open={dragOver}>
      <ImportIdentitiesDialog identities={identities} done={() => {
        setIdentities([]);
        setDragOver(false);
      }} />
    </Dialog>}
    {children}
  </>
};

const ImportIdentitiesDialog:React.FC<{ identities: PortableIdentity[], done: () => void }> = ({ identities, done }) => {
  const { importIdentity, loadIdentities } = useIdentities();
  const [ status, setStatus ] = useState<Map<string, boolean>>(new Map());
  const [ importing, setImporting ] = useState(false);

  const importIdentities = useCallback(async () => {
    setImporting(true);
    try {
      const successful = await importIdentity(window.location.origin, ...identities);
      successful.forEach(id => status.set(id, true))
      setStatus(new Map(status));
    } finally {
      setImporting(false);
      loadIdentities();
    }
  }, [ identities, status ]);

  const getStatus = useCallback((id: string) => {
    return status.has(id);
  }, [ status ]);

  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 10,
    }}>
      <Box>
        <Typography variant={"h4"} sx={{ mb: 2 }} >
          {identities.length === 0 ? 'Drop your identity files here' : 'Importing identities:'}
        </Typography>
        {identities.map((identity) => <Box key={identity.metadata.uri} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          <Typography key={identity.metadata.uri} variant="body1">
            {identity.metadata.uri}
          </Typography>
          <Box sx={{ ml: 2, mb: 1 }}>
            {getStatus(identity.metadata.uri) ? <CheckCircleOutline /> : importing ? <CircularProgress /> : <PendingRounded/>}
          </Box>
        </Box>)}
        {identities.length > 0 && (
          <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', mt: 2 }}>
            <Button disabled={importing} sx={{ mr: 2 }} variant="contained" onClick={importIdentities}>Import</Button>
            <Button disabled={importing} variant="contained" onClick={done}>Clear</Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default DragOver;