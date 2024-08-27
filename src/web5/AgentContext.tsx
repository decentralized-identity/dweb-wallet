import { Web5PlatformAgent } from "@web5/agent";
import { Web5UserAgent } from "@web5/user-agent";
import React, { createContext, useEffect, useState } from "react";

interface Web5ContextProps {
  initialized: boolean;
  agent?: Web5PlatformAgent;
  unlock: (password: string) => Promise<Web5PlatformAgent>;
  initialize: (password: string) => Promise<string | undefined>;
  isInitializing: boolean;
  isConnecting: boolean;
}

export const Web5AgentContext = createContext<Web5ContextProps>({
  initialized: false,
  isConnecting: false,
  isInitializing: false,
  initialize: async () => {
    throw new Error("Web5Context not initialized");
  },
  unlock: async () => {
    throw new Error("Web5Context not initialized");
  },
});

export const Web5Provider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const [initialized, setInitialized] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [web5Agent, setWeb5Agent] = useState<
    Web5PlatformAgent| undefined
  >(undefined);

  useEffect(() => {
    const checkInitialized = async () => {
      const agent = await Web5UserAgent.create();
      const initialized = await agent.firstLaunch();
      setInitialized(!initialized);
    };

    checkInitialized();
  })


  const initialize = async (password: string): Promise<string | undefined> => {
    console.log('initializing....')
    setIsInitializing(true);
    try {
      const agent = await Web5UserAgent.create();
      if (await agent.firstLaunch()) {
        setInitialized(true);
        const recoveryPhrase = await agent.initialize({ password });
        return recoveryPhrase;
      }
    } catch (error) {
      setIsInitializing(false);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }


  const unlock = async (password: string) => {
    setIsConnecting(true);
    try {
        const agent = await Web5UserAgent.create();
        await agent.start({ password });
        setWeb5Agent(agent);
        return agent;
    } catch (error) {
      setIsConnecting(false);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Web5AgentContext.Provider
      value={{
        initialized,
        initialize,
        unlock,
        agent: web5Agent,
        isInitializing,
        isConnecting,
      }}
    >
      {children}
    </Web5AgentContext.Provider>
  );
};
