import { Input } from "@/components/Input";
import IdentityList from "../components/identity/IdentityList";
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
    <div className="w-full">
      {isConnected && agent ? (
        <IdentityList />
      ) : initialized ? (
        <div className="text-center space-y-8">
          {recoveryPhrase ? (<div>
            <div>{recoveryPhrase}</div>
            <Button onClick={() => unlockAgent(password)}> Next </Button>
          </div>) :
          <div>
            <div>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div>
              <Button onClick={() => unlockAgent(password)}>
                Unlock
              </Button>
            </div>
          </div>}
        </div>
      ) : (
        <div className="text-center space-y-8">
          <div>Initialize Your Wallet</div>
          <div>
            <Input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <Button onClick={() => initializeAgent(password)}>
              Initialize
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
