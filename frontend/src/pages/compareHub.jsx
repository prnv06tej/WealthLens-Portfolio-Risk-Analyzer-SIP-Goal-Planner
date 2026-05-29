import { useState, useEffect } from 'react';
import API from '../utils/api';
import { AlertTriangle, CheckCircle2, RefreshCw, BarChart } from 'lucide-react';

export default function CompareHub() {
    const [popularFunds, setPopularFunds] = useState([]);
    const [fundA, setFundA] = useState('');
    const [fundB, setFundB] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // 1. Fetch available curated comparison fields on mount
    useEffect(() => {
        const fetchCurated = async () => {
            try {
                const response = await API.get('/funds/popular');
                setPopularFunds(response.data.data);
            } catch (err) {
                console.error("Failed loading comparison list:", err);
            }
        };
        fetchCurated();
    }, []);

    // 2. Request Overlap Calculation from Backend
    const handleCompare = async () => {
        if (!fundA || !fundB) return;
        setLoading(true);
        try {
            // Adjust this URL string to match your backend calculation endpoint route
            const response = await API.get(`/funds/overlap?fundA=${fundA}&fundB=${fundB}`);
            setAnalysisResult(response.data);
        } catch (err) {
            console.error("Overlap evaluation crash:", err);
        } finally {
            setLoading(false);
        }
    };

    // Helper to determine threat gauge colors based on risk concentrations
    const getRiskStatus = (percentage) => {
        if (percentage < 20) return { label: 'Excellent Diversification', color: '#16a34a', bg: '#f0fdf4' };
        if (percentage < 50) return { label: 'Moderate Overlap (Monitor Closely)', color: '#d97706', bg: '#fffbeb' };
        return { label: 'High Overlap Danger (Redundant Positions)', color: '#dc2626', bg: '#fef2f2' };
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto', fontFamily: 'sans-serif' }}>
            <div style={{ marginBottom: '35px' }}>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '700', color: '#0f172a' }}>Portfolio Overlap Analyzer</h1>
                <p style={{ color: '#64748b', marginTop: '6px' }}>Cross-reference two fund profiles to protect your investments from hidden stock concentration risk.</p>
            </div>

            {/* Selector Panel Layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '20px', alignItems: 'flex-end', background: '#f8fafc', padding: '25px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Select Fund A</label>
                    <select value={fundA} onChange={e => setFundA(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#fff' }}>
                        <option value="">-- Select Curated Fund --</option>
                        {popularFunds.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                    </select>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#334155', fontSize: '0.9rem' }}>Select Fund B</label>
                    <select value={fundB} onChange={e => setFundB(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#fff' }}>
                        <option value="">-- Select Curated Fund --</option>
                        {popularFunds.filter(f => f._id !== fundA).map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
                    </select>
                </div>

                <button 
                    onClick={handleCompare} 
                    disabled={loading || !fundA || !fundB}
                    style={{ padding: '12px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', transition: 'background 0.2s' }}
                >
                    <RefreshCw size={18} className={loading ? 'spin-animation' : ''} />
                    {loading ? 'Analyzing...' : 'Run Analysis'}
                </button>
            </div>

            {/* Analysis Metrics Output Dashboard */}
            {analysisResult && (
                <div style={{ marginTop: '40px' }}>
                    
                    {/* Giant Risk Meter Panel */}
                    <div style={{ ...getRiskStatus(analysisResult.overlapPercentage), display: 'flex', alignItems: 'center', gap: '20px', padding: '25px', borderRadius: '16px', border: '1px solid rgba(0,0,0,0.05)', marginBottom: '30px' }}>
                        {analysisResult.overlapPercentage >= 50 ? <AlertTriangle size={40} color="#dc2626" /> : <CheckCircle2 size={40} color="#16a34a" />}
                        <div>
                            <span style={{ fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.8 }}>Calculated Common Overlap</span>
                            <h2 style={{ fontSize: '3rem', fontWeight: '800', margin: '4px 0 2px 0' }}>{analysisResult.overlapPercentage}%</h2>
                            <p style={{ fontWeight: '600', fontSize: '1.1rem' }}>{getRiskStatus(analysisResult.overlapPercentage).label}</p>
                        </div>
                    </div>

                    {/* Breakdown Matrix Layout */}
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>
                        
                        {/* Common Component Holdings Table */}
                        <div style={{ border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
                            <div style={{ padding: '18px 20px', borderBottom: '1px solid #e2e8f0', background: '#f8fafc', fontWeight: '600', color: '#1e293b' }}>
                                Intersecting Stock Holdings ({analysisResult.commonStocks?.length || 0})
                            </div>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                {analysisResult.commonStocks?.length === 0 ? (
                                    <p style={{ padding: '20px', color: '#64748b', fontStyle: 'italic' }}>Zero common stock conflicts found between these selections.</p>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', fontSize: '0.85rem', color: '#64748b' }}>
                                                <th style={{ padding: '12px 20px' }}>Company Asset Name</th>
                                                <th style={{ padding: '12px 20px' }}>Fund A Weight</th>
                                                <th style={{ padding: '12px 20px' }}>Fund B Weight</th>
                                                <th style={{ padding: '12px 20px', color: '#0f172a', fontWeight: '600' }}>Shared Overlap</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysisResult.commonStocks.map((stock, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem' }}>
                                                    <td style={{ padding: '14px 20px', fontWeight: '500', color: '#1e293b' }}>{stock.name}</td>
                                                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{stock.weightInA}%</td>
                                                    <td style={{ padding: '14px 20px', color: '#64748b' }}>{stock.weightInB}%</td>
                                                    <td style={{ padding: '14px 20px', fontWeight: '600', color: '#0f172a', background: '#f8fafc' }}>{stock.overlapWeight}%</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>

                        {/* Extra Financial Context Cards */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#64748b', marginBottom: '12px' }}>
                                    <BarChart size={20} />
                                    <span style={{ fontWeight: '600', fontSize: '0.9rem' }}>Financial Insights</span>
                                </div>
                                <p style={{ fontSize: '0.9rem', color: '#475569', lineHeight: '1.5' }}>
                                    The portfolio overlap math computes the joint absolute minimum concentration threshold across positions:
                                </p>
                                <div style={{ background: '#f1f5f9', padding: '10px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.85rem', marginTop: '10px', color: '#334155', textAlign: 'center' }}>
                                    {'$$\\text{Overlap \\%} = \\sum_{i} \\min(W_{A,i}, W_{B,i})$$'}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}