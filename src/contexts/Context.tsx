import { useContext } from "react";
import { AgentContext } from "./AgentContext";
import { IdentitiesContext } from "./IdentitiesContext";
import { ProtocolsContext } from "./ProtocolsContext";
import { ThemeContext } from "./ThemeContext";
import { BackupSeedContext } from "./BackupSeedContext";
import { ProfileContext } from "./ProfileContext";

export const useAgent = () => {
  const context = useContext(AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  const { isConnecting, agent, unlock, initialized, initialize, isInitializing, recover } = context;

  const isConnected = agent !== undefined;

  return {
    recover,
    initialize,
    initialized,
    agent,
    isConnecting,
    unlock,
    isConnected,
    isInitializing,
  };
};

export const useIdentities = () => {
  const context = useContext(IdentitiesContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  return {
    ...context,
  };
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  const { social, avatar, hero, avatarUrl, heroUrl, setSocial, setAvatar, setHero} = context;

  return {
    social,
    avatar,
    avatarUrl,
    hero,
    heroUrl,
    setSocial,
    setAvatar,
    setHero,
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
