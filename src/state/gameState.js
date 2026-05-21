import { useState, useCallback } from 'react';

/**
 * GESTION DE L'ÉTAT GLOBAL (DEV 5)
 */
export const useGameState = () => {
  const [score, setScore] = useState(0);
  const [foundPairIds, setFoundPairIds] = useState([]);
  const [showExplorationModal, setShowExplorationModal] = useState(false);
  const threshold = 5; // Seuil pour la fiche d'exploration

  const updateScore = useCallback((pairId) => {
    setFoundPairIds((prev) => {
      if (prev.includes(pairId)) return prev;
      const next = [...prev, pairId];
      
      // Si on atteint le seuil (ex: 5 paires), on ouvre la modal
      if (next.length === threshold) {
        setShowExplorationModal(true);
      }
      
      setScore(next.length);
      return next;
    });
  }, [threshold]);

  const resetGame = () => {
    setScore(0);
    setFoundPairIds([]);
    setShowExplorationModal(false);
  };

  return {
    score,
    foundPairIds,
    showExplorationModal,
    setShowExplorationModal,
    updateScore,
    resetGame,
    totalPairs: 21
  };
};
