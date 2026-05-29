import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { LayoutDashboard, Compass, Columns, User, LogOut } from 'lucide-react';

export default function Layout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    // Navigation configuration item lists
    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
        { path: '/discover', label: 'Discover Funds', icon: <Compass size={20} /> },
        { path: '/compare', label: 'Overlap Analyzer', icon: <Columns size={20} /> },
        { path: '/profile', label: 'KYC & Settings', icon: <User size={20} /> },
    ];

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', background: '#f8fafc', overflow: 'hidden' }}>
            
            {/* Rigid Fintech App Sidebar Panel Layout */}
            <div style={{ width: '260px', background: '#0f172a', color: '#fff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '24px 16px' }}>
                <div>
                    {/* Brand Banner */}
                    <div style={{ padding: '0 8px 30px 8px', fontSize: '1.3rem', fontWeight: '800', letterSpacing: '-0.025em', color: '#fff', borderBottom: '1px solid #1e293b' }}>
                     🔎 Wealth<span style={{ color: '#38bdf8' }}>Lens</span>
                    </div>

                    {/* Operational App View Links */}
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '25px' }}>
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link key={item.path} to={item.path} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', color: isActive ? '#fff' : '#94a3b8', background: isActive ? '#1e293b' : 'transparent', textDecoration: 'none', borderRadius: '8px', fontWeight: '500', transition: 'all 0.2s' }}>
                                    {item.icon}
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Foot Profile Admin Banner Block */}
                <div style={{ paddingTop: '15px', borderTop: '1px solid #1e293b', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ padding: '0 8px' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#f8fafc' }}>{user?.name || 'Investor Profile'}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Tier V1.0 Account</div>
                    </div>
                    <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px', background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', textAlign: 'left', fontWeight: '600', borderRadius: '6px' }}>
                        <LogOut size={18} />
                        Exit Session
                    </button>
                </div>
            </div>

            {/* Scrolling Dynamic Content Box Panel view wrapper */}
            <div style={{ flex: 1, overflowY: 'auto', background: '#fff' }}>
                <Outlet />
            </div>

        </div>
    );
}