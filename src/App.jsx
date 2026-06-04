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
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>🚀 Space Dashboard</h1>
        <p>Powered by NASA &amp; SpaceX APIs</p>
      </header>

      <section className="section-header">NASA APIs</section>
      <main>
        <div className="grid-full"><APOD /></div>
        <div className="grid-full"><EPIC /></div>
        <div className="grid-half"><Asteroids /></div>
        <div className="grid-half"><EONET /></div>
        <div className="grid-full"><NASALibrary /></div>
        <div className="grid-half"><DONKI /></div>
        <div className="grid-half"><Exoplanets /></div>
        <div className="grid-half"><Satellites /></div>
        <div className="grid-half"><Techport /></div>
        <div className="grid-full"><SolarSystem /></div>
      </main>

      <section className="section-header">SpaceX APIs</section>
      <main>
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
