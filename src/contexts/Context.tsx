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

  const { isConnecting, agent, unlock, initialized, initialize, isInitializing } = context;

  const isConnected = agent !== undefined;

  return {
    initialize,
    initialized,
    agent,
    isConnecting,
    unlock,
    isConnected,
    isInitializing
  };
};

export const useIdentities = () => {
  const context = useContext(IdentitiesContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  const {
    getIdentity,
    uploadAvatar,
    uploadBanner,
    createIdentity,
    deleteIdentity,
    identities,
    reloadIdentities,
    selectedIdentity,
    setSelectedIdentity,
  } = context;

  return {
    getIdentity,
    uploadAvatar,
    uploadBanner,
    createIdentity,
    deleteIdentity,
    identities,
    reloadIdentities,
    selectedIdentity,
    setSelectedIdentity,
  };
};

export const useProtocols= () => {
  const context = useContext(ProtocolsContext);
  if (!context) {
    throw new Error("useProtocols must be used within a ProtocolsProvider");
  }

  const {
    addProtocol,
    listProtocols,
    loadProtocols,
  } = context;

  return {
    addProtocol,
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
