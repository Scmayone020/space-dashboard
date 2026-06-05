import { useState, useEffect, useCallback } from 'react';
import APOD from './components/APOD';
import Launches from './components/Launches';
import Asteroids from './components/Asteroids';
import Rockets from './components/Rockets';
import DONKI from './components/DONKI';
import EPIC from './components/EPIC';
import EONET from './components/EONET';
import Exoplanets from './components/Exoplanets';
import NASALibrary from './components/NASALibrary';
import Satellites from './components/Satellites';
import Techport from './components/Techport';
import SolarSystem from './components/SolarSystem';
import Capsules from './components/Capsules';
import Cores from './components/Cores';
import Starlink from './components/Starlink';
import Launchpads from './components/Launchpads';
import Landpads from './components/Landpads';
import Crew from './components/Crew';
import Payloads from './components/Payloads';
import History from './components/History';
import StormAlert from './components/StormAlert';
import NOAAWeather from './components/NOAAWeather';
import AuroraMap from './components/AuroraMap';
import Aurorasaurus from './components/Aurorasaurus';
import RefreshTimer from './components/RefreshTimer';
import './App.css';

const KP_POLL_MS = 2 * 60 * 1000;

export default function App() {
  const [refreshCount, setRefreshCount] = useState(0);
  const [liveKp, setLiveKp] = useState(1);

  const fetchKp = useCallback(() => {
    fetch(`https://services.swpc.noaa.gov/json/planetary_k_index_1m.json?_=${Date.now()}`)
      .then(r => r.json())
      .then(data => {
        const latest = data[data.length - 1];
        const val = Math.round(parseFloat(latest?.kp_index || latest?.Kp || 1));
        setLiveKp(val);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetchKp();
    const interval = setInterval(fetchKp, KP_POLL_MS);
    return () => clearInterval(interval);
  }, [fetchKp]);

  const handleRefresh = () => setRefreshCount(c => c + 1);

  // refreshKey forces all components to remount and re-fetch on refresh
  const refreshKey = refreshCount;

  return (
    <div className="app">
      <header>
        <h1>🚀 Space Dashboard</h1>
        <p>Powered by NASA &amp; SpaceX APIs</p>
      </header>

      <RefreshTimer onRefresh={handleRefresh} refreshCount={refreshCount} />

      <section className="section-header storm-section-header">🌌 Space Weather &amp; Aurora</section>
      <main key={`weather-${refreshKey}`}>
        <div className="grid-full"><StormAlert kpVal={liveKp} /></div>
        <div className="grid-full"><AuroraMap kpVal={liveKp} /></div>
        <div className="grid-half"><NOAAWeather /></div>
        <div className="grid-half"><Aurorasaurus /></div>
        <div className="grid-half"><DONKI /></div>
        <div className="grid-half"><EONET /></div>
      </main>

      <section className="section-header">NASA APIs</section>
      <main key={`nasa-${refreshKey}`}>
        <div className="grid-full"><APOD /></div>
        <div className="grid-full"><EPIC /></div>
        <div className="grid-half"><Asteroids /></div>
        <div className="grid-full"><NASALibrary /></div>
        <div className="grid-half"><Exoplanets /></div>
        <div className="grid-half"><Satellites /></div>
        <div className="grid-half"><Techport /></div>
        <div className="grid-full"><SolarSystem /></div>
      </main>

      <section className="section-header">SpaceX APIs</section>
      <main key={`spacex-${refreshKey}`}>
        <div className="grid-full"><Crew /></div>
        <div className="grid-half"><Launches /></div>
        <div className="grid-half"><Rockets /></div>
        <div className="grid-half"><Capsules /></div>
        <div className="grid-half"><Cores /></div>
        <div className="grid-full"><Starlink /></div>
        <div className="grid-half"><Launchpads /></div>
        <div className="grid-half"><Landpads /></div>
        <div className="grid-full"><Payloads /></div>
        <div className="grid-full"><History /></div>
      </main>
    </div>
  );
}
