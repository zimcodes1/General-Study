import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyCatalogues from './pages/MyCatalogues';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import CatalogueOverview from './pages/CatalogueOverview';
import LearningSession from './pages/LearningSession';
import Assessment from './pages/Assessment';
import AdminPanel from './pages/AdminPanel';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalogues" element={<MyCatalogues />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/catalogue/:id" element={<CatalogueOverview />} />
        <Route path="/learn/:catalogueId/:topicId/:subtopicId" element={<LearningSession />} />
        <Route path="/assessment/:catalogueId/:mode" element={<Assessment />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
