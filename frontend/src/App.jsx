import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/authContext';
import Login from './pages/login'; 
import Register from './pages/register';
import ProfileSettings from './pages/profileSettings';
import Discover from './pages/discover';
import CompareHub from './pages/compareHub';
import Dashboard from './pages/dashboard';
import Landing from './pages/landingPage';
import Layout from './components/Layout';
import PublicLayout from './components/publicLayout';

function ProtectedRoute({ children }) {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
}

export default function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/*  GROUP 1: PUBLIC ACCESSIBLE OUTSIDE OF SECURE SESSION */}
                    <Route element={<PublicLayout />}>
                        <Route path="/" element={<Landing />} />
                        <Route path="/discover" element={<Discover />} />
                        <Route path="/compare" element={<CompareHub />} />
                    </Route>

                    {/* GROUP 2: INDEPENDENT AUTH GATEWAYS */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    
                    {/*  GROUP 3: PRIVATE SECURITY GATE RESIDENTIAL TERMINAL */}
                    <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/profile" element={<ProfileSettings />} />
                    </Route>
                    
                    {/* Catch-all Wildcard Route */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}