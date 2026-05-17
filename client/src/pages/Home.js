import React from 'react';
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
          
          <button onClick={() => navigate('/panic')}
            style={btnStyle('#c62828', '#e53935', true)}>
            <span style={{ fontSize: '20px', marginRight: '8px' }}>🚨</span> {t.btnSos}
          </button>
        </div>

        {/* Geo-fence Zone Warnings */}
        <div style={{ marginTop: '80px', textAlign: 'left' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '10px' }}>Current High Risk Zones</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            
            <div style={zoneCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a237e' }}>Kaziranga National Park</h3>
                <span style={badgeStyle('#ff9800')}>MEDIUM RISK</span>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>Seasonal flooding affecting inner zones. Safari routes partially restricted.</p>
            </div>

            <div style={zoneCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a237e' }}>Tawang Sector</h3>
                <span style={badgeStyle('#e53935')}>HIGH RISK</span>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>Heavy snowfall and military convoy movement. Travel after 4 PM strictly prohibited.</p>
            </div>

            <div style={zoneCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a237e' }}>Dzukou Valley</h3>
                <span style={badgeStyle('#43a047')}>LOW RISK</span>
              </div>
              <p style={{ margin: 0, color: '#666', fontSize: '14px', lineHeight: '1.5' }}>Clear weather. Safe for trekking. Mandatory registration at entry point.</p>
            </div>

          </div>
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
