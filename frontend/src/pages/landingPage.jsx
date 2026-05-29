import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/publicNavbar';
import { Compass, Columns, ShieldCheck } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <PublicNavbar />
            
            {/* Hero Section */}
            <section style={{ padding: '100px 20px 80px 20px', textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
                <span style={{ background: '#e0f2fe', color: '#0384c7', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Next-Gen Analytics Engine
                </span>
                <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#0f172a', margin: '24px 0 16px 0', letterSpacing: '-0.04em', lineHeight: '1.15' }}>
                    Clear the smoke out of your Mutual Fund portfolios.
                </h1>
                <p style={{ fontSize: '1.2rem', color: '#475569', lineHeight: '1.6', marginBottom: '36px' }}>
                    Analyze hidden asset correlations, map core stock intersections, and audit capital performance using clean, mathematical metrics.
                </p>
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                    <button onClick={() => navigate('/register')} style={{ width: '200px', background: '#0070f3', padding: '14px' }}>Create Free Radar</button>
                    <button onClick={() => navigate('/compare')} style={{ width: '200px', background: '#f1f5f9', color: '#0f172a', padding: '14px' }}>Test Overlap Math</button>
                </div>
            </section>

            {/* Core Features Overview */}
            <section style={{ padding: '60px 40px 100px 40px', maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#f8fafc' }}>
                    <div style={{ color: '#0070f3', marginBottom: '16px' }}><Compass size={32} /></div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Marketplace Discovery</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Filter and review our top 45 curated market cap performers or cross-reference the live 45,000+ global AMFI data register.</p>
                </div>

                <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#f8fafc' }}>
                    <div style={{ color: '#10b981', marginBottom: '16px' }}><Columns size={32} /></div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Concentration Deep Dive</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Isolate intersecting corporate equity risk across funds instantly. Guard your portfolio from redundant allocations before buying.</p>
                </div>

                <div style={{ padding: '30px', border: '1px solid #e2e8f0', borderRadius: '16px', background: '#f8fafc' }}>
                    <div style={{ color: '#8b5cf6', marginBottom: '16px' }}><ShieldCheck size={32} /></div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>Asynchronous Verification</h3>
                    <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Onboard instantly with low-friction credentials. Delay detailed banking data, PAN records, and profile setups until you execute live tracking loops.</p>
                </div>
            </section>
        </div>
    );
}