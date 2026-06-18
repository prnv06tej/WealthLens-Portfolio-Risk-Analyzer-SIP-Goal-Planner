import { useNavigate } from 'react-router-dom';
import { Compass, Columns, Cpu, ArrowRight, Activity } from 'lucide-react';

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', overflowX: 'hidden', fontFamily: 'sans-serif' }}>
            
            {/* Ambient Background Glow Particles */}
            <div style={{ position: 'absolute', top: '-10%', left: '20%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(0,112,243,0.15) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
            <div style={{ position: 'absolute', top: '40%', right: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

            {/* Core Hero Frame */}
            <section style={{ position: 'relative', zIndex: 1, padding: '120px 20px 60px 20px', textAlign: 'center', maxWidth: '900px', margin: '0 auto' }}>
                <span style={{ background: 'linear-gradient(90deg, rgba(0,112,243,0.2) 0%, rgba(139,92,246,0.2) 100%)', border: '1px solid rgba(0,112,243,0.3)', color: '#38bdf8', padding: '8px 18px', borderRadius: '30px', fontSize: '0.85rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                     Premium Terminal Interface
                </span>
                
                <h1 style={{ fontSize: '4rem', fontWeight: '800', margin: '30px 0 20px 0', letterSpacing: '-0.04em', lineHeight: '1.1', background: 'linear-gradient(180deg, #ffffff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Clear the smoke out of your Mutual Fund portfolios.
                </h1>
                
                <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: '1.6', maxWidth: '700px', margin: '0 auto 40px auto' }}>
                    Analyze hidden asset correlations, map core stock intersections, and audit capital performance using clean, mathematical metrics.
                </p>
                
                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', marginBottom: '80px' }}>
                    <button onClick={() => navigate('/register')} style={{ width: '220px', background: '#0070f3', padding: '14px 28px', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '1rem', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', boxShadow: '0 4px 14px rgba(0, 112, 243, 0.4)' }}>
                        Launch Radar Terminal <ArrowRight size={18} />
                    </button>
                    <button onClick={() => navigate('/compare')} style={{ width: '200px', background: 'rgba(30, 41, 59, 0.5)', color: '#cbd5e1', padding: '14px', borderRadius: '8px', border: '1px solid #334155', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
                        Test Overlap Math
                    </button>
                </div>

                {/*  REFINED SECURE TERMINAL CARD: Stable, flat layout with crisp glassmorphism shadow effects */}
                <div style={{ width: '100%', maxWidth: '850px', display: 'inline-block', marginBottom: '60px' }}>
                    <div style={{
                        background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.4) 100%)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: '20px',
                        padding: '30px',
                        textAlign: 'left',
                        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 112, 243, 0.08)',
                        backdropFilter: 'blur(12px)'
                    }}>
                        {/* Terminal UI Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '15px', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <div style={{ width: '12px', height: '12px', background: '#ef4444', borderRadius: '50%' }} />
                                <div style={{ width: '12px', height: '12px', background: '#f59e0b', borderRadius: '50%' }} />
                                <div style={{ width: '12px', height: '12px', background: '#10b981', borderRadius: '50%' }} />
                            </div>
                            <span style={{ fontSize: '0.8rem', fontFamily: 'monospace', color: '#64748b', letterSpacing: '0.1em' }}>WEALTHLENS_CORE_ENGINE_V1.0</span>
                        </div>

                        {/* Card Internal Body Content */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '40px', alignItems: 'center' }}>
                            <div>
                                <h3 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#fff', margin: '0 0 12px 0' }}>Real-time Overlap Calculus</h3>
                                <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>
                                    The core system calculation pipeline maps mutual fund indices via decentralized asset node strings. It automatically cross-references and flags intersecting stock positions.
                                </p>
                            </div>
                            
                            {/* Graphic Visual Module */}
                            <div style={{ background: 'rgba(0,0,0,0.25)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#10b981' }}>
                                    <Activity size={16} className="spin-animation" style={{ animationDuration: '3s' }} />
                                    <span>MATRIX ACTIVE: INDEX_RADAR</span>
                                </div>
                                <div style={{ color: '#64748b' }}>&gt; Initializing MERN context bridge...</div>
                                <div style={{ color: '#64748b' }}>&gt; Binding Gemini fallback matrix...</div>
                                <div style={{ color: '#fff', marginTop: '8px', fontWeight: 'bold' }}>&gt; OVERLAP_THREAT_INDEX: 0.00% ✅</div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Core Features Marketing Section */}
            <section style={{ position: 'relative', zIndex: 1, padding: '40px 40px 120px 40px', maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                <div style={{ padding: '30px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
                    <div style={{ color: '#0070f3', marginBottom: '16px' }}><Compass size={32} /></div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Marketplace Discovery</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Filter and review our top 45 curated market cap performers or cross-reference the live 45,000+ global AMFI data register.</p>
                </div>

                <div style={{ padding: '30px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
                    <div style={{ color: '#10b981', marginBottom: '16px' }}><Columns size={32} /></div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Concentration Deep Dive</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Isolate intersecting corporate equity risk across funds instantly. Guard your portfolio from redundant allocations before buying.</p>
                </div>

                <div style={{ padding: '30px', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)' }}>
                    <div style={{ color: '#8b5cf6', marginBottom: '16px' }}><Cpu size={32} /></div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px', color: '#fff' }}>Asynchronous Verification</h3>
                    <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: '1.5', margin: 0 }}>Onboard instantly with low-friction credentials. Delay detailed banking data, PAN records, and profile setups until you execute live tracking loops.</p>
                </div>
            </section>
        </div>
    );
}