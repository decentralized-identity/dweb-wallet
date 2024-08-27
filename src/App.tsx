import { Web5Provider } from './web5/AgentContext';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import './App.css'
import { HomePage } from './pages/home-page';
import { Web5IdentitiesProvider } from './web5/IdentitiesContext';
import WebConnect from './pages/web-connect';

function App() {
  return (
    <Router>
      <Web5Provider>
        <Web5IdentitiesProvider>
          <div className="flex md:min-h-screen">
            <div>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/web-connect" element={<WebConnect />} />
              </Routes>
            </div>
          </div>
        </Web5IdentitiesProvider>
      </Web5Provider>
    </Router>
  )
}

export default App
