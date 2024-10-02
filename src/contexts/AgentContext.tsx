import React, { createContext, useCallback, useEffect, useState } from "react";

import { AppProvider } from "@toolpad/core";
import Grid from '@mui/material/Grid2';
import LockIcon from '@mui/icons-material/Lock';
import PinInput from '../components/PinInput';
import { TextField, Button, CircularProgress, Typography, Box, Container, Paper } from "@mui/material";

import { Web5UserAgent } from "@web5/user-agent";

import { useBackupSeed } from "./Context";

interface Web5ContextProps {
  unlocked: boolean;
  initialized: boolean;
  agent?: Web5UserAgent;
}

export const AgentContext = createContext<Web5ContextProps>({
  unlocked: false,
  initialized: false,
});

export const AgentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { setBackupSeed } = useBackupSeed();

  const [web5Agent, setWeb5Agent] = useState<Web5UserAgent | undefined>(undefined);

  const [initialized, setInitialized] = useState(false);
  const [isInitializing, setIsInitializing] = useState(false);

  const [unlocked, setUnlocked] = useState(false);

  const [isConnecting, setIsConnecting] = useState(false);
  const [dwnEndpoint, setDwnEndpoint] = useState('https://dwn.tbddev.org/latest');
  const [pin, setPin] = useState(['', '', '', '']);

  useEffect(() => {
    let loading = false;

    const loadAgent = async () => {
      if (loading) return;
      loading = true;
      const agent = await Web5UserAgent.create();
      setInitialized(!await agent.firstLaunch());
      setWeb5Agent(agent);
      loading = false;
    }

    if (!web5Agent) {
      loadAgent();
    }

  });

  const unlock = useCallback(async (password: string) => {
    if (isConnecting) {
      return;
    }

    if (!web5Agent) {
      throw new Error("Agent not initialized");
    }

    if (unlocked) {
      return;
    }

    setIsConnecting(true);
    try {
        await web5Agent.start({ password });
        setWeb5Agent(web5Agent);
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
            setUnlocked(false);
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
        setUnlocked(true);
    } catch (error) {
      setIsConnecting(false);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [ web5Agent, unlocked, isConnecting ]);

  useEffect(() => {
    if (web5Agent && initialized && !unlocked) {
      const password = localStorage.getItem('password');
      if (password) {
        unlock(password);
      }
    }
  }, [ web5Agent, initialized, unlocked, unlock ]);

  const initialize = useCallback(async (password: string, dwnEndpoint: string): Promise<string | undefined> => {
    if (!web5Agent) {
      throw new Error("Agent not initialized");
    }

    setIsInitializing(true);
    try {
      if (await web5Agent.firstLaunch()) {
        const recoveryPhrase = await web5Agent.initialize({ password, dwnEndpoints: [ dwnEndpoint ] });
        await web5Agent.start({ password });
        await web5Agent.sync.registerIdentity({ did: web5Agent.agentDid.uri })
        await web5Agent.sync.sync('pull');
        setInitialized(true);
        setUnlocked(true);
        return recoveryPhrase;
      }
    } catch (error) {
      setIsInitializing(false);
      throw error;
    } finally {
      setIsInitializing(false);
    }
  }, [ web5Agent ]);

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
      <AppProvider>
        <Container maxWidth="sm">
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
            <CircularProgress size={48} color="primary" />
            <Typography variant="h6" mt={2}>
              {isInitializing ? "Initializing..." : "Connecting..."}
            </Typography>
          </Box>
        </Container>
      </AppProvider>
    );
  }

  if (!initialized || !web5Agent || !unlocked) {
    return (
      <AppProvider>
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
      </AppProvider>
    );
  }

  return (
    <AgentContext.Provider
      value={{
        unlocked,
        initialized,
        agent: web5Agent,
      }}
    >
      {children}
    </AgentContext.Provider>
  );
};
