import React, { useState, useEffect } from 'react';
import touristPlaces from '../data/touristPlaces.json';

// Helper to calculate distance in km using Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1); 
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  const d = R * c; // Distance in km
  return d.toFixed(1);
}

function deg2rad(deg) {
  return deg * (Math.PI/180);
}

function Visit() {
  const [userLoc, setUserLoc] = useState({ lat: null, lon: null });
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    const cached = sessionStorage.getItem('safetrail_location');
    if (cached) {
      const loc = JSON.parse(cached);
      setUserLoc(loc);
      return;
    }
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lon: position.coords.longitude };
          setUserLoc(loc);
          sessionStorage.setItem('safetrail_location', JSON.stringify(loc));
        },
        (error) => console.error("Error getting location: ", error)
      );
    }
  }, []);

  useEffect(() => {
    // Calculate distances and sort if location is available
    let updatedPlaces = [...touristPlaces];
    if (userLoc.lat && userLoc.lon) {
      updatedPlaces = updatedPlaces.map(place => ({
        ...place,
        distance: calculateDistance(userLoc.lat, userLoc.lon, place.lat, place.lon)
      }));
      updatedPlaces.sort((a, b) => parseFloat(a.distance || 99999) - parseFloat(b.distance || 99999));
    }
    setPlaces(updatedPlaces);
  }, [userLoc]);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', padding: '100px 20px 40px', fontFamily: '"Inter", sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ color: 'white', fontFamily: '"Outfit", sans-serif', fontSize: '42px', textAlign: 'center', marginBottom: '10px' }}>
          Explore India
        </h1>
        <p style={{ color: '#94a3b8', textAlign: 'center', fontSize: '18px', marginBottom: '50px' }}>
          Discover 50 of the most beautiful destinations and navigate directly to them.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '30px' }}>
          {places.map((place, idx) => (
            <div key={idx} style={{ 
              backgroundColor: '#111827', 
              borderRadius: '16px', 
              overflow: 'hidden', 
              boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(255,255,255,0.05)',
              transition: 'transform 0.2s',
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
              
              {/* Image Section */}
              <div style={{ position: 'relative', height: '220px', backgroundColor: '#1e293b' }}>
                <img 
                  src={place.imageUrl || '/hero_register.png'} 
                  alt={place.name} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => { 
                    e.target.onerror = null;
                    e.target.src = '/hero_register.png';
                  }}
                />
                
                {/* Distance Pill */}
                {place.distance && (
                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    right: '12px',
                    backgroundColor: 'rgba(30, 41, 59, 0.9)',
                    backdropFilter: 'blur(4px)',
                    color: 'white',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontSize: '14px',
                    fontWeight: '700',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                  }}>
                    {place.distance} km
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h2 style={{ color: 'white', margin: '0 0 12px 0', fontSize: '24px', fontWeight: '800', fontFamily: '"Outfit", sans-serif' }}>
                  {place.name}
                </h2>
                
                <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: 1.6, margin: '0 0 24px 0', flex: 1, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                  {place.description}
                </p>

                {/* Action Links */}
                <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                  <a 
                    href={`https://en.wikipedia.org/wiki/Special:Search?search=${encodeURIComponent(place.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#94a3b8', 
                      textDecoration: 'none', 
                      fontWeight: '700', 
                      fontSize: '15px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#cbd5e1'}
                    onMouseOut={(e) => e.target.style.color = '#94a3b8'}
                  >
                    Wikipedia &#8599;
                  </a>
                  
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat ? userLoc.lat + ',' + userLoc.lon : ''}&destination=${place.lat},${place.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ 
                      color: '#38bdf8', 
                      textDecoration: 'none', 
                      fontWeight: '700', 
                      fontSize: '15px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'color 0.2s'
                    }}
                    onMouseOver={(e) => e.target.style.color = '#7dd3fc'}
                    onMouseOut={(e) => e.target.style.color = '#38bdf8'}
                  >
                    Navigate &rarr;
                  </a>
                </div>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Visit;
