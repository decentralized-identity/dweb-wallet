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

export const AgentContext = createContext<Web5ContextProps>({
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

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({
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
      const firstLaunch = await agent.firstLaunch();
      if (!firstLaunch) {
        // get password from local storage if it exists
        const password = localStorage.getItem('password');
        if (password) {
          await unlock(password);
        }
      }

      setInitialized(!firstLaunch);
    };

    if (!web5Agent) {
      checkInitialized();
    }

  }, [ web5Agent ])


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
       agent.sync.startSync({ interval: '45s' });

        localStorage.setItem('password', password);

        // After 2 minutes of inactivity, remove the password from local storage
        let inactivityTimer = setTimeout(() => {
          localStorage.removeItem('password');
        }, 2 * 60 * 1000);

        // Reset the timer on user activity
        const resetTimer = () => {
          clearTimeout(inactivityTimer);
          const newTimer = setTimeout(() => {
            localStorage.removeItem('password');
          }, 2 * 60 * 1000);
          return newTimer;
        };

        // Add event listeners for user activity
        window.addEventListener('mousemove', () => {
          inactivityTimer = resetTimer();
        });
        window.addEventListener('keypress', () => {
          inactivityTimer = resetTimer();
        });
        
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
    <AgentContext.Provider
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
    </AgentContext.Provider>
  );
};
