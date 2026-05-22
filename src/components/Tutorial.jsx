import { useState } from 'react';
import './Tutorial.css';

const STEPS = [
  {
    icon: '01',
    label: 'BIOMIMÉTISME',
    title: 'La nature comme modèle',
    text: "La nature résout depuis 3,8 milliards d'années les mêmes problèmes que nous. Votre mission : retrouver ces connexions cachées.",
    demo: 'nature',
  },
  {
    icon: '02',
    label: 'LES PAIRES',
    title: 'Relier pour comprendre',
    text: "Chaque carte Nature a son équivalent humain. Cliquez d'abord une carte verte, puis sa correspondance grise. Deux erreurs = un indice.",
    demo: 'pair',
  },
  {
    icon: '03',
    label: 'EXPLORATION',
    title: 'Prêt à explorer ?',
    text: "21 paires vous attendent. Chaque découverte débloque une fiche biomimétique dans votre espace explorateur.",
    demo: 'match',
  },
];

const Tutorial = ({ onStart }) => {
  const [step,    setStep]    = useState(0);
  const [exiting, setExiting] = useState(false);

  const handleClose = () => {
    setExiting(true);
    setTimeout(onStart, 400);
  };

  const current = STEPS[step];

  return (
    <div className={`stk-tuto-overlay ${exiting ? 'stk-tuto-exit' : ''}`}>
      <div className="stk-tuto-container">

        <div className="stk-tuto-content">
          <div className="stk-tuto-step-tag">
            <span className="step-num">{current.icon}</span>
            <span className="step-label">{current.label}</span>
          </div>

          <h2 className="stk-tuto-title">{current.title}</h2>
          <p className="stk-tuto-text">{current.text}</p>

          <div className="stk-tuto-dots">
            {STEPS.map((_, i) => (
              <button
                key={i}
                className={`stk-tuto-dot ${i === step ? 'active' : ''}`}
                onClick={() => setStep(i)}
              />
            ))}
          </div>

          <div className="stk-tuto-actions">
            <button className="stk-btn-skip" onClick={handleClose}>
              Passer
            </button>
            {step < STEPS.length - 1 ? (
              <button className="stk-btn-next" onClick={() => setStep(s => s + 1)}>
                Suivant →
              </button>
            ) : (
              <button className="stk-btn-start" onClick={handleClose}>
                Démarrer ✦
              </button>
            )}
          </div>
        </div>

        {/* FIX : key={step} force le remount → re-déclenche l'animation CSS naturellement,
            sans useEffect ni setState synchrone */}
        <div className="stk-tuto-visual">
          <TutoDemo key={step} type={current.demo} />
        </div>

      </div>
    </div>
  );
};

const TutoDemo = ({ type }) => {
  if (type === 'nature') return (
    <div className="tuto-demo tuto-demo--nature">
      <div className="demo-card is-nature">
        <span className="demo-card-label">Requin</span>
      </div>
      <p className="demo-caption">Carte Nature</p>
    </div>
  );

  if (type === 'pair') return (
    <div className="tuto-demo tuto-demo--pair">
      <div className="demo-card is-nature demo-selected">
        <span className="demo-card-label">Lotus</span>
      </div>
      <div className="demo-arrow">→</div>
      <div className="demo-card is-application">
        <span className="demo-card-label">Verre auto-nettoyant</span>
      </div>
    </div>
  );

  if (type === 'match') return (
    <div className="tuto-demo tuto-demo--match">
      <div className="demo-match-badge">✦ CONNEXION TROUVÉE</div>
      <div className="demo-card is-nature demo-matched">
        <span className="demo-card-label">Lotus</span>
      </div>
      <div className="demo-connect-line" />
      <div className="demo-card is-application demo-matched">
        <span className="demo-card-label">Verre auto-nettoyant</span>
      </div>
    </div>
  );

  return null;
};

export default Tutorial;