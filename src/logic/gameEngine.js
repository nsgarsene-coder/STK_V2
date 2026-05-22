import { pairs } from './pairs';

const shuffle = (array) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

/**
 * Construit un plateau de 4 cartes nature + 4 cartes app
 * avec exactement `guaranteedMatches` paires complètes garanties.
 * Les fillers ne forment jamais de paire accidentelle.
 */
export const setupBoard = (usedPairIds = [], guaranteedMatches = 1) => {
  const available = shuffle(pairs.filter(p => !usedPairIds.includes(p.id)));

  if (available.length < 4) return { natureCards: [], appCards: [] };

  // 1. Paires complètes garanties
  const matchPairs = available.slice(0, guaranteedMatches);

  // 2. Réservoir de fillers (hors paires garanties)
  const fillerPool = available.slice(guaranteedMatches);

  const fillerCount = 4 - guaranteedMatches;

  // 3. Cartes nature garanties
  const natureCards = matchPairs.map(p => ({ ...p.nature, pairId: p.id, type: 'nature' }));

  // 4. Cartes app garanties
  const appCards = matchPairs.map(p => ({ ...p.application, pairId: p.id, type: 'application' }));

  // 5. Fillers nature — on prend dans fillerPool mélangé
  const shuffledFillers = shuffle(fillerPool);
  const fillerNaturePairs = shuffledFillers.slice(0, fillerCount);
  fillerNaturePairs.forEach(p => {
    natureCards.push({ ...p.nature, pairId: p.id, type: 'nature' });
  });

  // 6. Fillers app — on exclut les pairIds déjà présents côté nature
  //    pour éviter toute paire accidentelle
  const usedNatureIds = new Set(natureCards.map(c => c.pairId));
  const eligibleAppFillers = shuffle(fillerPool).filter(p => !usedNatureIds.has(p.id));
  const fillerAppPairs = eligibleAppFillers.slice(0, fillerCount);
  fillerAppPairs.forEach(p => {
    appCards.push({ ...p.application, pairId: p.id, type: 'application' });
  });

  // 7. Si on n'a pas assez de fillers app (bord de partie), on complète
  //    avec des paires dont la nature est absente du board
  if (appCards.length < 4) {
    const fallback = shuffle(fillerPool).filter(p => !usedNatureIds.has(p.id));
    for (const p of fallback) {
      if (appCards.length >= 4) break;
      if (!appCards.find(c => c.pairId === p.id)) {
        appCards.push({ ...p.application, pairId: p.id, type: 'application' });
      }
    }
  }

  return {
    natureCards: shuffle(natureCards),
    appCards:    shuffle(appCards),
  };
};

export const isPair = (card1, card2) => {
  if (!card1 || !card2) return false;
  return card1.pairId === card2.pairId && card1.type !== card2.type;
};

export const getExplication = (pairId) => {
  const pair = pairs.find(p => p.id === pairId);
  return pair ? pair.explication : '';
};

export const getHint = (pairId, level) => {
  const pair = pairs.find(p => p.id === pairId);
  return pair ? pair.indices[Math.min(level, 2)] : null;
};