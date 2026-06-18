import { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import API from '../utils/api';
import { User, ShieldCheck, Landmark, CreditCard, Save, RefreshCw } from 'lucide-react';

export default function ProfileSettings() {
    const { updateProfileState } = useAuth();
    
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        panNumber: '',
        bankName: '',
        bankAccountNumber: '',
        ifscCode: '',
        riskTolerance: 'Moderate'
    });
    
    const [message, setMessage] = useState({ text: '', isError: false });
    const [loading, setLoading] = useState(true); // Starts as true while loading database records
    const [submitting, setSubmitting] = useState(false);

    //  LIVE SYNCHRONIZATION ENGINE: Fetches saved records directly from MongoDB on component load
    useEffect(() => {
        const fetchCurrentProfile = async () => {
            try {
                const response = await API.get('/users/profile');
                const profile = response.data.data;
                
                if (profile) {
                    setFormData({
                        firstName: profile.firstName || '',
                        lastName: profile.lastName || '',
                        panNumber: profile.panNumber || '',
                        bankName: profile.bankName || '',
                        bankAccountNumber: profile.bankAccountNumber || '',
                        ifscCode: profile.ifscCode || '',
                        riskTolerance: profile.riskTolerance || 'Moderate'
                    });
                    // Sync the global context state just in case
                    updateProfileState(profile);
                }
            } catch (err) {
                console.error("Failed to load saved profile data:", err);
                setMessage({ text: 'Could not sync database records automatically.', isError: true });
            } finally {
                setLoading(false);
            }
        };

        fetchCurrentProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setMessage({ text: '', isError: false });
        try {
            const response = await API.put('/users/profile', formData);
            updateProfileState(response.data.data);
            setMessage({ text: 'KYC Registry credentials successfully updated and verified.', isError: false });
        } catch (err) {
            setMessage({ text: 'Update rejected: ' + (err.response?.data?.message || err.message), isError: true });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', padding: '40px', fontFamily: 'sans-serif', color: '#64748b' }}>
                <RefreshCw size={20} className="spin-animation" />
                <span>Synchronizing live identity clearance indices from Atlas...</span>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', maxWidth: '850px', margin: '0 auto', fontFamily: 'sans-serif', color: '#1e293b' }}>
            
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '30px' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', margin: 0 }}>Account Settings</h1>
                <p style={{ color: '#64748b', marginTop: '6px' }}>Review and modify your verified regulatory credentials and active banking settlement vectors.</p>
            </div>

            {message.text && (
                <div style={{ 
                    padding: '14px 20px', borderRadius: '8px', marginBottom: '30px', fontSize: '0.95rem', fontWeight: '500',
                    background: message.isError ? '#fef2f2' : '#f0fdf4', color: message.isError ? '#b91c1c' : '#16a34a',
                    border: `1px solid ${message.isError ? '#fca5a5' : '#bbf7d0'}`
                }}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                
                {/* Section 1: User Identity details */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', margin: '0 0 20px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <User size={20} color="#0070f3" /> Investor Risk Identity
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>First Name</label>
                            <input type="text" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Last Name</label>
                            <input type="text" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} />
                        </div>
                    </div>
                    
                    <div style={{ marginTop: '20px', width: '50%', paddingRight: '10px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Risk Assessment Profile</label>
                        <select value={formData.riskTolerance} onChange={e => setFormData({...formData, riskTolerance: e.target.value})}>
                            <option value="Conservative">Conservative (Capital Preservation Focus)</option>
                            <option value="Moderate">Moderate (Balanced Wealth Growth)</option>
                            <option value="Aggressive">Aggressive (Aggressive Alpha Capture)</option>
                        </select>
                    </div>
                </div>

                {/* Section 2: Regulatory Credentials */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', margin: '0 0 20px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <ShieldCheck size={20} color="#10b981" /> Regulatory Mandates
                    </h3>
                    
                    <div style={{ width: '50%', paddingRight: '10px' }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Permanent Account Number (PAN)</label>
                        <div style={{ position: 'relative' }}>
                            <CreditCard size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input 
                                type="text" 
                                placeholder="ABCDE1234F" 
                                maxLength="10"
                                value={formData.panNumber} 
                                onChange={e => setFormData({...formData, panNumber: e.target.toUpperCase().trim()})} 
                                style={{ paddingLeft: '40px' }} 
                            />
                        </div>
                    </div>
                </div>

                {/* Section 3: Banking Clearances */}
                <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.15rem', margin: '0 0 20px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                        <Landmark size={20} color="#8b5cf6" /> Settlement Channels
                    </h3>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Bank Institution Name</label>
                            <input type="text" placeholder="State Bank of India" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>Core Account Number</label>
                                <input type="text" placeholder="00001234567890" value={formData.bankAccountNumber} onChange={e => setFormData({...formData, bankAccountNumber: e.target.value.trim()})} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', color: '#475569', marginBottom: '6px' }}>IFSC Branch Code</label>
                                <input type="text" placeholder="SBIN0001234" value={formData.ifscCode} onChange={e => setFormData({...formData, ifscCode: e.target.toUpperCase().trim()})} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save modifications */}
                <div style={{ textAlign: 'right' }}>
                    <button type="submit" disabled={submitting} style={{ width: 'auto', padding: '12px 30px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0f172a' }}>
                        <Save size={18} />
                        {submitting ? 'Committing Changes...' : 'Save Settings'}
                    </button>
                </div>

            </form>
        </div>
    );
}