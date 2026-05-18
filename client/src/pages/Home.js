import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const translations = {
  English: { title: "SafeTrail", subtitle: "Smart Tourist Safety Monitoring System", desc: "Ensuring secure journeys across Northeast India.", btnReg: "Tourist Registration", btnDash: "Police Dashboard", btnSos: "Emergency SOS" },
  Hindi: { title: "सेफट्रेल (SafeTrail)", subtitle: "स्मार्ट पर्यटक सुरक्षा निगरानी प्रणाली", desc: "पूर्वोत्तर भारत भर में सुरक्षित यात्रा सुनिश्चित करना।", btnReg: "पर्यटक पंजीकरण", btnDash: "पुलिस डैशबोर्ड", btnSos: "आपातकालीन SOS" },
  Marathi: { title: "सेफट्रेल (SafeTrail)", subtitle: "स्मार्ट पर्यटक सुरक्षा निरीक्षण प्रणाली", desc: "ईशान्य भारतात सुरक्षित प्रवास सुनिश्चित करणे.", btnReg: "पर्यटक नोंदणी", btnDash: "पोलीस डॅशबोर्ड", btnSos: "आणीबाणी SOS" },
  Bengali: { title: "সেফট্রেইল (SafeTrail)", subtitle: "স্মার্ট ট্যুরিস্ট সেফটি মনিটরিং সিস্টেম", desc: "উত্তর-পূর্ব ভারত জুড়ে নিরাপদ ভ্রমণ নিশ্চিত করা।", btnReg: "ট্যুরিস্ট রেজিস্ট্রেশন", btnDash: "পুলিশ ড্যাশবোর্ড", btnSos: "ইমার্জেন্সি SOS" },
  Assamese: { title: "ছেফট্রেইল (SafeTrail)", subtitle: "স্মাৰ্ট পৰ্যটক সুৰক্ষা নিৰীক্ষণ প্ৰণালী", desc: "উত্তৰ-পূব ভাৰতত নিৰাপদ যাত্ৰা নিশ্চিত কৰা।", btnReg: "পৰ্যটক পঞ্জীয়ন", btnDash: "আৰক্ষী ডেশ্ববৰ্ড", btnSos: "জৰুৰীকালীন SOS" }
};

function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.English;

  // Live Location & Weather State
  const [userLoc, setUserLoc] = useState({ name: 'Locating you...', lat: null, lon: null, hazardTitle: 'Assessing...', hazardLevel: 'Waiting for location...' });
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [geoError, setGeoError] = useState("");

  // Nearby Tourist Guide State
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);

  const fetchNearbyPlaces = async (lat, lon) => {
    try {
      // 1. Get nearby Wikipedia articles (places of interest) within 10km
      const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${lat}|${lon}&gslimit=6&format=json&origin=*`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      
      const places = geoData.query?.geosearch || [];
      if (places.length === 0) {
        setNearbyPlaces([]);
        setLoadingPlaces(false);
        return;
      }

      const pageIds = places.map(p => p.pageid).join('|');
      
      // 2. Get details (thumbnail & extract)
      const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts&exintro=1&exchars=150&piprop=thumbnail&pithumbsize=400&pageids=${pageIds}&format=json&origin=*`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();
      
      const pagesObj = detailsData.query?.pages || {};
      
      const enrichedPlaces = places.map(p => {
        const details = pagesObj[p.pageid];
        return {
          id: p.pageid,
          title: p.title,
          dist: (p.dist / 1000).toFixed(1), // convert to km
          image: details?.thumbnail?.source || 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80',
          extract: details?.extract?.replace(/<\/?[^>]+(>|$)/g, "") || "A notable place to visit nearby."
        };
      });

      setNearbyPlaces(enrichedPlaces);
    } catch (err) {
      console.error("Failed to fetch nearby places", err);
    }
    setLoadingPlaces(false);
  };

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
            // 1. Fetch Location Name (Reverse Geocoding)
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const geoData = await geoRes.json();
            const locName = `${geoData.city || geoData.locality || 'Unknown'}, ${geoData.principalSubdivision || 'India'}`;

            // 2. Fetch Weather
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const wData = await weatherRes.json();
            const weather = wData.current_weather;
            
            // 3. Determine Hazard based on live weather
            let hazardLevel = 'Weather is clear. Safe for travel and sightseeing.';
            let hazardTitle = 'Low Risk - All Clear';
            if (weather.temperature > 40) {
              hazardTitle = 'High Risk - Extreme Heatwave';
              hazardLevel = 'Travel not recommended. Stay hydrated and avoid direct sunlight.';
            } else if (weather.windspeed > 40) {
              hazardTitle = 'High Risk - Strong Winds / Storm';
              hazardLevel = 'Seek shelter. Driving and outdoor activities are dangerous.';
            } else if ([51, 53, 55, 61, 63, 65, 67, 80, 81, 82].includes(weather.weathercode)) {
              hazardTitle = 'Medium Risk - Rainfall';
              hazardLevel = 'Roads may be slippery. Drive carefully.';
            } else if ([71, 73, 75, 77, 85, 86].includes(weather.weathercode)) {
              hazardTitle = 'High Risk - Snowfall';
              hazardLevel = 'Snow accumulation possible. Check road blocks before traveling.';
            } else if ([95, 96, 99].includes(weather.weathercode)) {
              hazardTitle = 'High Risk - Thunderstorm';
              hazardLevel = 'Lightning and heavy rain expected. Stay indoors.';
            }

            setUserLoc({ name: locName, lat, lon, hazardTitle, hazardLevel });
            setWeatherData(weather);
            setLoadingWeather(false);
            
            // Trigger nearby places fetch
            fetchNearbyPlaces(lat, lon);
          } catch (err) {
            console.error(err);
            setGeoError("Failed to load weather data. Retrying...");
            setLoadingWeather(false);
            setLoadingPlaces(false);
          }
        },
        (err) => {
          console.error(err);
          setGeoError("Location access denied. Please enable GPS to get live safety alerts.");
          setLoadingWeather(false);
          setLoadingPlaces(false);
        }
      );
    } else {
      setGeoError("Geolocation is not supported by your browser.");
      setLoadingWeather(false);
      setLoadingPlaces(false);
    }
  }, []);

  // Helper to interpret weather code
  const getWeatherIcon = (code) => {
    if (code === undefined) return '🌤️';
    if (code === 0) return '☀️'; // Clear
    if (code >= 1 && code <= 3) return '⛅'; // Partly cloudy
    if (code >= 51 && code <= 67) return '🌧️'; // Rain
    if (code >= 71 && code <= 77) return '❄️'; // Snow
    if (code >= 95) return '⛈️'; // Thunderstorm
    return '🌫️';
  };
  
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#1a237e',
      backgroundImage: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      fontFamily: '"Inter", "Segoe UI", Roboto, Arial, sans-serif',
      color: 'white',
      padding: '80px 20px'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '1000px', width: '100%' }}>
        <div style={{ fontSize: '80px', marginBottom: '10px' }}>🛡️</div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', margin: '0 0 15px 0', letterSpacing: '-1px', textShadow: '0 4px 10px rgba(0,0,0,0.3)' }}>
          {t.title}
        </h1>
        <p style={{ fontSize: '1.25rem', opacity: '0.9', margin: '0 0 50px 0', lineHeight: '1.6', fontWeight: '300' }}>
          {t.subtitle}<br/>
          <strong>{t.desc}</strong>
        </p>
        
        <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => navigate('/register')}
            style={btnStyle('#3949ab', '#1e88e5')}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📝</span> {t.btnReg}
          </button>
          
          <button onClick={() => navigate('/dashboard')}
            style={btnStyle('#2e7d32', '#43a047')}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>👮</span> {t.btnDash}
          </button>

          <button onClick={() => {
            if (!userLoc.lat) {
              alert("Still acquiring GPS... Please try again in a few seconds.");
              return;
            }
            const link = `https://safetrail.in/track?lat=${userLoc.lat}&lon=${userLoc.lon}&session=ST-${Math.floor(Math.random()*90000) + 10000}`;
            navigator.clipboard.writeText(link);
            alert("🔗 Secure Tracking Link Copied!\n\n" + link + "\n\nShare this on WhatsApp with your family so they can follow your journey in real-time.");
          }}
            style={btnStyle('#8e24aa', '#ab47bc')}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>📡</span> Share Location
          </button>
          
          <button onClick={() => navigate('/panic')}
            style={btnStyle('#c62828', '#e53935', true)}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🚨</span> {t.btnSos}
          </button>
        </div>

        {/* Live Weather & Hazard Alerts Section */}
        <div style={{ marginTop: '80px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>📍 Live Location & Safety Alerts</h2>
            {geoError && <span style={{ color: '#ffcdd2', fontSize: '14px', fontWeight: 'bold' }}>⚠️ {geoError}</span>}
          </div>

          <div style={{ 
            backgroundColor: 'rgba(255, 255, 255, 0.1)', 
            backdropFilter: 'blur(10px)', 
            borderRadius: '16px', 
            padding: '25px', 
            border: '1px solid rgba(255,255,255,0.2)',
            display: 'flex',
            gap: '30px',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            {/* Weather Info */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{ fontSize: '64px', animation: loadingWeather ? 'pulse 1.5s infinite' : 'none' }}>
                {loadingWeather ? '🌍' : getWeatherIcon(weatherData?.weathercode)}
              </div>
              <div>
                <h3 style={{ fontSize: '24px', margin: '0 0 5px 0' }}>{userLoc.name}</h3>
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#4fc3f7' }}>
                  {loadingWeather ? '--' : weatherData?.temperature}°C
                </div>
                <div style={{ fontSize: '14px', color: '#e0e0e0', marginTop: '5px' }}>
                  Wind Speed: {loadingWeather ? '--' : weatherData?.windspeed} km/h
                </div>
              </div>
            </div>

            {/* Hazard Alert Box */}
            <div style={{ 
              backgroundColor: userLoc.hazardTitle.includes('High') ? 'rgba(229, 57, 53, 0.2)' : userLoc.hazardTitle.includes('Medium') ? 'rgba(255, 152, 0, 0.2)' : 'rgba(67, 160, 71, 0.2)',
              border: `1px solid ${userLoc.hazardTitle.includes('High') ? '#e53935' : userLoc.hazardTitle.includes('Medium') ? '#ff9800' : '#43a047'}`,
              padding: '15px 20px',
              borderRadius: '12px',
              flex: '1',
              minWidth: '250px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <span style={{ fontSize: '20px' }}>{userLoc.hazardTitle.includes('High') ? '🚨' : '⚠️'}</span>
                <span style={{ fontWeight: 'bold', fontSize: '16px', color: userLoc.hazardTitle.includes('High') ? '#ffcdd2' : '#fff' }}>
                  {userLoc.hazardTitle}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.5' }}>
                {userLoc.hazardLevel}
              </p>
              <div style={{ marginTop: '10px', fontSize: '12px', opacity: 0.8 }}>
                {userLoc.lat ? `GPS Tracked: ${userLoc.lat.toFixed(4)}, ${userLoc.lon.toFixed(4)}` : 'Waiting for GPS signal...'}
              </div>
            </div>
          </div>
        </div>

        {/* Smart Tourist Guide: Nearby Explorer */}
        <div style={{ marginTop: '80px', textAlign: 'left', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '1.5rem', margin: 0 }}>🧭 Live Explorer: Nearby Attractions</h2>
            <span style={{ color: '#4fc3f7', fontSize: '14px', fontWeight: 'bold' }}>Within 10 km</span>
          </div>

          {loadingPlaces ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#e0e0e0' }}>
              <div style={{ fontSize: '40px', animation: 'spin 2s linear infinite', display: 'inline-block' }}>🗺️</div>
              <p>Discovering places around you...</p>
            </div>
          ) : nearbyPlaces.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              {nearbyPlaces.map((place) => (
                <div key={place.id} style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                  borderRadius: '12px', 
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                  color: '#1a237e'
                }}
                onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <img src={place.image} alt={place.title} style={{ width: '100%', height: '150px', objectFit: 'cover' }} />
                  <div style={{ padding: '15px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold' }}>{place.title}</h3>
                      <span style={{ backgroundColor: '#e3f2fd', color: '#1565c0', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 'bold' }}>
                        {place.dist} km
                      </span>
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {place.extract}
                    </p>
                    <a 
                      href={`https://en.wikipedia.org/?curid=${place.id}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ display: 'inline-block', marginTop: '10px', fontSize: '13px', color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                      Read more →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div style={{ textAlign: 'center', padding: '20px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '12px' }}>
               No notable attractions found within 10km of your current location.
             </div>
          )}
        </div>

        {/* Tourist Safety Tips */}
        <div style={{ marginTop: '80px', textAlign: 'left', paddingBottom: '40px' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>Safety Guidelines</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
            
            <div style={tipCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📱</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1a237e' }}>Stay Connected</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Keep your GPS on and carry a power bank. Cell networks can be patchy in remote areas.</p>
            </div>

            <div style={tipCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📝</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1a237e' }}>Register at Entry</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Always log your details at police check-posts or via this SafeTrail digital portal.</p>
            </div>

            <div style={tipCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>🪪</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1a237e' }}>Carry Official ID</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Keep physical copies of your Inner Line Permit (ILP) and Aadhaar/Passport handy.</p>
            </div>

            <div style={tipCardStyle}>
              <div style={{ fontSize: '32px', marginBottom: '10px' }}>📞</div>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', color: '#1a237e' }}>Emergency Contacts</h3>
              <p style={{ margin: 0, color: '#666', fontSize: '13px', lineHeight: '1.5' }}>Dial 112 for Police, 108 for Ambulance, or hit the SOS button on this app for immediate help.</p>
            </div>

          </div>
        </div>

      </div>
      
      <div style={{ padding: '40px 0', marginTop: 'auto', fontSize: '0.8rem', opacity: '0.5' }}>
        Government of India | Tourism Safety Initiative
      </div>
    </div>
  );
}

const btnStyle = (color1, color2, isDanger = false) => ({
  padding: '16px 32px',
  fontSize: '1.1rem',
  fontWeight: '600',
  background: `linear-gradient(135deg, ${color1} 0%, ${color2} 100%)`,
  color: 'white',
  border: 'none',
  borderRadius: '50px',
  cursor: 'pointer',
  boxShadow: isDanger ? '0 10px 25px rgba(229, 57, 53, 0.4)' : '0 8px 20px rgba(0,0,0,0.2)',
  transition: 'all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const zoneCardStyle = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
  transition: 'transform 0.2s',
  cursor: 'default'
};

const badgeStyle = (color) => ({
  backgroundColor: color,
  color: 'white',
  padding: '4px 10px',
  borderRadius: '50px',
  fontSize: '11px',
  fontWeight: '700',
  letterSpacing: '0.5px'
});

const tipCardStyle = {
  backgroundColor: 'rgba(255, 255, 255, 0.95)',
  padding: '25px 20px',
  borderRadius: '12px',
  boxShadow: '0 8px 20px rgba(0,0,0,0.2)',
  textAlign: 'center',
  transition: 'transform 0.2s',
  cursor: 'default'
};

export default Home;
