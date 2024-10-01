import { useContext } from "react";
import { AgentContext } from "./AgentContext";
import { IdentitiesContext } from "./IdentitiesContext";
import { ProtocolsContext } from "./ProtocolsContext";
import { ThemeContext } from "./ThemeContext";
import { BackupSeedContext } from "./BackupSeedContext";

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  const { agent, initialized, unlocked } = context;

  return {
    agent: initialized && unlocked ? agent : undefined,
  };
};

export const useIdentities = () => {
  const context = useContext(IdentitiesContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  const { 
    createIdentity, 
    updateIdentity,
    identities, 
    loadIdentities, 
    selectedIdentity, 
    selectIdentity, 
    deleteIdentity,
    exportIdentity,
    dwnEndpoints,
    wallets,
    importIdentity,
    setWallets,
    setDwnEndpoints
  } = context;

  return {
    identities,
    loadIdentities,
    createIdentity,
    updateIdentity,
    deleteIdentity,
    exportIdentity,
    importIdentity,
    selectedIdentity,
    wallets,
    dwnEndpoints,
    selectIdentity,
    setWallets,
    setDwnEndpoints
  };
};

export const useProtocols= () => {
  const context = useContext(ProtocolsContext);
  if (!context) {
    throw new Error("useProtocols must be used within a ProtocolsProvider");
  }

  const {
    listProtocols,
    loadProtocols,
  } = context;

  return {
    listProtocols,
    loadProtocols,
  };
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  const { theme, toggleTheme } = context;

  return { theme, toggleTheme };
};

export const useBackupSeed = () => {
  const context = useContext(BackupSeedContext);
  if (!context) {
    throw new Error("useBackupSeed must be used within a BackupSeedProvider");
  }

  const { backupSeed, setBackupSeed, removeBackupSeed, showSeedScreen, toggleSeedScreen } = context;

  return { backupSeed, setBackupSeed, removeBackupSeed, showSeedScreen, toggleSeedScreen };
}
