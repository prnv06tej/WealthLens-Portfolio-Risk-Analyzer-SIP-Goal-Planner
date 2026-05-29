import { useState, useEffect } from 'react';
import API from '../utils/api';
import { Search, TrendingUp, Shield, BarChart2 } from 'lucide-react';

export default function Discover() {
    const [popularFunds, setPopularFunds] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchLoading, setSearchLoading] = useState(false);

    // 1. Fetch popular funds on mount
    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const response = await API.get('/funds/popular');
                setPopularFunds(response.data.data);
            } catch (err) {
                console.error("Error fetching popular funds:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchPopular();
    }, []);

    // 2. Handle Global Search API Call
    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        setSearchLoading(true);
        try {
            const response = await API.get(`/funds/search?q=${query}`);
            setSearchResults(response.data.data);
        } catch (err) {
            console.error("Search query failed:", err);
        } finally {
            setSearchLoading(false);
        }
    };

    // Helper to group our 45 funds by cap type dynamically on the frontend
    const filterByCategory = (category) => {
        return popularFunds.filter(fund => fund.category === category);
    };

    return (
        <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif', color: '#333' }}>
            
            {/* Header section */}
            <div style={{ marginBottom: '40px' }}>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '10px', fontWeight: '700' }}>Discover Funds</h1>
                <p style={{ color: '#666', fontSize: '1.1rem' }}>Explore curated top performers or search the entire AMFI universe.</p>
            </div>

            {/* 🔍 Universal Search Bar */}
            <div style={{ position: 'relative', marginBottom: '40px' }}>
                <div style={{ display: 'flex', alignItems: 'center', background: '#fff', border: '2px solid #e2e8f0', borderRadius: '12px', padding: '12px 20px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                    <Search size={22} style={{ color: '#94a3b8', marginRight: '12px' }} />
                    <input 
                        type="text" 
                        placeholder="Search any Mutual Fund in India (e.g., SBI, HDFC, Parag Parikh)..." 
                        value={searchQuery}
                        onChange={handleSearch}
                        style={{ width: '100%', border: 'none', outline: 'none', fontSize: '1.1rem', background: 'transparent' }}
                    />
                </div>

                {/* Search Results Dropdown overlay */}
                {searchQuery.trim().length >= 2 && (
                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#fff', border: '1px solid #e2e8f0', borderRadius: '12px', marginTop: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', zIndex: 50, maxHeight: '350px', overflowY: 'auto' }}>
                        {searchLoading ? (
                            <p style={{ padding: '20px', color: '#666' }}>Searching AMFI registry...</p>
                        ) : searchResults.length === 0 ? (
                            <p style={{ padding: '20px', color: '#666' }}>No funds found matching "{searchQuery}"</p>
                        ) : (
                            searchResults.map(fund => (
                                <div key={fund._id} style={{ padding: '15px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }} hover={{ background: '#f8fafc' }}>
                                    <div>
                                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{fund.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>ISIN: {fund.isin}</div>
                                    </div>
                                    <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                        <div style={{ fontWeight: '600', color: '#0f172a' }}>₹{fund.currentNAV}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>NAV Date: {fund.navDate}</div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>

            {/* Curated Marketplace Tiles (The Top 45 Engine) */}
            {loading ? (
                <h2>Loading marketplace assets...</h2>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                    
                    {/* Category Block: Large Cap */}
                    <FundCategorySection 
                        title="Large Cap Performers" 
                        icon={<Shield color="#0070f3" size={24} />} 
                        funds={filterByCategory('Large Cap')} 
                    />

                    {/* Category Block: Mid Cap */}
                    <FundCategorySection 
                        title="Mid Cap Growth Leaders" 
                        icon={<TrendingUp color="#10b981" size={24} />} 
                        funds={filterByCategory('Mid Cap')} 
                    />

                    {/* Category Block: Small Cap */}
                    <FundCategorySection 
                        title="High Alpha Small Caps" 
                        icon={<BarChart2 color="#8b5cf6" size={24} />} 
                        funds={filterByCategory('Small Cap')} 
                    />

                </div>
            )}
        </div>
    );
}

// Sub-Component for modular category grouping rows
function FundCategorySection({ title, icon, funds }) {
    return (
        <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                {icon}
                <h2 style={{ fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>{title} ({funds.length})</h2>
            </div>
            
            {funds.length === 0 ? (
                <p style={{ color: '#94a3b8', fontStyle: 'italic' }}>No funds ingested in this category yet. Use your Admin AI tool to load data.</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
                    {funds.map(fund => (
                        <div key={fund._id} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'pointer' }}>
                            <div>
                                <span style={{ fontSize: '0.75rem', background: '#f1f5f9', color: '#475569', padding: '4px 8px', borderRadius: '20px', fontWeight: '600' }}>{fund.category}</span>
                                <h3 style={{ fontSize: '1rem', fontWeight: '600', marginTop: '12px', color: '#1e293b', lineHeight: '1.4', height: '44px', overflow: 'hidden' }}>{fund.name}</h3>
                            </div>
                            <div style={{ marginTop: '20px', paddingTop: '15px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                                <div>
                                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block' }}>Current NAV</span>
                                    <span style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a' }}>₹{fund.currentNAV}</span>
                                </div>
                                <span style={{ fontSize: '0.75rem', color: '#64748b', background: '#f0fdf4', color: '#16a34a', padding: '2px 6px', borderRadius: '4px', fontWeight: '500' }}>Live Sync</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}