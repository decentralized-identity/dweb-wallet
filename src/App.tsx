import { AgentProvider } from '@/contexts/AgentContext';
import { IdentitiesProvider } from '@/contexts/IdentitiesContext';
import Home from '@/pages/Home';


function App() {

  return (
    <AgentProvider>
      <IdentitiesProvider>
        <Home />
      </IdentitiesProvider>
    </AgentProvider>
  );
}

export default App;
