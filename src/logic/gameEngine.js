import { pairs } from './pairs';

/**
 * Mélange un tableau
 */
const shuffle = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

/**
 * Prépare le plateau avec un dosage de paires et d'intrus
 * @param {Array} usedPairIds - IDs déjà trouvés
 * @param {Number} guaranteedMatches - Nombre de paires complètes à garantir (ex: 2)
 */
export const setupBoard = (usedPairIds = [], guaranteedMatches = 2) => {
  const availablePairs = pairs.filter(p => !usedPairIds.includes(p.id));
  const shuffledAvailable = shuffle(availablePairs);

  // 1. On pioche les paires qui seront COMPLÈTES (les matchs possibles)
  const matchingPairs = shuffledAvailable.slice(0, guaranteedMatches);
  
  // 2. On pioche les paires qui seront ORPHELINES (les intrus)
  // On prend les paires suivantes dans la liste mélangée
  const orphanPairs = shuffledAvailable.slice(guaranteedMatches, 8 - guaranteedMatches);

  const natureCards = [];
  const appCards = [];

  // Ajouter les matchs garantis
  matchingPairs.forEach(p => {
    natureCards.push({ ...p.nature, pairId: p.id });
    appCards.push({ ...p.application, pairId: p.id });
  });

  // Ajouter les intrus (on ne met qu'un côté de la paire pour chaque)
  orphanPairs.forEach((p, index) => {
    if (index % 2 === 0) {
      // On met la nature mais pas l'app
      natureCards.push({ ...p.nature, pairId: p.id });
      // On complète l'autre ligne avec une autre paire totalement différente
      const randomExtra = shuffledAvailable[shuffledAvailable.length - 1 - index];
      appCards.push({ ...randomExtra.application, pairId: randomExtra.id });
    } else {
      // On met l'app mais pas la nature
      appCards.push({ ...p.application, pairId: p.id });
      const randomExtra = shuffledAvailable[shuffledAvailable.length - 1 - index];
      natureCards.push({ ...randomExtra.nature, pairId: randomExtra.id });
    }
  });

  // 3. On mélange chaque ligne pour que les paires ne soient pas face à face
  return {
    natureCards: shuffle(natureCards).slice(0, 4),
    appCards: shuffle(appCards).slice(0, 4)
  };
};

export const isPair = (card1, card2) => {
  if (!card1 || !card2) return false;
  return card1.pairId === card2.pairId && card1.type !== card2.type;
};

export const getExplication = (pairId) => {
  const pair = pairs.find(p => p.id === pairId);
  return pair ? pair.explication : "";
};

export const getHint = (pairId, level) => {
  const pair = pairs.find(p => p.id === pairId);
  return pair ? pair.indices[Math.min(level, 2)] : null;
};
