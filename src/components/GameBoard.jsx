import { useState, useEffect } from 'react';
import Card from './Card';
import { setupBoard, isPair } from '../logic/gameEngine';
import { useGameState } from '../state/gameState';
import { playSFX } from '../utils/audioManager';
import './GameBoard.css';

const GameBoard = () => {
  const { updateScore, foundPairIds } = useGameState();
  
  // ✅ SOLUTION : On initialise le plateau directement ici
  const [board, setBoard] = useState(() => setupBoard(foundPairIds));
  
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(true);

  useEffect(() => {
    // On garde l'effet uniquement pour le son et le timer
    playSFX('distrib');
    const timer = setTimeout(() => setAnimating(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleCardClick = (card) => {
    if (animating || (selected && selected.pairId === card.pairId && selected.type === card.type)) return;

    if (!selected) {
      setSelected(card);
      return;
    }

    if (isPair(selected, card)) {
      playSFX('match');
      updateScore(card.pairId);
      
      setTimeout(() => {
        // On met à jour le plateau avec les nouvelles paires trouvées
        setBoard(setupBoard([...foundPairIds, card.pairId]));
        setSelected(null);
      }, 1000);
    } else {
      playSFX('error');
      setTimeout(() => setSelected(null), 800);
    }
  };

  return (
    <div className="stk-game-container">
      <div className="stk-board-row">
        {board.natureCards.map((card, index) => (
          <Card 
            key={`nature-${card.pairId}-${index}`}
            data={card}
            state={
              animating ? 'distributing' : 
              selected === card ? 'selected' : 'idle'
            }
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>

      <div className="stk-board-separator"></div>

      <div className="stk-board-row">
        {board.appCards.map((card, index) => (
          <Card 
            key={`app-${card.pairId}-${index}`}
            data={card}
            state={
              animating ? 'distributing' : 
              selected === card ? 'selected' : 'idle'
            }
            onClick={() => handleCardClick(card)}
          />
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
