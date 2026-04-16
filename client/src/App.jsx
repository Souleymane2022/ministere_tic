import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/auth';
import Layout from './components/Layout';
import Login from './pages/auth/Login';
import TwoFactorSetup from './pages/auth/TwoFactorSetup';
import Dashboard from './pages/Dashboard';
import Ged from './pages/ged/Ged';
import GedDetail from './pages/ged/GedDetail';
import Rh from './pages/rh/Rh';
import Conges from './pages/rh/Conges';
import Presences from './pages/rh/Presences';
import Organigramme from './pages/rh/Organigramme';
import Evaluations from './pages/rh/Evaluations';
import Finance from './pages/finance/Finance';
import Depenses from './pages/finance/Depenses';
import Contrats from './pages/finance/Contrats';
import Communication from './pages/communication/Communication';
import Messagerie from './pages/communication/Messagerie';
import Annuaire from './pages/communication/Annuaire';
import Projets from './pages/projets/Projets';
import ProjetDetail from './pages/projets/ProjetDetail';
import Admin from './pages/admin/Admin';
import AuditLogs from './pages/admin/AuditLogs';
import Settings from './pages/admin/Settings';
import Profile from './pages/Profile';

function ProtectedRoute({ children, roles }) {
  const { user, accessToken } = useAuthStore();
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="2fa" element={<TwoFactorSetup />} />

        <Route path="ged" element={<Ged />} />
        <Route path="ged/:id" element={<GedDetail />} />

        <Route path="rh" element={<Rh />} />
        <Route path="rh/conges" element={<Conges />} />
        <Route path="rh/presences" element={<Presences />} />
        <Route path="rh/organigramme" element={<Organigramme />} />
        <Route path="rh/evaluations" element={<Evaluations />} />

        <Route path="finance" element={<Finance />} />
        <Route path="finance/depenses" element={<Depenses />} />
        <Route path="finance/contrats" element={<Contrats />} />

        <Route path="communication" element={<Communication />} />
        <Route path="messages" element={<Messagerie />} />
        <Route path="messages/:userId" element={<Messagerie />} />
        <Route path="annuaire" element={<Annuaire />} />

        <Route path="projets" element={<Projets />} />
        <Route path="projets/:id" element={<ProjetDetail />} />

        <Route path="admin" element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}><Admin /></ProtectedRoute>
        } />
        <Route path="admin/audit" element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}><AuditLogs /></ProtectedRoute>
        } />
        <Route path="admin/settings" element={
          <ProtectedRoute roles={['SUPER_ADMIN', 'ADMIN']}><Settings /></ProtectedRoute>
        } />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
