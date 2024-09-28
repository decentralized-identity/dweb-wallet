import BottomBar from "@/components/BottomBar";
import IdentityDetails from "@/components/identity/IdentityDetails";
import IdentityList from "@/components/identity/IdentityList";
import TopBar from "@/components/TopBar";
import { useBackupSeed, useIdentities } from "@/contexts/Context";
import { ProtocolsProvider } from "@/contexts/ProtocolsContext";
import { useEffect, useState } from "react";
import BackupSeedPhrase from "@/components/BackupSeedPhrase";
import { PortableIdentity } from "@web5/agent";

const Home: React.FC = () => {
  const [ isDarkMode, setIsDarkMode ] = useState(false);
  const [ isDragging, setIsDragging ] = useState(false);
  const [ droppedFiles, setDroppedFiles ] = useState<File[]>([]);
  const { selectedIdentity, setSelectedIdentity, importIdentity } = useIdentities();
  const { showSeedScreen } = useBackupSeed();

  useEffect(() => {
    const loadIdentities = async () => {
      const uniqueIdentities = new Map<string, PortableIdentity>();
      const identities = await Promise.all(droppedFiles.map(async f => JSON.parse(await f.text()) as PortableIdentity));
      identities.forEach(i => uniqueIdentities.set(i.portableDid.uri, i));
      await importIdentity(...Array.from(uniqueIdentities.values())); 
      setDroppedFiles([]);
    }

    if (droppedFiles.length > 0) {
      loadIdentities();
    }
  }, [ droppedFiles, importIdentity ]);

  useEffect(() => {
    // Handlers for the drag events
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();


      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        const filesArray = Array.from(e.dataTransfer.files);
        setDroppedFiles(filesArray as File[]);
        e.dataTransfer.clearData();
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    }
  }, [])

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div>
      <TopBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      {showSeedScreen && <BackupSeedPhrase />}
      {!showSeedScreen && !isDragging && (
        <div>
          <div>
            <IdentityList />
          </div>
        <div>
          {selectedIdentity ? (
            <ProtocolsProvider>
              <IdentityDetails 
                onBack={() => setSelectedIdentity(undefined)}
              />
            </ProtocolsProvider>
          ) : (
            <div>
              <p>Select an identity to view details</p>
            </div>
          )}
        </div>
      </div>
      )}
      {!showSeedScreen && isDragging && (
        <div>
          {!droppedFiles.length && <p>Drop files here to upload</p>}
          {droppedFiles.length > 0 && <ul>
            {droppedFiles.map(file => <li key={file.name}>{file.name}</li>)}
          </ul>}
        </div>
      )}
      <BottomBar />
    </div>
  );
}

export default Home;