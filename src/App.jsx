import APOD from './components/APOD';
import Launches from './components/Launches';
import Asteroids from './components/Asteroids';
import Rockets from './components/Rockets';
import './App.css';

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>🚀 Space Dashboard</h1>
        <p>Powered by NASA &amp; SpaceX APIs</p>
      </header>
      <main>
        <div className="grid-full"><APOD /></div>
        <div className="grid-half"><Launches /></div>
        <div className="grid-half"><Asteroids /></div>
        <div className="grid-full"><Rockets /></div>
      </main>
    </div>
  );
}
