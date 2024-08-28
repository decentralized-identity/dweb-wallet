import { Input } from "@/components/ui/input";
import IdentityList from "../components/identity/IdentityList.tsx.bak";
import { useAgent } from "../web5/use-agent";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

/**
 * Home page: landing page with invitation to connect
 */
export const HomePage = () => {
  const { isConnected, agent, initialized, initialize, unlock } = useAgent();
  const [ password, setPassword ] = useState<string>('');
  const [ recoveryPhrase, setRecoveryPhrase ] = useState<string>('');

  const unlockAgent = async (password: string) => {
    await unlock(password);
    setPasswordToLocalStorage(password);
  }

  useEffect(() => {
    const getPassswordFromLocalStorage = async () => {
      const password = localStorage.getItem('password');
      if (password) {
        await unlock(password);
        setPassword(password);
      }
    }
    getPassswordFromLocalStorage()
  }, [ unlock ]);

  const setPasswordToLocalStorage = (password: string) => {
    localStorage.setItem('password', password);
    setPassword(password)
  }

  const initializeAgent = async (password: string) => {
    const recoveryPhrase = await initialize(password);
    if (recoveryPhrase) {
      localStorage.setItem('recoveryPhrase', recoveryPhrase);
      setRecoveryPhrase(recoveryPhrase);
    }
  }

  return (
    <div className="space-y-6">
      {isConnected && agent ? (
        <IdentityList />
      ) : initialized ? (
        <div className="space-y-4">
          {recoveryPhrase ? (
            <div className="space-y-4">
              <div className="bg-yellow-100 p-4 rounded-md">
                <h3 className="font-bold mb-2">Recovery Phrase:</h3>
                <p className="text-sm break-all">{recoveryPhrase}</p>
              </div>
              <Button onClick={() => unlockAgent(password)} className="w-full">
                Next
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button onClick={() => unlockAgent(password)} className="w-full">
                Unlock
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Initialize Your Wallet</h2>
          <Input
            type="password"
            id="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button onClick={() => initializeAgent(password)} className="w-full">
            Initialize
          </Button>
        </div>
      )}
    </div>
  );
};
