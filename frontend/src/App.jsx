import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Login from './pages/login'; 
import Register from './pages/register';
import ProfileSettings from './pages/profileSettings';
import Discover from './pages/discover';
import CompareHub from './pages/compareHub';
import Dashboard from './pages/dashboard';
import Landing from './pages/landingPage'; 
import Layout from './components/layout';
import PublicLayout from './components/publicLayout';
import AdminCockpit from './pages/adminCockpit';

//  standard user gateway
function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

//  BRAND NEW: DECENTRALIZED ADMIN SECURITY BOUNCER
function AdminRoute({ children }) {
    const { user, loading } = useAuth();
    
    if (loading) return <div>Verifying credentials...</div>;
    
    // Check if the user is authenticated AND contains the absolute admin database string
    return user && user.role === 'admin' ? children : <Navigate to="/dashboard" />;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    
                    {/* ZONE 1: PURELY PUBLIC */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/compare" element={<CompareHub />} />
                    </Route>

                    {/* ZONE 2: INDEPENDENT AUTH GATEWAYS */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/* ZONE 3: CLIENT PORTAL LAYOUT */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                    </Route>

                    {/*  ZONE 4: SERVER-VERIFIED ADMIN ACCESS NODE */}
                    {/* Wrapped inside AdminRoute to instantly redirect malicious or standard users */}
                    <Route path="/ops-control-panel" element={
                        <AdminRoute>
                            <AdminCockpit />
                        </AdminRoute>
                    } />
                    
                    {/* Catch-all Wildcard Route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}