import { useState } from 'react';
import API from '../utils/api';
import { Cpu, Database, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function AdminIngest() {
    const [isin, setIsin] = useState('');
    const [category, setCategory] = useState('Large Cap');
    const [messyText, setMessyText] = useState('');
    const [status, setStatus] = useState({ text: '', isError: false });
    const [loading, setLoading] = useState(false);

    const handleIngest = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ text: '', isError: false });

        try {
            // Strikes your backend fallback AI extraction endpoint row perfectly
            const response = await API.post('/admin/ingest-portfolio', {
                isin,
                category,
                messyText
            });

            setStatus({ 
                text: `🎉 Ingestion Success! Processed ${response.data.count || 'all'} holdings into Atlas database.`, 
                isError: false 
            });
            
            // Clear text area on success
            setMessyText('');
            setIsin('');
        } catch (err) {
            setStatus({ 
                text: 'Ingestion Fault: ' + (err.response?.data?.details || err.response?.data?.message || err.message), 
                isError: true 
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '40px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1e293b' }}>
            
            {/* Header Area */}
            <div style={{ marginBottom: '35px', borderBottom: '1px solid #e2e8f0', paddingBottom: '20px' }}>
                <span style={{ fontSize: '0.75rem', background: '#fef3c7', color: '#d97706', padding: '4px 10px', borderRadius: '12px', fontWeight: '700', textTransform: 'uppercase' }}>
                    System Administration Mode
                </span>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', margin: '10px 0 0 0' }}>Data Ingestion Cockpit</h1>
                <p style={{ color: '#64748b', marginTop: '6px' }}>Feed raw text documents to the Gemini AI parser to populate the WealthLens fund registry.</p>
            </div>

            {/* Status Notifications Banner */}
            {status.text && (
                <div style={{ 
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px', borderRadius: '8px', marginBottom: '30px', fontWeight: '500', fontSize: '0.95rem',
                    background: status.isError ? '#fef2f2' : '#f0fdf4', 
                    color: status.isError ? '#b91c1c' : '#16a34a',
                    border: `1px solid ${status.isError ? '#fca5a5' : '#bbf7d0'}`
                }}>
                    {status.isError ? <AlertCircle size={22} /> : <CheckCircle2 size={22} />}
                    <span>{status.text}</span>
                </div>
            )}

            {/* Ingestion Console Form */}
            <form onSubmit={handleIngest} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Fund ISIN Number</label>
                        <input 
                            type="text" 
                            placeholder="e.g., INF209K01VA5" 
                            required 
                            value={isin} 
                            onChange={e => setIsin(e.target.value.toUpperCase().trim())} 
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>Market Concentration Group</label>
                        <select value={category} onChange={e => setCategory(e.target.value)}>
                            <option value="Large Cap">Large Cap Market</option>
                            <option value="Mid Cap">Mid Cap Growth</option>
                            <option value="Small Cap">Small Cap Alpha</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '6px' }}>
                        Raw Portfolio Text Dump (Copy-Pasted from PDF/Excel)
                    </label>
                    <textarea 
                        placeholder="Paste the messy unaligned text strings here directly..." 
                        required 
                        rows={14}
                        value={messyText}
                        onChange={e => setMessyText(e.target.value)}
                        style={{ 
                            width: '100%', padding: '14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.95rem', fontFamily: 'monospace', lineHeight: '1.5', boxSizing: 'border-box', outline: 'none', background: '#fafafa'
                        }}
                    />
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button 
                        type="submit" 
                        disabled={loading} 
                        style={{ 
                            width: 'auto', padding: '14px 35px', display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#0070f3', fontSize: '1rem' 
                        }}
                    >
                        <Cpu size={18} className={loading ? 'spin-animation' : ''} />
                        {loading ? 'Executing AI Fallback Pipeline...' : 'Parse & Synchronize Holdings'}
                    </button>
                </div>

            </form>
        </div>
    );
}