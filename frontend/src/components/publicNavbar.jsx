import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';

export default function PublicNavbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 40px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 }}>
            {/* Branding */}
            <Link to="/" style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', textDecoration: 'none', letterSpacing: '-0.03em' }}>
                💎 Wealth<span style={{ color: '#0070f3' }}>Lens</span>
            </Link>

            {/* Public Links */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                <Link to="/discover" style={{ color: '#475569', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>Discover Funds</Link>
                <Link to="/compare" style={{ color: '#475569', textDecoration: 'none', fontWeight: '500', fontSize: '0.95rem' }}>Overlap Analyzer</Link>
            </nav>

            {/* Contextual Action Buttons */}
            <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                {user ? (
                    <>
                        <button onClick={() => navigate('/dashboard')} style={{ padding: '8px 16px', fontSize: '0.9rem', background: '#0f172a' }}>Console</button>
                        <button onClick={logout} style={{ padding: '8px 16px', fontSize: '0.9rem', background: 'transparent', color: '#ef4444', border: '1px solid #fca5a5' }}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login" style={{ color: '#0f172a', textDecoration: 'none', fontWeight: '600', fontSize: '0.95rem', padding: '8px 16px' }}>Sign In</Link>
                        <button onClick={() => navigate('/register')} style={{ padding: '10px 20px', fontSize: '0.9rem', background: '#0070f3', width: 'auto' }}>Get Started</button>
                    </>
                )}
            </div>
        </header>
    );
}