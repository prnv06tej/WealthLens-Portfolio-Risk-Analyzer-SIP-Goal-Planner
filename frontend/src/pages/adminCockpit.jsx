import { useState, useEffect } from 'react';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';
import { Cpu, Database, RefreshCw, Layers, Lock } from 'lucide-react';

export default function AdminCockpit() {
    const navigate = useNavigate();

    // Suite Operational States (Cleaned up local password forms)
    const [activeTab, setActiveTab] = useState('diagnostics');
    const [inventory, setInventory] = useState([]);
    const [syncLoading, setSyncLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(false);
    const [cronLog, setCronLog] = useState({ lastRun: 'Checking system nodes...', status: 'Healthy' });
    const [searchTerm, setSearchTerm] = useState('');

    // Ingestion States
    const [isin, setIsin] = useState('');
    const [category, setCategory] = useState('Large Cap');
    const [messyText, setMessyText] = useState('');
    const [ingestMessage, setIngestMessage] = useState('');

    //  MONGO REPLACEMENT EXPLORER: Pulls registered ISIN populations dynamically
    const fetchDbInventory = async () => {
        setDataLoading(true);
        try {
            const response = await API.get('/admin/inventory');
            setInventory(response.data.inventory || []);
            
            if (response.data.inventory?.length > 0) {
                const latestDate = new Date(response.data.inventory[0].lastUpdated).toLocaleTimeString();
                setCronLog({ lastRun: `Last index sync timestamped at ${latestDate}`, status: 'All micro-cron tasks checked.' });
            } else {
                setCronLog({ lastRun: 'No active items inside Atlas collection registry.', status: 'Healthy' });
            }
        } catch (err) {
            console.error("Inventory tracking synchronization error:", err);
        } finally {
            setDataLoading(false);
        }
    };

    const filteredInventory = inventory.filter(fund => {
    const term = searchTerm.toLowerCase();
    return (
        fund.name?.toLowerCase().includes(term) ||
        fund.isin?.toLowerCase().includes(term) ||
        fund.category?.toLowerCase().includes(term)
    );
   });

    // Automatically load database stats right when the admin enters the page
    useEffect(() => {
        fetchDbInventory();
    }, []);

    //  RECOVERY MATH: Manually trigger AMFI Parser updates bypassing Cron
    const handleManualSync = async () => {
        setSyncLoading(true);
        try {
            await API.get('/admin/sync-amfi');
            setCronLog({ lastRun: new Date().toLocaleTimeString(), status: 'Manual override sync completed successfully.' });
            fetchDbInventory();
        } catch (err) {
            setCronLog({ lastRun: 'Fault encountered', status: 'Sync error: ' + err.message });
        } finally {
            setSyncLoading(false);
        }
    };

    const handleIngestSubmit = async (e) => {
    e.preventDefault();
    setIngestMessage('Processing document clusters...');
    
    try {
        // Prepare a dynamic request payload block
        const payload = {
            isin: isin.trim(),
            category: category
        };

        //  SMART INTERCEPTOR: Detect if the user pasted valid JSON arrays
        try {
            const parsedData = JSON.parse(messyText);
            
            if (Array.isArray(parsedData)) {
                // If it's a clean array, assign it directly to skip Gemini!
                payload.directHoldings = parsedData;
            } else {
                // If it's JSON but not an array, treat it as normal text
                payload.messyText = messyText;
            }
        } catch (jsonError) {
            // If JSON.parse fails, it's normal unstructured text dump -> let Gemini handle it
            payload.messyText = messyText;
        }

        // Send the smart payload to your backend route
        await API.post('/admin/ingest', payload);
        
        setIngestMessage('🎉 Data successfully committed straight to Atlas (AI Bypassed!).');
        setMessyText('');
        fetchDbInventory(); // Refresh your mirror grid automatically
        
    } catch (err) {
        setIngestMessage('Ingestion error: ' + (err.response?.data?.message || err.message));
    }
};

    return (
        <div style={{ minHeight: '100vh', background: '#090d16', color: '#f8fafc', padding: '40px', fontFamily: 'sans-serif' }}>
            
            {/* Command Header */}
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: '800', margin: 0 }}>System Operations Console</h1>
                    <p style={{ color: '#94a3b8', marginTop: '4px' }}>Monitor core automation jobs, execute text parses, and audit database collection matrices.</p>
                </div>
                <button 
                    onClick={() => navigate('/dashboard')} 
                    style={{ width: 'auto', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', fontSize: '0.85rem', padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                    <Lock size={14} /> Exit Admin Node
                </button>
            </div>

            {/* Tab Array Modulators */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '30px' }}>
                <button onClick={() => setActiveTab('diagnostics')} style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'diagnostics' ? '#0070f3' : '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>⚙️ System Monitor & Cron</button>
                <button onClick={() => setActiveTab('explorer')} style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'explorer' ? '#0070f3' : '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>📊 Database Inventory Explorer</button>
                <button onClick={() => setActiveTab('ingest')} style={{ width: 'auto', padding: '10px 20px', background: activeTab === 'ingest' ? '#0070f3' : '#1e293b', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>📥 Document Ingest Engine</button>
            </div>

            {/* TAB CONTENT 1: SYSTEM MONITOR & CRON DIAGNOSTICS */}
            {activeTab === 'diagnostics' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
                        <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Cpu size={20} color="#eab308" /> 11:00 PM Automation Loop Diagnostics</h3>
                        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#38bdf8', border: '1px solid rgba(255,255,255,0.05)' }}>
                            <div>[SYSTEM CRON SCHEDULE]: 0 23 * * * (Everyday at 23:00)</div>
                            <div style={{ marginTop: '8px' }}>[LAST REGISTERED PULSE]: {cronLog.lastRun}</div>
                            <div style={{ marginTop: '4px', color: '#10b981' }}>[HEALTH ASSIDUITY STATUS]: {cronLog.status}</div>
                        </div>
                    </div>

                    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
                        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.1rem' }}>Manual Index Re-Calculation</h3>
                        <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '0 0 16px 0' }}>Force bypass the 11 PM timer schedule loop and download active AMFI net asset configurations to Atlas right now.</p>
                        <button onClick={handleManualSync} disabled={syncLoading} style={{ width: 'auto', background: '#10b981', color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                            <RefreshCw size={16} className={syncLoading ? 'spin-animation' : ''} />
                            {syncLoading ? 'Synchronizing Indices...' : 'Trigger Manual AMFI Calibration'}
                        </button>
                    </div>
                </div>
            )}

           {/* TAB CONTENT 2: DATABASE INVENTORY EXPLORER */}
{activeTab === 'explorer' && (
    <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px' }}>
        
        {/* Header and Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', gap: '20px', flexWrap: 'wrap' }}>
            <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Database size={20} color="#38bdf8" /> Mongo Atlas Collection Mirror
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '4px 0 0 0' }}> Total Synchronized Items: {inventory.length} records</p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', flex: '1', justifyContent: 'flex-end', minWidth: '300px' }}>
                {/*  LIVE SEARCH FILTER INPUT */}
                <input 
                    type="text" 
                    placeholder="Search by Fund Name, ISIN, or Category (e.g., 'Small Cap', 'Nippon')..." 
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    style={{ 
                        background: '#1e293b', border: '1px solid #334155', color: '#fff', 
                        padding: '10px 16px', borderRadius: '8px', width: '100%', maxWidth: '450px', fontSize: '0.9rem' 
                    }} 
                />
                <button onClick={fetchDbInventory} disabled={dataLoading} style={{ width: 'auto', padding: '10px 16px', fontSize: '0.85rem', background: '#0070f3', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600' }}>
                    Refresh
                </button>
            </div>
        </div>

        {/*  SUMMARY METRICS BOX (Proves asset diversity instantly) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '700', uppercase: 'true' }}>Total Rows</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{inventory.length}</div>
            </div>
            <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: '700', uppercase: 'true' }}>Equity Matches</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#38bdf8', marginTop: '4px' }}>
                    {inventory.filter(f => f.name?.toLowerCase().includes('equity') || f.category?.toLowerCase().includes('equity')).length}
                </div>
            </div>
            <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.75rem', color: '#a855f7', fontWeight: '700', uppercase: 'true' }}>Growth Options</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#a855f7', marginTop: '4px' }}>
                    {inventory.filter(f => f.name?.toLowerCase().includes('growth')).length}
                </div>
            </div>
            <div style={{ background: '#1e293b', padding: '14px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
                <div style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '700', uppercase: 'true' }}>Parsed Holdings</div>
                <div style={{ fontSize: '1.4rem', fontWeight: '700', color: '#10b981', marginTop: '4px' }}>
                    {inventory.filter(f => f.holdingsCount > 0).length} Funds
                </div>
            </div>
        </div>

        {/* Data Presentation Grid */}
        {dataLoading ? (
            <div style={{ color: '#64748b', fontFamily: 'monospace', padding: '20px' }}>Mapping active collection indexes...</div>
        ) : filteredInventory.length === 0 ? (
            <div style={{ color: '#eab308', padding: '20px', background: 'rgba(234,179,8,0.05)', borderRadius: '8px', border: '1px solid rgba(234,179,8,0.2)' }}>
                No active matching records found for "{searchTerm}". Try another keywords modifier.
            </div>
        ) : (
            <div style={{ overflowX: 'auto', maxHeight: '500px', overflowY: 'auto', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left', fontFamily: 'monospace' }}>
                    <thead style={{ position: 'sticky', top: 0, background: '#0f172a', zIndex: 1 }}>
                        <tr style={{ color: '#64748b', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                            <th style={{ padding: '12px' }}>ISIN REGISTRY</th>
                            <th style={{ padding: '12px' }}>MUTUAL FUND NAME</th>
                            <th style={{ padding: '12px' }}>STRATIFICATION CAP / CATEGORY</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredInventory.slice(0, 200).map((fund) => (
                            <tr key={fund.isin} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', color: '#cbd5e1' }}>
                                <td style={{ padding: '12px', color: '#38bdf8', fontWeight: 'bold' }}>{fund.isin}</td>
                                <td style={{ padding: '12px', color: '#fff' }}>{fund.name}</td>
                                <td style={{ padding: '12px' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: '4px', background: '#1e293b', fontSize: '0.75rem', color: '#94a3b8', display: 'inline-block', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {fund.category}
                                    </span>
                                </td >
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredInventory.length > 200 && (
                    <div style={{ textAlign: 'center', padding: '12px', color: '#64748b', fontSize: '0.8rem', background: '#090d16', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        Truncated display view context to top 200 matches of {filteredInventory.length} results to accelerate browser performance.
                    </div>
                )}
            </div>
        )}
    </div>
)}
            {/* TAB CONTENT 3: DOCUMENT INGEST ENGINE */}
            {activeTab === 'ingest' && (
                <form onSubmit={handleIngestSubmit} style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Layers size={20} color="#a855f7" /> Copy-Paste Document Matrix</h3>
                    
                    {ingestMessage && <div style={{ background: 'rgba(0,112,243,0.1)', color: '#38bdf8', padding: '12px', borderRadius: '6px', fontSize: '0.9rem', fontFamily: 'monospace' }}>{ingestMessage}</div>}

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>ISIN Target</label>
                            <input type="text" placeholder="INF209K01VA5" required value={isin} onChange={e => setIsin(e.target.value.toUpperCase())} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '12px', borderRadius: '8px', width: '100%', boxSizing: 'border-box' }} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>Cap Strategy</label>
                            <select value={category} onChange={e => setCategory(e.target.value)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#fff', width: '100%', padding: '12px', borderRadius: '8px' }}>
                                <option value="Large Cap">Large Cap</option>
                                <option value="Mid Cap">Mid Cap</option>
                                <option value="Small Cap">Small Cap</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', color: '#64748b', marginBottom: '6px' }}>Raw Text Block</label>
                        <textarea rows={10} placeholder="Paste table text directly..." required value={messyText} onChange={e => setMessyText(e.target.value)} style={{ width: '100%', background: '#1e293b', border: '1px solid #334155', color: '#fff', padding: '12px', borderRadius: '8px', fontFamily: 'monospace', boxSizing: 'border-box' }} />
                    </div>

                    <button type="submit" style={{ background: '#0070f3', color: '#fff', padding: '14px', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>Submit to Gemini Node</button>
                </form>
            )}

        </div>
    );
}