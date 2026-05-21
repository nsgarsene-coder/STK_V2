import GameBoard from './components/GameBoard';
import Modal from './components/Modal';
import { useGameState } from './state/gameState';
import './App.css';

function App() {
  const { score, showExplorationModal, setShowExplorationModal } = useGameState();

  return (
    <div className="stk-app-root">
      <header className="stk-main-header">
        <div className="stk-logo-main">STK ARCHITECTURE</div>
        <div className="stk-score-display">
          SCORE: <span className="score-num">{score}</span> / 21
        </div>
      </header>

      <main>
        <GameBoard />
      </main>

      {/* Modal de réussite Dev 5 */}
      <Modal 
        isOpen={showExplorationModal} 
        title="Félicitations ! 🎉"
        footer={
          <button 
            className="stk-btn-primary" 
            onClick={() => setShowExplorationModal(false)}
          >
            Continuer l'exploration
          </button>
        }
      >
        <p>Vous avez trouvé 5 paires biomimétiques ! Votre fiche d'exploration est prête à être consultée dans votre espace utilisateur.</p>
      </Modal>
    </div>
  );
}

export default App;
