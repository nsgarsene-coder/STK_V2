import { useState, useEffect, useRef } from 'react';
import GameBoard from './components/GameBoard';
import UserSpace from './components/UserSpace';
import Tutorial from './components/Tutorial';
import Modal from './components/Modal';
/*import LoadingScreen from './components/LoadingScreen';*/
import { useGameState } from './state/gameState';
import './App.css';

/* ── Logo SVG STK (inline, scale proprement) ── */
const StkLogo = () => (
  <svg
    width="80"
    height="38"
    viewBox="0 0 317 151"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
    style={{ display: 'block' }}
  >
    <rect
      width="317"
      height="151"
      fill="url(#stk-logo-pattern)"
      style={{ mixBlendMode: 'multiply' }}
    />
    <defs>
      <pattern
        id="stk-logo-pattern"
        patternContentUnits="objectBoundingBox"
        width="1"
        height="1"
      >
        <use
          xlinkHref="#stk-logo-img"
          transform="matrix(0.00211416 0 0 0.00443835 0 -0.00153312)"
        />
      </pattern>
      <image
        id="stk-logo-img"
        width="473"
        height="226"
        preserveAspectRatio="none"
        xlinkHref="data:image/png;base64,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"
      />
    </defs>
  </svg>
);

/* ── Icône utilisateur (SVG pro outline) ── */
const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4"/>
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
  </svg>
);

/* ── Icône jeu ── */
const GameIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="12" rx="3"/>
    <path d="M8 12h2m-1-1v2M15 12h.01M17 12h.01"/>
  </svg>
);

/* ================================================
   APP
================================================ */
function App() {
  const { score, foundPairIds, showExplorationModal, setShowExplorationModal } = useGameState();

  const [view, setView]         = useState('game');
  const [showTuto, setShowTuto] = useState(true);
  const [loading, setLoading]   = useState(true);

  // Ambient audio
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

  /* Simulate loading (images, pairs data) */
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800);
    return () => clearTimeout(t);
  }, []);

  if (loading) return null;

  const progressPct = (score / 21) * 100;

  return (
    <div className="stk-app-root">

      {/* ── AMBIENT AUDIO ── */}
      <audio ref={ambientRef} preload="none">
        {/* Remplacez src par votre fichier audio dans /src/assets/ */}
        {/* <source src="/src/assets/ambient.mp3" type="audio/mpeg" /> */}
      </audio>

      {/* ── TUTORIEL ── */}
      {showTuto && <Tutorial onStart={handleStart} />}

      {/* ── HEADER ── */}
      <header className="stk-main-header">

        {/* LOGO SVG */}
        <div className="stk-logo-main">
          <StkLogo />
        </div>

        {/* BARRE DE PROGRESSION */}
        <div className="stk-progress-wrapper">
          <div className="progress-info">
            EXPLORATION {score}/21
          </div>
          <div className="stk-progress-bar-bg">
            <div
              className="stk-progress-bar-fill"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* BOUTON USER / JEU */}
        <button
          className="nav-user-btn"
          onClick={() => setView(view === 'game' ? 'user' : 'game')}
        >
          {view === 'game' ? <UserIcon /> : <GameIcon />}
          {view === 'game' ? 'MON ESPACE' : 'RETOUR AU JEU'}
        </button>

      </header>

      {/* ── CONTENU ── */}
      <main className="stk-content-area">
        {view === 'game'
          ? <GameBoard />
          : <UserSpace onBack={() => setView('game')} />
        }
      </main>

      {/* ── MODAL 5 PAIRES ── */}
      <Modal
        isOpen={showExplorationModal}
        title="Félicitations ! ✦"
        footer={
          <button
            className="stk-btn-primary"
            onClick={() => setShowExplorationModal(false)}
          >
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
