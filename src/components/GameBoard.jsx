import { useState, useEffect, useRef, useCallback } from 'react';
import Card from './Card';
import { setupBoard, isPair } from '../logic/gameEngine';
import { useGameState } from '../state/gameState';
import { playSFX } from '../utils/audioManager';
import { pairs } from '../logic/pairs';
import './GameBoard.css';

const AUTO_DISMISS = 4000;
const getPairData = (pairId) => pairs.find(p => p.id === pairId);

const GameBoard = () => {
  const { updateScore } = useGameState();

  const [board,       setBoard]       = useState(() => setupBoard([]));
  const [selNature,   setSelNature]   = useState(null);
  const [selApp,      setSelApp]      = useState(null);
  const [animating,   setAnimating]   = useState(true);
  const [errorCards,  setErrorCards]  = useState([]);
  const [errorCounts, setErrorCounts] = useState({});
  const [infoPopup,   setInfoPopup]   = useState(null);
  const [matchPopup,  setMatchPopup]  = useState(null);
  const [matchAnim, setMatchAnim] = useState(null);

  const boardRef        = useRef(null);
  const cardRefs        = useRef({});
  const selNatureRef    = useRef(null);
  const selAppRef       = useRef(null);
  const foundPairIdsRef = useRef([]);

  useEffect(() => {
    const t = setTimeout(() => setAnimating(false), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => { selNatureRef.current = selNature; }, [selNature]);
  useEffect(() => { selAppRef.current    = selApp;    }, [selApp]);

  const getCenter = useCallback((key) => {
    const el  = cardRefs.current[key];
    const brd = boardRef.current;
    if (!el || !brd) return null;
    const er  = el.getBoundingClientRect();
    const brr = brd.getBoundingClientRect();
    return {
      x: er.left - brr.left + er.width  / 2,
      y: er.top  - brr.top  + er.height / 2,
    };
  }, []);

  const checkMatch = useCallback((nature, app) => {
    if (isPair(nature, app)) {
      playSFX('match');

      const p1 = getCenter(`nature-${nature.pairId}`);
      const p2 = getCenter(`app-${app.pairId}`);
      if (p1 && p2) setMatchAnim({
  nature:   nature,
  app:      app,
  pairData: getPairData(nature.pairId),
});
setSelNature(null);
setSelApp(null);
setInfoPopup(null);

setTimeout(() => {
  const nextIds = [...foundPairIdsRef.current, nature.pairId];
  foundPairIdsRef.current = nextIds;
  updateScore(nature.pairId);
  setBoard(setupBoard(nextIds));
  setMatchAnim(null);
}, 2800);

      setInfoPopup(null);
      setMatchPopup(getPairData(nature.pairId));
      setSelNature(null);
      setSelApp(null);

     setTimeout(() => {
  const nextIds = [...foundPairIdsRef.current, nature.pairId];
  foundPairIdsRef.current = nextIds;
  updateScore(nature.pairId);
  setBoard(setupBoard(nextIds));
  setMatchAnim(null);
}, 2800);

    } else {
      playSFX('error');

      const pid = nature.pairId;
      setErrorCounts(prev => ({ ...prev, [pid]: (prev[pid] || 0) + 1 }));
      setErrorCards([nature, app]);

      setTimeout(() => {
        setErrorCards([]);
        setSelNature(null);
        setSelApp(null);
        setInfoPopup(null);
      }, 700);
    }
  }, [getCenter, updateScore]);

  const handleCardClick = useCallback((card) => {
    if (animating) return;

    const isSel =
      (card.type === 'nature'      && selNatureRef.current === card) ||
      (card.type === 'application' && selAppRef.current    === card);

    if (isSel) {
      card.type === 'nature' ? setSelNature(null) : setSelApp(null);
      setInfoPopup(null);
      return;
    }

    setInfoPopup({ card, pairData: getPairData(card.pairId) });

    if (card.type === 'nature') {
      setSelNature(card);
      if (selAppRef.current) checkMatch(card, selAppRef.current);
    } else {
      setSelApp(card);
      if (selNatureRef.current) checkMatch(selNatureRef.current, card);
    }
  }, [animating, checkMatch]);

  // FIX : hint uniquement sur la carte nature actuellement sélectionnée
  const getHint = useCallback((pairId) => {
    const n = errorCounts[pairId] || 0;
    if (n < 2) return null;
    const pd = getPairData(pairId);
    return pd ? pd.indices[Math.min(n - 2, pd.indices.length - 1)] : null;
  }, [errorCounts]);

  const cardState = (card, sel) => {
    if (animating)                        return 'distributing';
    if (errorCards.includes(card)) return 'error';
    if (sel === card)                     return 'selected';
    return 'idle';
  };

  return (
    // FIX : position: relative nécessaire pour que le SVG absolu se positionne par rapport au board
    <div className="stk-game-container" ref={boardRef} style={{ position: 'relative' }}>

      {/* FIX : SVG dimensionné explicitement pour couvrir tout le board */}
      {matchAnim && (
  <MatchReveal
    nature={matchAnim.nature}
    app={matchAnim.app}
    pairData={matchAnim.pairData}
  />
)}
      <div className="stk-board-row">
        {board.natureCards.map(card => (
          <div key={card.pairId} className="stk-card-wrapper">
            <Card
              ref={el => { cardRefs.current[`nature-${card.pairId}`] = el; }}
              data={card}
              state={cardState(card, selNature)}
              onClick={() => handleCardClick(card)}
            />
            {/* FIX : hint visible UNIQUEMENT sur la carte nature sélectionnée */}
            {selNature === card && getHint(card.pairId) && (
              <HintBadge text={getHint(card.pairId)} />
            )}
          </div>
        ))}
      </div>

      {/* FIX : div vide remplacé par un séparateur purement spatial (pas de border) */}
      <div className="stk-board-separator" />

      <div className="stk-board-row">
        {board.appCards.map(card => (
          <div key={card.pairId} className="stk-card-wrapper">
            <Card
              ref={el => { cardRefs.current[`app-${card.pairId}`] = el; }}
              data={card}
              state={cardState(card, selApp)}
              onClick={() => handleCardClick(card)}
            />
          </div>
        ))}
      </div>

      {infoPopup && !matchPopup && (
        <SidePanel
          type="info"
          card={infoPopup.card}
          pairData={infoPopup.pairData}
          onClose={() => setInfoPopup(null)}
        />
      )}

      {matchPopup && (
        <SidePanel
          type="match"
          pairData={matchPopup}
          onClose={() => setMatchPopup(null)}
        />
      )}
    </div>
  );
};

const SidePanel = ({ type, card, pairData, onClose }) => {
  const [countdown, setCountdown] = useState(AUTO_DISMISS / 1000);

  useEffect(() => {
    const iv = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) { clearInterval(iv); onClose(); return 0; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [onClose]);

  const progress = ((AUTO_DISMISS / 1000 - countdown) / (AUTO_DISMISS / 1000)) * 100;

  return (
    <div className={`stk-side-panel stk-side-panel--${type}`}>
      <div className="stk-panel-timer-bar">
        <div className="stk-panel-timer-fill" style={{ width: `${progress}%` }} />
      </div>

      <button className="stk-panel-close" onClick={onClose}>
        ✕ <span className="stk-panel-countdown">{countdown}s</span>
      </button>

      {type === 'info' && card && (
        <>
          <div className="stk-panel-tag">
            {card.type === 'nature' ? '🌿 NATURE' : '⚙️ APPLICATION'}
          </div>
          <h3 className="stk-panel-title">{card.nom}</h3>
          {pairData && (
            <p className="stk-panel-text">{pairData.explication.slice(0, 110)}…</p>
          )}
        </>
      )}

      {type === 'match' && pairData && (
        <>
          <div className="stk-panel-tag stk-panel-tag--match">✦ CONNEXION TROUVÉE</div>
          <div className="stk-panel-pair">
            <span className="stk-panel-pill nature">{pairData.nature.nom}</span>
            <span className="stk-panel-arrow">→</span>
            <span className="stk-panel-pill app">{pairData.application.nom}</span>
          </div>
          <p className="stk-panel-text">{pairData.explication}</p>
        </>
      )}
    </div>
  );
};

const HintBadge = ({ text }) => (
  <div className="stk-hint-badge">💡 {text}</div>
);


export default GameBoard;
const MatchReveal = ({ nature, app, pairData }) => (
  <div className="stk-match-reveal-overlay">
    <div className="stk-match-reveal">

      <div className="stk-match-reveal-tag">✦ CONNEXION TROUVÉE</div>

      <div className="stk-match-reveal-cards">
        <div className="stk-match-mini-card is-nature">
          <img src={nature.image} alt={nature.nom} />
          <span>{nature.nom}</span>
        </div>

        <div className="stk-match-reveal-connector">
          <svg width="48" height="2" viewBox="0 0 48 2">
            <line x1="0" y1="1" x2="48" y2="1"
              stroke="#1A1A18" strokeWidth="1.5"
              strokeDasharray="4 3"
            />
          </svg>
        </div>

        <div className="stk-match-mini-card is-application">
          <img src={app.image} alt={app.nom} />
          <span>{app.nom}</span>
        </div>
      </div>

      {pairData && (
        <p className="stk-match-reveal-text">{pairData.explication}</p>
      )}

    </div>
  </div>
);