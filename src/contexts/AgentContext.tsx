import { Web5PlatformAgent } from "@web5/agent";
import { Web5UserAgent } from "@web5/user-agent";
import React, { createContext, useEffect, useState } from "react";
import { useBackupSeed } from "./Context";
import { TextField, Button, CircularProgress, Typography, Box, Container, Paper } from "@mui/material";
import Grid from '@mui/material/Grid2';
import LockIcon from '@mui/icons-material/Lock';
import PinInput from '../components/PinInput';

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
  const [isConnecting, setIsConnecting] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);
  const [dwnEndpoint, setDwnEndpoint] = useState('https://dwn.tbddev.org/latest');
  const [web5Agent, setWeb5Agent] = useState<
    Web5PlatformAgent| undefined
  >(undefined);
  const { setBackupSeed } = useBackupSeed();
  const [pin, setPin] = useState(['', '', '', '']);

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

  const handleAgentSetup = async (password: string) => {
   if (!initialized && password) {
      const recoveryPhrase = await initialize(password, dwnEndpoint);
      if (recoveryPhrase) {
        setBackupSeed(recoveryPhrase);
      }
    } else if (initialized && password) {
      await unlock(password);
    }
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const pinString = pin.join('');
    return handleAgentSetup(pinString);
  };

  if (isInitializing || isConnecting) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <CircularProgress size={48} color="primary" />
          <Typography variant="h6" mt={2}>
            {isInitializing ? "Initializing..." : "Connecting..."}
          </Typography>
        </Box>
      </Container>
    );
  }

  if (!initialized || !web5Agent) {
    return (
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
          <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <LockIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom>
              { initialized ? "Unlock Agent" : "Setup Agent" }
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
              Enter your 4-digit PIN to { initialized ? "unlock" : "setup" }
            </Typography>
            <form onSubmit={handleUnlock}>

              <PinInput initialPin={pin} onPinChange={(updatedPin) => setPin(updatedPin)} />

              {!initialized && <Grid container spacing={2} justifyContent="center" sx={{ my: 4 }}>
                <TextField
                  label="DWN Endpoint"
                  value={dwnEndpoint}
                  onChange={(e) => setDwnEndpoint(e.target.value)}
                  fullWidth
                />
              </Grid>}
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                disabled={pin.some(digit => digit === '')}
              >
                { initialized ? "Unlock" : "Setup" }
              </Button>
            </form>
          </Paper>
        </Box>
      </Container>
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
