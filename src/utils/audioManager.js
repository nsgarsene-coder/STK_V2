/**
 * GESTIONNAIRE AUDIO STK
 */
const sounds = {
  distrib: '/sounds/distrib.mp3',
  match: '/sounds/match.mp3',
  error: '/sounds/error.mp3',
};

export const playSFX = (type) => {
  const audioSrc = sounds[type];
  if (!audioSrc) return;

  try {
    const audio = new Audio(audioSrc);
    audio.volume = 0.5;
    audio.play().catch(err => console.log("Audio non chargé ou bloqué par le navigateur :", err));
  } catch (error) {
    console.error("Erreur lors de la lecture du son :", error);
  }
};
