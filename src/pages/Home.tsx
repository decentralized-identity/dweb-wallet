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
    <div className="h-screen w-full bg-background-light dark:bg-background-dark text-text-light-primary dark:text-text-dark-primary flex flex-col">
      <TopBar toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />
      {showSeedScreen && <BackupSeedPhrase />}
      {!showSeedScreen && !isDragging && (
        <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
          <div className={`md:w-3/10 ${selectedIdentity ? 'hidden md:block' : 'block'} bg-surface-light dark:bg-surface-dark overflow-y-auto`}>
          <IdentityList />
        </div>
        <div className={`flex-grow ${selectedIdentity ? 'block' : 'hidden md:block'} overflow-y-auto`}>
          {selectedIdentity ? (
            <ProtocolsProvider>
              <IdentityDetails 
                onBack={() => setSelectedIdentity(undefined)}
              />
            </ProtocolsProvider>
          ) : (
            <div className="h-full flex items-center justify-center">
              <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary">Select an identity to view details</p>
              </div>
            )}
          </div>
        </div>
      )}
      {!showSeedScreen && isDragging && (
        <div className="h-full flex items-center justify-center">
          {!droppedFiles.length && <p className="text-lg text-text-light-secondary dark:text-text-dark-secondary">Drop files here to upload</p>}
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