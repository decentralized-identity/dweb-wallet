import { useContext } from "react";
import { AgentContext } from "@/contexts/AgentContext";

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
