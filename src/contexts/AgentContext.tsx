import SeedPhraseInput from "@/components/SeedPhraseInput";
import { Input } from "@/components/ui/input";
import { Web5PlatformAgent } from "@web5/agent";
import { Web5UserAgent } from "@web5/user-agent";
import React, { createContext, useEffect, useState } from "react";
import { useBackupSeed } from "./Context";

interface Web5ContextProps {
  initialized: boolean;
  agent?: Web5PlatformAgent;
  unlock: (password: string) => Promise<Web5PlatformAgent>;
  initialize: (password: string, dwnEndpoint: string) => Promise<string | undefined>;
  recover: (recoveryPhrase:string, password: string, dwnEndpoint: string) => Promise<void>;
  isInitializing: boolean;
  isConnecting: boolean;
}

export const AgentContext = createContext<Web5ContextProps>({
  initialized: false,
  isConnecting: false,
  isInitializing: false,
  recover: async () => {},
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
  const [dwnEndpoint, setDwnEndpoint] = useState('http://localhost:3001/latest');
  const [recoveryPhrase, setRecoveryPhrase] = useState('');
  const [password, setPassword] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [web5Agent, setWeb5Agent] = useState<
    Web5PlatformAgent| undefined
  >(undefined);
  const { setBackupSeed } = useBackupSeed();

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

  }, [ web5Agent ]);

  const recover = async (recoveryPhrase: string, password: string, dwnEndpoint: string) => {
    const agent = await Web5UserAgent.create();
    await agent.initialize({ recoveryPhrase, password, dwnEndpoints: [ dwnEndpoint ] });
    await agent.start({ password });

    await agent.sync.registerIdentity({ did: agent.agentDid.uri })
    await agent.sync.sync('pull');
  }

  const initialize = async (password: string, dwnEndpoint: string): Promise<string | undefined> => {
    setIsInitializing(true);
    try {
      const agent = await Web5UserAgent.create();
      if (await agent.firstLaunch()) {
        setInitialized(true);
        const recoveryPhrase = await agent.initialize({ password, dwnEndpoints: [ dwnEndpoint ] });
        await agent.start({ password });

        await agent.sync.registerIdentity({ did: agent.agentDid.uri })
        await agent.sync.sync('pull');
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
        await agent.sync.sync('pull');

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

  const handleRecoveryPhraseChange = (phrase: string) => {
    setRecoveryPhrase(phrase);
  }

  const handleAgentSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialized && recoveryPhrase && password) {
      await recover(recoveryPhrase.trim(), password, dwnEndpoint);
      setBackupSeed(recoveryPhrase.trim());
    } else if (!initialized && password) {
      const recoveryPhrase = await initialize(password, dwnEndpoint);
      if (recoveryPhrase) {
        setBackupSeed(recoveryPhrase);
      }
    } else if (initialized && password) {
      await unlock(password);
    }
  };

  if (isInitializing || isConnecting) {
    return (
      <div>
        <div>
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p>
            {isInitializing ? "Initializing..." : "Connecting..."}
          </p>
        </div>
      </div>
    );
  }

  if (!initialized || !web5Agent) {
    return (
      <div>
        <div>
          <h2>
            {initialized ? "Unlock Agent" : "Initialize Agent"}
          </h2>
          {!initialized && (
            <div>
              <SeedPhraseInput
                value={recoveryPhrase}
                onChange={handleRecoveryPhraseChange}
              />
              <Input
                placeholder="DWN Endpoint"
                value={dwnEndpoint}
                onChange={(e) => setDwnEndpoint(e.target.value)}
              />
            </div>
          )}
          <form onSubmit={handleAgentSetup}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={initialized ? "Enter password to unlock" : "Set new password"}
            />
            <button 
              type="submit" 
              disabled={!initialized && !password}
            >
              {initialized ? "Unlock" : recoveryPhrase ? "Recover" : "Generate"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <AgentContext.Provider
      value={{
        recover,
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
