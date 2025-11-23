import React from 'react';
import { MemoryRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Latest from './pages/Latest';
import Startups from './pages/Startups';
import Events from './pages/Events';
import MarketAnalysis from './pages/MarketAnalysis';
import Podcasts from './pages/Podcasts';
import Newsletters from './pages/Newsletters';
import Partners from './pages/Partners';
import AIAssistant from './pages/AIAssistant';
import Auth from './pages/Auth';
import Saved from './pages/Saved';
import Resources from './pages/Resources';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
      
      <Route path="/" element={<Latest />} />
      <Route path="/startups" element={<Startups />} />
      <Route path="/events" element={<Events />} />
      <Route path="/market" element={<MarketAnalysis />} />
      <Route path="/podcasts" element={<Podcasts />} />
      <Route path="/newsletters" element={<Newsletters />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/resources" element={<Resources />} />
      
      <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
      <Route path="/saved" element={<ProtectedRoute><Saved /></ProtectedRoute>} />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;