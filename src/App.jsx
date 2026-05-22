import { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard';
import UserSpace from './components/UserSpace';
import Tutorial from './components/Tutorial';
import Modal from './components/Modal';
import LoadingScreen from './components/LoadingScreen';
import { useGameState } from './state/gameState';
import './App.css';

const StkLogo = () => (
  <span style={{
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    fontWeight: 800,
    letterSpacing: '3px',
    color: '#1A1A18',
    textTransform: 'uppercase',
  }}>
    STK Architecture
  </span>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

const GameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="3"/>
    <path d="M8 12h2m-1-1v2M15 12h.01M17 12h.01"/>
  </svg>
);

function App() {
  const { score, showExplorationModal, setShowExplorationModal } = useGameState();
  const [view,     setView]     = useState('game');
  const [showTuto, setShowTuto] = useState(true);
  const [loading,  setLoading]  = useState(true);

  const ambientRef = useRef(null);

  const startAmbient = () => {
    if (ambientRef.current) {
      ambientRef.current.volume = 0.12;
      ambientRef.current.loop   = true;
      ambientRef.current.play().catch(() => {});
    }
  };

  const handleStart = () => {
    setShowTuto(false);
    startAmbient();
  };

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <LoadingScreen />;

  const progressPct = (score / 21) * 100;

  return (
    <div className="stk-app-root">

      <audio ref={ambientRef} preload="none" />

      {showTuto && <Tutorial onStart={handleStart} />}

      <header className="stk-main-header">
        <div className="stk-logo-main">
          <StkLogo />
        </div>
        <div className="stk-progress-wrapper">
          <div className="progress-info">EXPLORATION {score}/21</div>
          <div className="stk-progress-bar-bg">
            <div className="stk-progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <button
          className="nav-user-btn"
          onClick={() => setView(view === 'game' ? 'user' : 'game')}
        >
          {view === 'game' ? <UserIcon /> : <GameIcon />}
          {view === 'game' ? 'MON ESPACE' : 'RETOUR AU JEU'}
        </button>
      </header>

      <main className="stk-content-area">
        {view === 'game' ? (
          <>
            <img src="/src/assets/bg-line.svg" aria-hidden="true" style={{
              position: 'fixed', top: 0, left: 0,
              width: '42vw', maxWidth: '600px',
              height: 'auto', pointerEvents: 'none',
              opacity: 0.18, zIndex: 0,
              transform: 'scaleX(-1)',
            }}/>
            <img src="/src/assets/bg-line.svg" aria-hidden="true" style={{
              position: 'fixed', top: 0, right: 0,
              width: '42vw', maxWidth: '600px',
              height: 'auto', pointerEvents: 'none',
              opacity: 0.18, zIndex: 0,
            }}/>
            <GameBoard />
          </>
        ) : (
          <UserSpace onBack={() => setView('game')} />
        )}
      </main>

      <Modal
        isOpen={showExplorationModal}
        title="Félicitations ! ✦"
        footer={
          <button className="stk-btn-primary" onClick={() => setShowExplorationModal(false)}>
            Continuer l'exploration
          </button>
        }
      >
        <p>Vous avez trouvé 5 paires biomimétiques ! Votre fiche d'exploration est prête dans votre espace.</p>
      </Modal>

    </div>
  );
}

export default App;