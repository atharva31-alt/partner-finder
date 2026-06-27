import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [matches, setMatches] = useState([]);
  const [myHosted, setMyHosted] = useState([]);
  const [myJoined, setMyJoined] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('All');

  const sportsOptions = ['All', 'Chess', 'Badminton', 'Cricket', 'Football'];

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { headers: { Authorization: `Bearer ${token}` } };
      
      const resOpen = await axios.get('http://localhost:5000/api/requests/open', headers);
      setMatches(resOpen.data);

      const resUserMatches = await axios.get('http://localhost:5000/api/requests/my-matches', headers);
      setMyHosted(resUserMatches.data.hosted);
      setMyJoined(resUserMatches.data.joined);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleAcceptMatch = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/requests/${requestId}/accept`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Match accepted successfully!');
      fetchDashboardData(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to accept match');
    }
  };

  const handleDeleteMatch = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this match invite?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/requests/${requestId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete match');
    }
  };

  // Filter matches based on selected pill tag
  const filteredMatches = selectedSport === 'All' 
    ? matches 
    : matches.filter(match => match.game.toLowerCase() === selectedSport.toLowerCase());

  return (
    <div style={{ padding: '30px 20px', fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      {loading ? (
        <p style={{ textAlign: 'center', fontSize: '18px', color: '#666', marginTop: '50px' }}>Loading your sports match dashboard...</p>
      ) : (
        <>
          {/* Header Title Section */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <h3 style={{ fontSize: '22px', color: '#212529', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span>🏆</span> Open Matches Nearby
            </h3>
          </div>

          {/* Sport Filter Pills Bar */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '25px', flexWrap: 'wrap', overflowX: 'auto', paddingBottom: '5px' }}>
            {sportsOptions.map((sport) => {
              const isSelected = selectedSport === sport;
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: isSelected ? 'none' : '1px solid #dee2e6',
                    background: isSelected ? '#0ca678' : '#fff',
                    color: isSelected ? '#fff' : '#495057',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease-in-out',
                    boxShadow: isSelected ? '0 4px 6px rgba(12, 166, 120, 0.2)' : 'none'
                  }}
                >
                  {sport}
                </button>
              );
            })}
          </div>
          
          {/* Main Feed Card Grid */}
          {filteredMatches.length === 0 ? (
            <div style={{ background: '#fff', padding: '40px 20px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.01)', border: '1px solid #e9ecef', marginBottom: '40px' }}>
              <p style={{ color: '#6c757d', margin: 0, fontSize: '15px' }}>
                No open {selectedSport !== 'All' ? selectedSport : ''} match requests available right now.
              </p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '25px', marginBottom: '50px' }}>
              {filteredMatches.map((match) => (
                <div key={match._id} style={{ backgroundColor: '#fff', padding: '24px', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.04), 0 4px 6px -2px rgba(0,0,0,0.04)', border: '1px solid #f1f3f5', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <span style={{ background: '#e6fcf5', color: '#0ca678', padding: '6px 12px', borderRadius: '8px', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }}>{match.game}</span>
                      <span style={{ fontSize: '12px', background: '#f1f3f5', color: '#495057', padding: '4px 8px', borderRadius: '6px', fontWeight: '600' }}>{match.host?.skillLevel || 'Beginner'}</span>
                    </div>
                    <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#343a40' }}>👤 <strong style={{ color: '#495057' }}>Host:</strong> {match.host?.name || 'Anonymous'}</p>
                    <p style={{ margin: '0 0 8px 0', fontSize: '15px', color: '#343a40' }}>📍 <strong style={{ color: '#495057' }}>Venue:</strong> {match.locationType} - <span style={{ color: '#666', fontSize: '14px' }}>{match.specificLocation}</span></p>
                    <p style={{ margin: '0 0 24px 0', fontSize: '15px', color: '#343a40' }}>🕒 <strong style={{ color: '#495057' }}>Time:</strong> {match.timeSlot}</p>
                  </div>
                  <button onClick={() => handleAcceptMatch(match._id)} style={{ width: '100%', padding: '12px', background: '#0ca678', color: 'white', border: 'none', borderRadius: '10px', fontWeight: '700', fontSize: '15px', cursor: 'pointer', transition: 'background 0.2s', boxShadow: '0 4px 6px rgba(12, 166, 120, 0.2)' }}>
                    Accept Match
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Lower Personal Status Lists */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
            <div>
              <h3 style={{ fontSize: '20px', color: '#212529', marginBottom: '20px', borderBottom: '2px solid #e9ecef', paddingBottom: '12px' }}>📢 Matches You Hosted</h3>
              {myHosted.length === 0 ? (
                <p style={{ color: '#868e96', fontSize: '14px' }}>You haven't created any match requests yet.</p>
              ) : (
                myHosted.map(match => (
                  <div key={match._id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', borderLeft: '5px solid #0ca678', boxShadow: '0 4px 6px rgba(0,0,0,0.01)', borderTop: '1px solid #f1f3f5', borderRight: '1px solid #f1f3f5', borderBottom: '1px solid #f1f3f5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '16px', color: '#212529' }}>{match.game}</strong> <span style={{ color: '#666', fontSize: '14px' }}>at {match.specificLocation}</span>
                      <div style={{ fontSize: '13px', color: '#495057', marginTop: '6px' }}>
                        Status: <span style={{ fontWeight: '700', color: match.status === 'Matched' ? '#228be6' : '#f59f00' }}>{match.status}</span>
                      </div>
                    </div>
                    <button onClick={() => handleDeleteMatch(match._id)} style={{ padding: '8px 12px', background: '#fff', color: '#fa5252', border: '1px solid #ffe3e3', borderRadius: '8px', fontWeight: '600', fontSize: '13px', cursor: 'pointer', transition: 'all 0.2s' }} onMouseEnter={(e) => e.target.style.background = '#fff5f5'} onMouseLeave={(e) => e.target.style.background = '#fff'}>
                      Cancel
                    </button>
                  </div>
                ))
              )}
            </div>

            <div>
              <h3 style={{ fontSize: '20px', color: '#212529', marginBottom: '20px', borderBottom: '2px solid #e9ecef', paddingBottom: '12px' }}>🤝 Matches You Joined</h3>
              {myJoined.length === 0 ? (
                <p style={{ color: '#868e96', fontSize: '14px' }}>You haven't accepted any match requests yet.</p>
              ) : (
                myJoined.map(match => (
                  <div key={match._id} style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '12px', marginBottom: '15px', borderLeft: '5px solid #228be6', boxShadow: '0 4px 6px rgba(0,0,0,0.01)', borderTop: '1px solid #f1f3f5', borderRight: '1px solid #f1f3f5', borderBottom: '1px solid #f1f3f5' }}>
                    <strong style={{ fontSize: '16px', color: '#212529' }}>{match.game}</strong> <span style={{ color: '#666', fontSize: '14px' }}>with Host: {match.host?.name || 'Partner'}</span>
                    <div style={{ fontSize: '13px', color: '#6c757d', marginTop: '6px' }}>
                      📍 {match.specificLocation} &nbsp;|&nbsp; 🕒 {match.timeSlot}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;