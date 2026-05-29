import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

export default function ProfileSettings() {
    const { user, updateProfileState } = useAuth();
    const [formData, setFormData] = useState({
        panNumber: user?.panNumber || '',
        bankName: user?.bankName || '',
        bankAccountNumber: user?.bankAccountNumber || '',
        ifscCode: user?.ifscCode || '',
        riskTolerance: user?.riskTolerance || 'Medium'
    });
    const [message, setMessage] = useState('');

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const response = await API.put('/users/profile', formData);
            updateProfileState(response.data.data);
            setMessage('Profile and KYC details processed successfully.');
        } catch (err) {
            setMessage('Error executing update: ' + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div style={{ maxWidth: '600px', padding: '20px', margin: '20px auto' }}>
            <h2>Profile Settings & KYC Verification</h2>
            <p>Verification Status: <strong>{user?.kycStatus || 'Unverified'}</strong></p>
            {message && <p style={{ background: '#f0f0f0', padding: '10px' }}>{message}</p>}
            
            <form onSubmit={handleUpdate} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
                <label>
                    PAN Number:
                    <input type="text" value={formData.panNumber} onChange={e => setFormData({...formData, panNumber: e.target.value.toUpperCase()})} maxLength="10" />
                </label>
                <label>
                    Bank Name:
                    <input type="text" value={formData.bankName} onChange={e => setFormData({...formData, bankName: e.target.value})} />
                </label>
                <label>
                    Account Number:
                    <input type="text" value={formData.bankAccountNumber} onChange={e => setFormData({...formData, bankAccountNumber: e.target.value})} />
                </label>
                <label>
                    IFSC Code:
                    <input type="text" value={formData.ifscCode} onChange={e => setFormData({...formData, ifscCode: e.target.value.toUpperCase()})} />
                </label>
                <label>
                    Risk Profile Group:
                    <select value={formData.riskTolerance} onChange={e => setFormData({...formData, riskTolerance: e.target.value})}>
                        <option value="Low">Low (Conservative Asset Play)</option>
                        <option value="Medium">Medium (Balanced Strategy)</option>
                        <option value="High">High (Aggressive Equity Play)</option>
                    </select>
                </label>
                <button type="submit" style={{ padding: '10px', background: '#0070f3', color: '#fff', border: 'none', cursor: 'pointer' }}>
                    Save & Verify Portfolio
                </button>
            </form>
        </div>
    );
}