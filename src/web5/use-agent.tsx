import { useContext } from "react";
import { Web5AgentContext } from "./AgentContext";

export const useAgent = () => {
  const context = useContext(Web5AgentContext);
  if (!context) {
    throw new Error("useAgent must be used within a Web5Provider");
  }

  const { isConnecting, agent, unlock, initialized, initialize } = context;

  const isConnected = agent !== undefined;

  return {
    initialize,
    initialized,
    agent,
    isConnecting,
    unlock,
    isConnected,
  };
};
