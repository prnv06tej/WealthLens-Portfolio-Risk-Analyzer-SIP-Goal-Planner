import { Outlet } from 'react-router-dom';
import PublicNavbar from './publicNavbar';

export default function PublicLayout() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff' }}>
            <PublicNavbar />
            <main style={{ flex: 1 }}>
                <Outlet />
            </main>
        </div>
    );
}