import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../LanguageContext';

const translations = {
  English: { title: "SafeTrail", subtitle: "Smart Tourist Safety System", desc: "Your digital guardian anywhere you travel.", btnReg: "Register Now", btnDash: "Command Center", btnSos: "Emergency SOS" },
  Hindi: { title: "सेफट्रेल", subtitle: "स्मार्ट पर्यटक सुरक्षा प्रणाली", desc: "आपकी यात्राओं में आपका डिजिटल रक्षक।", btnReg: "पंजीकरण करें", btnDash: "कमांड सेंटर", btnSos: "आपातकालीन SOS" },
  Marathi: { title: "सेफट्रेल", subtitle: "स्मार्ट पर्यटक सुरक्षा प्रणाली", desc: "तुमच्या प्रवासात तुमचा डिजिटल रक्षक.", btnReg: "नोंदणी करा", btnDash: "कमांड सेंटर", btnSos: "आणीबाणी SOS" },
  Bengali: { title: "সেফট্রেইল", subtitle: "স্মার্ট ট্যুরিস্ট সেফটি সিস্টেম", desc: "আপনার ভ্রমণে আপনার ডিজিটাল অভিভাবক।", btnReg: "নিবন্ধন করুন", btnDash: "কমান্ড সেন্টার", btnSos: "ইমার্জেন্সি SOS" },
  Assamese: { title: "ছেফট্রেইল", subtitle: "স্মাৰ্ট পৰ্যটক সুৰক্ষা প্ৰণালী", desc: "আপোনাৰ ভ্ৰমণত আপোনাৰ ডিজিটেল অভিভাৱক।", btnReg: "পঞ্জীয়ন কৰক", btnDash: "কমাণ্ড চেণ্টাৰ", btnSos: "জৰুৰীকালীন SOS" }
};

function Home() {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = translations[language] || translations.English;

  const [userLoc, setUserLoc] = useState({ name: 'Locating you...', lat: null, lon: null, hazardTitle: 'Assessing...', hazardLevel: 'Waiting for location...' });
  const [weatherData, setWeatherData] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [geoError, setGeoError] = useState("");
  const [nearbyPlaces, setNearbyPlaces] = useState([]);
  const [loadingPlaces, setLoadingPlaces] = useState(true);
  const [newsList, setNewsList] = useState([]);
  const [loadingNews, setLoadingNews] = useState(true);

  const fetchNearbyPlaces = async (lat, lon) => {
    try {
      const geoUrl = `https://en.wikipedia.org/w/api.php?action=query&list=geosearch&gsradius=10000&gscoord=${lat}|${lon}&gslimit=6&format=json&origin=*`;
      const geoRes = await fetch(geoUrl);
      const geoData = await geoRes.json();
      const places = geoData.query?.geosearch || [];
      if (places.length === 0) { setNearbyPlaces([]); setLoadingPlaces(false); return; }
      const pageIds = places.map(p => p.pageid).join('|');
      const detailsUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts&exintro=1&exchars=150&piprop=thumbnail&pithumbsize=400&pageids=${pageIds}&format=json&origin=*`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = await detailsRes.json();
      const pagesObj = detailsData.query?.pages || {};
      const enrichedPlaces = places.map(p => {
        const details = pagesObj[p.pageid];
        return {
          id: p.pageid, title: p.title, lat: p.lat, lon: p.lon, dist: (p.dist / 1000).toFixed(1),
          image: details?.thumbnail?.source || 'https://images.unsplash.com/photo-1546949216-95f0882e5ff6?q=80&w=400',
          extract: details?.extract?.replace(/<\/?[^>]+(>|$)/g, "") || "A notable place to visit nearby."
        };
      });
      setNearbyPlaces(enrichedPlaces);
    } catch (err) {
      console.error("Failed to fetch nearby places", err);
    }
    setLoadingPlaces(false);
  };

  const fetchNews = async () => {
    try {
      const res = await fetch('https://saurav.tech/NewsAPI/top-headlines/category/general/in.json');
      const data = await res.json();
      setNewsList(data.articles?.slice(0, 4) || []);
    } catch (err) {
      console.error("Failed to fetch news", err);
    }
    setLoadingNews(false);
  };

  useEffect(() => {
    fetchNews();
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
            const geoRes = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`);
            const geoData = await geoRes.json();
            const locName = `${geoData.city || geoData.locality || 'Unknown'}, ${geoData.principalSubdivision || 'India'}`;
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
            const wData = await weatherRes.json();
            const weather = wData.current_weather;
            
            let hazardLevel = 'Weather is clear. Safe for travel and sightseeing.';
            let hazardTitle = 'Low Risk - All Clear';
            if (weather.temperature > 40) { hazardTitle = 'High Risk - Extreme Heatwave'; hazardLevel = 'Travel not recommended. Stay hydrated.'; } 
            else if (weather.windspeed > 40) { hazardTitle = 'High Risk - Storm'; hazardLevel = 'Seek shelter. Outdoor activities dangerous.'; } 
            else if ([51, 53, 55, 61, 63, 65, 67, 80, 81, 82].includes(weather.weathercode)) { hazardTitle = 'Medium Risk - Rain'; hazardLevel = 'Roads may be slippery. Drive carefully.'; } 
            else if ([71, 73, 75, 77, 85, 86].includes(weather.weathercode)) { hazardTitle = 'High Risk - Snow'; hazardLevel = 'Check road blocks before traveling.'; } 
            else if ([95, 96, 99].includes(weather.weathercode)) { hazardTitle = 'High Risk - Thunderstorm'; hazardLevel = 'Lightning expected. Stay indoors.'; }

            setUserLoc({ name: locName, lat, lon, hazardTitle, hazardLevel });
            setWeatherData(weather);
            setLoadingWeather(false);
            fetchNearbyPlaces(lat, lon);
          } catch (err) {
            setGeoError("Failed to load live data.");
            setLoadingWeather(false); setLoadingPlaces(false);
          }
        },
        () => {
          setGeoError("Location access denied. Enable GPS for alerts.");
          setLoadingWeather(false); setLoadingPlaces(false);
        }
      );
    }
  }, []);

  const getWeatherIcon = (code) => {
    if (code === undefined) return '🌤️';
    if (code === 0) return '☀️'; if (code >= 1 && code <= 3) return '⛅';
    if (code >= 51 && code <= 67) return '🌧️'; if (code >= 71 && code <= 77) return '❄️';
    if (code >= 95) return '⛈️'; return '🌫️';
  };
  
  return (
    <div style={{ backgroundColor: '#0f172a', minHeight: '100vh', color: 'white', fontFamily: '"Inter", sans-serif', overflowX: 'hidden' }}>
      
      {/* Cinematic Hero Section */}
      <div style={{ position: 'relative', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 0, overflow: 'hidden' }}>
          <img src="https://images.unsplash.com/photo-1546949216-95f0882e5ff6?q=80&w=2000&auto=format&fit=crop" alt="Hero" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(0.6)' }} />
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'linear-gradient(to bottom, transparent, #0f172a)' }}></div>
        </div>
        
        <div style={{ zIndex: 1, padding: '20px', maxWidth: '800px', animation: 'fadeIn 1s ease' }}>
          <div style={{ fontSize: '72px', marginBottom: '10px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>🛡️</div>
          <h1 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '64px', fontWeight: '800', margin: '0 0 15px 0', letterSpacing: '-1px', textShadow: '0 4px 20px rgba(0,0,0,0.5)' }}>
            {t.title}
          </h1>
          <p style={{ fontSize: '24px', fontWeight: '300', opacity: 0.9, marginBottom: '40px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {t.subtitle} <br/> <strong style={{ fontWeight: '600' }}>{t.desc}</strong>
          </p>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/register')} style={{...heroBtnStyle, background: 'linear-gradient(135deg, #0ea5e9, #2563eb)', border: 'none', boxShadow: '0 8px 20px rgba(14, 165, 233, 0.3)'}}>
              <span style={{ fontSize: '24px' }}>📝</span> {t.btnReg}
            </button>
            <button onClick={() => navigate('/dashboard')} style={{...heroBtnStyle, background: 'linear-gradient(135deg, #10b981, #047857)', border: 'none', boxShadow: '0 8px 20px rgba(16, 185, 129, 0.3)'}}>
              <span style={{ fontSize: '24px' }}>👮</span> {t.btnDash}
            </button>
            <button onClick={() => {
              if (!userLoc.lat) { alert("Acquiring GPS..."); return; }
              navigator.clipboard.writeText(`https://safetrail.in/track?lat=${userLoc.lat}&lon=${userLoc.lon}&session=ST-${Math.floor(Math.random()*90000) + 10000}`);
              alert("🔗 Secure Tracking Link Copied!");
            }} style={{...heroBtnStyle, background: 'linear-gradient(135deg, #8b5cf6, #5b21b6)', border: 'none', boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'}}>
              <span style={{ fontSize: '24px' }}>📡</span> Share Location
            </button>
            <button onClick={() => navigate('/panic')} style={{...heroBtnStyle, background: 'linear-gradient(135deg, #ef4444, #991b1b)', border: 'none', boxShadow: '0 10px 30px rgba(239, 68, 68, 0.4)'}}>
              <span style={{ fontSize: '24px' }}>🚨</span> {t.btnSos}
            </button>
          </div>
        </div>
        
        <div style={{ position: 'absolute', bottom: '30px', zIndex: 1, opacity: 0.7, animation: 'pulse 2s infinite' }}>
          <p style={{ fontSize: '14px', letterSpacing: '2px', textTransform: 'uppercase' }}>Scroll for Live Intel</p>
          <div style={{ textAlign: 'center', fontSize: '24px' }}>↓</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 20px', position: 'relative', zIndex: 2 }}>
        
        {/* Live Weather & Alerts */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '32px', marginBottom: '30px', display: 'flex', alignItems: 'center', gap: '15px' }}>
            📍 Live Safety Intel
            {geoError && <span style={{ fontSize: '14px', color: '#fca5a5', backgroundColor: 'rgba(239, 68, 68, 0.2)', padding: '5px 10px', borderRadius: '8px' }}>{geoError}</span>}
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
            {/* Weather Glass Card */}
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', padding: '30px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '25px', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
              <div style={{ fontSize: '80px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.2))' }}>
                {loadingWeather ? '🌍' : getWeatherIcon(weatherData?.weathercode)}
              </div>
              <div>
                <div style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.7, marginBottom: '5px' }}>Current Location</div>
                <h3 style={{ fontSize: '28px', margin: '0 0 10px 0', fontFamily: '"Outfit", sans-serif' }}>{userLoc.name}</h3>
                <div style={{ fontSize: '42px', fontWeight: '800', color: '#38bdf8', lineHeight: 1 }}>
                  {loadingWeather ? '--' : weatherData?.temperature}°C
                </div>
              </div>
            </div>

            {/* Alert Glass Card */}
            <div style={{ 
              backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)',
              padding: '30px', borderRadius: '24px', 
              border: '1px solid rgba(255,255,255,0.1)',
              borderLeft: `6px solid ${userLoc.hazardTitle.includes('High') ? '#ef4444' : userLoc.hazardTitle.includes('Medium') ? '#f59e0b' : '#22c55e'}`,
              boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '32px' }}>{userLoc.hazardTitle.includes('High') ? '🚨' : '🛡️'}</span>
                <h3 style={{ fontSize: '22px', margin: 0, fontFamily: '"Outfit", sans-serif', color: userLoc.hazardTitle.includes('High') ? '#fca5a5' : 'white' }}>
                  {userLoc.hazardTitle}
                </h3>
              </div>
              <p style={{ fontSize: '16px', lineHeight: 1.6, opacity: 0.9, margin: '0 0 15px 0' }}>{userLoc.hazardLevel}</p>
              <div style={{ fontSize: '13px', opacity: 0.6, fontFamily: 'monospace' }}>
                {userLoc.lat ? `GPS: ${userLoc.lat.toFixed(4)}, ${userLoc.lon.toFixed(4)}` : 'Awaiting GPS...'}
              </div>
            </div>
          </div>
        </section>

        {/* Nearby Attractions */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '32px', marginBottom: '30px' }}>🧭 Live Explorer</h2>
          {loadingPlaces ? (
            <div style={{ textAlign: 'center', padding: '60px', opacity: 0.7 }}>
              <div style={{ fontSize: '48px', animation: 'pulse 1s infinite' }}>🗺️</div>
              <p style={{ fontSize: '18px', marginTop: '15px' }}>Scanning surroundings...</p>
            </div>
          ) : nearbyPlaces.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              {nearbyPlaces.map((place) => (
                <div key={place.id} style={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px', overflow: 'hidden', padding: 0, cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s'
                }}
                onClick={() => window.open(`https://www.google.com/maps/dir/?api=1&origin=${userLoc.lat},${userLoc.lon}&destination=${place.lat},${place.lon}`, '_blank')}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ position: 'relative', height: '180px' }}>
                    <img src={place.image} alt={place.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', bottom: '15px', right: '15px', backgroundColor: 'rgba(15, 23, 42, 0.8)', padding: '5px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', backdropFilter: 'blur(5px)' }}>
                      {place.dist} km
                    </div>
                  </div>
                  <div style={{ padding: '25px' }}>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontFamily: '"Outfit", sans-serif' }}>{place.title}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {place.extract}
                    </p>
                    <div style={{ marginTop: '20px', color: '#38bdf8', fontSize: '14px', fontWeight: '600' }}>Navigate →</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', padding: '40px', borderRadius: '20px', opacity: 0.7 }}>
              No nearby attractions found within 10km.
            </div>
          )}
        </section>

        {/* Local News & Updates */}
        <section style={{ marginBottom: '80px' }}>
          <h2 style={{ fontFamily: '"Outfit", sans-serif', fontSize: '32px', marginBottom: '30px' }}>📰 Local News & Updates</h2>
          {loadingNews ? (
            <div style={{ textAlign: 'center', padding: '60px', opacity: 0.7 }}>
              <div style={{ fontSize: '48px', animation: 'pulse 1s infinite' }}>📰</div>
              <p style={{ fontSize: '18px', marginTop: '15px' }}>Fetching latest headlines...</p>
            </div>
          ) : newsList.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '30px' }}>
              {newsList.map((news, idx) => (
                <div key={idx} style={{ 
                  backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '20px', overflow: 'hidden', padding: 0, cursor: 'pointer',
                  transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s'
                }}
                onClick={() => window.open(news.url, '_blank')}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-10px)'; e.currentTarget.style.boxShadow = '0 30px 60px rgba(0,0,0,0.4)'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {news.urlToImage && (
                    <div style={{ height: '180px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                      <img src={news.urlToImage} alt={news.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display = 'none'} />
                    </div>
                  )}
                  <div style={{ padding: '25px' }}>
                    <div style={{ fontSize: '12px', color: '#38bdf8', fontWeight: 'bold', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>{news.source?.name || 'Local Alert'}</div>
                    <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', fontFamily: '"Outfit", sans-serif', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{news.title}</h3>
                    <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {news.description || 'Click to read full story...'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ backgroundColor: 'rgba(15, 23, 42, 0.7)', backdropFilter: 'blur(15px)', border: '1px solid rgba(255,255,255,0.1)', textAlign: 'center', padding: '40px', borderRadius: '20px', opacity: 0.7 }}>
              Currently no news updates available.
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

const heroBtnStyle = {
  padding: '16px 32px',
  fontSize: '18px',
  fontWeight: '600',
  color: 'white',
  borderRadius: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  transition: 'transform 0.2s, background 0.2s',
  border: '1px solid rgba(255,255,255,0.2)'
};

export default Home;
