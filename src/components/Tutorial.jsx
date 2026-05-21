import { useState } from 'react';
import './Tutorial.css';

const Tutorial = ({ onStart }) => {
  const [step, setStep] = useState(1);

  return (
    <div className="stk-tuto-overlay">
      <div className="stk-tuto-container">
        {/* Bulle d'info à gauche */}
        <div className="stk-tuto-bubble">
          <h3>Bienvenue Explorateur !</h3>
          <p>
            {step === 1 
              ? "Le biomimétisme, c'est s'inspirer de la nature pour inventer le futur. Votre mission : relier chaque élément vivant à son invention humaine."
              : "Cliquez sur une carte 'Nature' puis sur sa correspondance 'Application'. Si vous hésitez, un indice apparaîtra après deux erreurs."}
          </p>
          <div className="stk-tuto-actions">
            <button className="stk-btn-skip" onClick={onStart}>Passer</button>
            {step === 1 
              ? <button className="stk-btn-next" onClick={() => setStep(2)}>Suivant</button>
              : <button className="stk-btn-start" onClick={onStart}>Démarrer le jeu</button>
            }
          </div>
        </div>

        {/* Fenêtre de tuto visuel à droite */}
        <div className="stk-tuto-visual">
          <div className="stk-visual-placeholder">
             {/* Ici vous pourrez mettre un GIF ou une petite animation de démo */}
             <div className="demo-card-mini nature"></div>
             <div className="demo-line"></div>
             <div className="demo-card-mini app"></div>
             <span>Tuto Visuel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
